/** @ignore */
const EventHandler = require('./EventHandler');

/**
 * Emitted after a member has been removed/left a guild.
 *
 * @see http://qeled.github.io/discordie/#/docs/GUILD_MEMBER_REMOVE
 *
 * @extends {EventHandler}
 */
class GuildMemberRemoveEvent extends EventHandler {

    /**
     * The event-handler that is executed by Discords event dispatcher.
     *
     * @param  {GatewaySocket} socket  The Discordie gateway socket
     * @return {mixed}
     */
    handle(socket) {
        //
    }
}

module.exports = new GuildMemberRemoveEvent;
