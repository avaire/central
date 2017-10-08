
class Spam {

    /**
     * Checks the message carried in the gateway socket looks like spam.
     *
     * @param  {GatewaySocket}  socket  The Discordie gateway socket
     * @return {Boolean}
     */
    isSpam(socket) {
        if (!this.hasSpamLinks(socket.message.content)) {
            return false;
        }
        return !this.canPostDiscordInviteLinks(socket);
    }

    /**
     * Checks if the given message has links that would be considered spam in them.
     *
     * @param  {String}  message  The message that should be checked.
     * @return {Boolean}
     */
    hasSpamLinks(message) {
        return message.match(/(http|https):\/\/discord\.gg\/[A-Za-z0-9-]+/gi) !== null;
    }

    /**
     * Checks if the user is allowed to bypass the spam filter by
     * checking if they have a role with any color assigned to it.
     *
     * @param  {GatewaySocket}  socket  The Discordie gateway socket
     * @return {Boolean}
     */
    canPostDiscordInviteLinks(socket) {
        if (socket.message.isPrivate) {
            return true;
        }

        let roles = socket.message.member.roles;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name.toLowerCase() === 'staff') {
                return true;
            }
        }
        return false;
    }

    /**
     * Handles the spam by deleting it and logging it to a private channel.
     *
     * @param  {GatewaySocket}  socket  The Discordie gateway socket
     * @return {Promise}
     */
    handle(socket) {
        socket.message.delete().then(() => {
            let channels = bot.Channels.toArray();
            for (let i in channels) {
                let channel = channels[i];
                if (!(channel.type === 0 && channel.name === 'central')) {
                    continue;
                }

                let author = socket.message.author;
                app.envoyer.sendEmbededMessage(channel, {
                    color: 0xE0CE38,
                    timestamp: new Date,
                    author: {
                        name: `${author.username}#${author.discriminator} (ID: ${author.id})`,
                        icon_url: `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=256`
                    },
                    description: socket.message.content,
                    footer: {
                        text: `The message was deleted in #${socket.message.channel.name}`
                    }
                });
            }
        });

        return app.envoyer.sendWarn(socket.message, '<@:userid> Please refrain from advertising in the server.');
    }
}

module.exports = new Spam;
