/** @ignore */
const Command = require('./../Command');

class StaffCommand extends Command {

    /**
     * Sets up the command by providing the prefix, command trigger, any
     * aliases the command might have and additional options that
     * might be usfull for the abstract command class.
     */
    constructor() {
        super('!', 'staff');
    }

    /**
     * Executes the given command.
     *
     * @param  {IUser}     sender   The Discordie user object that ran the command.
     * @param  {IMessage}  message  The Discordie message object that triggered the command.
     * @param  {Array}     args     The arguments that was parsed to the command.
     * @return {mixed}
     */
    onCommand(sender, message, args) {
        if (message.isPrivate) {
            return false;
        }

        let staff = {
            Developer: [],
            'Support Staff': [],
            Moderator: [],
            Staff: []
        };
        let staffRoles = Object.keys(staff);

        let members = message.guild.members;
        for (let i in members) {
            let userStaffRoles = [];
            members[i].roles.forEach(role => {
                if (staff.hasOwnProperty(role.name)) {
                    userStaffRoles.push(role.name);
                }
            });

            if (userStaffRoles.length === 0) {
                continue;
            }

            for (let x in staffRoles) {
                if (userStaffRoles.indexOf(staffRoles[x]) > -1) {
                    staff[staffRoles[x]].push(members[i]);
                    break;
                }
            }
        }

        let fields = [];
        for (let name in staff) {
            if (staff[name].length === 0) {
                continue;
            }

            let users = [];
            for (let i in staff[name]) {
                let user = staff[name][i];
                users.push(`${this.getStatus(user.status)} <@${user.id}>`);
            }

            fields.push({
                value: users.join('\n'), name
            });
        }

        return app.envoyer.sendEmbededMessage(message, {
            title: 'AvaIre Staff Team',
            fields
        });
    }

    /**
     * Gets the status emoji.
     *
     * @param  {String}  status  The status emoji to get.
     * @return {String}
     */
    getStatus(status) {
        switch (status) {
            case 'idle':
                return '<:idle:316856575098880002>';
            case 'dnd':
                return '<:dnd:324986174806425610>';
            case 'offline':
                return '<:offline:324986217529606144>';
            default:
                return '<:online:324986081378435072>';
        }
    }
}

module.exports = StaffCommand;
