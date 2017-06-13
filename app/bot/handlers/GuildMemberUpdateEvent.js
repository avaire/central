/** @ignore */
const EventHandler = require('./EventHandler');

/**
 * Emitted after a member has update their guild user profile.
 *
 * @see http://qeled.github.io/discordie/#/docs/GUILD_MEMBER_UPDATE
 *
 * @extends {EventHandler}
 */
class GuildMemberUpdateEvent extends EventHandler {

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

module.exports = new GuildMemberUpdateEvent;
