/** @ignore */
const Transformer = require('./Transformer');

/**
 * The guild transformer, allows for an easier way
 * to interact with guild database records.
 *
 * @extends {Transformer}
 */
class FeedbackTransformers extends Transformer {

    /**
     * Prepares the transformers data.
     *
     * @override
     *
     * @param  {Object} data  The data that should be transformed.
     * @param  {Lodash} _     The lodash instance.
     * @return {Object}
     */
    prepare(data, _) {
        if (data.hasOwnProperty('user')) {
            try {
                data.user = JSON.parse(data.user);
            } catch (err) {
                app.logger.error(err);
                data.user = {};
            }
        }

        if (data.hasOwnProperty('guild')) {
            try {
                data.guild = JSON.parse(data.guild);
            } catch (err) {
                app.logger.error(err);
                data.guild = {};
            }
        }

        if (data.hasOwnProperty('channel')) {
            try {
                data.channel = JSON.parse(data.channel);
            } catch (err) {
                app.logger.error(err);
                data.channel = {};
            }
        }

        return data;
    }

    /**
     * The default data objects for the transformer.
     *
     * @override
     *
     * @return {Object}
     */
    defaults() {
        return {
            id: 0,
            user: null,
            guild: null,
            channel: null,
            message: null
        };
    }
}

module.exports = FeedbackTransformers;
