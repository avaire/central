/** @ignore */
const utils = require('util');
/** @ignore */
const _ = require('lodash');
/** @ignore */
const directory = require('require-directory');
/** @ignore */
const Discordie = require('discordie');

class Application {

    /**
     * Bootstraps the application and prepares it for use.
     *
     * @return {Promise}
     */
    bootstrap() {
        global.app = require('./app');
        app.bot.jobs = {};

        app.logger.info(`Bootstraping AvaCentral v${app.version}`);

        this.prepareConfig();
        this.prepareDiscordie();

        return this.prepareDatabase();
    }

    /**
     * Registers and prepares the events, jobs and services that Ava uses.
     */
    register() {
        app.logger.info('Registering events & services');

        this.registerEvents();
        this.registerJobs();
    }

    /**
     * Connects the bot to the Discord network.
     */
    connect() {
        app.logger.info('Connecting to the Discord network...');
        bot.connect({token: app.config.token});
        bot.User.setStatus(null, 'avairebot.com');
    }

    /**
     * Loads the config from file and stores it in the global app variable.
     */
    prepareConfig() {
        app.config = app.configLoader.loadConfiguration('config.json');
    }

    /**
     * Loads and prepares the database by storing it in the global app variable,
     * connecting to the database, and running any migrations needs to be run.
     *
     * @return {Promise}
     */
    prepareDatabase() {
        app.logger.info(' - Setting up database and tables');

        const Database = require('./app/database/Database');

        app.database = new Database();
        return app.database.runMigrations();
    }

    /**
     * Prepares the bot instance and stores it in the global bot variable.
     */
    prepareDiscordie() {
        app.logger.info(' - Creating bot instance');

        let options = this.buildDiscordOptions();

        options.autoReconnect = true;
        global.bot = new Discordie(options);
    }

    /**
     * Registers the Discordie and process events.
     */
    registerEvents() {
        app.logger.info(` - Registering ${Object.keys(app.bot.handlers).length + 1} event handlers`);
        bot.Dispatcher.onAny((type, socket) => {
            if (app.bot.handlers.hasOwnProperty(type)) {
                return app.bot.handlers[type].handle(socket);
            }
        });

        process.on('unhandledRejection', (reason, p) => {
            return app.logger.info(`Unhandled promise: ${utils.inspect(p, {depth: 3})}: ${reason}`);
        });
    }

    /**
     * Registers the jobs.
     */
    registerJobs() {
        _.each(directory(module, './app/bot/jobs'), (Job, key) => {
            if (key !== 'Job') {
                app.bot.jobs[key] = app.scheduler.registerJob(new Job);
            }
        });
        app.logger.info(` - Registering ${Object.keys(app.bot.jobs).length} jobs`);
    }

    /**
     * Builds the Discordie options object based off the
     * provided arguments parsed to the start.js file.
     */
    buildDiscordOptions() {
        let options = {};
        let parsers = [
            {
                trigger: ['--shard-id', '--shardid', '-sid'],
                value: 'shardId'
            },
            {
                trigger: ['--shard-count', '--shardcount', '-scount', '-sc'],
                value: 'shardCount'
            },
            {
                trigger: ['--message-cache-limit', '--message-limit', '-mcl'],
                value: 'messageCacheLimit'
            }
        ];

        for (let i in process.argv) {
            let opt = process.argv[i].toLowerCase();

            if (opt.indexOf('=') < 0) {
                continue;
            }

            let parserValue = null;
            let parts = opt.split('=');
            for (let x in parsers) {
                if (parserValue !== null) {
                    continue;
                }

                let parser = parsers[x];
                if (parser.trigger.indexOf(parts[0]) < 0) {
                    continue;
                }

                parserValue = parser.value;
            }

            if (parserValue === null) {
                continue;
            }

            options[parserValue] = parseInt(parts[1], 10);
        }

        return options;
    }
}

module.exports = new Application;
