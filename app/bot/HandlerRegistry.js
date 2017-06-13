module.exports = {
    // Connection Handlers
    GATEWAY_READY: require('./handlers/GatewayReadyEvent'),
    GATEWAY_RESUMED: require('./handlers/GatewayResumedEvent'),
    DISCONNECTED: require('./handlers/GatewayDisconnectedEvent'),

    // Text Handlers
    MESSAGE_CREATE: require('./handlers/MessageCreateEvent'),

    // Guild Handlers
    GUILD_CREATE: require('./handlers/GuildCreateEvent'),
    GUILD_DELETE: require('./handlers/GuildDeleteEvent'),
    GUILD_MEMBER_ADD: require('./handlers/GuildMemberAddEvent'),
    GUILD_MEMBER_REMOVE: require('./handlers/GuildMemberRemoveEvent'),
    GUILD_MEMBER_UPDATE: require('./handlers/GuildMemberUpdateEvent')
};
