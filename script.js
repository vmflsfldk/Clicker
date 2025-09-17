const formatNumber = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    if (value >= 100) return Math.round(value).toString();
    if (value >= 10) return value.toFixed(1);
    if (value > 0) return value.toFixed(2);
    return '0';
};

const HERO_SKIN_LIBRARY = {
    shiroko: [
        {
            id: 'standard',
            name: '전술 제복',
            description: '아비도스 전술 훈련용 기본 전투복입니다.',
            requiredLevel: 1,
            theme: 'shiroko-standard',
            preview: 'linear-gradient(135deg, #38bdf8 0%, #1e293b 45%, #0f172a 100%)',
            accentColor: '#38bdf8',
            shadowColor: 'rgba(56, 189, 248, 0.35)',
        },
        {
            id: 'rider',
            name: '라이딩 기어',
            description: '모래바람 속에서도 달릴 수 있는 시로코의 라이딩 장비.',
            requiredLevel: 15,
            theme: 'shiroko-rider',
            preview: 'linear-gradient(135deg, #f97316 0%, #fb923c 45%, #0f172a 100%)',
            accentColor: '#f97316',
            shadowColor: 'rgba(249, 115, 22, 0.35)',
        },
    ],
    hoshino: [
        {
            id: 'defense',
            name: '방과후 전술복',
            description: '방과후 대책위원회의 전투용 제복입니다.',
            requiredLevel: 1,
            theme: 'hoshino-defense',
            preview: 'linear-gradient(135deg, #f472b6 0%, #db2777 55%, #111827 100%)',
            accentColor: '#f472b6',
            shadowColor: 'rgba(244, 114, 182, 0.35)',
        },
        {
            id: 'beach',
            name: '비치 타임',
            description: '휴식 시간에도 방심하지 않는 호시노의 수영복 세트.',
            requiredLevel: 25,
            theme: 'hoshino-beach',
            preview: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #0f172a 100%)',
            accentColor: '#22d3ee',
            shadowColor: 'rgba(34, 211, 238, 0.35)',
        },
    ],
    aru: [
        {
            id: 'standard',
            name: '청룡당 제복',
            description: '청룡당의 기품을 드러내는 기본 제복입니다.',
            requiredLevel: 1,
            theme: 'aru-standard',
            preview: 'linear-gradient(135deg, #a855f7 0%, #6d28d9 45%, #0f172a 100%)',
            accentColor: '#a855f7',
            shadowColor: 'rgba(168, 85, 247, 0.35)',
        },
        {
            id: 'festival',
            name: '축제 폭죽',
            description: '폭죽처럼 화려한 아루의 이벤트 한정 복장.',
            requiredLevel: 35,
            theme: 'aru-festival',
            preview: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #0f172a 100%)',
            accentColor: '#ef4444',
            shadowColor: 'rgba(239, 68, 68, 0.35)',
        },
    ],
    hibiki: [
        {
            id: 'artillery',
            name: '밀레니엄 포격복',
            description: '정밀 폭격 임무에 맞춘 밀레니엄 전투복.',
            requiredLevel: 1,
            theme: 'hibiki-artillery',
            preview: 'linear-gradient(135deg, #c084fc 0%, #6366f1 50%, #111827 100%)',
            accentColor: '#c084fc',
            shadowColor: 'rgba(192, 132, 252, 0.35)',
        },
        {
            id: 'engineer',
            name: '지원 공학복',
            description: '장비 정비에 최적화된 히비키의 공학복.',
            requiredLevel: 45,
            theme: 'hibiki-engineer',
            preview: 'linear-gradient(135deg, #4ade80 0%, #22c55e 45%, #0f172a 100%)',
            accentColor: '#4ade80',
            shadowColor: 'rgba(74, 222, 128, 0.35)',
        },
    ],
    iroha: [
        {
            id: 'commander',
            name: '특무대 지휘복',
            description: '코사카 특무대 지휘관다운 위엄 있는 제복입니다.',
            requiredLevel: 1,
            theme: 'iroha-commander',
            preview: 'linear-gradient(135deg, #facc15 0%, #f97316 45%, #0f172a 100%)',
            accentColor: '#facc15',
            shadowColor: 'rgba(250, 204, 21, 0.35)',
        },
        {
            id: 'parade',
            name: '행진 준비',
            description: '의장 행사를 위한 장식이 돋보이는 의상입니다.',
            requiredLevel: 55,
            theme: 'iroha-parade',
            preview: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 45%, #0f172a 100%)',
            accentColor: '#7dd3fc',
            shadowColor: 'rgba(125, 211, 252, 0.35)',
        },
    ],
    yuuka: [
        {
            id: 'standard',
            name: '생도 회계복',
            description: '밀레니엄 재무국의 단정한 제복으로 꼼꼼함이 느껴집니다.',
            requiredLevel: 1,
            theme: 'yuuka-standard',
            preview: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #0f172a 100%)',
            accentColor: '#60a5fa',
            shadowColor: 'rgba(96, 165, 250, 0.35)',
        },
        {
            id: 'resort',
            name: '리조트 체크인',
            description: '휴양지에서도 예산을 챙기는 유우카의 세련된 휴가 복장입니다.',
            requiredLevel: 40,
            theme: 'yuuka-resort',
            preview: 'linear-gradient(135deg, #f472b6 0%, #fb7185 45%, #0f172a 100%)',
            accentColor: '#f472b6',
            shadowColor: 'rgba(244, 114, 182, 0.35)',
        },
    ],
};

const HERO_TRAIT_GROUPS = [
    {
        id: 'school',
        label: '학교',
        shortLabel: '학교',
        icon: '🏫',
        traits: [
            {
                id: 'abydos',
                name: '아비도스 고등학교',
                shortName: '아비도스',
                description: '사막을 지키는 아비도스 대책위원회의 학생들입니다.',
                accentColor: '#38bdf8',
            },
            {
                id: 'gehenna',
                name: '게헨나 학원',
                shortName: '게헨나',
                description: '폭발적인 화력을 자랑하는 게헨나 학생들입니다.',
                accentColor: '#f97316',
            },
            {
                id: 'millennium',
                name: '밀레니엄 사이언스 스쿨',
                shortName: '밀레니엄',
                description: '첨단 장비로 전장을 지휘하는 밀레니엄 학생들입니다.',
                accentColor: '#22d3ee',
            },
        ],
    },
    {
        id: 'weapon',
        label: '주무기',
        shortLabel: '무기',
        icon: '🔫',
        traits: [
            {
                id: 'ar',
                name: '돌격소총',
                shortName: 'AR',
                description: '탄막과 정확도를 모두 갖춘 범용 돌격소총 사용 학생입니다.',
                accentColor: '#34d399',
            },
            {
                id: 'mg',
                name: '기관총',
                shortName: 'MG',
                description: '지속 화력 지원에 특화된 기관총 사용 학생입니다.',
                accentColor: '#f97316',
            },
            {
                id: 'artillery',
                name: '포격 장비',
                shortName: '포격',
                description: '장거리 지원을 담당하는 포격/중화기 사용 학생입니다.',
                accentColor: '#facc15',
            },
            {
                id: 'smg',
                name: '기관단총',
                shortName: 'SMG',
                description: '근거리에서 기동력을 살린 기관단총 사용 학생입니다.',
                accentColor: '#60a5fa',
            },
        ],
    },
    {
        id: 'position',
        label: '포지션',
        shortLabel: '포지션',
        icon: '🎖️',
        traits: [
            {
                id: 'striker',
                name: '스트라이커',
                shortName: '스트라이커',
                description: '전선에 서서 직접 전투를 수행하는 학생입니다.',
                accentColor: '#60a5fa',
            },
            {
                id: 'special',
                name: '스페셜',
                shortName: '스페셜',
                description: '후방에서 전술 지원을 담당하는 학생입니다.',
                accentColor: '#a855f7',
            },
        ],
    },
];

const HERO_TRAIT_GROUP_MAP = new Map(HERO_TRAIT_GROUPS.map((group) => [group.id, group]));
const HERO_TRAIT_MAP = HERO_TRAIT_GROUPS.reduce((acc, group) => {
    acc[group.id] = new Map(group.traits.map((trait) => [trait.id, trait]));
    return acc;
}, {});

const HERO_SET_BONUSES = [
    {
        id: 'abydos-alliance',
        name: '아비도스 합동 작전',
        description: '사막에서 단련된 대책위원회의 전술 호흡이 빛납니다.',
        requirement: { type: 'school', trait: 'abydos', count: 2 },
        effects: { hero: 0.08, gold: 0.05 },
    },
    {
        id: 'millennium-strategy',
        name: '밀레니엄 전략 분석',
        description: '첨단 분석과 드론 지원으로 전술 호출 효율을 극대화합니다.',
        requirement: { type: 'school', trait: 'millennium', count: 2 },
        effects: { skill: 0.08, critChance: 0.02 },
    },
    {
        id: 'rapid-response',
        name: '기동 포위망',
        description: 'AR 운용 학생들이 기동력을 살려 전장을 장악합니다.',
        requirement: { type: 'weapon', trait: 'ar', count: 2 },
        effects: { tap: 0.05, hero: 0.04 },
    },
    {
        id: 'artillery-support',
        name: '중화기 포격 지원',
        description: '장거리 포격망을 구축해 지속적인 화력을 제공합니다.',
        requirement: { type: 'weapon', trait: 'artillery', count: 2 },
        effects: { skill: 0.06, hero: 0.03 },
    },
    {
        id: 'frontline-spearhead',
        name: '전선 돌파대',
        description: '스트라이커 부대가 전선을 돌파하며 공격력을 끌어올립니다.',
        requirement: { type: 'position', trait: 'striker', count: 3 },
        effects: { hero: 0.07, tap: 0.04 },
    },
    {
        id: 'tactical-command',
        name: '전술 지휘망',
        description: '스페셜 포지션 학생들이 전장의 흐름을 통제합니다.',
        requirement: { type: 'position', trait: 'special', count: 2 },
        effects: { skill: 0.05, critDamage: 0.1 },
    },
];

const HERO_TRAIT_TYPES = ['school', 'weapon', 'position'];

const getHeroTraitGroup = (type) => HERO_TRAIT_GROUP_MAP.get(type) ?? null;

const getHeroTraitDefinition = (type, traitId) => {
    if (!type || !traitId) return null;
    const map = HERO_TRAIT_MAP[type];
    if (!map) return null;
    return map.get(traitId) ?? null;
};

const describeSetBonusRequirement = (requirement) => {
    if (!requirement) return '특수 조건';
    const { type, trait, count } = requirement;
    const group = getHeroTraitGroup(type);
    const traitData = getHeroTraitDefinition(type, trait);
    const traitName = traitData?.name ?? trait ?? '특성';
    const label = group?.label ?? type ?? '조건';
    const required = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 1;
    return `${label} ${traitName} ${required}명 편성`;
};

const formatSetBonusEffects = (effects) => {
    if (!effects || typeof effects !== 'object') {
        return '추가 효과 없음';
    }
    const entries = Object.entries(effects)
        .map(([effectId, value]) => describeEquipmentEffect(effectId, Number(value) || 0))
        .filter(Boolean);
    return entries.length > 0 ? entries.join(' · ') : '추가 효과 없음';
};

const defaultHeroes = [
    {
        id: 'shiroko',
        name: '시로코 - 아비도스 라이더',
        description: '아비도스 대책위원회의 라이딩 에이스로 꾸준한 사격 지원을 제공합니다.',
        baseCost: 25,
        costMultiplier: 1.08,
        baseDamage: 5,
        rarity: 'common',
        skins: HERO_SKIN_LIBRARY.shiroko,
        school: 'abydos',
        weapon: 'ar',
        position: 'striker',
    },
    {
        id: 'hoshino',
        name: '호시노 - 방과후 지휘',
        description: '방과후 대책위원회의 부장. 여유로운 모습과 달리 안정적인 탄막을 유지합니다.',
        baseCost: 120,
        costMultiplier: 1.1,
        baseDamage: 18,
        rarity: 'uncommon',
        skins: HERO_SKIN_LIBRARY.hoshino,
        school: 'abydos',
        weapon: 'mg',
        position: 'striker',
    },
    {
        id: 'aru',
        name: '아루 - 청룡당 리더',
        description: '게헨나 청룡당의 리더로 폭발적인 화력을 자랑합니다.',
        baseCost: 450,
        costMultiplier: 1.12,
        baseDamage: 75,
        rarity: 'rare',
        skins: HERO_SKIN_LIBRARY.aru,
        school: 'gehenna',
        weapon: 'ar',
        position: 'striker',
    },
    {
        id: 'hibiki',
        name: '히비키 - 밀레니엄 포격',
        description: '밀레니엄 사이언스 스쿨의 폭격 지원 담당. 정밀 포격으로 광역 피해를 입힙니다.',
        baseCost: 1800,
        costMultiplier: 1.14,
        baseDamage: 220,
        rarity: 'unique',
        skins: HERO_SKIN_LIBRARY.hibiki,
        school: 'millennium',
        weapon: 'artillery',
        position: 'special',
    },
    {
        id: 'iroha',
        name: '이로하 - 코사카 특무대',
        description: '코사카 특무대의 전차 지휘관으로 강력한 포격으로 보스를 제압합니다.',
        baseCost: 5200,
        costMultiplier: 1.15,
        baseDamage: 620,
        rarity: 'legendary',
        skins: HERO_SKIN_LIBRARY.iroha,
        school: 'millennium',
        weapon: 'artillery',
        position: 'special',
    },
    {
        id: 'yuuka',
        name: '유우카 - 밀레니엄 회계',
        description: '밀레니엄 재무국의 회계 담당. 냉철한 판단으로 자원을 효율적으로 운용합니다.',
        baseCost: 2300,
        costMultiplier: 1.13,
        baseDamage: 360,
        rarity: 'unique',
        skins: HERO_SKIN_LIBRARY.yuuka,
        school: 'millennium',
        weapon: 'smg',
        position: 'striker',
    },
];

const HERO_RARITIES = [
    {
        id: 'common',
        name: '커먼',
        color: '#94a3b8',
        weight: 40,
        initialLevel: 1,
        duplicateGain: 1,
        description: '기본적인 지원 학생으로 쉽게 합류합니다.',
    },
    {
        id: 'uncommon',
        name: '언커먼',
        color: '#22d3ee',
        weight: 25,
        initialLevel: 2,
        duplicateGain: 1,
        description: '특별한 전술을 가진 학생으로 합류 확률이 조금 낮습니다.',
    },
    {
        id: 'rare',
        name: '레어',
        color: '#a855f7',
        weight: 18,
        initialLevel: 3,
        duplicateGain: 2,
        description: '강력한 화력을 보유한 학생으로 합류 시 높은 전력 상승을 제공합니다.',
    },
    {
        id: 'unique',
        name: '유니크',
        color: '#f97316',
        weight: 12,
        initialLevel: 4,
        duplicateGain: 2,
        description: '전용 장비와 전술을 가진 학생으로 등장 확률이 낮습니다.',
    },
    {
        id: 'legendary',
        name: '레전더리',
        color: '#facc15',
        weight: 5,
        initialLevel: 5,
        duplicateGain: 3,
        description: '전장을 지배하는 최상급 학생으로 만나기 매우 어렵습니다.',
    },
];

const HERO_RARITY_MAP = new Map(HERO_RARITIES.map((rarity) => [rarity.id, rarity]));
const DEFAULT_HERO_RARITY_ID = 'common';

