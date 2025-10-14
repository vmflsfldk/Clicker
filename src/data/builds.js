export const BUILD_EFFECT_TYPES = {
    TAP: 'tap',
    SKILL: 'skill',
    HERO: 'hero',
    GOLD: 'gold',
};

export const BUILDS = [
    {
        id: 'shadowClone',
        name: 'Shadow Clone',
        icon: '🗡️',
        summary: '자동틱 기반의 지속딜. 장시간 방치 플레이에 특화된 안정적인 빌드입니다.',
        effect: {
            [BUILD_EFFECT_TYPES.SKILL]: 0.18,
            [BUILD_EFFECT_TYPES.TAP]: 0.08,
        },
        tips: [
            '그림자 분신 지속시간과 쿨타임 감소 장비를 우선 확보하세요.',
            '마나 회복 유물과 포션을 확보하면 푸시 안정성이 크게 향상됩니다.',
            '포터(Portar)를 활용해 정체 구간을 빠르게 스킵하세요.',
        ],
    },
    {
        id: 'heavenlyStrike',
        name: 'Heavenly Strike',
        icon: '⚡',
        summary: '순간 폭딜로 스테이지를 빠르게 돌파하는 컨트롤 빌드입니다.',
        effect: {
            [BUILD_EFFECT_TYPES.SKILL]: 0.12,
            [BUILD_EFFECT_TYPES.TAP]: 0.15,
            [BUILD_EFFECT_TYPES.GOLD]: 0.05,
        },
        tips: [
            '활성 스킬의 순서를 최적화하여 HS → War Cry → Fire Sword 순으로 사용해 보세요.',
            '치명타 확률과 피해 유물을 강화하면 폭딜이 크게 향상됩니다.',
            '마나 자동회복 장비를 확보해 반복적인 스킬 사용을 유지하세요.',
        ],
    },
    {
        id: 'clanShip',
        name: 'Clan Ship & Pet',
        icon: '🚢',
        summary: '클랜쉽 포격과 펫 평타를 중심으로 하는 하이브리드 성장 빌드입니다.',
        effect: {
            [BUILD_EFFECT_TYPES.HERO]: 0.16,
            [BUILD_EFFECT_TYPES.GOLD]: 0.08,
        },
        tips: [
            '클랜 보너스와 함포 쿨감 장비를 맞추면 자동진행 효율이 높아집니다.',
            '펫 레벨과 장비 세트를 꾸준히 강화해 장기 성장력을 확보하세요.',
            '토너먼트와 레이드에서 얻는 보상으로 펫 스킬과 장비를 업그레이드하세요.',
        ],
    },
];

export const DEFAULT_BUILD_ID = BUILDS[0]?.id ?? null;

export const BUILD_MAP = new Map(BUILDS.map((build) => [build.id, build]));

export const clampBuildEffect = (value) => {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, value);
};
