/** @ignore */
const Knex = require('knex');

/**
 * Database manager class, this class allows you to interact with
 * different database types as well as fetching guild, channel
 * and user data easily from the database.
 *
 * @see http://knexjs.org/
 */
class Database {

    /**
     * Setups the Knex database instance of the
     * provided type from the config.json file.
     */
    constructor() {
        /**
         * The Knex client database instance.
         *
         * @type {Knex}
         */
        this.client = new Knex({
            client: app.config.database.type,
            connection: app.config.database,
            pool: {
                min: 2,
                max: 18
            },
            migrations: {
                tableName: 'central_migrations',
                directory: './app/database/migrations'
            },
            useNullAsDefault: true
        });
    }

    /**
     * Runs the database migrations.
     *
     * @return {Promise}
     */
    runMigrations() {
        return new Promise((resolve, reject) => {
            this.getClient().migrate.latest().then(() => {
                resolve();
            }).catch(err => {
                app.logger.error(err);
                reject(err);
            });
        });
    }

    /**
     * Gets the Knex database client instance.
     *
     * @return {Knex}
     */
    getClient() {
        return this.client;
    }

    /**
     * Inserts a new record into the provided table with the provided fields,
     * if timestamps is set to true a created_at and updated_at field will
     * be added to the fields object with the current date as their value.
     *
     * @param  {String}  table       The name of the table the record should be inserted into.
     * @param  {Object}  fields      The fields that should populate the row.
     * @param  {Boolean} timestamps  Determines if the record uses timestamps, defaults to true.
     * @return {Promise}
     */
    insert(table, fields, timestamps = true) {
        return new Promise((resolve, reject) => {
            if (timestamps) {
                fields.created_at = new Date;
                fields.updated_at = new Date;
            }

            return this.getClient().insert(fields).into(table).then(() => {
                app.bot.statistics.databaseQueries++;

                return resolve();
            }).catch(err => {
                app.logger.error(err);

                return reject(err);
            });
        });
    }

    /**
     * Updates an existing record in the database that satisfies the
     * provided condition, if no condition is given every record
     * in the database will be updated to the new values.
     *
     * @param  {String}  table       The name of the table that holds the database records.
     * @param  {Object}  fields      The fields that should be updated in the database records.
     * @param  {Closure} condition   The closure that should limit the query.
     * @param  {Boolean} timestamps  Determins if the record uses timestatmps, defaults to true.
     * @return {Promise}
     */
    update(table, fields, condition, timestamps = true) {
        return new Promise((resolve, reject) => {
            if (timestamps) {
                fields.updated_at = new Date;
            }

            let query = this.getClient().table(table).update(fields);
            if (typeof condition === 'function') {
                query = condition(query);
            }

            return query.then(() => {
                return resolve(app.bot.statistics.databaseQueries++);
            }).catch(err => app.logger.error(err));
        });
    }
}

module.exports = Database;
