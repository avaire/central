/** @ignore */
const Job = require('./Job');
/** @ignore */
const FeedbackTransformer = require('./../../database/transformers/FeedbackTransformer');

/**
 * Send Feedback Job, this job will run every minute, for each time
 * the job runs all feedback messages will be pulled from the
 * database and sent to all text channels called feedback.
 *
 * @extends {Job}
 */
class SendFeedbackJob extends Job {

    /**
     * This method determines when the job should be execcuted.
     *
     * @override
     * @param  {RecurrenceRule} rule  A node-schedule CRON recurrence rule instance
     * @return {mixed}
     */
    runCondition(rule) {
        return '* * * * *';
    }

    /**
     * The jobs main logic method, this method is executed
     * whenever the {@link Job#runCondition} method returns true.
     *
     * @override
     */
    run() {
        let channels = bot.Channels.toArray();
        this.forEachFeedback(feedback => {
            for (let i in channels) {
                let channel = channels[i];
                if (!(channel.type === 0 && channel.name === 'feedback')) {
                    continue;
                }

                app.envoyer.sendEmbededMessage(channel, {
                    color: 0x323232,
                    timestamp: new Date(feedback.get('created_at')),
                    author: {
                        name: feedback.get('user.username'),
                        icon_url: `https://cdn.discordapp.com/avatars/${feedback.get('user.id')}/${feedback.get('user.avatar')}.png?size=256`
                    },
                    footer: {
                        text: `Author ID: ${feedback.get('user.id')}`
                    },
                    fields: this.buildFeedbackFields(feedback)
                });
            }
        });
    }

    /**
     * Builds the embeded fields items for
     * the given feedback transformer.
     *
     * @param  {FeedbackTransformer}  feedback  The feedback transformer that should be used.
     * @return {Array}
     */
    buildFeedbackFields(feedback) {
        let items = [
            {
                name: 'Feedback',
                value: feedback.get('message')
            },
            {
                name: 'Channel',
                value: `${feedback.get('channel.name')} (ID: ${feedback.get('channel.id')})`
            }
        ];

        if (feedback.get('guild', null) !== null) {
            items.push({
                name: 'Server',
                value: `${feedback.get('guild.name')} (ID: ${feedback.get('guild.id')})`
            });
        }
        return items;
    }

    /**
     * Loops through all the feedback that was pulled
     * from the database and calls the callback for
     * the database record transformer.
     *
     * @param  {Function}  callback  The callback the database transformer should be called on.
     * @return {Promise}
     */
    forEachFeedback(callback) {
        return app.database.getClient().select().from(app.constants.FEEDBACK_TABLE_NAME).orderBy('created_at').then(feedbacks => {
            let ids = [];
            for (let i in feedbacks) {
                let transformer = new FeedbackTransformer(feedbacks[i]);

                ids.push(transformer.get('id'));
                callback(transformer);
            }

            return app.database.getClient().from(app.constants.FEEDBACK_TABLE_NAME).whereIn('id', ids).del();
        });
    }
}

module.exports = SendFeedbackJob;
