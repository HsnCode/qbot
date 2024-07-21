import { ActivityType } from 'discord.js';
import { BotConfig } from './structures/types'; 

export const config: BotConfig = {
    groupId: 13693196,
    slashCommands: true,
    legacyCommands: {
        enabled: true,
        prefixes: ['tco!'],
    },
    permissions: {
        all: ['1233769721896374282','1238193223025950851','1238434536061145130','1233879749043159202','1234583107676405780'],
        ranking: ['1233769776875044927','1233769806499680328'],
        users: [''],
        shout: [''],
        join: [''],
        signal: [''],
        admin: ['1233769776875044927'],
    },
    logChannels: {
        actions: '',
        shout: '',
    },
    api: false,
    maximumRank: 255,
    verificationChecks: false,
    bloxlinkGuildId: '',
    firedRank: 1,
    suspendedRank: 1,
    recordManualActions: true,
    memberCount: {
        enabled: false,
        channelId: '',
        milestone: 100,
        onlyMilestones: false,
    },
    xpSystem: {
        enabled: false,
        autoRankup: false,
        roles: [],
    },
    antiAbuse: {
        enabled: false,
        clearDuration: 1 * 60,
        threshold: 10,
        demotionRank: 1,
    },
    activity: {
        enabled: false,
        type: ActivityType.Watching,
        value: 'for commands.',
    },
    status: 'online',
    deleteWallURLs: false,
}
