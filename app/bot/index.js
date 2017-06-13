module.exports = {
    commands: require('./commands'),
    handlers: require('./HandlerRegistry'),
    middleware: require('./MiddlewareRegistry'),
    permissions: require('./PermissionRegistry'),

    maintenance: false
};