const EQUIPMENT_EFFECTS = [
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

const EQUIPMENT_EFFECT_MAP = new Map(EQUIPMENT_EFFECTS.map((effect) => [effect.id, effect]));

const EQUIPMENT_TYPES = [
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

const EQUIPMENT_BASE_NAMES = {
    tap: ['시로코의 라이딩 글러브', '네루의 전술 나이프', '미도리의 개조 키트', '유우카의 데이터 패드'],
    hero: ['방과후 대책위원회 작전도', '밀레니엄 폭격 프로토콜', '청룡당 지휘 배지', '샬레 공용 무전기'],
    skill: ['아로나의 전술 로그', '샬레 필드 매뉴얼', '코사카 특무대 작전지도', '하나에의 지원 드론 설계도'],
};

const EQUIPMENT_RARITIES = [
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

const EQUIPMENT_MAX_VALUE = 0.6;
const EQUIPMENT_UPGRADE_RATE = 0.2;

const clampEquipmentValue = (value, effectId = null) => {
    const effect = effectId ? EQUIPMENT_EFFECT_MAP.get(effectId) : null;
    const cap = effect?.maxValue ?? EQUIPMENT_MAX_VALUE;
    return Math.min(cap, Number(value.toFixed(3)));
};

const calculateEquipmentValue = (baseValue, level = 1, effectId = null) => {
    const normalizedLevel = Math.max(1, Math.floor(level));
    const multiplier = 1 + EQUIPMENT_UPGRADE_RATE * (normalizedLevel - 1);
    return clampEquipmentValue(baseValue * multiplier, effectId);
};

const clampProbability = (value) => Math.min(1, Math.max(0, value));

const EQUIPMENT_DROP_CHANCE = 0.2;
const EQUIPMENT_BOSS_DROP_CHANCE = 0.45;

const EQUIPMENT_RARITY_MAP = new Map(EQUIPMENT_RARITIES.map((rarity) => [rarity.id, rarity]));
const EQUIPMENT_TYPE_MAP = new Map(EQUIPMENT_TYPES.map((type) => [type.id, type]));

const GACHA_SINGLE_COST = 1;
const GACHA_MULTI_COUNT = 10;
const GACHA_MULTI_COST = 9;
const GACHA_TOKEN_NORMAL_DROP_CHANCE = 0.02;
const GACHA_TOKEN_BOSS_DROP_CHANCE = 0.35;

const MISSIONS = [
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
    {
        id: 'gacha_30',
        name: '모집 전문가',
        description: '학생 모집을 30회 진행하세요.',
        trigger: 'gachaRoll',
        goal: 30,
        reward: { type: 'gold', amount: 1200 },
    },
    {
        id: 'salvage_20',
        name: '장비 정리 I',
        description: '전술 장비를 20회 분해하세요.',
        trigger: 'equipmentSalvage',
        goal: 20,
        reward: { type: 'gold', amount: 800 },
    },
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
];

const MISSION_MAP = new Map(MISSIONS.map((mission) => [mission.id, mission]));

const BOSS_STAGE_INTERVAL = 5;
const BOSS_TIME_LIMIT = 30000;
const BOSS_TIME_LIMIT_SECONDS = Math.floor(BOSS_TIME_LIMIT / 1000);
const BOSS_WARNING_THRESHOLD = 5000;

const REBIRTH_STAGE_REQUIREMENT = 100;

const CLICK_UPGRADE_CONFIG = {
    baseCost: 10,
    costGrowth: 1.2,
    baseDamage: 1,
    flatIncrease: 1,
    damageGrowth: 1.12,
    assumedClicksPerSecond: 4,
};

const CLICK_CRIT_CHANCE_UPGRADE_CONFIG = {
    baseCost: 50,
    costGrowth: 1.3,
    baseChance: 0.05,
    increasePerLevel: 0.02,
    maxChance: 0.75,
};

const CLICK_CRIT_DAMAGE_UPGRADE_CONFIG = {
    baseCost: 75,
    costGrowth: 1.28,
    baseMultiplier: 1.5,
    increasePerLevel: 0.15,
    maxMultiplier: 5,
};

const HERO_DPS_UPGRADE_CONFIG = {
    baseCost: 100,
    costGrowth: 1.25,
    increasePerLevel: 0.08,
};

const STAGE_REWARD_CONFIG = {
    base: 12,
    growth: 1.1,
    bossMultiplier: 5,
};

const normalizeLevel = (level) => {
    const numeric = Number(level);
    return Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1;
};

const calculateClickUpgradeCost = (level) => {
    const normalized = normalizeLevel(level);
    const exponent = Math.max(0, normalized - 1);
    return Math.ceil(CLICK_UPGRADE_CONFIG.baseCost * Math.pow(CLICK_UPGRADE_CONFIG.costGrowth, exponent));
};

const calculateScalingUpgradeCost = (level, config) => {
    const normalized = Number.isFinite(level) ? Math.max(0, Math.floor(level)) : 0;
    return Math.ceil(config.baseCost * Math.pow(config.costGrowth, normalized));
};

const calculateClickDamageAtLevel = (level) => {
    const normalized = normalizeLevel(level);
    let damage = CLICK_UPGRADE_CONFIG.baseDamage;
    for (let step = 2; step <= normalized; step += 1) {
        damage = Math.ceil(
            damage +
                CLICK_UPGRADE_CONFIG.flatIncrease +
                Math.pow(CLICK_UPGRADE_CONFIG.damageGrowth, step),
        );
    }
    return damage;
};

const calculateStageRewardValue = (stage) => {
    const normalized = Number.isFinite(stage) ? Math.max(1, Math.floor(stage)) : 1;
    const exponent = Math.max(0, normalized - 1);
    return STAGE_REWARD_CONFIG.base * Math.pow(STAGE_REWARD_CONFIG.growth, exponent);
};

const calculateStageReward = (stage, isBoss, goldBonus = 0) => {
    const baseReward = calculateStageRewardValue(stage);
    const bossMultiplier = isBoss ? STAGE_REWARD_CONFIG.bossMultiplier : 1;
    const bonusMultiplier = 1 + (Number.isFinite(goldBonus) ? goldBonus : 0);
    return Math.ceil(baseReward * bossMultiplier * bonusMultiplier);
};

const REBIRTH_EFFECT_LABELS = {
    tap: '전술 공격력',
    hero: '지원 화력',
    skill: '전술 스킬',
    gold: '작전 보상',
    critChance: '치명타 확률',
    critDamage: '치명타 피해',
    equipmentDrop: '전술 장비 드롭',
    gachaDrop: '모집권 드롭',
    rebirthGain: '환생 포인트',
};

const REBIRTH_SKILLS = [
    {
        id: 'tapPower',
        name: '아로나의 전술 분석',
        description: '아로나가 전투 데이터를 실시간으로 분석해 학생들의 조준을 돕습니다.',
        effectDescription: '레벨당 전술 공격력 +10%',
        effect: { tap: 0.1 },
        baseCost: 2,
        costGrowth: 2,
        maxLevel: 10,
    },
    {
        id: 'heroCommand',
        name: '대책위원회 연계',
        description: '방과후 대책위원회가 팀워크로 지원 화력을 조율합니다.',
        effectDescription: '레벨당 지원 화력 +8%',
        effect: { hero: 0.08 },
        baseCost: 2,
        costGrowth: 3,
        maxLevel: 10,
    },
    {
        id: 'manaOverflow',
        name: '밀레니엄 전술 드론',
        description: '밀레니엄의 전술 드론이 전장 데이터를 공유해 지원 호출을 강화합니다.',
        effectDescription: '레벨당 전술 스킬 +6%',
        effect: { skill: 0.06 },
        baseCost: 3,
        costGrowth: 3,
        maxLevel: 10,
    },
    {
        id: 'goldSense',
        name: '게헨나 재무 감각',
        description: '게헨나의 운영 노하우로 작전 보상 회수를 극대화합니다.',
        effectDescription: '레벨당 작전 보상 +5%',
        effect: { gold: 0.05 },
        baseCost: 4,
        costGrowth: 4,
        maxLevel: 10,
    },
    {
        id: 'salvageNetwork',
        name: '샬레 전리품 네트워크',
        description: '샬레 보급 관리국이 전장 보급망을 확충해 장비 회수를 체계화합니다.',
        effectDescription: '레벨당 전술 장비 드롭 확률 +10%',
        effect: { equipmentDrop: 0.1 },
        baseCost: 3,
        costGrowth: 4,
        maxLevel: 10,
    },
    {
        id: 'strategicRecruitment',
        name: '전략적 모집 네트워크',
        description: '각 학원의 협력 체계를 통해 보스 토벌 시 추가 모집권을 확보합니다.',
        effectDescription: '레벨당 모집권 드롭 확률 +4%',
        effect: { gachaDrop: 0.04 },
        baseCost: 4,
        costGrowth: 5,
        maxLevel: 10,
    },
    {
        id: 'rebirthInsight',
        name: '환생 기억 각성',
        description: '누적된 전투 경험이 새로운 시작을 더욱 강력하게 만들어 줍니다.',
        effectDescription: '레벨당 환생 포인트 +5%',
        effect: { rebirthGain: 0.05 },
        baseCost: 6,
        costGrowth: 6,
        maxLevel: 10,
    },
];

const REBIRTH_SKILL_MAP = new Map(REBIRTH_SKILLS.map((skill) => [skill.id, skill]));

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

const formatSignedPercent = (value) => {
    const normalized = Number.isFinite(value) ? value : 0;
    const sign = normalized >= 0 ? '+' : '-';
    return `${sign}${formatPercent(Math.abs(normalized))}`;
};

const describeEquipmentEffect = (effectId, value = 0) => {
    const effect = EQUIPMENT_EFFECT_MAP.get(effectId);
    if (!effect) return null;
    const formattedValue = effect.format === 'percent' ? formatSignedPercent(value) : formatNumber(value);
    const label = effect.shortLabel ?? effect.label;
    return `${label} ${formattedValue}`;
};

const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

const randomInt = (min, max) => {
    const normalizedMin = Math.max(0, Math.floor(Math.min(min, max)));
    const normalizedMax = Math.max(0, Math.floor(Math.max(min, max)));
    if (normalizedMax <= normalizedMin) return normalizedMin;
    return normalizedMin + Math.floor(Math.random() * (normalizedMax - normalizedMin + 1));
};

const weightedRandom = (items, getWeight) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    const pool = [];
    let totalWeight = 0;
    items.forEach((item) => {
        const rawWeight = typeof getWeight === 'function' ? Number(getWeight(item)) : 0;
        const weight = Number.isFinite(rawWeight) ? Math.max(0, rawWeight) : 0;
        if (weight > 0) {
            pool.push({ item, weight });
            totalWeight += weight;
        }
    });
    if (pool.length === 0 || totalWeight <= 0) {
        return randomFromArray(items);
    }
    let roll = Math.random() * totalWeight;
    for (const entry of pool) {
        roll -= entry.weight;
        if (roll < 0) {
            return entry.item;
        }
    }
    return pool[pool.length - 1]?.item ?? null;
};

const calculateRebirthPoints = (highestStage) => {
    if (highestStage < REBIRTH_STAGE_REQUIREMENT) return 0;
    return Math.max(1, Math.floor((highestStage - (REBIRTH_STAGE_REQUIREMENT - 5)) / 5));
};

const chooseRarity = (isBoss) => {
    const totalWeight = EQUIPMENT_RARITIES.reduce(
        (total, rarity) => total + (isBoss ? rarity.bossWeight : rarity.baseWeight),
        0,
    );
    let roll = Math.random() * totalWeight;
    for (const rarity of EQUIPMENT_RARITIES) {
        const weight = isBoss ? rarity.bossWeight : rarity.baseWeight;
        if (roll < weight) {
            return rarity;
        }
        roll -= weight;
    }
    return EQUIPMENT_RARITIES[0];
};

const generateEquipmentName = (typeId) => {
    const pool = EQUIPMENT_BASE_NAMES[typeId] ?? ['미식별 전술 장비'];
    return randomFromArray(pool);
};

const generateEquipmentItem = (stage, isBoss) => {
    const rarity = chooseRarity(isBoss);
    const type = randomFromArray(EQUIPMENT_TYPES);
    const primaryEffect = EQUIPMENT_EFFECT_MAP.has(type.primaryEffect)
        ? type.primaryEffect
        : type.id;
    const stageBonus = 1 + Math.min(stage, 150) * 0.002;
    const optionRange = Array.isArray(rarity.optionRange) ? rarity.optionRange : [1, 1];
    const optionCount = Math.max(
        1,
        Math.min(
            EQUIPMENT_EFFECTS.length,
            randomInt(optionRange[0], optionRange[1] ?? optionRange[0]),
        ),
    );
    const selectedEffects = new Set([primaryEffect]);
    const availableEffects = EQUIPMENT_EFFECTS.map((effect) => effect.id).filter(
        (id) => id !== primaryEffect,
    );
    while (selectedEffects.size < optionCount && availableEffects.length > 0) {
        const next = randomFromArray(availableEffects);
        selectedEffects.add(next);
        availableEffects.splice(availableEffects.indexOf(next), 1);
    }

    const effects = {};
    const effectOrder = Array.from(selectedEffects);
    for (const effectId of effectOrder) {
        const effectData = EQUIPMENT_EFFECT_MAP.get(effectId);
        if (!effectData) continue;
        const rarityData = EQUIPMENT_RARITY_MAP.get(rarity.id);
        const [min, max] = rarityData?.valueRange ?? [0.01, 0.02];
        const multiplier = effectData.stageMultiplier ?? 1;
        const base = clampEquipmentValue(
            (min + Math.random() * Math.max(0, max - min)) * stageBonus * multiplier,
            effectId,
        );
        effects[effectId] = {
            baseValue: base,
            value: calculateEquipmentValue(base, 1, effectId),
        };
    }
    if (!effects[primaryEffect]) {
        effects[primaryEffect] = {
            baseValue: 0,
            value: 0,
        };
    }
    const baseValue = effects[primaryEffect]?.baseValue ?? 0;
    const value = effects[primaryEffect]?.value ?? 0;
    return {
        id: `eq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: type.id,
        rarity: rarity.id,
        baseValue,
        value,
        level: 1,
        maxLevel: rarity.maxLevel,
        name: generateEquipmentName(type.id),
        stage,
        locked: false,
        effects,
        effectOrder,
    };
};

class Hero {
    constructor(
        { id, name, description, baseDamage, rarity, skins, school, weapon, position },
        savedState,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.baseDamage = baseDamage;
        const savedLevel = Number(savedState?.level ?? 0);
        this.level = Number.isFinite(savedLevel) ? Math.max(0, Math.floor(savedLevel)) : 0;
        const assignedRarity = typeof rarity === 'string' ? rarity : DEFAULT_HERO_RARITY_ID;
        this.rarityId = HERO_RARITY_MAP.has(assignedRarity) ? assignedRarity : DEFAULT_HERO_RARITY_ID;
        this.skins = this.initializeSkins(Array.isArray(skins) ? skins : [], savedState);
        const savedSelection = typeof savedState?.selectedSkinId === 'string' ? savedState.selectedSkinId : null;
        this.selectedSkinId = savedSelection ?? this.skins[0]?.id ?? null;
        this.schoolId = typeof school === 'string' ? school : null;
        this.weaponId = typeof weapon === 'string' ? weapon : null;
        this.positionId = typeof position === 'string' ? position : null;
        this.refreshSkinUnlocks();
    }

    get damagePerSecond() {
        if (this.level === 0) return 0;
        const scalingBonus = 1 + Math.floor(this.level / 10) * 0.2;
        return this.baseDamage * this.level * scalingBonus;
    }

    get isUnlocked() {
        return this.level > 0;
    }

    get enhancementLevel() {
        if (this.level === 0) return 0;
        return Math.max(0, this.level - this.gachaInitialLevel);
    }

    get activeSkin() {
        return this.getSkin(this.selectedSkinId) ?? this.skins[0] ?? null;
    }

    get activeSkinKey() {
        const skin = this.activeSkin;
        if (!skin) return null;
        return `${this.id}:${skin.id}`;
    }

    get nextSkinUnlock() {
        const lockedSkins = this.skins
            .filter((skin) => !skin.unlocked)
            .sort((a, b) => a.requiredLevel - b.requiredLevel);
        return lockedSkins[0] ?? null;
    }

    get rarity() {
        return HERO_RARITY_MAP.get(this.rarityId) ?? HERO_RARITY_MAP.get(DEFAULT_HERO_RARITY_ID);
    }

    get rarityName() {
        return this.rarity?.name ?? '커먼';
    }

    get rarityColor() {
        return this.rarity?.color ?? '#94a3b8';
    }

    get gachaWeight() {
        const weight = this.rarity?.weight ?? 1;
        return Math.max(0, Number(weight)) || 0;
    }

    get gachaInitialLevel() {
        const value = this.rarity?.initialLevel ?? 1;
        return Math.max(1, Math.floor(Number(value) || 1));
    }

    get gachaDuplicateGain() {
        const value = this.rarity?.duplicateGain ?? 1;
        return Math.max(1, Math.floor(Number(value) || 1));
    }

    get school() {
        return getHeroTraitDefinition('school', this.schoolId);
    }

    get weapon() {
        return getHeroTraitDefinition('weapon', this.weaponId);
    }

    get position() {
        return getHeroTraitDefinition('position', this.positionId);
    }

    get traitEntries() {
        return HERO_TRAIT_TYPES.map((type) => {
            const trait = getHeroTraitDefinition(type, this.getTraitId(type));
            const group = getHeroTraitGroup(type);
            if (!trait || !group) return null;
            return { type, trait, group };
        }).filter(Boolean);
    }

    getTraitId(type) {
        switch (type) {
            case 'school':
                return this.schoolId;
            case 'weapon':
                return this.weaponId;
            case 'position':
                return this.positionId;
            default:
                return null;
        }
    }

    hasTrait(type, traitId) {
        if (!type || !traitId) return false;
        const normalizedId = this.getTraitId(type);
        return normalizedId === traitId;
    }

    increaseLevel(amount = 1) {
        const normalized = Number.isFinite(amount) ? Math.max(1, Math.floor(amount)) : 1;
        this.level += normalized;
        return this.refreshSkinUnlocks();
    }

    isSkinUnlocked(skinId) {
        const skin = this.getSkin(skinId);
        if (!skin) return false;
        if (this.level <= 0) return false;
        return Boolean(skin.unlocked);
    }

    getSkin(skinId) {
        if (!skinId) return null;
        return this.skins.find((skin) => skin.id === skinId) ?? null;
    }

    getSkinPublicData(skinId) {
        const skin = typeof skinId === 'object' ? skinId : this.getSkin(skinId);
        if (!skin) return null;
        return {
            id: skin.id,
            name: skin.name,
            requiredLevel: skin.requiredLevel,
            description: skin.description,
            theme: skin.theme,
            accentColor: skin.accentColor,
            shadowColor: skin.shadowColor,
            preview: skin.preview,
        };
    }

    selectSkin(skinId) {
        const skin = this.getSkin(skinId);
        if (!skin) {
            return { success: false, message: '스킨 정보를 찾을 수 없습니다.' };
        }
        if (this.level <= 0 || !skin.unlocked) {
            return {
                success: false,
                message: `해당 스킨은 Lv. ${skin.requiredLevel} 달성 후 사용 가능합니다.`,
                requiredLevel: skin.requiredLevel,
            };
        }
        if (this.selectedSkinId === skin.id) {
            return { success: false, message: '이미 적용 중인 스킨입니다.', skin: this.getSkinPublicData(skin) };
        }
        this.selectedSkinId = skin.id;
        return { success: true, skin: this.getSkinPublicData(skin) };
    }

    resetProgress() {
        this.level = 0;
        this.skins.forEach((skin) => {
            skin.unlocked = false;
        });
        this.selectedSkinId = this.skins[0]?.id ?? null;
        this.refreshSkinUnlocks();
    }

    refreshSkinUnlocks() {
        const newlyUnlocked = [];
        this.skins.forEach((skin) => {
            const wasUnlocked = Boolean(skin.unlocked);
            const shouldUnlock = this.level > 0 && this.level >= skin.requiredLevel;
            if (shouldUnlock && !wasUnlocked) {
                skin.unlocked = true;
                newlyUnlocked.push(this.getSkinPublicData(skin));
            } else if (!shouldUnlock && wasUnlocked) {
                skin.unlocked = false;
            }
        });
        if (!this.selectedSkinId || !this.isSkinUnlocked(this.selectedSkinId)) {
            const fallback = this.skins.find((skin) => skin.unlocked) ?? this.skins[0] ?? null;
            this.selectedSkinId = fallback?.id ?? null;
        }
        return newlyUnlocked;
    }

    initializeSkins(definitions, savedState) {
        const savedSkins = Array.isArray(savedState?.skins) ? savedState.skins : [];
        const normalized = definitions.map((definition, index) => {
            const skinId = typeof definition.id === 'string' && definition.id.trim().length > 0
                ? definition.id
                : `skin-${index + 1}`;
            const saved = savedSkins.find((entry) => entry.id === skinId);
            const requiredLevel = Number.isFinite(definition.requiredLevel)
                ? Math.max(1, Math.floor(definition.requiredLevel))
                : 1;
            return {
                id: skinId,
                name: definition.name ?? '스킨',
                description: definition.description ?? '',
                requiredLevel,
                theme: definition.theme ?? `${this.id}-${skinId}`,
                preview:
                    typeof definition.preview === 'string'
                        ? definition.preview
                        : 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
                accentColor: definition.accentColor ?? '#38bdf8',
                shadowColor: definition.shadowColor ?? 'rgba(56, 189, 248, 0.25)',
                unlocked: saved ? Boolean(saved.unlocked) : false,
            };
        });
        if (normalized.length === 0) {
            normalized.push({
                id: `${this.id}-default`,
                name: '전술 제복',
                description: '기본 전술 제복입니다.',
                requiredLevel: 1,
                theme: `${this.id}-default`,
                preview: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
                accentColor: '#38bdf8',
                shadowColor: 'rgba(56, 189, 248, 0.25)',
                unlocked: this.level > 0,
            });
        }
        normalized.sort((a, b) => a.requiredLevel - b.requiredLevel);
        return normalized;
    }

    toJSON() {
        return {
            id: this.id,
            level: this.level,
            selectedSkinId: this.selectedSkinId,
            skins: this.skins.map((skin) => ({ id: skin.id, unlocked: Boolean(skin.unlocked) })),
        };
    }
}

class Enemy {
    constructor(stage = 1, savedState) {
        this.stage = stage;
        this.baseNames = [
            '훈련용 타깃',
            '전술 드론',
            '모의 전차',
            '연습용 자동포대',
            '합동 훈련 장비',
            '도시전 모의 적',
            '방어전 모의 중계기',
            '실시간 전술 분석기',
            '교차 사격 훈련 장치',
            '모의 합동 지원기',
            '전술 네트워크 수신기',
            '방해전 모의 포탑',
        ];
        this.bossNames = [
            '하코네 전술 골렘',
            '특수 자동포탑',
            '모의 메카니카',
            '연합 실전 검증기',
            '고출력 전술 요새',
            '절차 통제 프로토타입',
            '네트워크 통합 지휘기',
            '종합 전술 모의체',
        ];
        this.maxHp = savedState?.maxHp ?? this.calculateMaxHp(stage);
        this.hp = savedState?.hp ?? this.maxHp;
        this.defeated = savedState?.defeated ?? 0;
    }

    calculateMaxHp(stage) {
        const base = 10 + stage * 8;
        const exponential = Math.pow(1.16, stage - 1);
        return Math.floor(base * exponential);
    }

    get name() {
        const isBossStage = this.stage % BOSS_STAGE_INTERVAL === 0;
        const useBossNames = isBossStage && this.bossNames.length > 0;
        const names = useBossNames ? this.bossNames : this.baseNames;
        if (names.length === 0) {
            return isBossStage ? '미지의 적 (보스)' : '미지의 적';
        }
        if (useBossNames) {
            const bossIndex = Math.max(0, Math.floor(this.stage / BOSS_STAGE_INTERVAL) - 1);
            const index = bossIndex % names.length;
            return `${names[index]} (보스)`;
        }
        const index = Math.floor((this.stage - 1) % names.length);
        const suffix = isBossStage ? ' (보스)' : '';
        return `${names[index]}${suffix}`;
    }

    applyDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
        const defeated = this.hp === 0;
        if (defeated) this.defeated += 1;
        return defeated;
    }

    advanceStage() {
        this.stage += 1;
        this.maxHp = this.calculateMaxHp(this.stage);
        this.hp = this.maxHp;
        this.defeated = 0;
    }

    retreatStage() {
        if (this.stage <= 1) {
            this.reset(1);
            return;
        }
        this.stage -= 1;
        this.maxHp = this.calculateMaxHp(this.stage);
        this.hp = this.maxHp;
        this.defeated = 0;
    }

    reset(stage = 1) {
        this.stage = stage;
        this.maxHp = this.calculateMaxHp(stage);
        this.hp = this.maxHp;
        this.defeated = 0;
    }

    toJSON() {
        return { stage: this.stage, maxHp: this.maxHp, hp: this.hp, defeated: this.defeated };
    }
}

class GameState {
    constructor(saved) {
        this.gold = saved?.gold ?? 0;
        const savedClickLevel = Number(saved?.clickLevel ?? 1);
        this.clickLevel = Number.isFinite(savedClickLevel) ? Math.max(1, Math.floor(savedClickLevel)) : 1;
        this.clickDamage = calculateClickDamageAtLevel(this.clickLevel);
        const savedCritChanceLevel = Number(saved?.clickCritChanceLevel ?? 0);
        this.clickCritChanceLevel = Number.isFinite(savedCritChanceLevel)
            ? Math.max(0, Math.floor(savedCritChanceLevel))
            : 0;
        const savedCritDamageLevel = Number(saved?.clickCritDamageLevel ?? 0);
        this.clickCritDamageLevel = Number.isFinite(savedCritDamageLevel)
            ? Math.max(0, Math.floor(savedCritDamageLevel))
            : 0;
        const savedHeroTrainingLevel = Number(saved?.heroDpsLevel ?? 0);
        this.heroDpsLevel = Number.isFinite(savedHeroTrainingLevel)
            ? Math.max(0, Math.floor(savedHeroTrainingLevel))
            : 0;
        this.lastSave = saved?.lastSave ?? Date.now();
        this.frenzyCooldown = saved?.frenzyCooldown ?? 0;
        this.frenzyActiveUntil = saved?.frenzyActiveUntil ?? 0;
        this.enemy = new Enemy(saved?.enemy?.stage ?? 1, saved?.enemy);
        const heroStates = saved?.heroes ?? [];
        this.heroes = defaultHeroes.map((hero) => new Hero(hero, heroStates.find((h) => h.id === hero.id)));
        const loadedTokens = Number(saved?.gachaTokens ?? 0);
        this.gachaTokens = Number.isFinite(loadedTokens) ? Math.max(0, Math.floor(loadedTokens)) : 0;
        const savedSort = typeof saved?.sortOrder === 'string' ? saved.sortOrder : null;
        this.sortOrder = savedSort === 'dps' ? 'dps' : 'level';
        this.inventory = Array.isArray(saved?.inventory)
            ? saved.inventory
                  .map((item) => this.normalizeEquipmentItem(item))
                  .filter(Boolean)
            : [];
        this.equipped = {};
        EQUIPMENT_TYPES.forEach(({ id }) => {
            const savedId = saved?.equipped?.[id];
            this.equipped[id] = savedId ?? null;
        });
        const rawMaterials = Number(saved?.upgradeMaterials ?? 0);
        this.upgradeMaterials = Number.isFinite(rawMaterials) ? Math.max(0, Math.floor(rawMaterials)) : 0;
        const fallbackHighest = Math.max(0, this.enemy.stage - 1);
        const loadedHighest = Number(saved?.highestStage ?? fallbackHighest);
        this.highestStage = Number.isFinite(loadedHighest) ? Math.max(0, loadedHighest) : fallbackHighest;
        const fallbackCurrent = Math.max(0, this.enemy.stage - 1);
        const loadedCurrent = Number(saved?.currentRunHighestStage ?? fallbackCurrent);
        this.currentRunHighestStage = Number.isFinite(loadedCurrent) ? Math.max(0, loadedCurrent) : fallbackCurrent;
        const loadedPoints = Number(saved?.rebirthPoints ?? 0);
        this.rebirthPoints = Number.isFinite(loadedPoints) ? Math.max(0, Math.floor(loadedPoints)) : 0;
        const loadedRebirths = Number(saved?.totalRebirths ?? 0);
        this.totalRebirths = Number.isFinite(loadedRebirths) ? Math.max(0, Math.floor(loadedRebirths)) : 0;
        this.initializeRebirthSkills(saved?.rebirthSkills);
        this.initializeMissions(saved?.missions);
        this.normalizeEquippedState();
        const savedBossDeadline = Number(saved?.bossDeadline ?? 0);
        this.bossDeadline = Number.isFinite(savedBossDeadline)
            ? Math.max(0, Math.floor(savedBossDeadline))
            : 0;
        this.pendingBossEntry = Boolean(saved?.pendingBossEntry);
        if (!this.isBossStage()) {
            this.clearBossTimer();
        } else {
            this.pendingBossEntry = false;
            if (this.bossDeadline === 0) {
                this.startBossTimer();
            }
        }
    }

    get totalDps() {
        const heroDps = this.heroes.reduce((total, hero) => total + hero.damagePerSecond, 0);
        const heroMultiplier = 1 + this.heroBonus;
        const frenzyMultiplier = this.isFrenzyActive ? this.frenzyMultiplier : 1;
        return heroDps * heroMultiplier * frenzyMultiplier;
    }

    get isFrenzyActive() {
        return Date.now() < this.frenzyActiveUntil;
    }

    get frenzyMultiplier() {
        return 2 * (1 + this.skillBonus);
    }

    get tapBonus() {
        const equipment = this.getTotalEquipmentEffect('tap');
        const rebirth = this.getRebirthBonusValue('tap');
        const setBonus = this.getSetBonusEffect('tap');
        return equipment + rebirth + setBonus;
    }

    get heroTrainingBonus() {
        return this.heroDpsLevel * HERO_DPS_UPGRADE_CONFIG.increasePerLevel;
    }

    get heroBonus() {
        const equipment = this.getTotalEquipmentEffect('hero');
        const rebirth = this.getRebirthBonusValue('hero');
        const setBonus = this.getSetBonusEffect('hero');
        return equipment + rebirth + this.heroTrainingBonus + setBonus;
    }

    get skillBonus() {
        const equipment = this.getTotalEquipmentEffect('skill');
        const rebirth = this.getRebirthBonusValue('skill');
        const setBonus = this.getSetBonusEffect('skill');
        return equipment + rebirth + setBonus;
    }

    get goldBonus() {
        const equipment = this.getTotalEquipmentEffect('gold');
        const rebirth = this.getRebirthBonusValue('gold');
        const setBonus = this.getSetBonusEffect('gold');
        return equipment + rebirth + setBonus;
    }

    get equipmentDropBonus() {
        const rebirth = this.getRebirthBonusValue('equipmentDrop');
        const setBonus = this.getSetBonusEffect('equipmentDrop');
        return rebirth + setBonus;
    }

    get gachaDropBonus() {
        const rebirth = this.getRebirthBonusValue('gachaDrop');
        const setBonus = this.getSetBonusEffect('gachaDrop');
        return rebirth + setBonus;
    }

    get pendingRebirthPoints() {
        const basePoints = calculateRebirthPoints(this.currentRunHighestStage);
        if (basePoints <= 0) return 0;
        const rebirthGain = this.getRebirthBonusValue('rebirthGain');
        // 환생 포인트 증가는 기본 계산 이후 후처리로 적용합니다.
        const modified = Math.floor(basePoints * (1 + rebirthGain));
        return Math.max(1, modified);
    }

    get canRebirth() {
        return this.pendingRebirthPoints > 0;
    }

    getRebirthBonusValue(type) {
        return REBIRTH_SKILLS.reduce((total, skill) => {
            const level = this.rebirthSkills[skill.id] ?? 0;
            if (level <= 0) return total;
            const effect = skill.effect[type];
            if (!effect) return total;
            return total + effect * level;
        }, 0);
    }

    getRebirthBonusSummary() {
        return REBIRTH_SKILLS.reduce((acc, skill) => {
            const level = this.rebirthSkills[skill.id] ?? 0;
            if (level <= 0) return acc;
            Object.entries(skill.effect).forEach(([key, value]) => {
                acc[key] = (acc[key] ?? 0) + value * level;
            });
            return acc;
        }, {});
    }

    getRebirthSkillLevel(skillId) {
        return this.rebirthSkills[skillId] ?? 0;
    }

    getRebirthSkillCost(skillId) {
        const skill = REBIRTH_SKILL_MAP.get(skillId);
        if (!skill) return Infinity;
        const level = this.getRebirthSkillLevel(skillId);
        if (skill.maxLevel && level >= skill.maxLevel) return 0;
        return Math.max(1, Math.ceil(skill.baseCost + level * skill.costGrowth));
    }

    upgradeRebirthSkill(skillId) {
        const skill = REBIRTH_SKILL_MAP.get(skillId);
        if (!skill) {
            return { success: false, message: '알 수 없는 환생 스킬입니다.' };
        }
        const level = this.getRebirthSkillLevel(skillId);
        if (skill.maxLevel && level >= skill.maxLevel) {
            return { success: false, message: '이미 최대 레벨입니다.' };
        }
        const cost = this.getRebirthSkillCost(skillId);
        if (this.rebirthPoints < cost) {
            return { success: false, message: '환생 포인트가 부족합니다.' };
        }
        this.rebirthPoints -= cost;
        this.rebirthSkills[skillId] = level + 1;
        this.lastSave = Date.now();
        return { success: true, level: level + 1, cost, skill };
    }

    performRebirth() {
        const pointsEarned = this.pendingRebirthPoints;
        if (pointsEarned <= 0) {
            return {
                success: false,
                message: `${REBIRTH_STAGE_REQUIREMENT}층을 돌파해야 환생할 수 있습니다.`,
            };
        }
        this.rebirthPoints += pointsEarned;
        this.totalRebirths += 1;
        const earnedFrom = this.currentRunHighestStage;
        this.gold = 0;
        this.clickLevel = 1;
        this.clickDamage = 1;
        this.clickCritChanceLevel = 0;
        this.clickCritDamageLevel = 0;
        this.heroDpsLevel = 0;
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.clearBossTimer();
        this.pendingBossEntry = false;
        this.frenzyCooldown = 0;
        this.frenzyActiveUntil = 0;
        this.currentRunHighestStage = 0;
        this.normalizeEquippedState();
        return {
            success: true,
            pointsEarned,
            earnedFrom,
            totalPoints: this.rebirthPoints,
            rebirthCount: this.totalRebirths,
        };
    }

    get effectiveClickDamage() {
        return this.clickDamage * (1 + this.tapBonus);
    }

    get clickCritChance() {
        const base = CLICK_CRIT_CHANCE_UPGRADE_CONFIG.baseChance;
        const bonus = this.clickCritChanceLevel * CLICK_CRIT_CHANCE_UPGRADE_CONFIG.increasePerLevel;
        const equipment = this.getTotalEquipmentEffect('critChance');
        const rebirth = this.getRebirthBonusValue('critChance');
        const setBonus = this.getSetBonusEffect('critChance');
        const total = base + bonus + equipment + rebirth + setBonus;
        return Math.min(CLICK_CRIT_CHANCE_UPGRADE_CONFIG.maxChance, total);
    }

    get clickCritMultiplier() {
        const base = CLICK_CRIT_DAMAGE_UPGRADE_CONFIG.baseMultiplier;
        const bonus = this.clickCritDamageLevel * CLICK_CRIT_DAMAGE_UPGRADE_CONFIG.increasePerLevel;
        const equipment = this.getTotalEquipmentEffect('critDamage');
        const rebirth = this.getRebirthBonusValue('critDamage');
        const setBonus = this.getSetBonusEffect('critDamage');
        const total = base + bonus + equipment + rebirth + setBonus;
        return Math.min(CLICK_CRIT_DAMAGE_UPGRADE_CONFIG.maxMultiplier, total);
    }

    get clickCritAverageMultiplier() {
        return 1 + this.clickCritChance * (this.clickCritMultiplier - 1);
    }

    get expectedClickDamage() {
        return this.effectiveClickDamage * this.clickCritAverageMultiplier;
    }

    applyClick() {
        const baseDamage = this.effectiveClickDamage;
        const isCritical = Math.random() < this.clickCritChance;
        const damage = isCritical ? Math.ceil(baseDamage * this.clickCritMultiplier) : baseDamage;
        const defeated = this.enemy.applyDamage(damage);
        return { damage, defeated, critical: isCritical };
    }

    awardGold(amount) {
        this.gold += amount;
    }

    getStageReward(stage = this.enemy.stage) {
        return calculateStageReward(stage, this.isBossStage(stage), this.goldBonus);
    }

    enemyReward(stage = this.enemy.stage) {
        return this.getStageReward(stage);
    }

    getClickUpgradeContext() {
        const cost = calculateClickUpgradeCost(this.clickLevel);
        const currentDamage = this.effectiveClickDamage;
        const simulatedLevel = this.clickLevel + 1;
        const nextBaseDamage = Math.ceil(
            this.clickDamage +
                CLICK_UPGRADE_CONFIG.flatIncrease +
                Math.pow(CLICK_UPGRADE_CONFIG.damageGrowth, simulatedLevel),
        );
        const nextDamage = nextBaseDamage * (1 + this.tapBonus);
        const expectedCurrent = this.expectedClickDamage;
        const expectedNext = nextDamage * this.clickCritAverageMultiplier;
        const damageGain = expectedNext - expectedCurrent;
        const baseDamageGain = nextDamage - currentDamage;
        const assumedClicks = CLICK_UPGRADE_CONFIG.assumedClicksPerSecond;
        const enemyHp = Math.max(1, Number(this.enemy.maxHp) || 1);
        const reward = this.enemyReward();
        const goldPerSecondBefore = (expectedCurrent * assumedClicks * reward) / enemyHp;
        const goldPerSecondAfter = (expectedNext * assumedClicks * reward) / enemyHp;
        const goldGainPerSecond = Math.max(0, goldPerSecondAfter - goldPerSecondBefore);
        const paybackSeconds = goldGainPerSecond > 0 ? cost / goldGainPerSecond : Infinity;
        return {
            cost,
            currentDamage: expectedCurrent,
            nextDamage: expectedNext,
            damageGain,
            baseDamageGain,
            goldGainPerSecond,
            paybackSeconds,
            assumedClicks,
        };
    }

    levelUpClick() {
        const cost = calculateClickUpgradeCost(this.clickLevel);
        if (this.gold < cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= cost;
        const newLevel = this.clickLevel + 1;
        const nextDamage = Math.ceil(
            this.clickDamage +
                CLICK_UPGRADE_CONFIG.flatIncrease +
                Math.pow(CLICK_UPGRADE_CONFIG.damageGrowth, newLevel),
        );
        this.clickLevel = newLevel;
        this.clickDamage = nextDamage;
        this.lastSave = Date.now();
        return { success: true, cost };
    }

    getClickCritChanceUpgradeContext() {
        const currentChance = this.clickCritChance;
        const nextLevel = this.clickCritChanceLevel + 1;
        const rawNextChance =
            CLICK_CRIT_CHANCE_UPGRADE_CONFIG.baseChance +
            nextLevel * CLICK_CRIT_CHANCE_UPGRADE_CONFIG.increasePerLevel;
        const nextChance = Math.min(CLICK_CRIT_CHANCE_UPGRADE_CONFIG.maxChance, rawNextChance);
        const gain = Math.max(0, nextChance - currentChance);
        const canUpgrade = gain > 0;
        const cost = canUpgrade
            ? calculateScalingUpgradeCost(this.clickCritChanceLevel, CLICK_CRIT_CHANCE_UPGRADE_CONFIG)
            : 0;
        return { cost, currentChance, nextChance, gain, canUpgrade };
    }

    levelUpClickCritChance() {
        const context = this.getClickCritChanceUpgradeContext();
        if (!context.canUpgrade) {
            return { success: false, message: '치명타 확률이 이미 최대입니다.' };
        }
        if (this.gold < context.cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= context.cost;
        this.clickCritChanceLevel += 1;
        this.lastSave = Date.now();
        return {
            success: true,
            cost: context.cost,
            previousChance: context.currentChance,
            newChance: this.clickCritChance,
        };
    }

    getClickCritDamageUpgradeContext() {
        const currentMultiplier = this.clickCritMultiplier;
        const nextLevel = this.clickCritDamageLevel + 1;
        const rawNextMultiplier =
            CLICK_CRIT_DAMAGE_UPGRADE_CONFIG.baseMultiplier +
            nextLevel * CLICK_CRIT_DAMAGE_UPGRADE_CONFIG.increasePerLevel;
        const nextMultiplier = Math.min(CLICK_CRIT_DAMAGE_UPGRADE_CONFIG.maxMultiplier, rawNextMultiplier);
        const gain = Math.max(0, nextMultiplier - currentMultiplier);
        const canUpgrade = gain > 0;
        const cost = canUpgrade
            ? calculateScalingUpgradeCost(this.clickCritDamageLevel, CLICK_CRIT_DAMAGE_UPGRADE_CONFIG)
            : 0;
        return { cost, currentMultiplier, nextMultiplier, gain, canUpgrade };
    }

    levelUpClickCritDamage() {
        const context = this.getClickCritDamageUpgradeContext();
        if (!context.canUpgrade) {
            return { success: false, message: '치명타 피해 배율이 이미 최대입니다.' };
        }
        if (this.gold < context.cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= context.cost;
        this.clickCritDamageLevel += 1;
        this.lastSave = Date.now();
        return {
            success: true,
            cost: context.cost,
            previousMultiplier: context.currentMultiplier,
            newMultiplier: this.clickCritMultiplier,
        };
    }

    getHeroDpsUpgradeContext() {
        const currentBonus = this.heroTrainingBonus;
        const nextBonus = currentBonus + HERO_DPS_UPGRADE_CONFIG.increasePerLevel;
        const currentMultiplier = 1 + currentBonus;
        const nextMultiplier = 1 + nextBonus;
        const cost = calculateScalingUpgradeCost(this.heroDpsLevel, HERO_DPS_UPGRADE_CONFIG);
        return {
            cost,
            currentBonus,
            nextBonus,
            currentMultiplier,
            nextMultiplier,
            gain: HERO_DPS_UPGRADE_CONFIG.increasePerLevel,
            canUpgrade: true,
        };
    }

    levelUpHeroDps() {
        const context = this.getHeroDpsUpgradeContext();
        if (this.gold < context.cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= context.cost;
        this.heroDpsLevel += 1;
        this.lastSave = Date.now();
        return {
            success: true,
            cost: context.cost,
            previousBonus: context.currentBonus,
            newBonus: this.heroTrainingBonus,
        };
    }

    getHeroById(heroId) {
        return this.heroes.find((hero) => hero.id === heroId) ?? null;
    }

    selectHeroSkin(heroId, skinId) {
        const hero = this.getHeroById(heroId);
        if (!hero) {
            return { success: false, message: '학생을 찾을 수 없습니다.' };
        }
        const result = hero.selectSkin(skinId);
        if (result.success) {
            this.lastSave = Date.now();
        }
        return result;
    }

    getGachaCost(count) {
        if (count === GACHA_MULTI_COUNT) return GACHA_MULTI_COST;
        if (!Number.isFinite(count) || count <= 0) return GACHA_SINGLE_COST;
        return Math.max(1, Math.floor(count)) * GACHA_SINGLE_COST;
    }

    rollGacha(count) {
        const normalizedCount =
            count === GACHA_MULTI_COUNT
                ? GACHA_MULTI_COUNT
                : Number.isFinite(count) && count > 0
                ? Math.max(1, Math.floor(count))
                : 1;
        const cost = this.getGachaCost(normalizedCount);
        if (this.gachaTokens < cost) {
            return { success: false, message: '모집권이 부족합니다.' };
        }
        this.gachaTokens -= cost;
        const results = [];
        for (let i = 0; i < normalizedCount; i += 1) {
            const hero = weightedRandom(this.heroes, (candidate) => candidate.gachaWeight);
            if (!hero) continue;
            const previousLevel = hero.level;
            const levelGain = previousLevel === 0 ? hero.gachaInitialLevel : hero.gachaDuplicateGain;
            const unlockedSkins = hero.increaseLevel(levelGain);
            results.push({
                hero,
                isNew: previousLevel === 0,
                previousLevel,
                newLevel: hero.level,
                levelGain,
                unlockedSkins,
            });
        }
        this.lastSave = Date.now();
        return { success: true, cost, count: normalizedCount, results };
    }

    isBossStage(stage = this.enemy.stage) {
        if (!Number.isFinite(stage) || stage <= 0) return false;
        return stage % BOSS_STAGE_INTERVAL === 0;
    }

    startBossTimer() {
        this.pendingBossEntry = false;
        this.bossDeadline = Date.now() + BOSS_TIME_LIMIT;
    }

    clearBossTimer() {
        this.bossDeadline = 0;
    }

    checkBossTimeout() {
        if (!this.isBossStage()) {
            if (this.bossDeadline !== 0) {
                this.clearBossTimer();
            }
            return null;
        }
        if (!this.bossDeadline) {
            this.startBossTimer();
            return null;
        }
        if (Date.now() < this.bossDeadline) {
            return null;
        }
        const failedStage = this.enemy.stage;
        this.enemy.retreatStage();
        const revertedStage = this.enemy.stage;
        this.clearBossTimer();
        this.pendingBossEntry = true;
        this.lastSave = Date.now();
        return { failedStage, revertedStage };
    }

    canRetreatFromBoss() {
        if (!this.isBossStage()) return false;
        if (this.enemy.stage <= 1) return false;
        return true;
    }

    retreatFromBoss() {
        if (!this.canRetreatFromBoss()) {
            return { success: false, message: '현재 보스 전투 중이 아닙니다.' };
        }
        const bossStage = this.enemy.stage;
        this.enemy.retreatStage();
        const fallbackStage = this.enemy.stage;
        this.clearBossTimer();
        this.pendingBossEntry = true;
        this.lastSave = Date.now();
        return { success: true, bossStage, fallbackStage };
    }

    canAdvanceToNextBossStage() {
        if (this.isBossStage()) return false;
        const stage = this.enemy.stage;
        if (!Number.isFinite(stage) || stage <= 0) return false;
        return stage % BOSS_STAGE_INTERVAL === BOSS_STAGE_INTERVAL - 1;
    }

    advanceToNextBossStage() {
        if (!this.canAdvanceToNextBossStage()) {
            return { success: false, message: '보스 직전 단계에서만 돌입할 수 있습니다.' };
        }
        const fromStage = this.enemy.stage;
        this.enemy.advanceStage();
        this.pendingBossEntry = false;
        this.clearBossTimer();
        this.startBossTimer();
        this.lastSave = Date.now();
        return { success: true, fromStage, bossStage: this.enemy.stage };
    }

    goNextEnemy() {
        const defeatedStage = this.enemy.stage;
        const reward = this.enemyReward();
        this.gold += reward;
        const drop = this.tryDropEquipment(defeatedStage);
        const gacha = this.tryDropGachaToken(defeatedStage);
        this.highestStage = Math.max(this.highestStage, defeatedStage);
        this.currentRunHighestStage = Math.max(this.currentRunHighestStage, defeatedStage);
        if (this.pendingBossEntry) {
            this.enemy.reset(this.enemy.stage);
            this.clearBossTimer();
        } else {
            this.enemy.advanceStage();
            if (this.isBossStage()) {
                this.startBossTimer();
            } else {
                this.clearBossTimer();
            }
        }
        return { reward, drop, gacha, defeatedStage };
    }

    reset() {
        this.gold = 0;
        this.clickLevel = 1;
        this.clickDamage = 1;
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.clearBossTimer();
        this.pendingBossEntry = false;
        this.heroes.forEach((hero) => {
            hero.resetProgress();
        });
        this.gachaTokens = 0;
        this.frenzyCooldown = 0;
        this.frenzyActiveUntil = 0;
        this.inventory = [];
        this.equipped = {};
        this.upgradeMaterials = 0;
        EQUIPMENT_TYPES.forEach(({ id }) => {
            this.equipped[id] = null;
        });
        this.highestStage = 0;
        this.currentRunHighestStage = 0;
        this.rebirthPoints = 0;
        this.totalRebirths = 0;
        this.initializeRebirthSkills({});
        this.initializeMissions({});
    }

    toJSON() {
        return {
            gold: this.gold,
            clickLevel: this.clickLevel,
            clickDamage: this.clickDamage,
            clickCritChanceLevel: this.clickCritChanceLevel,
            clickCritDamageLevel: this.clickCritDamageLevel,
            heroDpsLevel: this.heroDpsLevel,
            lastSave: Date.now(),
            enemy: this.enemy.toJSON(),
            heroes: this.heroes.map((hero) => hero.toJSON()),
            sortOrder: this.sortOrder,
            frenzyCooldown: this.frenzyCooldown,
            frenzyActiveUntil: this.frenzyActiveUntil,
            inventory: this.inventory,
            equipped: this.equipped,
            upgradeMaterials: this.upgradeMaterials,
            highestStage: this.highestStage,
            currentRunHighestStage: this.currentRunHighestStage,
            bossDeadline: this.bossDeadline,
            pendingBossEntry: this.pendingBossEntry,
            gachaTokens: this.gachaTokens,
            rebirthPoints: this.rebirthPoints,
            totalRebirths: this.totalRebirths,
            rebirthSkills: this.rebirthSkills,
            missions: this.serializeMissions(),
        };
    }

    initializeRebirthSkills(savedSkills) {
        this.rebirthSkills = {};
        REBIRTH_SKILLS.forEach((skill) => {
            const savedLevel = Number(savedSkills?.[skill.id] ?? 0);
            this.rebirthSkills[skill.id] = Number.isFinite(savedLevel)
                ? Math.max(0, Math.floor(savedLevel))
                : 0;
        });
    }

    initializeMissions(savedMissions) {
        this.missionProgress = {};
        MISSIONS.forEach((mission) => {
            const saved = savedMissions?.[mission.id];
            const rawProgress = Number(saved?.progress ?? 0);
            const progress = Number.isFinite(rawProgress) ? Math.max(0, Math.floor(rawProgress)) : 0;
            const completed = saved?.completed ?? progress >= mission.goal;
            const claimed = saved?.claimed ?? false;
            this.missionProgress[mission.id] = {
                progress: Math.min(mission.goal, progress),
                completed: Boolean(completed),
                claimed: Boolean(claimed),
            };
            if (this.missionProgress[mission.id].completed) {
                this.missionProgress[mission.id].progress = Math.max(
                    this.missionProgress[mission.id].progress,
                    mission.goal,
                );
            }
        });
    }

    serializeMissions() {
        return MISSIONS.reduce((acc, mission) => {
            const state = this.missionProgress[mission.id];
            if (state) {
                acc[mission.id] = {
                    progress: state.progress,
                    completed: state.completed,
                    claimed: state.claimed,
                };
            }
            return acc;
        }, {});
    }

    getMissionState(missionId) {
        return this.missionProgress[missionId] ?? { progress: 0, completed: false, claimed: false };
    }

    progressMissions(trigger, amount = 1) {
        const normalizedAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (normalizedAmount <= 0) {
            return [];
        }
        const completed = [];
        MISSIONS.forEach((mission) => {
            if (mission.trigger !== trigger) return;
            const state = this.missionProgress[mission.id];
            if (!state || state.claimed) return;
            if (state.completed && state.progress >= mission.goal) return;
            const previousProgress = state.progress;
            state.progress = Math.min(mission.goal, previousProgress + normalizedAmount);
            if (state.progress >= mission.goal) {
                state.completed = true;
                completed.push({ mission, state });
            }
        });
        if (completed.length > 0) {
            this.lastSave = Date.now();
        }
        return completed;
    }

    claimMissionReward(missionId) {
        const mission = MISSION_MAP.get(missionId);
        if (!mission) {
            return { success: false, message: '알 수 없는 임무입니다.' };
        }
        const state = this.missionProgress[missionId];
        if (!state || !state.completed) {
            return { success: false, message: '아직 임무가 완료되지 않았습니다.' };
        }
        if (state.claimed) {
            return { success: false, message: '이미 보상을 수령했습니다.' };
        }
        const rewardResult = this.applyMissionReward(mission.reward);
        state.claimed = true;
        this.lastSave = Date.now();
        return { success: true, mission, reward: mission.reward, rewardResult };
    }

    applyMissionReward(reward) {
        if (!reward) {
            return null;
        }
        const amount = Number.isFinite(reward.amount) ? Math.max(0, Math.floor(reward.amount)) : 0;
        switch (reward.type) {
            case 'gold':
                this.gold += amount;
                return { type: reward.type, amount };
            case 'gachaTokens':
                this.gachaTokens += amount;
                return { type: reward.type, amount };
            case 'rebirthPoints':
                this.rebirthPoints += amount;
                return { type: reward.type, amount };
            default:
                return null;
        }
    }

    normalizeEquipmentItem(item) {
        if (!item) return null;
        const type = EQUIPMENT_TYPE_MAP.has(item.type) ? item.type : null;
        if (!type) return null;
        const typeData = EQUIPMENT_TYPE_MAP.get(type);
        const primaryEffect = EQUIPMENT_EFFECT_MAP.has(typeData?.primaryEffect)
            ? typeData.primaryEffect
            : type;
        const rarity = EQUIPMENT_RARITY_MAP.has(item.rarity) ? item.rarity : 'common';
        const rarityData = EQUIPMENT_RARITY_MAP.get(rarity);
        const rawMaxLevel = Number(item.maxLevel ?? rarityData?.maxLevel ?? 3);
        const maxLevel = Math.max(1, Math.floor(Number.isFinite(rawMaxLevel) ? rawMaxLevel : 1));
        const rawLevel = Number(item.level ?? 1);
        const level = Math.min(maxLevel, Math.max(1, Math.floor(Number.isFinite(rawLevel) ? rawLevel : 1)));

        const normalizeEffectEntry = (effectId, effectEntry) => {
            if (!EQUIPMENT_EFFECT_MAP.has(effectId)) return null;
            const rawBase = Number(
                effectEntry?.baseValue ?? effectEntry?.base ?? effectEntry?.value ?? effectEntry ?? 0,
            );
            const baseValue = clampEquipmentValue(
                Math.max(0, Number.isFinite(rawBase) ? rawBase : 0),
                effectId,
            );
            const value = calculateEquipmentValue(baseValue, level, effectId);
            return { baseValue, value };
        };

        const normalizedEffects = {};
        if (item.effects && typeof item.effects === 'object') {
            Object.entries(item.effects).forEach(([effectId, effectEntry]) => {
                const normalized = normalizeEffectEntry(effectId, effectEntry);
                if (normalized) {
                    normalizedEffects[effectId] = normalized;
                }
            });
        }

        if (!normalizedEffects[primaryEffect]) {
            const rawBaseValue = Number(item.baseValue ?? item.value ?? 0);
            const baseValue = clampEquipmentValue(
                Math.max(0, Number.isFinite(rawBaseValue) ? rawBaseValue : 0),
                primaryEffect,
            );
            normalizedEffects[primaryEffect] = {
                baseValue,
                value: calculateEquipmentValue(baseValue, level, primaryEffect),
            };
        } else {
            const baseValue = normalizedEffects[primaryEffect].baseValue;
            normalizedEffects[primaryEffect].value = calculateEquipmentValue(
                baseValue,
                level,
                primaryEffect,
            );
        }

        const effectOrderSource = Array.isArray(item.effectOrder)
            ? item.effectOrder.filter((effectId) => normalizedEffects[effectId])
            : [];
        const effectOrder = [];
        if (!effectOrderSource.includes(primaryEffect)) {
            effectOrder.push(primaryEffect);
        }
        effectOrder.push(...effectOrderSource);
        Object.keys(normalizedEffects).forEach((effectId) => {
            if (!effectOrder.includes(effectId)) {
                effectOrder.push(effectId);
            }
        });

        const baseValue = normalizedEffects[primaryEffect]?.baseValue ?? 0;
        const value = normalizedEffects[primaryEffect]?.value ?? 0;

        return {
            id: item.id ?? `eq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            type,
            rarity,
            baseValue,
            value,
            level,
            maxLevel,
            name: item.name ?? generateEquipmentName(type),
            stage: Number(item.stage ?? 1) || 1,
            locked: Boolean(item.locked),
            effects: normalizedEffects,
            effectOrder,
        };
    }

    normalizeEquippedState() {
        EQUIPMENT_TYPES.forEach(({ id }) => {
            const equippedId = this.equipped[id];
            if (!equippedId) {
                this.equipped[id] = null;
                return;
            }
            const exists = this.inventory.some((item) => item.id === equippedId && item.type === id);
            if (!exists) {
                this.equipped[id] = null;
            }
        });
    }

    getEquippedItem(type) {
        const equippedId = this.equipped[type];
        if (!equippedId) return null;
        return this.inventory.find((item) => item.id === equippedId) ?? null;
    }

    getEquipmentUpgradeMaterialCost(item, targetLevel) {
        if (!item) return 0;
        const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
        if (!rarity) return 0;
        const currentLevel = Math.max(1, Math.floor(item.level ?? 1));
        const maxLevel = Math.max(currentLevel, Math.floor(item.maxLevel ?? currentLevel));
        const normalizedTargetLevel = Number.isFinite(targetLevel)
            ? Math.max(currentLevel + 1, Math.min(maxLevel, Math.floor(targetLevel)))
            : Math.min(maxLevel, currentLevel + 1);
        if (normalizedTargetLevel <= currentLevel) {
            return 0;
        }
        const rarityRank = Math.max(0, Math.floor(rarity.rank ?? 0));
        const baseCost = rarityRank + 1;
        const levelFactor = Math.max(1, normalizedTargetLevel - 1);
        return Math.max(1, Math.floor(baseCost * levelFactor));
    }

    canUpgradeEquipment(item) {
        if (!item) return false;
        if (item.level >= item.maxLevel) return false;
        const materialCost = this.getEquipmentUpgradeMaterialCost(item, item.level + 1);
        if (materialCost > this.upgradeMaterials) return false;
        return true;
    }

    upgradeEquipment(itemId) {
        const index = this.inventory.findIndex((entry) => entry.id === itemId);
        if (index === -1) {
            return { success: false, message: '전술 장비를 찾을 수 없습니다.' };
        }
        const item = this.inventory[index];
        if (item.level >= item.maxLevel) {
            return { success: false, message: '이미 최대 강화 단계입니다.' };
        }
        const materialCost = this.getEquipmentUpgradeMaterialCost(item, item.level + 1);
        if (materialCost > this.upgradeMaterials) {
            return {
                success: false,
                message: `강화 재료가 부족합니다. 필요 ${formatNumber(materialCost)}개, 보유 ${formatNumber(
                    this.upgradeMaterials,
                )}개`,
            };
        }
        const previousLevel = item.level;
        const previousValue = item.value;
        item.level = Math.min(item.maxLevel, item.level + 1);
        if (!item.effects || typeof item.effects !== 'object') {
            item.effects = {
                [item.type]: {
                    baseValue: Number.isFinite(item.baseValue) && item.baseValue > 0 ? item.baseValue : previousValue,
                    value: previousValue,
                },
            };
        }
        const primaryEffect = item.type;
        Object.entries(item.effects).forEach(([effectId, effect]) => {
            const base = clampEquipmentValue(
                Number.isFinite(effect.baseValue) && effect.baseValue > 0 ? effect.baseValue : previousValue,
                effectId,
            );
            effect.baseValue = base;
            effect.value = calculateEquipmentValue(base, item.level, effectId);
        });
        if (item.effects[primaryEffect]) {
            item.baseValue = item.effects[primaryEffect].baseValue;
            item.value = item.effects[primaryEffect].value;
        } else {
            const firstEffectId = Object.keys(item.effects)[0];
            if (firstEffectId) {
                item.baseValue = item.effects[firstEffectId].baseValue;
                item.value = item.effects[firstEffectId].value;
            }
        }
        if (!Array.isArray(item.effectOrder) || item.effectOrder.length === 0) {
            const order = [primaryEffect];
            Object.keys(item.effects).forEach((effectId) => {
                if (!order.includes(effectId)) {
                    order.push(effectId);
                }
            });
            item.effectOrder = order;
        }

        this.upgradeMaterials = Math.max(0, this.upgradeMaterials - materialCost);
        this.normalizeEquippedState();
        const currentlyEquipped = this.getEquippedItem(item.type);
        if (!currentlyEquipped || currentlyEquipped.id === item.id || item.value > currentlyEquipped.value) {
            this.equipped[item.type] = item.id;
        }
        this.lastSave = Date.now();
        return {
            success: true,
            item,
            previousLevel,
            previousValue,
            materialsSpent: materialCost,
        };
    }

    canSalvageItem(item) {
        if (!item) return false;
        if (item.locked) return false;
        return this.equipped[item.type] !== item.id;
    }

    toggleEquipmentLock(itemId) {
        const item = this.inventory.find((entry) => entry.id === itemId);
        if (!item) {
            return { success: false, message: '전술 장비를 찾을 수 없습니다.' };
        }
        item.locked = !item.locked;
        this.lastSave = Date.now();
        return { success: true, item, locked: item.locked };
    }

    calculateSalvageReward(item) {
        if (!item) {
            return { gold: 0, materials: 0 };
        }
        const rarityData = EQUIPMENT_RARITY_MAP.get(item.rarity);
        const rarityRank = rarityData?.rank ?? 0;
        const baseMaterials = 1 + rarityRank;
        const levelBonus = Math.max(0, item.level - 1);
        const materials = Math.max(1, Math.round(baseMaterials + levelBonus));
        const stage = Math.max(1, Number.isFinite(item.stage) ? Math.floor(item.stage) : 1);
        const baseGold = 20 + stage * 6;
        const totalBase = Object.values(item.effects ?? {}).reduce(
            (sum, effect) => sum + (Number(effect?.baseValue) || 0),
            0,
        );
        const valueSource = totalBase > 0 ? totalBase : item.baseValue ?? item.value ?? 0;
        const valueFactor = Math.max(1, valueSource * 10 + 1);
        const rarityMultiplier = 1 + rarityRank * 0.6;
        const gold = Math.max(15, Math.round(baseGold * rarityMultiplier * valueFactor));
        return { gold, materials };
    }

    salvageEquipment(itemIds) {
        const ids = Array.isArray(itemIds) ? itemIds.filter(Boolean) : [itemIds];
        const uniqueIds = Array.from(new Set(ids));
        if (uniqueIds.length === 0) {
            return { success: false, message: '분해할 전술 장비를 선택하세요.' };
        }
        const items = [];
        for (const id of uniqueIds) {
            const item = this.inventory.find((entry) => entry.id === id);
            if (!item) {
                return { success: false, message: '전술 장비를 찾을 수 없습니다.' };
            }
            if (item.locked) {
                return { success: false, message: `${item.name}은(는) 잠겨 있어 분해할 수 없습니다.` };
            }
            if (this.equipped[item.type] === item.id) {
                return { success: false, message: '장착 중인 전술 장비는 분해할 수 없습니다.' };
            }
            items.push(item);
        }

        if (items.length === 0) {
            return { success: false, message: '분해할 전술 장비를 선택하세요.' };
        }

        const totals = items.reduce(
            (acc, item) => {
                const reward = this.calculateSalvageReward(item);
                acc.gold += reward.gold;
                acc.materials += reward.materials;
                return acc;
            },
            { gold: 0, materials: 0 },
        );

        const removalSet = new Set(uniqueIds);
        this.inventory = this.inventory.filter((entry) => !removalSet.has(entry.id));

        this.gold += totals.gold;
        this.upgradeMaterials += totals.materials;
        this.lastSave = Date.now();

        return {
            success: true,
            items,
            count: items.length,
            gold: totals.gold,
            materials: totals.materials,
        };
    }

    getEquipmentBonuses() {
        const equippedItems = EQUIPMENT_TYPES.map(({ id }) => this.getEquippedItem(id)).filter(Boolean);
        return EQUIPMENT_EFFECTS.reduce((acc, { id }) => {
            acc[id] = equippedItems.reduce(
                (total, item) => total + (item.effects?.[id]?.value ?? 0),
                0,
            );
            return acc;
        }, {});
    }

    getTotalEquipmentEffect(effectId) {
        if (!EQUIPMENT_EFFECT_MAP.has(effectId)) return 0;
        return EQUIPMENT_TYPES.reduce((total, { id }) => {
            const item = this.getEquippedItem(id);
            if (!item?.effects) return total;
            const effectValue = Number(item.effects[effectId]?.value ?? 0);
            return total + (Number.isFinite(effectValue) ? effectValue : 0);
        }, 0);
    }

    getAllSetBonusStatuses() {
        return HERO_SET_BONUSES.map((bonus) => {
            const requirement = bonus.requirement;
            if (!requirement?.type || !requirement?.trait) {
                return { bonus, count: 0, required: 0, active: false, heroes: [] };
            }
            const required = Number.isFinite(requirement.count)
                ? Math.max(1, Math.floor(requirement.count))
                : 1;
            const members = this.heroes.filter(
                (hero) => hero.isUnlocked && hero.hasTrait(requirement.type, requirement.trait),
            );
            const count = members.length;
            return {
                bonus,
                count,
                required,
                active: count >= required,
                heroes: members,
            };
        });
    }

    getActiveSetBonuses() {
        return this.getAllSetBonusStatuses().filter((entry) => entry.active);
    }

    getSetBonusSummary() {
        return this.getActiveSetBonuses().reduce((acc, entry) => {
            Object.entries(entry.bonus.effects ?? {}).forEach(([effectId, value]) => {
                if (!Number.isFinite(value)) return;
                acc[effectId] = (acc[effectId] ?? 0) + value;
            });
            return acc;
        }, {});
    }

    getSetBonusEffect(effectId) {
        if (!effectId) return 0;
        return this.getActiveSetBonuses().reduce((total, entry) => {
            const value = Number(entry.bonus.effects?.[effectId] ?? 0);
            return total + (Number.isFinite(value) ? value : 0);
        }, 0);
    }

    getHeroEffectiveDps(hero) {
        return hero.damagePerSecond * (1 + this.heroBonus);
    }

    addEquipment(item) {
        item.locked = Boolean(item.locked);
        this.inventory.push(item);
        const current = this.getEquippedItem(item.type);
        if (!current || item.value > current.value) {
            this.equipped[item.type] = item.id;
            return { autoEquipped: true, replaced: current ?? null };
        }
        return { autoEquipped: false, replaced: current ?? null };
    }

    equipItem(itemId) {
        const item = this.inventory.find((entry) => entry.id === itemId);
        if (!item) {
            return { success: false, message: '전술 장비를 찾을 수 없습니다.' };
        }
        const previous = this.getEquippedItem(item.type);
        this.equipped[item.type] = item.id;
        return { success: true, item, previous };
    }

    tryDropGachaToken(stage) {
        const isBoss = this.isBossStage(stage);
        const baseChance = isBoss ? GACHA_TOKEN_BOSS_DROP_CHANCE : GACHA_TOKEN_NORMAL_DROP_CHANCE;
        const bonus = this.gachaDropBonus;
        const finalChance = clampProbability(baseChance + bonus);
        if (Math.random() > finalChance) return null;
        this.gachaTokens += 1;
        this.lastSave = Date.now();
        return { amount: 1, baseChance, chance: finalChance, isBoss };
    }

    tryDropEquipment(stage) {
        const isBoss = stage % BOSS_STAGE_INTERVAL === 0;
        const baseChance = isBoss ? EQUIPMENT_BOSS_DROP_CHANCE : EQUIPMENT_DROP_CHANCE;
        const bonusMultiplier = 1 + this.equipmentDropBonus;
        const finalChance = clampProbability(baseChance * bonusMultiplier);
        if (Math.random() > finalChance) return null;
        const item = generateEquipmentItem(stage, isBoss);
        const result = this.addEquipment(item);
        return {
            item,
            autoEquipped: result.autoEquipped,
            replaced: result.replaced,
            isBoss,
            baseChance,
            chance: finalChance,
        };
    }
}

const UI = {
    stage: document.getElementById('stage'),
    gold: document.getElementById('gold'),
    upgradeMaterials: document.getElementById('upgradeMaterials'),
    gachaTokensHeader: document.getElementById('gachaTokensHeader'),
    clickDamage: document.getElementById('clickDamage'),
    totalDps: document.getElementById('totalDps'),
    critChance: document.getElementById('critChance'),
    critMultiplier: document.getElementById('critMultiplier'),
    enemyName: document.getElementById('enemyName'),
    enemyCurrentHp: document.getElementById('enemyCurrentHp'),
    enemyMaxHp: document.getElementById('enemyMaxHp'),
    enemyHealthBar: document.getElementById('enemyHealthBar'),
    bossTimer: document.getElementById('bossTimer'),
    bossControls: document.getElementById('bossControls'),
    bossRetreat: document.getElementById('bossRetreat'),
    bossAdvance: document.getElementById('bossAdvance'),
    tapButton: document.getElementById('tapButton'),
    enemy: document.getElementById('enemy'),
    heroList: document.getElementById('heroList'),
    setBonusSummary: document.getElementById('setBonusSummary'),
    setBonusList: document.getElementById('setBonusList'),
    gachaTokens: document.getElementById('gachaTokens'),
    gachaSingle: document.getElementById('gachaSingle'),
    gachaTen: document.getElementById('gachaTen'),
    gachaRateList: document.getElementById('gachaRateList'),
    gachaPoolList: document.getElementById('gachaPoolList'),
    gachaResults: document.getElementById('gachaResults'),
    gachaResultsEmpty: document.getElementById('gachaResultsEmpty'),
    upgradeClick: document.getElementById('upgradeClick'),
    upgradeClickInfo: document.getElementById('clickUpgradeInfo'),
    upgradeCritChance: document.getElementById('upgradeCritChance'),
    upgradeCritChanceInfo: document.getElementById('critChanceUpgradeInfo'),
    upgradeCritDamage: document.getElementById('upgradeCritDamage'),
    upgradeCritDamageInfo: document.getElementById('critDamageUpgradeInfo'),
    upgradeHeroDps: document.getElementById('upgradeHeroDps'),
    upgradeHeroDpsInfo: document.getElementById('heroDpsUpgradeInfo'),
    log: document.getElementById('log'),
    sortHeroes: document.getElementById('sortHeroes'),
    stageProgressTrack: document.getElementById('stageProgressTrack'),
    damageIndicator: document.getElementById('damageIndicator'),
    skillFrenzy: document.getElementById('skillFrenzy'),
    skillCooldown: document.getElementById('skillCooldown'),
    saveProgress: document.getElementById('saveProgress'),
    resetProgress: document.getElementById('resetProgress'),
    rebirthPanel: document.getElementById('rebirthPanel'),
    rebirthButton: document.getElementById('rebirthButton'),
    rebirthRequirement: document.getElementById('rebirthRequirement'),
    rebirthSkillList: document.getElementById('rebirthSkillList'),
    rebirthPoints: document.getElementById('rebirthPoints'),
    rebirthPotential: document.getElementById('rebirthPotential'),
    rebirthHighestStage: document.getElementById('rebirthHighestStage'),
    rebirthCount: document.getElementById('rebirthCount'),
    equipmentSummary: document.getElementById('equipmentSummary'),
    equipmentTapBonus: document.getElementById('equipmentTapBonus'),
    equipmentHeroBonus: document.getElementById('equipmentHeroBonus'),
    equipmentSkillBonus: document.getElementById('equipmentSkillBonus'),
    equipmentGoldBonus: document.getElementById('equipmentGoldBonus'),
    equipmentCritChanceBonus: document.getElementById('equipmentCritChanceBonus'),
    equipmentCritDamageBonus: document.getElementById('equipmentCritDamageBonus'),
    equipmentSlots: document.getElementById('equipmentSlots'),
    equipmentInventory: document.getElementById('equipmentInventory'),
    equipmentEmpty: document.getElementById('equipmentEmpty'),
    equipmentFilterSalvageable: document.getElementById('equipmentFilterSalvageable'),
    equipmentSelectSalvageable: document.getElementById('equipmentSelectSalvageable'),
    equipmentSalvageSelected: document.getElementById('equipmentSalvageSelected'),
    equipmentSalvageHint: document.getElementById('equipmentSalvageHint'),
    equipmentSelectionCount: document.getElementById('equipmentSelectionCount'),
    missionSummary: document.getElementById('missionSummary'),
    missionList: document.getElementById('missionList'),
    missionEmpty: document.getElementById('missionEmpty'),
    salvageModal: document.getElementById('salvageModal'),
    salvageModalOverlay: document.getElementById('salvageModalOverlay'),
    salvageModalList: document.getElementById('salvageModalList'),
    salvageModalCount: document.getElementById('salvageModalCount'),
    salvageModalRewards: document.getElementById('salvageModalRewards'),
    salvageModalConfirm: document.getElementById('salvageModalConfirm'),
    salvageModalCancel: document.getElementById('salvageModalCancel'),
    panelTabButtons: document.querySelectorAll('[data-tab-target]'),
    panelViews: document.querySelectorAll('[data-tab]'),
    panelOverlay: document.querySelector('.game__panel'),
    panelOverlayBackdrop: document.getElementById('panelOverlayBackdrop'),
    panelOverlayClose: document.getElementById('panelOverlayClose'),
};

class GameUI {
    constructor(state) {
        this.state = state;
        this.heroTemplate = document.getElementById('heroTemplate');
        this.heroElements = new Map();
        this.setBonusElements = new Map();
        this.rebirthSkillElements = new Map();
        this.missionElements = new Map();
        this.gachaPoolElements = new Map();
        this.selectedEquipmentIds = new Set();
        this.filterSalvageable = false;
        this.pendingSalvageIds = [];
        this.sortState = state.sortOrder === 'dps' ? 'dps' : 'level';
        this.tabButtons = [];
        this.tabPanels = new Map();
        this.panelOverlay = UI.panelOverlay ?? null;
        this.panelOverlayBackdrop = UI.panelOverlayBackdrop ?? null;
        this.panelOverlayClose = UI.panelOverlayClose ?? null;
        this.mobileViewport =
            typeof window !== 'undefined' && 'matchMedia' in window
                ? window.matchMedia('(max-width: 768px)')
                : null;
        this.setupTabs();
        this.setupEvents();
        if (this.mobileViewport) {
            this.mobileViewport.addEventListener('change', () => {
                this.handleViewportChange();
            });
            this.handleViewportChange();
        } else {
            this.handleViewportChange();
        }
        this.updateGachaHistoryVisibility();
        this.renderGachaOverview();
        this.renderHeroSetBonuses();
        this.renderHeroes();
        this.renderEquipmentUI();
        this.renderMissionUI();
        this.renderRebirthUI();
        this.updateSortButton();
        this.updateUI();
        this.startLoops();
    }

    setupTabs() {
        this.tabButtons = Array.from(UI.panelTabButtons ?? []);
        this.tabPanels = new Map(
            Array.from(UI.panelViews ?? []).map((panel) => [panel.dataset.tab, panel]),
        );
        if (this.tabButtons.length === 0 || this.tabPanels.size === 0) {
            return;
        }
        this.tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.dataset.tabTarget;
                if (target) {
                    this.activateTab(target);
                    if (this.isMobileViewport()) {
                        this.openPanelOverlay();
                    }
                }
            });
        });
        const initialButton = this.tabButtons.find((button) => button.classList.contains('is-active'));
        const initialTab = initialButton?.dataset.tabTarget ?? this.tabButtons[0]?.dataset.tabTarget;
        if (initialTab) {
            this.activateTab(initialTab);
        }
    }

    activateTab(tabId) {
        if (!tabId || !this.tabPanels.has(tabId)) {
            return;
        }
        this.tabButtons.forEach((button) => {
            const isActive = button.dataset.tabTarget === tabId;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        this.tabPanels.forEach((panel, id) => {
            const isActive = id === tabId;
            panel.classList.toggle('is-active', isActive);
            panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            if (isActive) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });
        this.activeTab = tabId;
        this.updateOverlayAriaState();
    }

    isMobileViewport() {
        if (this.mobileViewport) {
            return this.mobileViewport.matches;
        }
        if (typeof window !== 'undefined') {
            return window.innerWidth <= 768;
        }
        return false;
    }

    isPanelOverlayOpen() {
        return this.panelOverlay?.classList.contains('is-overlay-open') ?? false;
    }

    openPanelOverlay() {
        if (!this.isMobileViewport()) {
            return;
        }
        if (this.panelOverlay) {
            this.panelOverlay.classList.add('is-overlay-open');
        }
        document.body.classList.add('is-panel-overlay-open');
        this.updateOverlayAriaState();
    }

    closePanelOverlay() {
        if (this.panelOverlay) {
            this.panelOverlay.classList.remove('is-overlay-open');
        }
        document.body.classList.remove('is-panel-overlay-open');
        this.updateOverlayAriaState();
    }

    updateOverlayAriaState() {
        const isMobile = this.isMobileViewport();
        const isOpen = this.isPanelOverlayOpen();
        this.tabButtons.forEach((button) => {
            if (isMobile) {
                const isActive = button.dataset.tabTarget === this.activeTab;
                button.setAttribute('aria-expanded', isOpen && isActive ? 'true' : 'false');
            } else {
                button.removeAttribute('aria-expanded');
            }
        });
        if (this.panelOverlayBackdrop) {
            if (isMobile) {
                this.panelOverlayBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            } else {
                this.panelOverlayBackdrop.setAttribute('aria-hidden', 'true');
            }
        }
        if (this.panelOverlayClose) {
            if (isMobile) {
                this.panelOverlayClose.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
                this.panelOverlayClose.setAttribute('tabindex', isOpen ? '0' : '-1');
            } else {
                this.panelOverlayClose.setAttribute('aria-hidden', 'true');
                this.panelOverlayClose.setAttribute('tabindex', '-1');
            }
        }
    }

    handleViewportChange() {
        this.closePanelOverlay();
    }

    setupEvents() {
        UI.tapButton.addEventListener('click', () => this.handleTap());
        UI.enemy.addEventListener('click', () => this.handleTap());
        UI.upgradeClick.addEventListener('click', () => this.handleClickUpgrade());
        if (UI.upgradeCritChance) {
            UI.upgradeCritChance.addEventListener('click', () => this.handleClickCritChanceUpgrade());
        }
        if (UI.upgradeCritDamage) {
            UI.upgradeCritDamage.addEventListener('click', () => this.handleClickCritDamageUpgrade());
        }
        if (UI.upgradeHeroDps) {
            UI.upgradeHeroDps.addEventListener('click', () => this.handleHeroDpsUpgrade());
        }
        UI.sortHeroes.addEventListener('click', () => this.toggleHeroSort());
        if (UI.heroList) {
            UI.heroList.addEventListener('click', (event) => this.handleHeroListClick(event));
        }
        if (UI.bossRetreat) {
            UI.bossRetreat.addEventListener('click', () => this.handleBossRetreat());
        }
        if (UI.bossAdvance) {
            UI.bossAdvance.addEventListener('click', () => this.handleBossAdvance());
        }
        if (UI.gachaSingle) {
            UI.gachaSingle.addEventListener('click', () => this.handleGachaRoll(1));
        }
        if (UI.gachaTen) {
            UI.gachaTen.addEventListener('click', () => this.handleGachaRoll(GACHA_MULTI_COUNT));
        }
        UI.skillFrenzy.addEventListener('click', () => this.useFrenzy());
        UI.saveProgress.addEventListener('click', () => this.manualSave());
        UI.resetProgress.addEventListener('click', () => this.resetGame());
        if (UI.rebirthButton) {
            UI.rebirthButton.addEventListener('click', () => this.handleRebirth());
        }
        if (UI.rebirthSkillList) {
            UI.rebirthSkillList.addEventListener('click', (event) => this.handleRebirthSkillClick(event));
        }
        if (UI.equipmentInventory) {
            UI.equipmentInventory.addEventListener('click', (event) => this.handleEquipmentInventoryClick(event));
            UI.equipmentInventory.addEventListener('change', (event) => this.handleEquipmentInventoryChange(event));
        }
        if (UI.equipmentFilterSalvageable) {
            UI.equipmentFilterSalvageable.addEventListener('change', (event) =>
                this.handleEquipmentFilterChange(event),
            );
        }
        if (UI.equipmentSelectSalvageable) {
            UI.equipmentSelectSalvageable.addEventListener('click', () => this.selectAllSalvageable());
        }
        if (UI.equipmentSalvageSelected) {
            UI.equipmentSalvageSelected.addEventListener('click', () => this.requestSalvageSelected());
        }
        if (UI.salvageModalCancel) {
            UI.salvageModalCancel.addEventListener('click', () => this.closeSalvageModal());
        }
        if (UI.salvageModalConfirm) {
            UI.salvageModalConfirm.addEventListener('click', () => this.confirmSalvage());
        }
        if (UI.salvageModalOverlay) {
            UI.salvageModalOverlay.addEventListener('click', (event) => {
                if (event.target === UI.salvageModalOverlay) {
                    this.closeSalvageModal();
                }
            });
        }
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        if (UI.missionList) {
            UI.missionList.addEventListener('click', (event) => this.handleMissionListClick(event));
        }
        if (this.panelOverlayClose) {
            this.panelOverlayClose.addEventListener('click', () => this.closePanelOverlay());
        }
        if (this.panelOverlayBackdrop) {
            this.panelOverlayBackdrop.addEventListener('click', () => this.closePanelOverlay());
        }
    }

    renderHeroes() {
        UI.heroList.innerHTML = '';
        this.heroElements.clear();
        const sorted = [...this.state.heroes];
        if (this.sortState === 'dps') {
            sorted.sort((a, b) => this.state.getHeroEffectiveDps(b) - this.state.getHeroEffectiveDps(a));
        } else {
            sorted.sort((a, b) => {
                if (a.level === b.level) {
                    return a.name.localeCompare(b.name, 'ko');
                }
                return b.level - a.level;
            });
        }
        sorted.forEach((hero) => this.addHero(hero));
        this.updateHeroSetBonuses();
    }

    renderGachaOverview() {
        const heroes = this.state.heroes ?? [];
        const totalWeight = heroes.reduce((acc, hero) => acc + hero.gachaWeight, 0);

        if (UI.gachaRateList) {
            UI.gachaRateList.innerHTML = '';
            HERO_RARITIES.forEach((rarity) => {
                const rarityHeroes = heroes.filter((hero) => hero.rarityId === rarity.id);
                if (rarityHeroes.length === 0) return;
                const rarityWeight = rarityHeroes.reduce((sum, hero) => sum + hero.gachaWeight, 0);
                const rate = totalWeight > 0 ? rarityWeight / totalWeight : 0;
                const item = document.createElement('li');
                item.dataset.rarity = rarity.id;
                const label = document.createElement('span');
                label.className = 'gacha-rate__label';
                const badge = document.createElement('span');
                badge.className = 'rarity-badge';
                badge.textContent = rarity.name;
                label.appendChild(badge);

                const count = document.createElement('span');
                count.className = 'gacha-rate__count';
                count.textContent = `${rarityHeroes.length}명`;

                const value = document.createElement('span');
                value.className = 'gacha-rate__value';
                value.textContent = formatPercent(rate);

                const tooltipRate = (rate * 100).toFixed(2);
                item.title = `${rarity.description} · 등장률 ${tooltipRate}%`;

                item.append(label, count, value);
                UI.gachaRateList.appendChild(item);
            });
        }

        if (UI.gachaPoolList) {
            UI.gachaPoolList.innerHTML = '';
            this.gachaPoolElements.clear();
            heroes.forEach((hero) => {
                const item = document.createElement('li');
                item.dataset.heroId = hero.id;
                item.dataset.rarity = hero.rarityId;
                item.dataset.ownership = hero.isUnlocked ? 'owned' : 'unowned';

                const name = document.createElement('span');
                name.className = 'gacha-pool__name';
                name.textContent = hero.name;

                const rarityBadge = document.createElement('span');
                rarityBadge.className = 'rarity-badge gacha-pool__rarity';
                rarityBadge.textContent = hero.rarityName;

                const rate = document.createElement('span');
                rate.className = 'gacha-pool__rate';
                const heroRate = totalWeight > 0 ? hero.gachaWeight / totalWeight : 0;
                rate.textContent = formatPercent(heroRate);

                const status = document.createElement('span');
                status.className = 'gacha-pool__status';
                status.textContent = hero.isUnlocked ? `보유 Lv. ${hero.level}` : '미보유';

                item.title = `초회 Lv. ${hero.gachaInitialLevel} · 중복 +${hero.gachaDuplicateGain} 레벨`;
                item.append(name, rarityBadge, rate, status);
                UI.gachaPoolList.appendChild(item);
                this.gachaPoolElements.set(hero.id, { item, status, rate });
            });
        } else {
            this.gachaPoolElements.clear();
        }
    }

    addHero(hero) {
        const node = this.heroTemplate.content.firstElementChild.cloneNode(true);
        node.dataset.heroId = hero.id;
        const name = node.querySelector('.hero__name');
        const desc = node.querySelector('.hero__desc');
        const level = node.querySelector('.hero__level');
        const dps = node.querySelector('.hero__dps');
        const statusState = node.querySelector('.hero__status-state');
        const statusDetail = node.querySelector('.hero__status-detail');
        const rarity = node.querySelector('.hero__rarity');
        const traits = node.querySelector('.hero__traits');
        const skinPreview = node.querySelector('.hero__skin-preview');
        const skinList = node.querySelector('.hero__skin-list');
        const skinButtons = new Map();

        if (rarity) {
            rarity.classList.add('rarity-badge');
            rarity.textContent = hero.rarityName;
            rarity.title = hero.rarity?.description ?? '';
        }

        name.textContent = hero.name;
        desc.textContent = hero.description;
        node.dataset.rarity = hero.rarityId;
        if (skinList) {
            skinList.innerHTML = '';
            hero.skins.forEach((skin) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'hero-skin';
                button.dataset.heroSkinId = skin.id;
                button.dataset.heroId = hero.id;

                const skinName = document.createElement('span');
                skinName.className = 'hero-skin__name';

                const skinStatus = document.createElement('span');
                skinStatus.className = 'hero-skin__status';

                const skinDesc = document.createElement('span');
                skinDesc.className = 'hero-skin__desc';
                skinDesc.textContent = skin.description ?? '';

                button.append(skinName, skinStatus, skinDesc);
                skinList.appendChild(button);
                skinButtons.set(skin.id, { button, name: skinName, status: skinStatus, desc: skinDesc });
            });
        }

        this.heroElements.set(hero.id, {
            node,
            name,
            desc,
            level,
            dps,
            statusState,
            statusDetail,
            rarity,
            traits,
            skinPreview,
            skinList,
            skinButtons,
        });
        this.updateHero(hero);

        UI.heroList.appendChild(node);
    }

    updateHero(hero) {
        const heroUI = this.heroElements.get(hero.id);
        if (!heroUI) return;
        heroUI.node.dataset.rarity = hero.rarityId;
        if (heroUI.name) {
            heroUI.name.textContent = hero.name;
        }
        if (heroUI.desc) {
            heroUI.desc.textContent = hero.description;
        }
        if (heroUI.rarity) {
            heroUI.rarity.textContent = hero.rarityName;
            heroUI.rarity.title = hero.rarity?.description ?? '';
        }
        heroUI.level.textContent = `Lv. ${hero.level}`;
        heroUI.dps.textContent = `DPS: ${formatNumber(this.state.getHeroEffectiveDps(hero))}`;
        this.updateHeroTraits(hero);
        heroUI.node.dataset.recruited = hero.isUnlocked ? 'true' : 'false';
        if (hero.isUnlocked) {
            heroUI.statusState.textContent = '합류 완료';
            const extraLevels = hero.enhancementLevel;
            const detailParts = [];
            if (extraLevels > 0) {
                detailParts.push(`추가 성장 +${extraLevels} (Lv. ${hero.level})`);
            } else {
                detailParts.push(`초회 합류 Lv. ${hero.level}`);
            }
            const activeSkin = hero.activeSkin;
            if (activeSkin) {
                detailParts.push(`현재 스킨: ${activeSkin.name}`);
            }
            const nextSkin = hero.nextSkinUnlock;
            if (nextSkin) {
                detailParts.push(`다음 스킨 Lv. ${nextSkin.requiredLevel} ${nextSkin.name}`);
            }
            heroUI.statusDetail.textContent = detailParts.join(' · ');
        } else {
            heroUI.statusState.textContent = '미합류';
            const detailParts = [`${hero.rarityName} 학생을 가챠로 모집하세요.`];
            const firstSkin = hero.skins?.[0];
            if (firstSkin) {
                detailParts.push(`첫 스킨 Lv. ${firstSkin.requiredLevel} ${firstSkin.name}`);
            }
            heroUI.statusDetail.textContent = detailParts.join(' · ');
        }
        this.updateHeroSkins(hero);
        this.updateHeroGachaEntry(hero);
    }

    updateHeroTraits(hero) {
        const heroUI = this.heroElements.get(hero.id);
        if (!heroUI?.traits) return;
        const container = heroUI.traits;
        container.innerHTML = '';
        const entries = Array.isArray(hero.traitEntries) ? hero.traitEntries : [];
        if (entries.length === 0) {
            container.dataset.state = 'empty';
            return;
        }
        container.dataset.state = 'ready';
        entries.forEach(({ type, trait, group }) => {
            const badge = document.createElement('span');
            badge.className = 'hero-trait';
            badge.dataset.traitType = type;
            if (trait?.id) {
                badge.dataset.traitId = trait.id;
            } else {
                delete badge.dataset.traitId;
            }
            if (trait.accentColor) {
                badge.style.setProperty('--hero-trait-accent', trait.accentColor);
            } else {
                badge.style.removeProperty('--hero-trait-accent');
            }
            const labelParts = [];
            if (group?.label) labelParts.push(group.label);
            if (trait?.name) labelParts.push(trait.name);
            if (trait?.description) labelParts.push(trait.description);
            if (labelParts.length > 0) {
                badge.title = labelParts.join(' · ');
            } else {
                badge.removeAttribute('title');
            }
            const icon = document.createElement('span');
            icon.className = 'hero-trait__icon';
            icon.textContent = group?.icon ?? '•';
            const text = document.createElement('span');
            text.className = 'hero-trait__text';
            text.textContent = trait?.shortName ?? trait?.name ?? '특성';
            badge.append(icon, text);
            container.appendChild(badge);
        });
    }

    updateHeroSkins(hero) {
        const heroUI = this.heroElements.get(hero.id);
        if (!heroUI) return;
        const activeSkin = hero.activeSkin;
        if (heroUI.skinPreview) {
            if (hero.isUnlocked && activeSkin) {
                heroUI.skinPreview.dataset.locked = 'false';
                heroUI.skinPreview.style.background = activeSkin.preview ??
                    'linear-gradient(135deg, #334155 0%, #0f172a 100%)';
                heroUI.skinPreview.style.borderColor = activeSkin.accentColor ?? 'rgba(148, 163, 184, 0.28)';
                heroUI.skinPreview.style.boxShadow = activeSkin.shadowColor
                    ? `0 18px 32px ${activeSkin.shadowColor}`
                    : 'none';
                const tooltip = [activeSkin.name, activeSkin.description]
                    .filter(Boolean)
                    .join(' · ');
                heroUI.skinPreview.title = tooltip || `${hero.name} 스킨 프리뷰`;
            } else {
                heroUI.skinPreview.dataset.locked = 'true';
                heroUI.skinPreview.style.background = 'linear-gradient(135deg, #334155 0%, #0f172a 100%)';
                heroUI.skinPreview.style.borderColor = 'rgba(148, 163, 184, 0.28)';
                heroUI.skinPreview.style.boxShadow = 'none';
                heroUI.skinPreview.title = '학생 모집 후 스킨을 확인할 수 있습니다.';
            }
        }
        if (heroUI.node) {
            if (hero.isUnlocked && activeSkin) {
                heroUI.node.dataset.skinTheme = activeSkin.theme ?? '';
                heroUI.node.style.setProperty(
                    '--hero-skin-accent',
                    activeSkin.accentColor ?? 'rgba(148, 163, 184, 0.25)',
                );
                heroUI.node.style.setProperty(
                    '--hero-skin-shadow',
                    activeSkin.shadowColor ?? 'rgba(15, 23, 42, 0)',
                );
            } else {
                delete heroUI.node.dataset.skinTheme;
                heroUI.node.style.removeProperty('--hero-skin-accent');
                heroUI.node.style.removeProperty('--hero-skin-shadow');
            }
        }
        if (heroUI.skinButtons && heroUI.skinButtons.size > 0) {
            hero.skins.forEach((skin) => {
                const entry = heroUI.skinButtons.get(skin.id);
                if (!entry) return;
                entry.name.textContent = skin.name;
                if (entry.desc) {
                    entry.desc.textContent = skin.description ?? '';
                }
                const unlocked = hero.isSkinUnlocked(skin.id);
                entry.button.dataset.locked = unlocked ? 'false' : 'true';
                entry.button.dataset.heroSkinId = skin.id;
                entry.button.dataset.heroId = hero.id;
                entry.button.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
                entry.button.classList.toggle('is-selected', skin.id === hero.selectedSkinId);
                entry.button.setAttribute('aria-pressed', skin.id === hero.selectedSkinId ? 'true' : 'false');
                entry.button.style.setProperty('--hero-skin-accent', skin.accentColor ?? '#38bdf8');
                entry.status.textContent = this.getHeroSkinRequirementText(hero, skin);
                entry.button.title = this.buildHeroSkinTooltip(hero, skin);
            });
        }
    }

    getHeroSkinRequirementText(hero, skin) {
        if (hero.level <= 0) {
            return '학생 모집 필요';
        }
        if (hero.isSkinUnlocked(skin.id)) {
            return skin.id === hero.selectedSkinId ? '적용 중' : '해금 완료';
        }
        return `필요 Lv. ${skin.requiredLevel} (현재 ${hero.level})`;
    }

    buildHeroSkinTooltip(hero, skin) {
        const lines = [];
        if (skin.description) {
            lines.push(skin.description);
        }
        if (hero.level <= 0) {
            lines.push('학생을 모집하면 해금됩니다.');
        } else if (hero.isSkinUnlocked(skin.id)) {
            lines.push('해금 완료');
        } else {
            lines.push(`필요 레벨: ${skin.requiredLevel}`);
            lines.push(`현재 레벨: ${hero.level}`);
        }
        return lines.join('\n');
    }

    renderHeroSetBonuses() {
        if (!UI.setBonusList) return;
        UI.setBonusList.innerHTML = '';
        this.setBonusElements.clear();
        HERO_SET_BONUSES.forEach((bonus) => {
            const item = document.createElement('li');
            item.className = 'set-bonus';
            item.dataset.bonusId = bonus.id;

            const header = document.createElement('div');
            header.className = 'set-bonus__header';

            const name = document.createElement('h3');
            name.className = 'set-bonus__name';
            name.textContent = bonus.name;

            const status = document.createElement('span');
            status.className = 'set-bonus__status';
            status.textContent = '0/0';

            header.append(name, status);

            const requirement = document.createElement('p');
            requirement.className = 'set-bonus__requirement';
            const baseRequirement = describeSetBonusRequirement(bonus.requirement);
            requirement.dataset.baseRequirement = baseRequirement;
            requirement.textContent = baseRequirement;

            const effects = document.createElement('p');
            effects.className = 'set-bonus__effects';
            const effectText = formatSetBonusEffects(bonus.effects);
            effects.textContent = effectText;
            effects.title = effectText;

            item.append(header, requirement, effects);

            if (bonus.description) {
                const desc = document.createElement('p');
                desc.className = 'set-bonus__desc';
                desc.textContent = bonus.description;
                item.appendChild(desc);
            }

            UI.setBonusList.appendChild(item);
            this.setBonusElements.set(bonus.id, {
                node: item,
                status,
                requirement,
                effects,
                baseRequirement,
            });
        });
        this.updateHeroSetBonuses();
    }

    updateHeroSetBonuses() {
        if (!this.setBonusElements || this.setBonusElements.size === 0) {
            if (UI.setBonusSummary) {
                UI.setBonusSummary.textContent = '발동 중인 세트 없음';
                UI.setBonusSummary.title = '조건을 만족한 세트 효과가 없습니다.';
            }
            return;
        }
        const statuses = this.state.getAllSetBonusStatuses();
        const activeNames = [];
        statuses.forEach(({ bonus, count, required, active, heroes }) => {
            const entry = this.setBonusElements.get(bonus.id);
            if (!entry) return;
            entry.node.dataset.active = active ? 'true' : 'false';
            entry.status.textContent = active ? '발동 중' : `${count}/${required}`;
            entry.status.title = active ? '세트 효과 발동 중' : `편성 ${count}/${required}`;
            const baseRequirement = entry.baseRequirement ?? describeSetBonusRequirement(bonus.requirement);
            entry.requirement.textContent = `${baseRequirement} (현재 ${count}명)`;
            const memberNames = heroes.map((hero) => hero.name).join(', ');
            const memberDetail = memberNames ? `참여 학생: ${memberNames}` : '조건을 충족하는 학생이 없습니다.';
            entry.node.title = memberDetail;
            entry.requirement.title = memberDetail;
            if (active) {
                activeNames.push(bonus.name);
            }
        });
        if (UI.setBonusSummary) {
            if (activeNames.length === 0) {
                UI.setBonusSummary.textContent = '발동 중인 세트 없음';
                UI.setBonusSummary.title = '조건을 만족한 세트 효과가 없습니다.';
            } else {
                UI.setBonusSummary.textContent = `발동 중 ${activeNames.length}개 · ${activeNames.join(' · ')}`;
                const summaryEffects = this.state.getSetBonusSummary();
                const effectTexts = Object.entries(summaryEffects)
                    .map(([effectId, value]) => describeEquipmentEffect(effectId, value))
                    .filter(Boolean);
                UI.setBonusSummary.title = effectTexts.length > 0
                    ? effectTexts.join('\n')
                    : '활성화된 세트 효과가 있습니다.';
            }
        }
    }

    handleHeroListClick(event) {
        const button = event.target.closest('.hero-skin');
        if (!button) return;
        const heroElement = button.closest('.hero');
        const heroId = heroElement?.dataset.heroId;
        const skinId = button.dataset.heroSkinId;
        if (!heroId || !skinId) return;
        const hero = this.state.getHeroById(heroId);
        if (!hero) return;
        if (!hero.isSkinUnlocked(skinId)) {
            const skin = hero.getSkinPublicData(skinId) ?? hero.getSkin(skinId);
            if (hero.level <= 0) {
                this.addLog(`${hero.name}을(를) 먼저 모집해야 스킨을 사용할 수 있습니다.`, 'info');
            } else if (skin) {
                this.addLog(`${hero.name}의 ${skin.name} 스킨은 Lv. ${skin.requiredLevel}에서 해금됩니다.`, 'info');
            } else {
                this.addLog('스킨 정보를 확인할 수 없습니다.', 'warning');
            }
            return;
        }
        const result = this.state.selectHeroSkin(heroId, skinId);
        if (!result.success) {
            if (result.message) {
                this.addLog(result.message, 'warning');
            }
            return;
        }
        const skinName = result.skin?.name ?? hero.getSkinPublicData(skinId)?.name ?? '스킨';
        this.addLog(`${hero.name}에게 ${skinName} 스킨을 적용했습니다!`, 'success');
        this.updateHero(hero);
        saveGame(this.state);
    }

    updateHeroes() {
        this.state.heroes.forEach((hero) => this.updateHero(hero));
    }

    updateHeroGachaEntry(hero) {
        const entry = this.gachaPoolElements.get(hero.id);
        if (!entry) return;
        entry.item.dataset.ownership = hero.isUnlocked ? 'owned' : 'unowned';
        if (entry.status) {
            entry.status.textContent = hero.isUnlocked ? `보유 Lv. ${hero.level}` : '미보유';
        }
    }

    renderEquipmentUI() {
        this.renderEquipmentSlots();
        this.renderEquipmentInventory();
        this.updateEquipmentSummary();
    }

    getEquipmentEffectDescriptions(item) {
        if (!item?.effects) return [];
        const order = Array.isArray(item.effectOrder) && item.effectOrder.length > 0
            ? item.effectOrder
            : Object.keys(item.effects);
        return order
            .map((effectId) => {
                const effect = item.effects[effectId];
                if (!effect) return null;
                return describeEquipmentEffect(effectId, effect.value ?? 0);
            })
            .filter(Boolean);
    }

    getPrimaryEquipmentEffectValue(item) {
        if (!item) return 0;
        const primary = item.effects?.[item.type]?.value;
        if (Number.isFinite(primary)) {
            return primary;
        }
        return Number.isFinite(item.value) ? item.value : 0;
    }

    renderRebirthUI() {
        if (!UI.rebirthSkillList) return;
        UI.rebirthSkillList.innerHTML = '';
        this.rebirthSkillElements.clear();
        REBIRTH_SKILLS.forEach((skill) => {
            const entry = document.createElement('li');
            entry.className = 'rebirth-skill';
            entry.dataset.skillId = skill.id;

            const header = document.createElement('div');
            header.className = 'rebirth-skill__header';

            const name = document.createElement('span');
            name.className = 'rebirth-skill__name';
            name.textContent = skill.name;

            const level = document.createElement('span');
            level.className = 'rebirth-skill__level';

            header.append(name, level);

            const desc = document.createElement('p');
            desc.className = 'rebirth-skill__desc';
            desc.textContent = skill.description;

            const bonus = document.createElement('span');
            bonus.className = 'rebirth-skill__bonus';
            bonus.textContent = skill.effectDescription;

            const actions = document.createElement('div');
            actions.className = 'rebirth-skill__actions';

            const total = document.createElement('span');
            total.className = 'rebirth-skill__total';

            const button = document.createElement('button');
            button.className = 'btn btn-secondary rebirth-skill__button';
            button.dataset.skillId = skill.id;
            button.type = 'button';

            actions.append(total, button);

            entry.append(header, desc, bonus, actions);
            UI.rebirthSkillList.appendChild(entry);

            this.rebirthSkillElements.set(skill.id, { level, total, button });
        });
        this.updateRebirthUI();
    }

    updateEquipmentSummary() {
        const equipmentBonuses = this.state.getEquipmentBonuses();
        const rebirthBonuses = this.state.getRebirthBonusSummary();
        const setBonuses = this.state.getSetBonusSummary();
        const summaryEffects = [
            { id: 'tap', element: UI.equipmentTapBonus },
            { id: 'hero', element: UI.equipmentHeroBonus },
            { id: 'skill', element: UI.equipmentSkillBonus },
            { id: 'gold', element: UI.equipmentGoldBonus },
            { id: 'critChance', element: UI.equipmentCritChanceBonus },
            { id: 'critDamage', element: UI.equipmentCritDamageBonus },
        ];

        const summaryData = summaryEffects.map(({ id, element }) => {
            const effect = EQUIPMENT_EFFECT_MAP.get(id);
            const label = effect?.shortLabel ?? effect?.label ?? id;
            const equipmentValue = equipmentBonuses[id] ?? 0;
            const rebirthValue = rebirthBonuses[id] ?? 0;
            const setValue = setBonuses[id] ?? 0;
            this.setBonusDisplay(element, equipmentValue, rebirthValue, setValue);
            return { id, label, equipmentValue, rebirthValue, setValue };
        });

        if (UI.equipmentSummary) {
            const summaryText = summaryData
                .map(({ label, equipmentValue, rebirthValue, setValue }) => {
                    const total = (equipmentValue ?? 0) + (rebirthValue ?? 0) + (setValue ?? 0);
                    if (total <= 0) return null;
                    return `${label} ${formatSignedPercent(total)}`;
                })
                .filter(Boolean)
                .join(' · ');
            UI.equipmentSummary.textContent = summaryText || '추가 지원 없음';

            const tooltipParts = summaryData.map(({ label, equipmentValue, rebirthValue, setValue }) => {
                const breakdown = this.buildBonusBreakdown(equipmentValue, rebirthValue, setValue);
                return `${label}: ${breakdown}`;
            });
            const dropBonus = this.state.equipmentDropBonus ?? 0;
            const normalChance = clampProbability(EQUIPMENT_DROP_CHANCE * (1 + dropBonus));
            const bossChance = clampProbability(EQUIPMENT_BOSS_DROP_CHANCE * (1 + dropBonus));
            const normalDetail = this.buildChanceDetail('일반 드롭 확률', EQUIPMENT_DROP_CHANCE, normalChance);
            const bossDetail = this.buildChanceDetail('보스 드롭 확률', EQUIPMENT_BOSS_DROP_CHANCE, bossChance);
            if (normalDetail) tooltipParts.push(normalDetail);
            if (bossDetail) tooltipParts.push(bossDetail);
            UI.equipmentSummary.title = tooltipParts.length > 0 ? tooltipParts.join('\n') : '추가 지원 없음';
        }
    }

    setBonusDisplay(element, equipmentValue = 0, rebirthValue = 0, setValue = 0) {
        if (!element) return;
        const total = (equipmentValue ?? 0) + (rebirthValue ?? 0) + (setValue ?? 0);
        element.textContent = formatSignedPercent(total);
        element.title = this.buildBonusBreakdown(equipmentValue, rebirthValue, setValue);
    }

    buildBonusBreakdown(equipmentValue = 0, rebirthValue = 0, setValue = 0) {
        const parts = [];
        if (equipmentValue > 0) parts.push(`장비 지원 ${formatPercent(equipmentValue)}`);
        if (rebirthValue > 0) parts.push(`환생 기억 ${formatPercent(rebirthValue)}`);
        if (setValue > 0) parts.push(`세트 효과 ${formatPercent(setValue)}`);
        if (parts.length === 0) return '추가 지원 없음';
        return parts.join(' / ');
    }

    buildChanceDetail(label, baseChance, finalChance) {
        if (!Number.isFinite(baseChance) || !Number.isFinite(finalChance)) return '';
        const baseText = formatPercent(baseChance);
        const finalText = formatPercent(finalChance);
        if (Math.abs(finalChance - baseChance) < 0.0005) {
            return `${label} ${finalText}`;
        }
        return `${label} ${baseText} → ${finalText}`;
    }

    formatPayback(seconds) {
        if (!Number.isFinite(seconds) || seconds <= 0) {
            return '';
        }
        if (seconds < 1) {
            return `${Math.max(1, Math.round(seconds * 1000))}ms`;
        }
        if (seconds < 60) {
            return `${seconds.toFixed(1)}초`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const minutesRemainder = minutes % 60;
            if (minutesRemainder === 0) {
                return `${hours}시간`;
            }
            return `${hours}시간 ${minutesRemainder}분`;
        }
        if (remainingSeconds === 0) {
            return `${minutes}분`;
        }
        return `${minutes}분 ${remainingSeconds}초`;
    }

    updateRebirthUI() {
        if (!UI.rebirthPanel) return;
        if (UI.rebirthCount) {
            UI.rebirthCount.textContent = formatNumber(this.state.totalRebirths);
        }
        if (UI.rebirthHighestStage) {
            UI.rebirthHighestStage.textContent = formatNumber(this.state.highestStage);
        }
        if (UI.rebirthPotential) {
            UI.rebirthPotential.textContent = formatNumber(this.state.pendingRebirthPoints);
        }
        if (UI.rebirthPoints) {
            UI.rebirthPoints.textContent = formatNumber(this.state.rebirthPoints);
        }
        if (UI.rebirthButton) {
            UI.rebirthButton.disabled = !this.state.canRebirth;
        }
        if (UI.rebirthRequirement) {
            if (this.state.canRebirth) {
                UI.rebirthRequirement.textContent = '환생이 가능합니다! 포인트를 받고 새롭게 시작하세요.';
                UI.rebirthRequirement.dataset.state = 'ready';
            } else {
                const current = this.state.currentRunHighestStage;
                if (current <= 0) {
                    UI.rebirthRequirement.textContent = `${REBIRTH_STAGE_REQUIREMENT}층을 돌파하면 환생할 수 있습니다.`;
                } else {
                    const remaining = Math.max(0, REBIRTH_STAGE_REQUIREMENT - current);
                    UI.rebirthRequirement.textContent =
                        remaining > 0
                            ? `환생까지 ${remaining}층 더 돌파하세요.`
                            : '보스를 처치해 환생 포인트를 모으세요.';
                }
                UI.rebirthRequirement.dataset.state = 'locked';
            }
        }
        if (UI.rebirthPanel) {
            UI.rebirthPanel.dataset.unlocked = this.state.highestStage >= REBIRTH_STAGE_REQUIREMENT ? 'true' : 'false';
        }
        this.updateRebirthSkills();
    }

    updateRebirthSkills() {
        if (this.rebirthSkillElements.size === 0) return;
        const availablePoints = this.state.rebirthPoints;
        REBIRTH_SKILLS.forEach((skill) => {
            const elements = this.rebirthSkillElements.get(skill.id);
            if (!elements) return;
            const level = this.state.getRebirthSkillLevel(skill.id);
            elements.level.textContent = `Lv. ${level}/${skill.maxLevel}`;
            elements.total.textContent = this.formatRebirthTotal(skill, level);
            const cost = this.state.getRebirthSkillCost(skill.id);
            if (skill.maxLevel && level >= skill.maxLevel) {
                elements.button.textContent = '최대 레벨';
                elements.button.disabled = true;
            } else {
                elements.button.textContent = `강화 (${cost}P)`;
                elements.button.disabled = cost > availablePoints;
            }
        });
    }

    formatRebirthTotal(skill, level) {
        if (level <= 0) return '총 효과: 없음';
        const parts = Object.entries(skill.effect).map(([type, value]) => {
            const label = REBIRTH_EFFECT_LABELS[type] ?? type;
            return `${label} +${formatPercent(value * level)}`;
        });
        return `총 효과: ${parts.join(' · ')}`;
    }

    renderEquipmentSlots() {
        if (!UI.equipmentSlots) return;
        UI.equipmentSlots.innerHTML = '';
        EQUIPMENT_TYPES.forEach((type) => {
            const item = this.state.getEquippedItem(type.id);
            const slot = document.createElement('li');
            slot.className = 'equipment-slot';
            slot.dataset.rarity = item?.rarity ?? 'none';
            slot.dataset.equipped = item ? 'true' : 'false';

            const label = document.createElement('div');
            label.className = 'equipment-slot__label';
            label.textContent = type.label;

            const content = document.createElement('div');
            content.className = 'equipment-slot__content';

            if (item) {
                const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
                const header = document.createElement('div');
                header.className = 'equipment-slot__header';

                const name = document.createElement('span');
                name.className = 'equipment-slot__name';
                const rarityTag = rarity ? `[${rarity.name}] ` : '';
                name.textContent = `${rarityTag}${item.name}`;

                const level = document.createElement('span');
                level.className = 'equipment-slot__level';
                level.textContent = `Lv. ${item.level}/${item.maxLevel}`;

                header.append(name, level);

                const value = document.createElement('span');
                value.className = 'equipment-slot__value';
                const effects = this.getEquipmentEffectDescriptions(item);
                const primaryValue = this.getPrimaryEquipmentEffectValue(item);
                const fallback = describeEquipmentEffect(item.type, primaryValue) ?? formatSignedPercent(primaryValue);
                value.textContent = effects.length > 0 ? effects.join(' · ') : fallback;
                content.append(header, value);
            } else {
                const empty = document.createElement('span');
                empty.className = 'equipment-slot__empty';
                empty.textContent = '미장착';
                content.appendChild(empty);
            }

            slot.append(label, content);
            UI.equipmentSlots.appendChild(slot);
        });
    }

    getEquipmentUpgradeContext(item) {
        if (!item) {
            return {
                cost: 0,
                hasMaterials: false,
                canUpgrade: false,
            };
        }
        const cost = this.state.getEquipmentUpgradeMaterialCost(item, item.level + 1);
        const hasMaterials = cost === 0 || this.state.upgradeMaterials >= cost;
        const canUpgrade = item.level < item.maxLevel && hasMaterials;
        return {
            cost,
            hasMaterials,
            canUpgrade,
        };
    }

    renderEquipmentInventory() {
        if (!UI.equipmentInventory) return;
        this.sanitizeSelectedEquipment();
        UI.equipmentInventory.innerHTML = '';
        const sorted = [...this.state.inventory];
        sorted.sort((a, b) => {
            const rarityA = EQUIPMENT_RARITY_MAP.get(a.rarity)?.rank ?? 0;
            const rarityB = EQUIPMENT_RARITY_MAP.get(b.rarity)?.rank ?? 0;
            if (rarityA !== rarityB) return rarityB - rarityA;
            const primaryA = a.effects?.[a.type]?.value ?? a.value ?? 0;
            const primaryB = b.effects?.[b.type]?.value ?? b.value ?? 0;
            if (primaryA !== primaryB) return primaryB - primaryA;
            return a.name.localeCompare(b.name, 'ko');
        });

        const visibleItems = this.filterSalvageable
            ? sorted.filter((item) => this.state.canSalvageItem(item))
            : sorted;

        if (UI.equipmentEmpty) {
            if (sorted.length === 0) {
                UI.equipmentEmpty.textContent = '아직 확보한 전술 장비가 없습니다.';
                UI.equipmentEmpty.style.display = 'block';
            } else if (visibleItems.length === 0) {
                UI.equipmentEmpty.textContent =
                    '조건을 만족하는 전술 장비가 없습니다. 잠금 또는 장착 상태를 확인하세요.';
                UI.equipmentEmpty.style.display = 'block';
            } else {
                UI.equipmentEmpty.style.display = 'none';
            }
        }

        visibleItems.forEach((item) => {
            const type = EQUIPMENT_TYPE_MAP.get(item.type);
            const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
            const equipped = this.state.equipped[item.type] === item.id;
            const salvageable = this.state.canSalvageItem(item);

            const entry = document.createElement('li');
            entry.className = 'equipment-item';
            entry.dataset.rarity = item.rarity;
            entry.dataset.equipped = equipped ? 'true' : 'false';
            entry.dataset.salvageable = salvageable ? 'true' : 'false';

            const selectWrapper = document.createElement('label');
            selectWrapper.className = 'equipment-item__select';
            const selectTooltip = salvageable
                ? '선택하여 여러 장비를 한 번에 분해할 수 있습니다.'
                : item.locked
                ? '잠금 중인 전술 장비는 선택할 수 없습니다.'
                : equipped
                ? '장착 중인 전술 장비는 선택할 수 없습니다.'
                : '선택할 수 없는 전술 장비입니다.';
            selectWrapper.title = selectTooltip;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.selectId = item.id;
            checkbox.checked = this.selectedEquipmentIds.has(item.id);
            checkbox.disabled = !salvageable;

            const checkboxLabel = document.createElement('span');
            checkboxLabel.className = 'equipment-item__select-label';
            checkboxLabel.textContent = '선택';

            selectWrapper.append(checkbox, checkboxLabel);

            const info = document.createElement('div');
            info.className = 'equipment-item__info';

            const name = document.createElement('span');
            name.className = 'equipment-item__name';
            const rarityLabel = rarity ? `[${rarity.name}] ` : '';
            name.textContent = `${rarityLabel}${item.name}`;

            const details = document.createElement('span');
            details.className = 'equipment-item__details';
            const typeLabel = type?.label ?? '전술 장비';
            const effects = this.getEquipmentEffectDescriptions(item);
            const primary = item.effects?.[item.type]?.value ?? item.value ?? 0;
            const fallbackEffect = describeEquipmentEffect(item.type, primary) ?? formatSignedPercent(primary);
            const effectText = effects.length > 0 ? effects.join(' / ') : fallbackEffect;
            details.textContent = `${typeLabel} · ${effectText} · Lv. ${item.level}/${item.maxLevel} · 스테이지 ${item.stage}`;

            const status = document.createElement('span');
            status.className = 'equipment-item__status';
            if (item.locked) {
                status.textContent = '🔒 잠금 상태';
                status.dataset.state = 'locked';
            } else if (equipped) {
                status.textContent = '장착 중';
                status.dataset.state = 'equipped';
            } else if (salvageable) {
                status.textContent = '분해 가능';
                status.dataset.state = 'available';
            } else {
                status.textContent = '보관 중';
                status.dataset.state = 'stored';
            }

            info.append(name, details, status);

            const actions = document.createElement('div');
            actions.className = 'equipment-item__actions';

            const lockButton = document.createElement('button');
            lockButton.type = 'button';
            lockButton.className = 'btn btn-ghost equipment-item__lock';
            lockButton.dataset.lockId = item.id;
            lockButton.textContent = item.locked ? '잠금 해제' : '잠금';
            lockButton.title = item.locked
                ? '잠금을 해제하여 강화 재료로 사용하거나 분해할 수 있습니다.'
                : '잠금하면 분해 및 강화 재료로 사용되지 않습니다.';

            const upgradeContext = this.getEquipmentUpgradeContext(item);
            const upgradeAvailable = upgradeContext.canUpgrade;

            const upgradeButton = document.createElement('button');
            upgradeButton.type = 'button';
            upgradeButton.className = 'btn btn-upgrade equipment-item__upgrade';
            upgradeButton.dataset.upgradeId = item.id;
            if (item.level >= item.maxLevel) {
                upgradeButton.textContent = '최대 강화';
                upgradeButton.disabled = true;
                upgradeButton.title = '이미 최대 강화 단계입니다.';
            } else {
                upgradeButton.textContent =
                    upgradeContext.cost > 0
                        ? `강화 (${formatNumber(upgradeContext.cost)}개)`
                        : '강화';
                upgradeButton.disabled = !upgradeAvailable;
                if (!upgradeAvailable) {
                    if (!upgradeContext.hasMaterials && upgradeContext.cost > 0) {
                        upgradeButton.title = `강화 재료가 부족합니다. 필요 ${formatNumber(
                            upgradeContext.cost,
                        )}개, 보유 ${formatNumber(this.state.upgradeMaterials)}개`;
                    } else {
                        upgradeButton.title = '강화를 진행할 수 없습니다.';
                    }
                } else {
                    upgradeButton.title =
                        upgradeContext.cost > 0
                            ? `강화에 강화 재료 ${formatNumber(upgradeContext.cost)}개가 소모됩니다. (보유 재료 ${formatNumber(
                                  this.state.upgradeMaterials,
                              )}개)`
                            : '강화 재료 없이 강화를 진행할 수 있습니다.';
                }
            }

            const equipButton = document.createElement('button');
            equipButton.type = 'button';
            equipButton.className = 'btn btn-secondary equipment-item__equip';
            equipButton.textContent = equipped ? '장착 중' : '장착';
            equipButton.disabled = equipped;
            equipButton.dataset.equipId = item.id;
            equipButton.title = equipped ? '이미 장착 중입니다.' : '선택한 전술 장비를 장착합니다.';

            const salvageButton = document.createElement('button');
            salvageButton.type = 'button';
            salvageButton.className = 'btn btn-danger equipment-item__salvage';
            salvageButton.dataset.salvageId = item.id;
            salvageButton.textContent = '분해';
            salvageButton.disabled = !salvageable;
            if (item.locked) {
                salvageButton.title = '잠긴 전술 장비는 분해할 수 없습니다.';
            } else if (equipped) {
                salvageButton.title = '장착 중인 전술 장비는 분해할 수 없습니다.';
            } else {
                salvageButton.title = '전술 장비를 분해하여 강화 재료와 골드를 획득합니다.';
            }

            actions.append(lockButton, upgradeButton, equipButton, salvageButton);

            entry.append(selectWrapper, info, actions);
            UI.equipmentInventory.appendChild(entry);
        });

        this.updateEquipmentControls();
    }


    sanitizeSelectedEquipment() {
        if (!this.selectedEquipmentIds || this.selectedEquipmentIds.size === 0) {
            return;
        }
        const valid = new Set();
        this.state.inventory.forEach((item) => {
            if (this.state.canSalvageItem(item) && this.selectedEquipmentIds.has(item.id)) {
                valid.add(item.id);
            }
        });
        this.selectedEquipmentIds = valid;
    }

    updateEquipmentControls() {
        const salvageableItems = this.state.inventory.filter((item) => this.state.canSalvageItem(item));
        const totalSalvageable = salvageableItems.length;
        const selectedCount = this.selectedEquipmentIds.size;

        if (UI.equipmentFilterSalvageable) {
            UI.equipmentFilterSalvageable.checked = this.filterSalvageable;
        }
        if (UI.equipmentSelectSalvageable) {
            UI.equipmentSelectSalvageable.disabled = totalSalvageable === 0;
            UI.equipmentSelectSalvageable.title =
                totalSalvageable === 0
                    ? '분해 가능한 전술 장비가 없습니다.'
                    : `분해 가능한 전술 장비 ${formatNumber(totalSalvageable)}개를 한 번에 선택합니다.`;
        }
        if (UI.equipmentSalvageSelected) {
            UI.equipmentSalvageSelected.disabled = selectedCount === 0;
            UI.equipmentSalvageSelected.textContent =
                selectedCount > 0 ? `선택 분해 (${formatNumber(selectedCount)}개)` : '선택 분해';
            UI.equipmentSalvageSelected.title = selectedCount > 0
                ? '선택한 전술 장비를 분해합니다.'
                : '분해할 전술 장비를 먼저 선택하세요.';
        }
        if (UI.equipmentSelectionCount) {
            UI.equipmentSelectionCount.textContent =
                selectedCount > 0 ? `현재 선택: ${formatNumber(selectedCount)}개` : '현재 선택: 없음';
        }
        if (UI.equipmentInventory) {
            const upgradeButtons = UI.equipmentInventory.querySelectorAll('[data-upgrade-id]');
            upgradeButtons.forEach((button) => {
                const itemId = button.dataset.upgradeId;
                if (!itemId) return;
                const item = this.state.inventory.find((entry) => entry.id === itemId);
                if (!item) {
                    button.disabled = true;
                    button.title = '전술 장비를 찾을 수 없습니다.';
                    return;
                }
                if (item.level >= item.maxLevel) {
                    button.textContent = '최대 강화';
                    button.disabled = true;
                    button.title = '이미 최대 강화 단계입니다.';
                    return;
                }
                const context = this.getEquipmentUpgradeContext(item);
                button.textContent =
                    context.cost > 0 ? `강화 (${formatNumber(context.cost)}개)` : '강화';
                button.disabled = !context.canUpgrade;
                if (!context.canUpgrade) {
                    if (!context.hasMaterials && context.cost > 0) {
                        button.title = `강화 재료가 부족합니다. 필요 ${formatNumber(
                            context.cost,
                        )}개, 보유 ${formatNumber(this.state.upgradeMaterials)}개`;
                    } else {
                        button.title = '강화를 진행할 수 없습니다.';
                    }
                } else {
                    button.title =
                        context.cost > 0
                            ? `강화에 강화 재료 ${formatNumber(context.cost)}개가 소모됩니다. (보유 재료 ${formatNumber(
                                  this.state.upgradeMaterials,
                              )}개)`
                            : '강화 재료 없이 강화를 진행할 수 있습니다.';
                }
            });
        }
    }

    handleEquipmentInventoryChange(event) {
        const checkbox = event.target.closest('input[data-select-id]');
        if (!checkbox) return;
        const itemId = checkbox.dataset.selectId;
        if (!itemId) return;
        if (checkbox.checked) {
            this.selectedEquipmentIds.add(itemId);
        } else {
            this.selectedEquipmentIds.delete(itemId);
        }
        this.updateEquipmentControls();
    }

    handleEquipmentFilterChange(event) {
        const target = event?.target;
        const checked = target ? Boolean(target.checked) : false;
        this.filterSalvageable = checked;
        this.renderEquipmentInventory();
    }

    selectAllSalvageable() {
        const salvageable = this.state.inventory.filter((item) => this.state.canSalvageItem(item));
        if (salvageable.length === 0) {
            this.addLog('분해 가능한 전술 장비가 없습니다.', 'info');
            return;
        }
        salvageable.forEach((item) => this.selectedEquipmentIds.add(item.id));
        this.renderEquipmentInventory();
    }

    requestSalvageSelected() {
        if (!this.selectedEquipmentIds || this.selectedEquipmentIds.size === 0) {
            this.addLog('분해할 전술 장비를 먼저 선택하세요.', 'warning');
            return;
        }
        this.openSalvageModal(Array.from(this.selectedEquipmentIds));
    }

    openSalvageModal(itemIds) {
        const uniqueIds = Array.from(new Set(Array.isArray(itemIds) ? itemIds : [itemIds])).filter(Boolean);
        if (uniqueIds.length === 0) {
            this.addLog('분해할 전술 장비가 없습니다.', 'warning');
            return;
        }
        const items = uniqueIds
            .map((id) => this.state.inventory.find((item) => item.id === id))
            .filter((item) => item && this.state.canSalvageItem(item));
        if (items.length === 0) {
            this.addLog('선택한 전술 장비를 분해할 수 없습니다.', 'warning');
            return;
        }
        this.pendingSalvageIds = items.map((item) => item.id);
        this.renderSalvageModal(items);
        if (UI.salvageModal) {
            UI.salvageModal.classList.add('is-open');
            UI.salvageModal.removeAttribute('hidden');
        }
        document.body.classList.add('modal-open');
    }

    renderSalvageModal(items) {
        const totals = items.reduce(
            (acc, item) => {
                const reward = this.state.calculateSalvageReward(item);
                acc.gold += reward.gold;
                acc.materials += reward.materials;
                return acc;
            },
            { gold: 0, materials: 0 },
        );
        if (UI.salvageModalList) {
            UI.salvageModalList.innerHTML = '';
            items.forEach((item) => {
                const entry = document.createElement('li');
                entry.className = 'modal__list-item';
                const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
                const type = EQUIPMENT_TYPE_MAP.get(item.type);
                const reward = this.state.calculateSalvageReward(item);
                const rarityLabel = rarity ? `[${rarity.name}] ` : '';
                const effectSummary = this.getEquipmentEffectDescriptions(item);
                const primaryValue = this.getPrimaryEquipmentEffectValue(item);
                const typeLabel = type?.label ?? '전술 장비';
                const fallbackOption = describeEquipmentEffect(item.type, primaryValue) ?? formatSignedPercent(primaryValue);
                const optionText = effectSummary.length > 0 ? effectSummary.join(' / ') : fallbackOption;
                entry.textContent = `${rarityLabel}${item.name} · ${typeLabel} · ${optionText} (재료 ${formatNumber(reward.materials)}개 / 골드 ${formatNumber(reward.gold)})`;
                UI.salvageModalList.appendChild(entry);
            });
        }
        if (UI.salvageModalCount) {
            UI.salvageModalCount.textContent = `선택된 장비 ${formatNumber(items.length)}개`;
        }
        if (UI.salvageModalRewards) {
            UI.salvageModalRewards.textContent = `강화 재료 ${formatNumber(totals.materials)}개 · 골드 ${formatNumber(totals.gold)}`;
        }
    }

    closeSalvageModal() {
        this.pendingSalvageIds = [];
        if (UI.salvageModal) {
            UI.salvageModal.classList.remove('is-open');
            UI.salvageModal.setAttribute('hidden', '');
        }
        document.body.classList.remove('modal-open');
    }

    isSalvageModalOpen() {
        return Boolean(UI.salvageModal?.classList.contains('is-open'));
    }

    confirmSalvage() {
        if (!this.pendingSalvageIds || this.pendingSalvageIds.length === 0) {
            this.closeSalvageModal();
            return;
        }
        const result = this.state.salvageEquipment(this.pendingSalvageIds);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            this.closeSalvageModal();
            this.renderEquipmentInventory();
            return;
        }
        const countText = formatNumber(result.count);
        const materialsText = formatNumber(result.materials);
        const goldText = formatNumber(result.gold);
        this.addLog(
            `전술 장비 ${countText}개를 분해하여 강화 재료 ${materialsText}개와 골드 ${goldText}을(를) 획득했습니다.`,
            'success',
        );
        this.handleMissionProgress('equipmentSalvage', result.count);
        result.items.forEach((item) => {
            this.selectedEquipmentIds.delete(item.id);
        });
        this.closeSalvageModal();
        this.renderEquipmentInventory();
        this.updateStats();
        saveGame(this.state);
    }

    handleKeyDown(event) {
        if (event.key !== 'Escape') {
            return;
        }
        if (this.isSalvageModalOpen()) {
            event.preventDefault();
            this.closeSalvageModal();
            return;
        }
        if (this.isMobileViewport() && this.isPanelOverlayOpen()) {
            event.preventDefault();
            this.closePanelOverlay();
        }
    }

    renderMissionUI() {
        if (!UI.missionList) return;
        UI.missionList.innerHTML = '';
        this.missionElements.clear();
        MISSIONS.forEach((mission) => {
            const entry = document.createElement('li');
            entry.className = 'mission';
            entry.dataset.missionId = mission.id;

            const header = document.createElement('div');
            header.className = 'mission__header';

            const title = document.createElement('h3');
            title.className = 'mission__title';
            title.textContent = mission.name;

            const status = document.createElement('span');
            status.className = 'mission__status';

            header.append(title, status);

            const desc = document.createElement('p');
            desc.className = 'mission__desc';
            desc.textContent = mission.description;

            const reward = document.createElement('div');
            reward.className = 'mission__reward';
            reward.textContent = `보상: ${this.formatMissionReward(mission.reward)}`;

            const progressWrapper = document.createElement('div');
            progressWrapper.className = 'mission__progress';

            const progressLabel = document.createElement('span');
            progressLabel.className = 'mission__progress-label';

            const progressBar = document.createElement('div');
            progressBar.className = 'mission__progress-bar';

            const progressFill = document.createElement('div');
            progressFill.className = 'mission__progress-fill';
            progressBar.appendChild(progressFill);

            progressWrapper.append(progressLabel, progressBar);

            const actions = document.createElement('div');
            actions.className = 'mission__actions';

            const button = document.createElement('button');
            button.className = 'btn btn-secondary mission__claim';
            button.type = 'button';
            button.dataset.missionId = mission.id;
            button.textContent = '보상 수령';

            actions.appendChild(button);

            entry.append(header, desc, reward, progressWrapper, actions);
            UI.missionList.appendChild(entry);

            this.missionElements.set(mission.id, {
                entry,
                status,
                progressLabel,
                progressFill,
                button,
            });
        });
        this.updateMissionUI();
    }

    updateMissionUI() {
        this.updateMissionSummary();
        MISSIONS.forEach((mission) => this.updateMissionEntry(mission));
        this.updateMissionEmptyState();
    }

    updateMissionSummary() {
        if (!UI.missionSummary) return;
        const total = MISSIONS.length;
        const completed = MISSIONS.filter((mission) => this.state.getMissionState(mission.id).completed).length;
        const claimed = MISSIONS.filter((mission) => this.state.getMissionState(mission.id).claimed).length;
        if (claimed >= total && total > 0) {
            UI.missionSummary.textContent = '모든 임무를 완료했습니다! 새로운 임무를 기다려 주세요.';
        } else {
            UI.missionSummary.textContent = `진행 중인 임무 ${formatNumber(total - claimed)}개 · 완료 ${formatNumber(
                completed,
            )}/${formatNumber(total)}`;
        }
    }

    updateMissionEntry(mission) {
        const elements = this.missionElements.get(mission.id);
        if (!elements) return;
        const state = this.state.getMissionState(mission.id);
        const progress = Math.min(mission.goal, state.progress ?? 0);
        const percent = mission.goal > 0 ? Math.min(100, (progress / mission.goal) * 100) : 0;
        elements.progressLabel.textContent = `${formatNumber(progress)}/${formatNumber(mission.goal)}`;
        elements.progressFill.style.width = `${percent}%`;
        const completed = Boolean(state.completed) || progress >= mission.goal;
        const claimed = Boolean(state.claimed);
        elements.entry.dataset.state = claimed ? 'claimed' : completed ? 'completed' : 'active';
        elements.status.textContent = claimed ? '수령 완료' : completed ? '보상 수령 가능' : '진행 중';
        elements.button.disabled = !completed || claimed;
        elements.button.textContent = claimed ? '수령 완료' : '보상 수령';
        elements.button.title = claimed
            ? '이미 보상을 수령했습니다.'
            : completed
            ? `보상: ${this.formatMissionReward(mission.reward)}`
            : '임무를 먼저 완료하세요.';
    }

    updateMissionEmptyState() {
        if (!UI.missionEmpty) return;
        const remaining = MISSIONS.some((mission) => !this.state.getMissionState(mission.id).claimed);
        UI.missionEmpty.style.display = remaining ? 'none' : 'block';
    }

    formatMissionReward(reward) {
        if (!reward) return '없음';
        const amountText = formatNumber(reward.amount ?? 0);
        switch (reward.type) {
            case 'gold':
                return `${amountText} 골드`;
            case 'gachaTokens':
                return `모집권 ${amountText}개`;
            case 'rebirthPoints':
                return `환생 포인트 ${amountText}P`;
            default:
                return '알 수 없는 보상';
        }
    }

    handleEquipmentInventoryClick(event) {
        const lockButton = event.target.closest('[data-lock-id]');
        if (lockButton) {
            const itemId = lockButton.dataset.lockId;
            if (!itemId) return;
            const result = this.state.toggleEquipmentLock(itemId);
            if (!result.success) {
                this.addLog(result.message, 'warning');
                return;
            }
            if (result.locked) {
                this.selectedEquipmentIds.delete(result.item.id);
            }
            const rarity = EQUIPMENT_RARITY_MAP.get(result.item.rarity);
            const prefix = rarity ? `[${rarity.name}] ` : '';
            const actionText = result.locked ? '잠금되었습니다.' : '잠금이 해제되었습니다.';
            this.addLog(`${prefix}${result.item.name}이(가) ${actionText}`, result.locked ? 'info' : 'success');
            this.renderEquipmentInventory();
            saveGame(this.state);
            return;
        }

        const salvageButton = event.target.closest('[data-salvage-id]');
        if (salvageButton) {
            const itemId = salvageButton.dataset.salvageId;
            if (!itemId) return;
            this.openSalvageModal([itemId]);
            return;
        }

        const upgradeButton = event.target.closest('[data-upgrade-id]');
        if (upgradeButton) {
            const itemId = upgradeButton.dataset.upgradeId;
            const result = this.state.upgradeEquipment(itemId);
            if (!result.success) {
                this.addLog(result.message, 'warning');
                return;
            }
            const rarity = EQUIPMENT_RARITY_MAP.get(result.item.rarity);
            const type = EQUIPMENT_TYPE_MAP.get(result.item.type);
            const prefix = rarity ? `[${rarity.name}] ` : '';
            const label = type?.label ?? '전술 장비';
            const previousLevel = result.previousLevel;
            const previousValueText = formatSignedPercent(result.previousValue);
            const currentPrimary = this.getPrimaryEquipmentEffectValue(result.item);
            const newValueText = formatSignedPercent(currentPrimary);
            const effectDetails = this.getEquipmentEffectDescriptions(result.item);
            const summaryText = effectDetails.length > 0 ? ` (옵션: ${effectDetails.join(' / ')})` : '';
            this.addLog(
                `${prefix}${result.item.name} 강화 성공! Lv. ${previousLevel} → ${result.item.level}, ${label} ${previousValueText} → ${newValueText}${summaryText}`,
                'success',
            );
            if (result.materialsSpent > 0) {
                const spentText = formatNumber(result.materialsSpent);
                const remainingText = formatNumber(this.state.upgradeMaterials);
                this.addLog(
                    `강화 재료 ${spentText}개를 사용했습니다. (보유 재료 ${remainingText}개)`,
                    'info',
                );
            }
            this.renderEquipmentSlots();
            this.renderEquipmentInventory();
            this.updateStats();
            this.updateHeroes();
            saveGame(this.state);
            return;
        }
        const button = event.target.closest('[data-equip-id]');
        if (!button) return;
        const itemId = button.dataset.equipId;
        const result = this.state.equipItem(itemId);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const type = EQUIPMENT_TYPE_MAP.get(result.item.type);
        const rarity = EQUIPMENT_RARITY_MAP.get(result.item.rarity);
        const prefix = rarity ? `[${rarity.name}] ` : '';
        const typeLabel = type?.label ?? '전술 장비';
        const effects = this.getEquipmentEffectDescriptions(result.item);
        const primaryValue = this.getPrimaryEquipmentEffectValue(result.item);
        const fallbackSummary = describeEquipmentEffect(result.item.type, primaryValue) ?? formatSignedPercent(primaryValue);
        const effectSummary = effects.length > 0 ? effects.join(' / ') : fallbackSummary;
        const bonusText = `${typeLabel} · ${effectSummary} · Lv. ${result.item.level}/${result.item.maxLevel}`;
        this.addLog(`${prefix}${result.item.name}을 장착했습니다. ${bonusText}`, 'success');
        if (result.previous && result.previous.id !== result.item.id) {
            const previousRarity = EQUIPMENT_RARITY_MAP.get(result.previous.rarity);
            const previousPrefix = previousRarity ? `[${previousRarity.name}] ` : '';
            this.addLog(
                `이전 전술 장비 ${previousPrefix}${result.previous.name} (Lv. ${result.previous.level}/${result.previous.maxLevel})은 인벤토리에 보관됩니다.`,
                'info',
            );
        }
        this.renderEquipmentSlots();
        this.renderEquipmentInventory();
        this.updateStats();
        this.updateHeroes();
    }

    handleMissionListClick(event) {
        const button = event.target.closest('.mission__claim');
        if (!button) return;
        const missionId = button.dataset.missionId;
        if (!missionId) return;
        this.handleMissionClaim(missionId);
    }

    handleMissionClaim(missionId) {
        const result = this.state.claimMissionReward(missionId);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const rewardText = this.formatMissionReward(result.reward);
        this.addLog(`임무 보상 수령: ${result.mission.name}! (${rewardText})`, 'success');
        this.updateMissionUI();
        this.updateStats();
        this.updateGachaUI();
        saveGame(this.state);
    }

    handleMissionProgress(trigger, amount = 1) {
        const completed = this.state.progressMissions(trigger, amount);
        this.updateMissionUI();
        if (completed.length === 0) return;
        completed.forEach(({ mission }) => {
            this.addLog(`임무 완료: ${mission.name}! 보상을 수령하세요.`, 'success');
        });
        saveGame(this.state);
    }

    handleRebirthSkillClick(event) {
        const button = event.target.closest('[data-skill-id]');
        if (!button) return;
        const skillId = button.dataset.skillId;
        const result = this.state.upgradeRebirthSkill(skillId);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const totalText = this.formatRebirthTotal(result.skill, result.level);
        this.addLog(`${result.skill.name} 레벨이 ${result.level}이 되었습니다! ${totalText}`, 'success');
        this.updateStats();
        saveGame(this.state);
    }

    handleRebirth() {
        const result = this.state.performRebirth();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const stageText = formatNumber(result.earnedFrom);
        const pointsText = formatNumber(result.pointsEarned);
        const totalPointsText = formatNumber(result.totalPoints);
        const rebirthCountText = formatNumber(result.rebirthCount);
        this.addLog(
            `${stageText}층까지 돌파하여 환생 포인트 ${pointsText}점을 획득했습니다! (보유 ${totalPointsText}P, 총 ${rebirthCountText}회)`,
            'success',
        );
        this.renderHeroes();
        this.updateUI();
        this.handleMissionProgress('rebirth', 1);
        saveGame(this.state);
    }

    handleEquipmentDrop(drop) {
        const { item, autoEquipped, replaced, baseChance, chance } = drop;
        const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
        const type = EQUIPMENT_TYPE_MAP.get(item.type);
        const prefix = rarity ? `[${rarity.name}] ` : '';
        const typeLabel = type?.label ?? '전술 장비';
        const effects = this.getEquipmentEffectDescriptions(item);
        const primaryValue = this.getPrimaryEquipmentEffectValue(item);
        const fallbackBonus = describeEquipmentEffect(item.type, primaryValue) ?? formatSignedPercent(primaryValue);
        const bonusSummary = effects.length > 0 ? effects.join(' / ') : fallbackBonus;
        const bonusText = `${typeLabel} · ${bonusSummary}`;
        const levelText = `Lv. ${item.level}/${item.maxLevel}`;
        const autoText = autoEquipped ? ' (자동 장착)' : '';
        const chanceDetail = this.buildChanceDetail('드롭 확률', baseChance, chance);
        const chanceText = chanceDetail ? ` (${chanceDetail})` : '';
        this.addLog(`${prefix}${item.name}을 획득했습니다! ${bonusText} · ${levelText}${autoText}${chanceText}`, 'success');
        if (autoEquipped && replaced) {
            const replacedRarity = EQUIPMENT_RARITY_MAP.get(replaced.rarity);
            const replacedPrefix = replacedRarity ? `[${replacedRarity.name}] ` : '';
            this.addLog(
                `기존 ${type?.label ?? '전술 장비'} ${replacedPrefix}${replaced.name} (Lv. ${replaced.level}/${replaced.maxLevel})이(가) 인벤토리로 이동했습니다.`,
                'info',
            );
        } else if (!autoEquipped) {
            this.addLog(`${type?.label ?? '전술 장비'}가 기존보다 약해 자동 장착되지 않았습니다.`, 'info');
        }
        this.renderEquipmentInventory();
        this.renderEquipmentSlots();
        this.updateStats();
        this.updateHeroes();
    }

    updateEnemy() {
        UI.enemyName.textContent = this.state.enemy.name;
        UI.enemyCurrentHp.textContent = formatNumber(this.state.enemy.hp);
        UI.enemyMaxHp.textContent = formatNumber(this.state.enemy.maxHp);
        const percentage = Math.max(0, (this.state.enemy.hp / this.state.enemy.maxHp) * 100);
        UI.enemyHealthBar.style.width = `${percentage}%`;
        const progressPercent = ((this.state.enemy.stage - 1) % 5) / 4;
        UI.stageProgressTrack.style.width = `${Math.min(100, progressPercent * 100)}%`;
    }

    updateStats() {
        UI.stage.textContent = this.state.enemy.stage;
        UI.gold.textContent = formatNumber(this.state.gold);
        if (UI.upgradeMaterials) {
            UI.upgradeMaterials.textContent = formatNumber(this.state.upgradeMaterials);
        }
        if (UI.clickDamage) {
            UI.clickDamage.textContent = formatNumber(this.state.expectedClickDamage);
        }
        UI.totalDps.textContent = formatNumber(this.state.totalDps);
        if (UI.critChance) {
            UI.critChance.textContent = formatPercent(this.state.clickCritChance);
        }
        if (UI.critMultiplier) {
            UI.critMultiplier.textContent = `${this.state.clickCritMultiplier.toFixed(2)}배`;
        }
        if (UI.upgradeClick) {
            const context = this.state.getClickUpgradeContext();
            UI.upgradeClick.textContent = `전술 교육 (${formatNumber(context.cost)} 골드)`;
            if (UI.upgradeClickInfo) {
                const infoParts = [];
                if (context.damageGain > 0) {
                    infoParts.push(`평균 피해 +${formatNumber(context.damageGain)}`);
                } else {
                    infoParts.push('평균 피해 증가 없음');
                }
                if (context.baseDamageGain > 0) {
                    infoParts.push(`기본 피해 +${formatNumber(context.baseDamageGain)}`);
                }
                if (context.goldGainPerSecond > 0) {
                    infoParts.push(`골드/초 +${formatNumber(context.goldGainPerSecond)}`);
                    const paybackText = this.formatPayback(context.paybackSeconds);
                    if (paybackText) {
                        infoParts.push(`예상 회수 ${paybackText}`);
                    }
                } else {
                    infoParts.push('ROI 계산 불가');
                }
                infoParts.push(`기준 ${context.assumedClicks}회/초 클릭`);
                UI.upgradeClickInfo.textContent = infoParts.join(' · ');
            }
        }
        if (UI.upgradeCritChance) {
            const context = this.state.getClickCritChanceUpgradeContext();
            if (context.canUpgrade) {
                UI.upgradeCritChance.textContent = `정밀 교정 (${formatNumber(context.cost)} 골드)`;
                UI.upgradeCritChance.disabled = false;
            } else {
                UI.upgradeCritChance.textContent = '정밀 교정 (최대)';
                UI.upgradeCritChance.disabled = true;
            }
            if (UI.upgradeCritChanceInfo) {
                const infoParts = [];
                infoParts.push(
                    `현재 ${formatPercent(context.currentChance)} → 다음 ${formatPercent(context.nextChance)}`,
                );
                if (context.canUpgrade) {
                    infoParts.push(`증가량 +${formatPercent(context.gain)}`);
                } else {
                    infoParts.push('이미 최대 강화');
                }
                UI.upgradeCritChanceInfo.textContent = infoParts.join(' · ');
            }
        }
        if (UI.upgradeCritDamage) {
            const context = this.state.getClickCritDamageUpgradeContext();
            if (context.canUpgrade) {
                UI.upgradeCritDamage.textContent = `탄두 연구 (${formatNumber(context.cost)} 골드)`;
                UI.upgradeCritDamage.disabled = false;
            } else {
                UI.upgradeCritDamage.textContent = '탄두 연구 (최대)';
                UI.upgradeCritDamage.disabled = true;
            }
            if (UI.upgradeCritDamageInfo) {
                const infoParts = [];
                infoParts.push(
                    `현재 ${context.currentMultiplier.toFixed(2)}배 → 다음 ${context.nextMultiplier.toFixed(2)}배`,
                );
                if (context.canUpgrade) {
                    infoParts.push(`증가량 +${context.gain.toFixed(2)}배`);
                } else {
                    infoParts.push('이미 최대 강화');
                }
                UI.upgradeCritDamageInfo.textContent = infoParts.join(' · ');
            }
        }
        if (UI.upgradeHeroDps) {
            const context = this.state.getHeroDpsUpgradeContext();
            UI.upgradeHeroDps.textContent = `지휘 과정 (${formatNumber(context.cost)} 골드)`;
            UI.upgradeHeroDps.disabled = false;
            if (UI.upgradeHeroDpsInfo) {
                const infoParts = [];
                infoParts.push(
                    `지원 보너스 ${formatPercent(context.currentBonus)} → ${formatPercent(context.nextBonus)}`,
                );
                infoParts.push(
                    `총 배율 ${context.currentMultiplier.toFixed(2)}배 → ${context.nextMultiplier.toFixed(2)}배`,
                );
                UI.upgradeHeroDpsInfo.textContent = infoParts.join(' · ');
            }
        }
        this.updateEquipmentSummary();
        this.updateRebirthUI();
    }

    updateFrenzyUI() {
        const now = Date.now();
        const remainingCooldown = Math.max(0, this.state.frenzyCooldown - now);
        if (this.state.isFrenzyActive) {
            const secondsLeft = ((this.state.frenzyActiveUntil - now) / 1000).toFixed(1);
            UI.skillCooldown.textContent = `전술 지원 지속: ${secondsLeft}s`;
            UI.skillFrenzy.disabled = true;
        } else if (remainingCooldown > 0) {
            const seconds = Math.ceil(remainingCooldown / 1000);
            UI.skillCooldown.textContent = `재가동까지: ${seconds}s`;
            UI.skillFrenzy.disabled = true;
        } else {
            UI.skillCooldown.textContent = '지원 가능';
            UI.skillFrenzy.disabled = false;
        }
    }

    updateBossTimerUI() {
        if (!UI.bossTimer) return;
        if (!this.state.isBossStage()) {
            UI.bossTimer.textContent = '';
            UI.bossTimer.classList.remove('boss-timer--visible', 'boss-timer--warning');
            return;
        }
        UI.bossTimer.classList.add('boss-timer--visible');
        const deadline = this.state.bossDeadline;
        if (!deadline) {
            UI.bossTimer.textContent = '보스 제한시간 준비 중...';
            UI.bossTimer.classList.remove('boss-timer--warning');
            return;
        }
        const remaining = Math.max(0, deadline - Date.now());
        const seconds = (remaining / 1000).toFixed(1);
        UI.bossTimer.textContent = `보스 제한시간: ${seconds}s`;
        if (remaining <= BOSS_WARNING_THRESHOLD) {
            UI.bossTimer.classList.add('boss-timer--warning');
        } else {
            UI.bossTimer.classList.remove('boss-timer--warning');
        }
    }

    updateBossControls() {
        const controls = UI.bossControls;
        if (!controls) return;
        const canRetreat = this.state.canRetreatFromBoss();
        const canAdvance = this.state.canAdvanceToNextBossStage();
        if (UI.bossRetreat) {
            UI.bossRetreat.disabled = !canRetreat;
        }
        if (UI.bossAdvance) {
            UI.bossAdvance.disabled = !canAdvance;
        }
        const visible = canRetreat || canAdvance;
        controls.classList.toggle('boss-controls--visible', visible);
        controls.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    updateUI() {
        this.updateStats();
        this.updateMissionUI();
        this.updateGachaUI();
        this.updateHeroes();
        this.updateHeroSetBonuses();
        this.updateEnemy();
        this.updateFrenzyUI();
        this.updateBossTimerUI();
        this.updateBossControls();
    }

    handleTap() {
        const { damage, defeated, critical } = this.state.applyClick();
        this.showDamageIndicator(damage, critical);
        if (defeated) {
            this.handleEnemyDefeat();
        }
        this.updateUI();
    }

    showDamageIndicator(damage, isCritical = false) {
        const indicator = UI.damageIndicator;
        indicator.textContent = isCritical
            ? `치명타! -${formatNumber(damage)}`
            : `-${formatNumber(damage)}`;
        indicator.classList.toggle('damage-indicator--crit', isCritical);
        indicator.style.opacity = '1';
        const startTransform = isCritical ? 'translate(-50%, -60%) scale(1.1)' : 'translate(-50%, -60%)';
        indicator.style.transform = startTransform;
        setTimeout(() => {
            indicator.style.opacity = '0';
            const endTransform = isCritical
                ? 'translate(-50%, -40%) scale(1.05)'
                : 'translate(-50%, -40%)';
            indicator.style.transform = endTransform;
        }, 180);
    }

    handleEnemyDefeat() {
        const previousBest = this.state.currentRunHighestStage;
        const { reward, drop, gacha, defeatedStage } = this.state.goNextEnemy();
        this.addLog(`스테이지 ${defeatedStage}의 적을 처치하고 ${formatNumber(reward)} 골드를 획득했습니다!`);
        if (drop) {
            this.handleEquipmentDrop(drop);
        }
        if (gacha) {
            const chanceDetail = this.buildChanceDetail('드롭 확률', gacha.baseChance, gacha.chance);
            const chanceText = chanceDetail ? ` (${chanceDetail})` : '';
            const sourceText = gacha.isBoss ? '보스 제압 보상으로' : '적 전리품에서';
            this.addLog(
                `${sourceText} 모집권 ${gacha.amount.toLocaleString('ko-KR')}개를 확보했습니다!${chanceText}`,
                'success',
            );
            this.updateGachaUI();
        }
        if (this.state.isBossStage()) {
            this.addLog(
                `${this.state.enemy.stage}층 보스 등장! ${BOSS_TIME_LIMIT_SECONDS}초 안에 처치하세요!`,
                'warning',
            );
        }
        if (previousBest < REBIRTH_STAGE_REQUIREMENT && defeatedStage >= REBIRTH_STAGE_REQUIREMENT) {
            this.addLog('환생의 기운이 깨어났습니다! 환생 메뉴에서 포인트를 획득하세요.', 'success');
        }
        this.handleMissionProgress('enemyDefeat', 1);
    }

    handleBossRetreat() {
        const result = this.state.retreatFromBoss();
        if (!result.success) {
            if (result.message) {
                this.addLog(result.message, 'warning');
            }
            return;
        }
        this.addLog(
            `${result.bossStage}층 보스에서 퇴각합니다. 전열을 재정비하기 위해 ${result.fallbackStage}층으로 이동합니다.`,
            'warning',
        );
        this.updateUI();
        saveGame(this.state);
    }

    handleBossAdvance() {
        const result = this.state.advanceToNextBossStage();
        if (!result.success) {
            if (result.message) {
                this.addLog(result.message, 'warning');
            }
            return;
        }
        this.addLog(
            `${result.fromStage}층을 넘어 ${result.bossStage}층 보스로 즉시 돌입합니다!`,
            'success',
        );
        this.updateUI();
        saveGame(this.state);
    }

    handleClickUpgrade() {
        const context = this.state.getClickUpgradeContext();
        const result = this.state.levelUpClick();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const detailParts = [];
        if (context.damageGain > 0) {
            detailParts.push(`평균 피해 +${formatNumber(context.damageGain)}`);
        }
        if (context.baseDamageGain > 0) {
            detailParts.push(`기본 피해 +${formatNumber(context.baseDamageGain)}`);
        }
        if (context.goldGainPerSecond > 0) {
            const paybackText = this.formatPayback(context.paybackSeconds);
            if (paybackText) {
                detailParts.push(`ROI ${paybackText}`);
            }
        }
        const detailText = detailParts.length > 0 ? ` (${detailParts.join(' · ')})` : '';
        this.addLog(`전술 교육 프로그램 레벨이 ${this.state.clickLevel}이 되었습니다!${detailText}`, 'success');
        this.updateStats();
    }

    handleClickCritChanceUpgrade() {
        const result = this.state.levelUpClickCritChance();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const previousText = formatPercent(result.previousChance);
        const newText = formatPercent(result.newChance);
        this.addLog(
            `정밀 사격 교정 레벨이 ${this.state.clickCritChanceLevel}이 되었습니다! (치명타 확률 ${previousText} → ${newText})`,
            'success',
        );
        this.updateStats();
    }

    handleClickCritDamageUpgrade() {
        const result = this.state.levelUpClickCritDamage();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const previousText = `${result.previousMultiplier.toFixed(2)}배`;
        const newText = `${this.state.clickCritMultiplier.toFixed(2)}배`;
        this.addLog(
            `특수 탄두 연구 레벨이 ${this.state.clickCritDamageLevel}이 되었습니다! (치명타 배율 ${previousText} → ${newText})`,
            'success',
        );
        this.updateStats();
    }

    handleHeroDpsUpgrade() {
        const result = this.state.levelUpHeroDps();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const previousText = formatPercent(result.previousBonus);
        const newText = formatPercent(this.state.heroTrainingBonus);
        this.addLog(
            `지원 화력 지휘 과정 레벨이 ${this.state.heroDpsLevel}이 되었습니다! (보너스 ${previousText} → ${newText})`,
            'success',
        );
        this.updateStats();
    }

    handleGachaRoll(count) {
        const result = this.state.rollGacha(count);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            this.updateGachaUI();
            return;
        }
        if (result.results.length === 0) {
            this.addLog('모집 결과가 없습니다.', 'info');
            this.updateGachaUI();
            return;
        }
        this.addGachaResults(result.results);
        result.results.forEach((entry) => {
            const rarityLabel = `[${entry.hero.rarityName}]`;
            if (entry.isNew) {
                this.addLog(
                    `[가챠] ${rarityLabel} ${entry.hero.name} 합류! Lv. ${entry.newLevel} (초회)`,
                    'success',
                );
            } else {
                this.addLog(
                    `[가챠] ${rarityLabel} ${entry.hero.name} 강화! Lv. ${entry.previousLevel} → ${entry.newLevel} (+${entry.levelGain})`,
                    'info',
                );
            }
            if (Array.isArray(entry.unlockedSkins) && entry.unlockedSkins.length > 0) {
                entry.unlockedSkins.forEach((skin) => {
                    this.addLog(`🎨 ${entry.hero.name} - ${skin.name} 스킨 해금! (필요 Lv. ${skin.requiredLevel})`, 'success');
                });
            }
        });
        this.renderHeroes();
        this.updateStats();
        this.updateGachaUI();
        this.handleMissionProgress('gachaRoll', result.count);
        saveGame(this.state);
    }

    addGachaResults(entries) {
        if (!UI.gachaResults) return;
        entries.forEach((entry) => {
            const item = document.createElement('li');
            item.dataset.resultType = entry.isNew ? 'new' : 'duplicate';
            item.dataset.rarity = entry.hero.rarityId;

            const header = document.createElement('div');
            header.className = 'gacha-result__header';

            const rarity = document.createElement('span');
            rarity.className = 'gacha-result__rarity rarity-badge';
            rarity.textContent = entry.hero.rarityName;

            const name = document.createElement('span');
            name.className = 'gacha-result__name';
            name.textContent = entry.hero.name;

            const state = document.createElement('span');
            state.className = 'gacha-result__state';
            state.textContent = entry.isNew ? '신규 합류' : '강화 성공';

            header.append(rarity, name, state);

            const detail = document.createElement('span');
            detail.className = 'gacha-result__detail';
            if (entry.isNew) {
                detail.textContent = `초회 획득 Lv. ${entry.newLevel}`;
                item.title = `희귀도 ${entry.hero.rarityName} · 초회 Lv. ${entry.newLevel}`;
            } else {
                detail.textContent = `Lv. ${entry.previousLevel} → ${entry.newLevel} (+${entry.levelGain})`;
                item.title = `희귀도 ${entry.hero.rarityName} · 중복 +${entry.levelGain} 레벨`;
            }

            item.append(header, detail);
            if (Array.isArray(entry.unlockedSkins) && entry.unlockedSkins.length > 0) {
                const skins = document.createElement('ul');
                skins.className = 'gacha-result__skins';
                entry.unlockedSkins.forEach((skin) => {
                    const skinItem = document.createElement('li');
                    skinItem.className = 'gacha-result__skin';
                    skinItem.textContent = `${skin.name} 스킨 해금 (필요 Lv. ${skin.requiredLevel})`;
                    skins.appendChild(skinItem);
                });
                item.appendChild(skins);
            }
            UI.gachaResults.prepend(item);
        });
        const maxEntries = 12;
        while (UI.gachaResults.children.length > maxEntries) {
            UI.gachaResults.removeChild(UI.gachaResults.lastChild);
        }
        this.updateGachaHistoryVisibility();
    }

    updateGachaHistoryVisibility() {
        if (!UI.gachaResultsEmpty) return;
        const hasEntries = (UI.gachaResults?.children.length ?? 0) > 0;
        UI.gachaResultsEmpty.style.display = hasEntries ? 'none' : 'block';
    }

    clearGachaResults() {
        if (UI.gachaResults) {
            UI.gachaResults.innerHTML = '';
        }
        this.updateGachaHistoryVisibility();
    }

    updateGachaUI() {
        const tokenText = this.state.gachaTokens.toLocaleString('ko-KR');
        if (UI.gachaTokens) {
            UI.gachaTokens.textContent = tokenText;
        }
        if (UI.gachaTokensHeader) {
            UI.gachaTokensHeader.textContent = tokenText;
        }
        const gachaBonus = this.state.gachaDropBonus ?? 0;
        const normalChance = clampProbability(GACHA_TOKEN_NORMAL_DROP_CHANCE + gachaBonus);
        const bossChance = clampProbability(GACHA_TOKEN_BOSS_DROP_CHANCE + gachaBonus);
        const normalDetail = this.buildChanceDetail(
            '일반 모집권 드롭 확률',
            GACHA_TOKEN_NORMAL_DROP_CHANCE,
            normalChance,
        );
        const bossDetail = this.buildChanceDetail(
            '보스 모집권 드롭 확률',
            GACHA_TOKEN_BOSS_DROP_CHANCE,
            bossChance,
        );
        const chanceDetail = [normalDetail, bossDetail].filter(Boolean).join('\n');
        if (UI.gachaTokens) {
            UI.gachaTokens.title = chanceDetail || '모집권 드롭 정보 없음';
        }
        if (UI.gachaTokensHeader) {
            UI.gachaTokensHeader.title = chanceDetail || '모집권 드롭 정보 없음';
        }
        if (UI.gachaSingle) {
            UI.gachaSingle.disabled = this.state.gachaTokens < GACHA_SINGLE_COST;
        }
        if (UI.gachaTen) {
            UI.gachaTen.disabled = this.state.gachaTokens < GACHA_MULTI_COST;
        }
    }

    toggleHeroSort() {
        this.sortState = this.sortState === 'level' ? 'dps' : 'level';
        this.state.sortOrder = this.sortState;
        this.renderHeroes();
        this.updateSortButton();
    }

    updateSortButton() {
        const label = this.sortState === 'level' ? '레벨 순' : 'DPS 순';
        UI.sortHeroes.textContent = `정렬 순서 변경 (${label})`;
    }

    addLog(message, type = 'info') {
        const entry = document.createElement('li');
        entry.textContent = message;
        entry.dataset.type = type;
        UI.log.prepend(entry);
        const maxLogs = 40;
        while (UI.log.children.length > maxLogs) {
            UI.log.removeChild(UI.log.lastChild);
        }
    }

    handleBossTimerTick() {
        const result = this.state.checkBossTimeout();
        if (result) {
            this.addLog(
                `${result.failedStage}층 보스를 ${BOSS_TIME_LIMIT_SECONDS}초 안에 처치하지 못했습니다. ${result.revertedStage}층으로 후퇴합니다.`,
                'warning',
            );
            this.updateUI();
            return;
        }
        this.updateBossTimerUI();
        this.updateBossControls();
    }

    startLoops() {
        this.damageLoop = setInterval(() => this.applyDps(), 250);
        this.saveLoop = setInterval(() => this.autoSave(), 10000);
        this.frenzyLoop = setInterval(() => this.updateFrenzyUI(), 200);
        this.bossTimerLoop = setInterval(() => this.handleBossTimerTick(), 100);
        this.handleBossTimerTick();
    }

    applyDps() {
        const dps = this.state.totalDps;
        if (dps <= 0) return;
        const damage = dps / 4; // 250ms 마다 호출되므로 4로 나눔
        const defeated = this.state.enemy.applyDamage(damage);
        if (defeated) {
            this.handleEnemyDefeat();
        }
        this.updateEnemy();
        this.updateStats();
        this.updateGachaUI();
        this.updateHeroes();
        this.updateBossTimerUI();
        this.updateBossControls();
    }

    useFrenzy() {
        const now = Date.now();
        if (this.state.frenzyCooldown > now || this.state.isFrenzyActive) {
            this.addLog('아로나의 전술 지원은 아직 준비되지 않았습니다.', 'warning');
            return;
        }
        const baseDuration = 15000; // 15초 기본 지속
        const cooldown = 60000; // 60초 쿨타임
        const duration = Math.floor(baseDuration * (1 + this.state.skillBonus));
        const multiplier = this.state.frenzyMultiplier;
        this.state.frenzyActiveUntil = now + duration;
        this.state.frenzyCooldown = now + cooldown;
        this.addLog(
            `아로나의 전술 지원 발동! ${(duration / 1000).toFixed(1)}초 동안 DPS가 ${multiplier.toFixed(1)}배입니다!`,
            'success',
        );
        this.updateFrenzyUI();
        this.updateStats();
    }

    autoSave() {
        saveGame(this.state);
    }

    manualSave() {
        saveGame(this.state);
        this.addLog('진행 상황이 저장되었습니다.', 'success');
    }

    resetGame() {
        if (!confirm('정말로 진행 상황을 초기화할까요?')) return;
        this.state.reset();
        this.clearGachaResults();
        this.renderHeroes();
        this.renderEquipmentUI();
        this.renderMissionUI();
        this.renderRebirthUI();
        this.updateUI();
        saveGame(this.state);
        this.addLog('게임이 초기화되었습니다.', 'warning');
    }
}

const STORAGE_KEY = 'tap-titan-web-save';

const saveGame = (state) => {
    try {
        const serialized = JSON.stringify(state.toJSON());
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        console.error('저장 실패', error);
    }
};

const loadGame = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error('저장 데이터를 불러올 수 없습니다.', error);
        return null;
    }
};

const init = () => {
    const saved = loadGame();
    const state = new GameState(saved);
    const ui = new GameUI(state);

    window.addEventListener('beforeunload', () => {
        saveGame(state);
    });

    // 오프라인 진행 계산
    if (saved?.lastSave) {
        const elapsed = Math.floor((Date.now() - saved.lastSave) / 1000);
        if (elapsed > 5) {
            const offlineGold = Math.floor(state.totalDps * elapsed * 0.25 * (1 + state.goldBonus));
            if (offlineGold > 0) {
                state.gold += offlineGold;
                ui.addLog(`오프라인 동안 ${elapsed}초가 지났습니다. ${formatNumber(offlineGold)} 골드를 획득했습니다!`);
                ui.updateUI();
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', init);
