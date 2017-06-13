/** @ignore */
const URL = require('url');
/** @ignore */
const _ = require('lodash');

/**
 * Envoyer, creates a simple way of sending embed messages to channels, the methods is highly adaptable, allowing
 * you to use the syntax you like best, you can also send language strings instead of messages, and the methods
 * will pickup on the fact you're sending a language string and fetch the corresponding message for you, just
 * keep in mind that sending language messages requires you to parse in the IMessage Discordie object.
 *
 * @see http://qeled.github.io/discordie/#/docs/IMessage
 * @see http://qeled.github.io/discordie/#/docs/ITextChannel
 * @see https://discordapp.com/developers/docs/resources/channel#embed-object
 */
class Envoyer {

    /**
     * Prepares the default colors for the different types of messages that can be sent.
     */
    constructor() {
        /**
         * The default colors for the different types of messages that can be sent.
         *
         * @type {Object}
         */
        this.colors = {
            error: 0xD91616,
            warn: 0xD9D016,
            success: 0x16D940,
            info: 0x3498DB
        };

        /**
         * The default placeholders that should be added to
         * every message parsed through the language files.
         *
         * @type {Object}
         */
        this.defaultPlaceholders = {
            userid: message => message.author.id,
            channelid: message => message.channel.id,
            username: message => message.author.username,
            useravatar: message => message.author.avatar,
            userdiscr: message => message.author.discriminator
        };
    }

    /**
     * Sends an embeded error message, if the message given looks like a language
     * string and the IMessage object was provided the language message will
     * be fetched from the string for the provided message.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent, or the language string that should be fetched.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendError(channel, message, placeholders) {
        return this.sendEmbededMessage(channel, this.transform('error', message), placeholders);
    }

    /**
     * Sends an embeded warning message, if the message given looks like a language
     * string and the IMessage object was provided the language message will
     * be fetched from the string for the provided message.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent, or the language string that should be fetched.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendWarn(channel, message, placeholders) {
        return this.sendEmbededMessage(channel, this.transform('warn', message), placeholders);
    }

    /**
     * Sends an embeded info message, if the message given looks like a language
     * string and the IMessage object was provided the language message will
     * be fetched from the string for the provided message.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent, or the language string that should be fetched.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendInfo(channel, message, placeholders) {
        return this.sendEmbededMessage(channel, this.transform('info', message), placeholders);
    }

    /**
     * Sends an embeded success message, if the message given looks like a language
     * string and the IMessage object was provided the language message will
     * be fetched from the string for the provided message.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent, or the language string that should be fetched.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendSuccess(channel, message, placeholders) {
        return this.sendEmbededMessage(channel, this.transform('success', message), placeholders);
    }

    /**
     * Sends an embeded message of the provided color to the given channel or
     * message object, if the message given looks like a language string
     * and the IMessage object was provided the language message will
     * be fetched from the string for the provided message.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent, or the language string that should be fetched.
     * @param  {String|Number}         color         The color of the embeded element, by default it will be info(blue).
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendMessage(channel, message, color = 'info', placeholders) {
        return this.sendEmbededMessage(channel, this.transform(color, message), placeholders);
    }

    /**
     * Sends an embed message to the provided channel, if an IMessage object is given the
     * correct channel will be fetched from the message, if the embed message looks like
     * a language string and the IMessage object was provided the language message
     * will be fetched from the string for the provided message.
     *
     * @see https://discordapp.com/developers/docs/resources/channel#embed-object
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {Object}                embed         The embeded object that should be sent.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendEmbededMessage(channel, embed, placeholders) {
        if (embed.hasOwnProperty('description')) {
            embed.description = this.prepareMessage(channel, embed.description, placeholders);
        }

        return new Promise((resolve, reject) => {
            return this.prepareChannel(channel).sendMessage('', false, embed)
                .then(sentMessage => resolve(sentMessage))
                .catch(err => {
                    if (this.handleError(channel, err, {resolve, reject}, ['', false, embed])) {
                        return;
                    }

                    return reject(err);
                });
        });
    }

    /**
     * Sends a normal text message to the provided channel, if an IMessage object is given the
     * correct channel will be fetched from the IMessage instance, if the given message
     * looks like a language string and the IMessage object was provided the language
     * message will be feted from the string for the provided message.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent in the provided channel.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {Promise}
     */
    sendNormalMessage(channel, message, placeholders) {
        return new Promise((resolve, reject) => {
            message = this.prepareMessage(channel, message, placeholders);

            return this.prepareChannel(channel).sendMessage(message)
                .then(sentMessage => resolve(sentMessage))
                .catch(err => {
                    if (this.handleError(channel, err, {resolve, reject}, [message])) {
                        return;
                    }

                    return reject(err);
                });
        });
    }

