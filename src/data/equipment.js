export const EQUIPMENT_EFFECTS = [
    {
        id: 'tap',
        label: '클릭 데미지 증가',
        shortLabel: '클릭 데미지',
        description: '학생의 기본 전술 공격력을 강화합니다.',
        format: 'percent',
        maxValue: 0.6,
        stageMultiplier: 1,
    },
    {
        id: 'hero',
        label: '지원 화력 증가',
        shortLabel: '지원 화력',
        description: '후방 지원 부대의 지속 화력을 끌어올립니다.',
        format: 'percent',
        maxValue: 0.6,
        stageMultiplier: 1,
    },
    {
        id: 'skill',
        label: '전술 스킬 효과 증가',
        shortLabel: '전술 스킬',
        description: '샬레 전술 지원 호출의 효율을 강화합니다.',
        format: 'percent',
        maxValue: 0.6,
        stageMultiplier: 1,
    },
    {
        id: 'gold',
        label: '골드 획득 증가',
        shortLabel: '골드 획득',
        description: '적 처치 시 획득하는 골드를 증가시킵니다.',
        format: 'percent',
        maxValue: 0.5,
        stageMultiplier: 0.9,
    },
    {
        id: 'critChance',
        label: '클릭 치명타 확률 증가',
        shortLabel: '치명타 확률',
        description: '클릭 공격이 치명타로 적중할 확률을 높입니다.',
        format: 'percent',
        maxValue: 0.35,
        stageMultiplier: 0.65,
    },
    {
        id: 'critDamage',
        label: '클릭 치명타 데미지 증가',
        shortLabel: '치명타 피해',
        description: '치명타 발생 시 피해량을 증가시킵니다.',
        format: 'percent',
        maxValue: 1,
        stageMultiplier: 1.1,
    },
];

export const EQUIPMENT_TYPES = [
    {
        id: 'tap',
        label: '공격 보조 장비',
        description: '클릭 데미지 관련 장비로 기본 전투력을 강화합니다.',
        primaryEffect: 'tap',
    },
    {
        id: 'hero',
        label: '지원 장비',
        description: '지원 부대의 화력을 끌어올리는 장비입니다.',
        primaryEffect: 'hero',
    },
    {
        id: 'skill',
        label: '전술 장비',
        description: '전술 스킬의 효율을 강화하는 장비입니다.',
        primaryEffect: 'skill',
    },
];

export const EQUIPMENT_BASE_NAMES = {
    tap: ['시로코의 라이딩 글러브', '네루의 전술 나이프', '미도리의 개조 키트', '유우카의 데이터 패드'],
    hero: ['방과후 대책위원회 작전도', '밀레니엄 폭격 프로토콜', '청룡당 지휘 배지', '샬레 공용 무전기'],
    skill: ['아로나의 전술 로그', '샬레 필드 매뉴얼', '코사카 특무대 작전지도', '하나에의 지원 드론 설계도'],
};

export const EQUIPMENT_RARITIES = [
    {
        id: 'common',
        name: '커먼',
        color: '#94a3b8',
        baseWeight: 40,
        bossWeight: 25,
        valueRange: [0.02, 0.05],
        rank: 0,
        maxLevel: 3,
        optionRange: [1, 1],
    },
    {
        id: 'uncommon',
        name: '언커먼',
        color: '#22d3ee',
        baseWeight: 25,
        bossWeight: 20,
        valueRange: [0.04, 0.07],
        rank: 1,
        maxLevel: 4,
        optionRange: [1, 2],
    },
    {
        id: 'rare',
        name: '레어',
        color: '#a855f7',
        baseWeight: 20,
        bossWeight: 25,
        valueRange: [0.07, 0.12],
        rank: 2,
        maxLevel: 5,
        optionRange: [2, 3],
    },
    {
        id: 'unique',
        name: '유니크',
        color: '#f97316',
        baseWeight: 10,
        bossWeight: 18,
        valueRange: [0.12, 0.18],
        rank: 3,
        maxLevel: 6,
        optionRange: [3, 4],
    },
    {
        id: 'legendary',
        name: '레전더리',
        color: '#facc15',
        baseWeight: 5,
        bossWeight: 12,
        valueRange: [0.18, 0.26],
        rank: 4,
        maxLevel: 7,
        optionRange: [4, 5],
    },
];

export const EQUIPMENT_MAX_VALUE = 0.6;
export const EQUIPMENT_UPGRADE_RATE = 0.2;

export const EQUIPMENT_DROP_CHANCE = 0.2;
export const EQUIPMENT_BOSS_DROP_CHANCE = 0.45;
