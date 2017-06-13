/** @ignore */
const EventHandler = require('./EventHandler');

/**
 * Emitted after a member has been added to a new guild.
 *
 * @see http://qeled.github.io/discordie/#/docs/GUILD_MEMBER_ADD
 *
 * @extends {EventHandler}
 */
class GuildMemberAddEvent extends EventHandler {

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

module.exports = new GuildMemberAddEvent;