    /**
     * Prepares the message, if an IMessage object is given and the provided message looks like a
     * language string, the propper language string will be fetched for the guilds local, if an
     * IMessage object is given but the string doesn't look like a language string, any
     * placeholders in the string will be replaced with their propper values instead.
     *
     * @param  {IMessage|ITextChannel} channel       The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {String}                message       The message that should be sent in the provided channel.
     * @param  {Object}                placeholders  The placeholders that should replace placeholders in the language string.
     * @return {String}
     */
    prepareMessage(channel, message, placeholders) {
        if (this.isMessageObject(channel)) {
            placeholders = this.addDefaultPlacehodlers(channel, placeholders);
        }

        for (let token in placeholders) {
            message = _.replace(message, new RegExp(`:${token}`, 'gm'), placeholders[token]);
        }

        return message;
    }

    /**
     * Checks to see if the provided channel object is really a IMessage
     * instance, if that's the case the propper channel instance
     * will be pulled from it and returned instead.
     *
     * @param  {IMessage|ITextChannel} channel  The IMessage or ITextChannel object from Discordies event emitter.
     * @return {ITextChannel}
     */
    prepareChannel(channel) {
        return (this.isMessageObject(channel)) ? channel.channel : channel;
    }

    /**
     * Transforms the provided color and message into
     * a simple Discord embed message object.
     *
     * @param  {String|Number} color    The color of the embeded element.
     * @param  {String}        message  The description of the embed element.
     * @return {Object}
     */
    transform(color, message) {
        if (typeof this.colors[color] !== 'undefined') {
            color = this.colors[color];
        }

        return {
            color,
            description: message
        };
    }

    /**
     * Error handler.
     *
     * @param  {IMessage|ITextChannel}  message     The IMessage or ITextChannel object from Discordies event emitter.
     * @param  {Error}                  err         The error that should be handled.
     * @param  {Object}                 promise     The promise functions.
     * @param  {Array}                  messageArr  The arguments that was parsed to the sendMessage that caused the error.
     * @return {Boolean}
     */
    handleError(message, err, promise, messageArr) {
        if (this.isMissingPermissions(err)) {
            if (this.isMessageObject(message) && !message.isPrivate) {
                messageArr[0] = 'I can\'t send messages in the channel you ran the command in, heres the result instead.\n' + messageArr[0];

                return message.author.openDM().then(directMessage => {
                    return directMessage.sendMessage(...messageArr)
                        .then(sentMessage => promise.resolve(sentMessage))
                        .catch(err => promise.catch(err));
                }).catch(error => promise.reject(error));
            }
            return true;
        }
        return false;
    }

    /**
     * Add default placeholders to the placeholder object.
     *
     * @param {IMessage} message
     * @param {Object}   placeholders
     */
    addDefaultPlacehodlers(message, placeholders) {
        if (typeof placeholders !== 'object') {
            placeholders = {};
        }

        for (let placeholder in this.defaultPlaceholders) {
            if (!placeholders.hasOwnProperty(placeholder)) {
                placeholders[placeholder] = this.defaultPlaceholders[placeholder](message);
            }
        }

        let sortedPlaceholders = {};
        let keys = Object.keys(placeholders);
        keys.sort((a, b) => b.length - a.length);

        for (let i = 0; i < keys.length; i++) {
            sortedPlaceholders[keys[i]] = placeholders[keys[i]];
        }

        return sortedPlaceholders;
    }

    /**
     * Checks if the given object is a IMessage object.
     *
     * @param  {Object}  object  The object should be checked.
     * @return {Boolean}
     */
    isMessageObject(object) {
        if (object === undefined || object === null) {
            // Something went really wrong if we got to this
            // point but atleast we have a check for it.
            return false;
        }

        return object.constructor.name === 'IMessage';
    }

    /**
     * Checks if the given error is caused because of missing permissions.
     *
     * @param  {Error}  error  The error that should be checked.
     * @return {Boolean}
     */
    isMissingPermissions(error) {
        return error.status === 403 && error.message.indexOf('Missing Permissions') > -1;
    }
}

module.exports = new Envoyer;
