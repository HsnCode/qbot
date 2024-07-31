import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getInvalidRobloxUserEmbed,
    getUnexpectedErrorEmbed,
    getSuccessfulAcceptJoinRequestEmbed,
    getNoJoinRequestEmbed,
} from '../../handlers/locale';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';

class AcceptJoinCommand extends Command {
    constructor() {
        super({
            trigger: 'acceptjoin',
            description: 'Grup isteğini Kabul eder',
            type: 'ChatInput',
            module: 'join-requests',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Kimin roblox grup davetini Kabul edeceksin',
                    autocomplete: true,
                    type: 'RobloxUser',
                },
                {
                    trigger: 'Sebep',
                    description: 'Sebep giriniz ',
                    isLegacyFlag: true,
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.join,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        let robloxUser: User | PartialUser;
        try {
            robloxUser = await robloxClient.getUser(ctx.args['roblox-user'] as number);
        } catch (err) {
            try {
                const robloxUsers = await robloxClient.getUsersByUsernames([ ctx.args['roblox-user'] as string ]);
                if(robloxUsers.length === 0) throw new Error();
                robloxUser = robloxUsers[0];
            } catch (err) {
                try {
                    const idQuery = ctx.args['roblox-user'].replace(/[^0-9]/gm, '');
                    const discordUser = await discordClient.users.fetch(idQuery);
                    const linkedUser = await getLinkedRobloxUser(discordUser.id);
                    if(!linkedUser) throw new Error();
                    robloxUser = linkedUser;
                } catch (err) {
                    return ctx.reply({ embeds: [ getInvalidRobloxUserEmbed() ]});
                }
            }
        }

        const joinRequest = await robloxUser.getJoinRequestInGroup(config.groupId);
        if(!joinRequest) return ctx.reply({ embeds: [ getNoJoinRequestEmbed() ] });

        try {
            await robloxGroup.acceptJoinRequest(robloxUser.id);
            ctx.reply({ embeds: [ await getSuccessfulAcceptJoinRequestEmbed(robloxUser) ]});
            logAction('Accept Join Request', ctx.user, ctx.args['reason'], robloxUser);
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }
    }
}

export default AcceptJoinCommand;
