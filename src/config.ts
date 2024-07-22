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
        ranking: ['1234586849033584801','1234586773498368181','1234586678140731412','1234586558368190566','1233769780293533798','1233769781438578699','1233769785159061564','1233769808567341128','1233769809880285204','1233769811276861450','1233769812438552636'],
        users: [''],
        shout: [''],
        join: [''],
        signal: [''],
        admin: ['1234586849033584801','1234586773498368181','1234586678140731412','1234586558368190566','1233769780293533798','1233769781438578699','1233769785159061564'],
    },
    logChannels: {
        actions: '1250919848997945364',
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
        enabled: true,
        clearDuration: 1 * 10,
        threshold: 10,
        demotionRank: 1,
    },
    activity: {
        enabled: true,
        type: ActivityType.Watching,
        value: 'Tco Türkiye Cumhuriyeti Ordusu.',
    },
    status: 'dnd',
    deleteWallURLs: false,
}
