const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;

const BASE_MISSION_GROUPS = [
    {
        id: 'static',
        label: '상시 임무',
        description: '언제든 진행 가능한 기본 임무입니다.',
        resetInterval: null,
        slotLimit: null,
        missions: [
            {
                id: 'defeat_50',
                name: '전술 훈련 I',
                description: '적 50명을 처치하세요.',
                trigger: 'enemyDefeat',
                goal: 50,
                reward: { type: 'gold', amount: 500 },
            },
            {
                id: 'defeat_250',
                name: '전술 훈련 II',
                description: '적 250명을 처치하세요.',
                trigger: 'enemyDefeat',
                goal: 250,
                reward: { type: 'gachaTokens', amount: 3 },
            },
        ],
    },
    {
        id: 'daily',
        label: '일일 임무',
        description: '매일 새로운 보상을 받을 수 있는 임무입니다.',
        resetInterval: DAY,
        slotLimit: 4,
        missions: [
            {
                id: 'gacha_30',
                name: '모집 전문가',
                description: '학생 모집을 20회 진행하세요.',
                trigger: 'gachaRoll',
                goal: 20,
                reward: { type: 'gachaTokens', amount: 2 },
            },
            {
                id: 'salvage_20',
                name: '장비 정리 I',
                description: '전술 장비를 20회 분해하세요.',
                trigger: 'equipmentSalvage',
                goal: 20,
                reward: { type: 'gold', amount: 800 },
            },
        ],
    },
    {
        id: 'weekly',
        label: '주간 임무',
        description: '한 주 동안 꾸준히 진행하면 좋은 임무입니다.',
        resetInterval: WEEK,
        slotLimit: 4,
        missions: [
            {
                id: 'salvage_100',
                name: '장비 정리 II',
                description: '전술 장비를 100회 분해하세요.',
                trigger: 'equipmentSalvage',
                goal: 100,
                reward: { type: 'gachaTokens', amount: 4 },
            },
            {
                id: 'rebirth_1',
                name: '새로운 출발',
                description: '환생을 1회 진행하세요.',
                trigger: 'rebirth',
                goal: 1,
                reward: { type: 'gachaTokens', amount: 5 },
            },
        ],
    },
];

export const MISSION_GROUPS = BASE_MISSION_GROUPS.map(({ missions, ...group }) => ({ ...group }));

export const MISSION_GROUP_LOOKUP = MISSION_GROUPS.reduce((acc, group) => {
    acc[group.id] = group;
    return acc;
}, {});

export const MISSION_TYPE_ORDER = MISSION_GROUPS.map((group) => group.id);

export const MISSIONS = BASE_MISSION_GROUPS.flatMap((group) =>
    group.missions.map((mission) => ({
        ...mission,
        type: group.id,
        resetInterval:
            Number.isFinite(mission.resetInterval) && mission.resetInterval > 0
                ? Math.floor(mission.resetInterval)
                : group.resetInterval,
    })),
);
