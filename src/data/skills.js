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
