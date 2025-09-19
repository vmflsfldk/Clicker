export const ENEMY_STAGE_INTERVAL = 5;

export const ENEMY_NAME_POOLS = {
    normal: [
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
    ],
    boss: [
        '하코네 전술 골렘',
        '특수 자동포탑',
        '모의 메카니카',
        '연합 실전 검증기',
        '고출력 전술 요새',
        '절차 통제 프로토타입',
        '네트워크 통합 지휘기',
        '종합 전술 모의체',
    ],
};

const DEFAULT_STAGE_MODIFIERS = {
    hpMultiplier: 1,
    rewardMultiplier: 1,
    goldBonus: 0,
    equipmentDropBonus: 0,
    gachaDropBonus: 0,
};

export const DEFAULT_STAGE_GIMMICK = {
    id: 'default',
    type: 'normal',
    icon: '🎯',
    label: '표준 훈련',
    description: '현재 구간에는 특별한 효과가 없습니다.',
    effects: [],
    highlight: false,
    alert: 'info',
    modifiers: { ...DEFAULT_STAGE_MODIFIERS },
};

export const ENEMY_STAGE_SEGMENTS = [
    {
        id: 'supply-lane',
        type: 'normal',
        namePool: 'normal',
        offsets: [0, 1],
        icon: '📦',
        label: '보급 강화 구간',
        description: '보급로가 안정되어 장비 보급이 크게 늘어납니다.',
        effects: ['장비 드롭 확률 +25%'],
        highlight: true,
        alert: 'boost',
        modifiers: {
            equipmentDropBonus: 0.25,
        },
    },
    {
        id: 'finance-boost',
        type: 'normal',
        namePool: 'normal',
        offsets: [2, 3],
        icon: '💰',
        label: '재정 집중 구간',
        description: '학원 재무실이 추가 지원을 약속했습니다.',
        effects: ['골드 보상 +35%', '모집권 드롭 확률 +6%'],
        highlight: true,
        alert: 'boost',
        modifiers: {
            rewardMultiplier: 1.35,
            gachaDropBonus: 0.06,
        },
    },
    {
        id: 'boss-overclock',
        type: 'boss',
        namePool: 'boss',
        offsets: [4],
        icon: '⚠️',
        label: '위협 등급 상승',
        description: '강화된 모의 보스가 출현했습니다. 시간 내 제압이 필수입니다.',
        effects: ['보스 체력 +50%', '보상 2.2배', '모집권 드롭 확률 +18%'],
        highlight: true,
        alert: 'warning',
        modifiers: {
            hpMultiplier: 1.5,
            rewardMultiplier: 2.2,
            gachaDropBonus: 0.18,
            equipmentDropBonus: 0.18,
        },
    },
];

const sanitizeModifiers = (rawModifiers = {}) => {
    const modifiers = { ...DEFAULT_STAGE_MODIFIERS };
    Object.entries(rawModifiers).forEach(([key, value]) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return;
        if (key === 'hpMultiplier' || key === 'rewardMultiplier') {
            modifiers[key] = Math.max(0, numeric);
            return;
        }
        modifiers[key] = numeric;
    });
    return modifiers;
};

const normalizeStage = (stage) => {
    const numeric = Number(stage);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(1, Math.floor(numeric));
};

const findStageSegment = (stage) => {
    const normalized = normalizeStage(stage);
    const offset = (normalized - 1) % ENEMY_STAGE_INTERVAL;
    return (
        ENEMY_STAGE_SEGMENTS.find((segment) => {
            if (Array.isArray(segment.offsets)) {
                return segment.offsets.includes(offset);
            }
            if (Array.isArray(segment.offsetRange) && segment.offsetRange.length === 2) {
                const [start, end] = segment.offsetRange;
                return offset >= start && offset <= end;
            }
            return false;
        }) ?? null
    );
};

export const getEnemyStageGimmick = (stage) => {
    const segment = findStageSegment(stage);
    if (!segment) {
        return {
            ...DEFAULT_STAGE_GIMMICK,
            modifiers: { ...DEFAULT_STAGE_GIMMICK.modifiers },
        };
    }
    const { offsets, offsetRange, modifiers, ...rest } = segment;
    return {
        ...rest,
        modifiers: sanitizeModifiers(modifiers),
    };
};

export const getEnemyStageModifiers = (stage) => {
    const gimmick = getEnemyStageGimmick(stage);
    return { ...gimmick.modifiers };
};

export const getEnemyNameForStage = (stage, gimmick = null, pools = ENEMY_NAME_POOLS) => {
    const normalized = normalizeStage(stage);
    const poolKey = gimmick?.namePool ?? (gimmick?.type === 'boss' ? 'boss' : null);
    const isBossStage = poolKey === 'boss' || normalized % ENEMY_STAGE_INTERVAL === 0;
    const pool = isBossStage ? pools.boss ?? [] : pools.normal ?? [];
    if (!Array.isArray(pool) || pool.length === 0) {
        return isBossStage ? '미지의 적 (보스)' : '미지의 적';
    }
    if (isBossStage) {
        const bossIndex = Math.max(0, Math.floor((normalized - 1) / ENEMY_STAGE_INTERVAL));
        const index = bossIndex % pool.length;
        return `${pool[index]} (보스)`;
    }
    const index = (normalized - 1) % pool.length;
    return pool[index];
};
