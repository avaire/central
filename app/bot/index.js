module.exports = {
    commands: require('./commands'),
    features: require('./features'),
    handlers: require('./HandlerRegistry'),
    middleware: require('./MiddlewareRegistry'),
    permissions: require('./PermissionRegistry'),

    maintenance: false
};
