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
        id: 'skill',
        label: '스킬 운영',
        description: '스킬을 사용하고 강화해 지휘 역량을 끌어올리세요.',
        resetInterval: null,
        slotLimit: null,
        missions: [
            {
                id: 'skill_use_20',
                name: '실전 감각 I',
                description: '전술 스킬을 20회 사용하세요.',
                trigger: 'skillUse',
                goal: 20,
                reward: { type: 'skillModules', amount: 3 },
            },
            {
                id: 'skill_upgrade_10',
                name: '전술 연구 I',
                description: '스킬을 10회 강화하세요.',
                trigger: 'skillUpgrade',
                goal: 10,
                reward: { type: 'gold', amount: 2500 },
            },
        ],
    },
    {
        id: 'bond',
        label: '호감도 관리',
        description: '학생들과의 유대를 더욱 깊게 다져 보세요.',
        resetInterval: null,
        slotLimit: null,
        missions: [
            {
                id: 'bond_level_5',
                name: '신뢰 구축 I',
                description: '학생 호감도를 5회 레벨업하세요.',
                trigger: 'bondLevelUp',
                goal: 5,
                reward: { type: 'bondAll', amount: 10 },
            },
            {
                id: 'bond_level_15',
                name: '신뢰 구축 II',
                description: '학생 호감도를 15회 레벨업하세요.',
                trigger: 'bondLevelUp',
                goal: 15,
                reward: { type: 'gachaTokens', amount: 4 },
            },
        ],
    },
    {
        id: 'equipment',
        label: '장비 개조',
        description: '전술 장비를 강화하여 전투력을 높이세요.',
        resetInterval: null,
        slotLimit: null,
        missions: [
            {
                id: 'equipment_upgrade_5',
                name: '정비 지원 I',
                description: '전술 장비를 5회 강화하세요.',
                trigger: 'equipmentUpgrade',
                goal: 5,
                reward: { type: 'upgradeMaterials', amount: 60 },
            },
            {
                id: 'equipment_upgrade_20',
                name: '정비 지원 II',
                description: '전술 장비를 20회 강화하세요.',
                trigger: 'equipmentUpgrade',
                goal: 20,
                reward: { type: 'gold', amount: 4000 },
            },
        ],
    },
    {
        id: 'stage',
        label: '전선 돌파',
        description: '더 높은 스테이지를 돌파해 지휘 능력을 입증하세요.',
        resetInterval: null,
        slotLimit: null,
        missions: [
            {
                id: 'stage_clear_50',
                name: '최전선 확보 I',
                description: '스테이지 50에 도달하세요.',
                trigger: 'stageClear',
                goal: 50,
                reward: { type: 'gold', amount: 5000 },
            },
            {
                id: 'stage_clear_120',
                name: '최전선 확보 II',
                description: '스테이지 120에 도달하세요.',
                trigger: 'stageClear',
                goal: 120,
                reward: { type: 'rebirthPoints', amount: 30 },
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
