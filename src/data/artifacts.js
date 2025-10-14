export const ARTIFACT_EFFECT_TYPES = {
    RELIC_GAIN: 'relicGain',
    GOLD: 'gold',
    BOSS_GOLD: 'bossGold',
    TAP: 'tap',
    HERO: 'hero',
    SKILL: 'skill',
};

export const ARTIFACTS = [
    {
        id: 'bookOfShadows',
        name: 'Book of Shadows',
        icon: '📘',
        description: '프레스티지로 얻는 유물 조각이 크게 증가합니다.',
        effectType: ARTIFACT_EFFECT_TYPES.RELIC_GAIN,
        baseEffect: 0.25,
        effectGrowth: 0.12,
        baseCost: 5,
        costGrowth: 1.45,
        format: 'percent',
    },
    {
        id: 'heartOfMidas',
        name: 'Heart of Midas',
        icon: '💛',
        description: '모든 전투 골드가 증가합니다.',
        effectType: ARTIFACT_EFFECT_TYPES.GOLD,
        baseEffect: 0.18,
        effectGrowth: 0.08,
        baseCost: 12,
        costGrowth: 1.5,
        format: 'percent',
    },
    {
        id: 'chestersonChance',
        name: 'Chesterson Chance',
        icon: '🗝️',
        description: '보스 토벌 시 추가 보상을 기대할 수 있습니다.',
        effectType: ARTIFACT_EFFECT_TYPES.BOSS_GOLD,
        baseEffect: 0.35,
        effectGrowth: 0.12,
        baseCost: 18,
        costGrowth: 1.55,
        format: 'percent',
    },
    {
        id: 'fairyCharm',
        name: 'Fairy Charm',
        icon: '🪄',
        description: '전술 스킬의 효과가 강화됩니다.',
        effectType: ARTIFACT_EFFECT_TYPES.SKILL,
        baseEffect: 0.14,
        effectGrowth: 0.06,
        baseCost: 20,
        costGrowth: 1.6,
        format: 'percent',
    },
    {
        id: 'clanBanner',
        name: 'Clan Ship Banner',
        icon: '🚢',
        description: '클랜 함포 지원과 학생들의 지원 화력이 증가합니다.',
        effectType: ARTIFACT_EFFECT_TYPES.HERO,
        baseEffect: 0.16,
        effectGrowth: 0.07,
        baseCost: 24,
        costGrowth: 1.62,
        format: 'percent',
    },
    {
        id: 'shadowSigil',
        name: 'Shadow Sigil',
        icon: '🗡️',
        description: '그림자 분신과 탭 피해 계수가 상승합니다.',
        effectType: ARTIFACT_EFFECT_TYPES.TAP,
        baseEffect: 0.12,
        effectGrowth: 0.05,
        baseCost: 16,
        costGrowth: 1.58,
        format: 'percent',
    },
];

export const ARTIFACT_MAP = new Map(ARTIFACTS.map((artifact) => [artifact.id, artifact]));

export const clampArtifactLevel = (level) => {
    if (!Number.isFinite(level)) return 0;
    return Math.max(0, Math.floor(level));
};

export const getArtifactEffectValue = (artifact, level = 0) => {
    if (!artifact) return 0;
    const normalized = clampArtifactLevel(level);
    if (normalized <= 0) return 0;
    const additionalLevels = Math.max(0, normalized - 1);
    const base = Number.isFinite(artifact.baseEffect) ? artifact.baseEffect : 0;
    const growth = Number.isFinite(artifact.effectGrowth) ? artifact.effectGrowth : 0;
    return Math.max(0, base + additionalLevels * growth);
};

export const getArtifactUpgradeCost = (artifact, level = 0) => {
    if (!artifact) return Infinity;
    const normalized = clampArtifactLevel(level);
    const exponent = Math.max(0, normalized);
    const baseCost = Number.isFinite(artifact.baseCost) ? Math.max(1, Math.floor(artifact.baseCost)) : 1;
    const growth = Number.isFinite(artifact.costGrowth) ? Math.max(1, artifact.costGrowth) : 1;
    return Math.max(1, Math.floor(baseCost * Math.pow(growth, exponent)));
};

export const formatArtifactEffectValue = (artifact, value) => {
    if (!artifact) return '효과 없음';
    if (artifact.format === 'percent') {
        return `${(value * 100).toFixed(1)}%`;
    }
    return value.toLocaleString('ko-KR');
};
