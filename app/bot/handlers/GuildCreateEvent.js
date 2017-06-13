/** @ignore */
const EventHandler = require('./EventHandler');

/**
 * Emitted when a new guild instance is added to the bot instance, this is
 * either when a new guild is created or the bot joins a pre-existing guild.
 *
 * @see http://qeled.github.io/discordie/#/docs/GUILD_CREATE
 *
 * @extends {EventHandler}
 */
class GuildCreateEvent extends EventHandler {

    /**
     * The event-handler that is executed by Discords event dispatcher.
     *
     * @param  {GatewaySocket} socket  The Discordie gateway socket.
     * @return {mixed}
     */
    handle(socket) {
        app.logger.info(`Joined guild with an ID of ${app.getGuildIdFrom(socket)} called: ${socket.guild.name}`);
    }
}

module.exports = new GuildCreateEvent;
