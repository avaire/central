module.exports = {
    bot: require('./bot'),
    constants: require('./constants'),

    // Utilities
    guild: require('./utils/guild/Guild'),
    logger: require('./utils/logger/Logger'),
    envoyer: require('./utils/envoyer/Envoyer'),
    cache: require('./utils/cache/CacheManager'),
    scheduler: require('./utils/scheduler/Scheduler'),
    permission: require('./utils/permission/Permission'),
    configLoader: require('./utils/config/ConfigLoader'),

    // Bot Version
    version: require('../package').version,

    // Quick helper function for the guild utility
    getGuildIdFrom: context => app.guild.getIdFrom(context)
};
