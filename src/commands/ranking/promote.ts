import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getNoRankAboveEmbed,
    getRoleNotFoundEmbed,
    getVerificationChecksFailedEmbed,
    getUserSuspendedEmbed,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database';

class PromoteCommand extends Command {
    constructor() {
        super({
            trigger: 'terfi',
            description: 'Roblox grubundaki birinin rütbesini arttırır .',
            type: 'ChatInput',
            module: 'ranking',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Kimin rütbesini arttiracaksin',
                    autocomplete: true,
                    type: 'RobloxUser',
                },
                {
                    trigger: 'sebep',
                    description: 'Sebep yazınız ',
                    isLegacyFlag: true,
                    required: true,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.ranking,
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

        let robloxMember: GroupMember;
        try {
            robloxMember = await robloxGroup.getMember(robloxUser.id);
            if(!robloxMember) throw new Error();
        } catch (err) {
            return ctx.reply({ embeds: [ getRobloxUserIsNotMemberEmbed() ]});
        }

        const groupRoles = await robloxGroup.getRoles();
        const currentRoleIndex = groupRoles.findIndex((role) => role.rank === robloxMember.role.rank);
        const role = groupRoles[currentRoleIndex + 1];
        if(!role) return ctx.reply({ embeds: [ getNoRankAboveEmbed() ]});
        if(role.rank > config.maximumRank || robloxMember.role.rank > config.maximumRank) return ctx.reply({ embeds: [ getRoleNotFoundEmbed() ] });

        if(config.verificationChecks) {
            const actionEligibility = await checkActionEligibility(ctx.user.id, ctx.guild.id, robloxMember, role.rank);
            if(!actionEligibility) return ctx.reply({ embeds: [ getVerificationChecksFailedEmbed() ] });
        }

        const userData = await provider.findUser(robloxUser.id.toString());
        if(userData.suspendedUntil) return ctx.reply({ embeds: [ getUserSuspendedEmbed() ] });

        try {
            await robloxGroup.updateMember(robloxUser.id, role.id);
            ctx.reply({ embeds: [ await getSuccessfulPromotionEmbed(robloxUser, role.name) ]});
            logAction('Terfi', ctx.user, ctx.args['sebep'], robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }
    }
}

export default PromoteCommand;
