/** @ignore */
const _ = require('lodash');
/** @ignore */
const EventHandler = require('./EventHandler');
/** @ignore */
const CommandHandler = require('./../commands/CommandHandler');

/**
 * Emitted when a user sends a text message in any valid text channel in a guild.
 *
 * @extends {EventHandler}
 */
class MessageCreateEvent extends EventHandler {

    /**
     * The event-handler that is executed by Discords event dispatcher.
     *
     * @param  {GatewaySocket} socket  The Discordie gateway socket
     * @return {mixed}
     */
    handle(socket) {
        // Checks if the message was sent from the bot itself, or another bot, if that's
        // the case we want to simply just end the event there, otherwise we'll end up
        // with an endless loop of messages going on and on and on and on and...
        if (bot.User.id === socket.message.author.id || socket.message.author.bot) {
            return;
        }

        let message = socket.message.content;
        let command = CommandHandler.getCommand(message);

        // Checks to see if a valid command was found from the message context, if a
        // command was found the onCommand method will be called for the handler.
        if (command !== null) {
            return this.processCommand(socket, command);
        }
    }

    /**
     * Process command by building the middleware stack and running it.
     *
     * @param  {GatewaySocket} socket   The Discordie gateway socket
     * @param  {Command}       command  The command that should be executed
     * @return {mixed}
     */
    processCommand(socket, command) {
        return command.handler.onCommand(socket.message.author, socket.message, _.drop(
            socket.message.content.trim().split(' ')
        ).join(' ').match(/[^\s"]+|"([^"]*)"/gi));
    }
}

module.exports = new MessageCreateEvent;
