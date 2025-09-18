export const SKILL_EFFECT_TYPES = {
    DPS_MULTIPLIER: 'dpsMultiplier',
    BOSS_TIMER_FREEZE: 'bossTimerFreeze',
    INSTANT_GOLD: 'instantGold',
};

export const SKILLS = [
    {
        id: 'frenzy',
        name: '아로나의 전술 지원',
        description: '샬레의 지원 네트워크로 잠시 총 지원 화력을 대폭 끌어올립니다.',
        cooldown: 60000,
        duration: 15000,
        effectType: SKILL_EFFECT_TYPES.DPS_MULTIPLIER,
        effectValue: 2,
    },
    {
        id: 'timeFreeze',
        name: '시간 정지 작전',
        description: '보스 제한시간을 잠시 정지시켜 안정적인 전술 수행을 돕습니다.',
        cooldown: 90000,
        duration: 10000,
        effectType: SKILL_EFFECT_TYPES.BOSS_TIMER_FREEZE,
    },
    {
        id: 'emergencyFunding',
        name: '비상 보급 요청',
        description: '현재 지원 화력을 바탕으로 추가 작전 자금을 즉시 확보합니다.',
        cooldown: 45000,
        duration: 0,
        effectType: SKILL_EFFECT_TYPES.INSTANT_GOLD,
        effectValue: 8,
    },
];

export const SKILL_MAP = new Map(SKILLS.map((skill) => [skill.id, skill]));

export const DEFAULT_SKILL_LEVEL = 1;

const DEFAULT_SKILL_LEVEL_CONFIG = {
    maxLevel: DEFAULT_SKILL_LEVEL,
    levels: [
        {
            level: DEFAULT_SKILL_LEVEL,
            effectMultiplier: 1,
            durationMultiplier: 1,
            cooldownMultiplier: 1,
            upgradeCost: null,
        },
    ],
};

export const SKILL_LEVEL_CONFIG = {
    frenzy: {
        maxLevel: 5,
        levels: [
            {
                level: 1,
                effectMultiplier: 1,
                durationMultiplier: 1,
                cooldownMultiplier: 1,
                upgradeCost: 20,
            },
            {
                level: 2,
                effectMultiplier: 1.25,
                durationMultiplier: 1.15,
                cooldownMultiplier: 0.95,
                upgradeCost: 40,
            },
            {
                level: 3,
                effectMultiplier: 1.5,
                durationMultiplier: 1.3,
                cooldownMultiplier: 0.9,
                upgradeCost: 80,
            },
            {
                level: 4,
                effectMultiplier: 1.75,
                durationMultiplier: 1.45,
                cooldownMultiplier: 0.85,
                upgradeCost: 160,
            },
            {
                level: 5,
                effectMultiplier: 2,
                durationMultiplier: 1.6,
                cooldownMultiplier: 0.8,
                upgradeCost: null,
            },
        ],
    },
    timeFreeze: {
        maxLevel: 5,
        levels: [
            {
                level: 1,
                effectMultiplier: 1,
                durationMultiplier: 1,
                cooldownMultiplier: 1,
                upgradeCost: 30,
            },
            {
                level: 2,
                effectMultiplier: 1.1,
                durationMultiplier: 1.2,
                cooldownMultiplier: 0.95,
                upgradeCost: 60,
            },
            {
                level: 3,
                effectMultiplier: 1.2,
                durationMultiplier: 1.4,
                cooldownMultiplier: 0.9,
                upgradeCost: 120,
            },
            {
                level: 4,
                effectMultiplier: 1.3,
                durationMultiplier: 1.6,
                cooldownMultiplier: 0.85,
                upgradeCost: 240,
            },
            {
                level: 5,
                effectMultiplier: 1.4,
                durationMultiplier: 1.8,
                cooldownMultiplier: 0.8,
                upgradeCost: null,
            },
        ],
    },
    emergencyFunding: {
        maxLevel: 5,
        levels: [
            {
                level: 1,
                effectMultiplier: 1,
                durationMultiplier: 1,
                cooldownMultiplier: 1,
                upgradeCost: 15,
            },
            {
                level: 2,
                effectMultiplier: 1.5,
                durationMultiplier: 1,
                cooldownMultiplier: 0.95,
                upgradeCost: 30,
            },
            {
                level: 3,
                effectMultiplier: 2,
                durationMultiplier: 1,
                cooldownMultiplier: 0.9,
                upgradeCost: 60,
            },
            {
                level: 4,
                effectMultiplier: 2.5,
                durationMultiplier: 1,
                cooldownMultiplier: 0.85,
                upgradeCost: 120,
            },
            {
                level: 5,
                effectMultiplier: 3,
                durationMultiplier: 1,
                cooldownMultiplier: 0.8,
                upgradeCost: null,
            },
        ],
    },
};

export const SKILL_LEVEL_MAP = new Map(Object.entries(SKILL_LEVEL_CONFIG));

export const getSkillLevelConfig = (skillId) => SKILL_LEVEL_MAP.get(skillId) ?? DEFAULT_SKILL_LEVEL_CONFIG;

export const getSkillLevelDefinition = (skillId, level = DEFAULT_SKILL_LEVEL) => {
    const config = getSkillLevelConfig(skillId);
    const levels = Array.isArray(config.levels) && config.levels.length > 0 ? config.levels : DEFAULT_SKILL_LEVEL_CONFIG.levels;
    const clamped = Math.max(DEFAULT_SKILL_LEVEL, Math.min(config.maxLevel ?? DEFAULT_SKILL_LEVEL, Math.floor(level)));
    return (
        levels.find((entry) => Number(entry.level) === clamped) ??
        levels[Math.min(levels.length - 1, clamped - DEFAULT_SKILL_LEVEL)] ??
        DEFAULT_SKILL_LEVEL_CONFIG.levels[0]
    );
};

export const getSkillUpgradeCost = (skillId, level = DEFAULT_SKILL_LEVEL) => {
    const config = getSkillLevelConfig(skillId);
    const clampedLevel = Math.max(DEFAULT_SKILL_LEVEL, Math.min(config.maxLevel ?? DEFAULT_SKILL_LEVEL, Math.floor(level)));
    if (clampedLevel >= (config.maxLevel ?? DEFAULT_SKILL_LEVEL)) {
        return null;
    }
    const definition = getSkillLevelDefinition(skillId, clampedLevel);
    if (!definition) return null;
    const rawCost = Number(definition.upgradeCost ?? 0);
    return Number.isFinite(rawCost) ? Math.max(0, Math.floor(rawCost)) : null;
};
