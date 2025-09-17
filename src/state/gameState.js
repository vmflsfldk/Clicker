import {
    HERO_SET_BONUSES,
    HERO_TRAIT_GROUPS,
    HERO_TRAIT_TYPES,
    HERO_RARITIES,
    defaultHeroes,
} from '../data/heroes.js';
import {
    EQUIPMENT_EFFECTS,
    EQUIPMENT_TYPES,
    EQUIPMENT_BASE_NAMES,
    EQUIPMENT_RARITIES,
    EQUIPMENT_MAX_VALUE,
    EQUIPMENT_UPGRADE_RATE,
    EQUIPMENT_DROP_CHANCE,
    EQUIPMENT_BOSS_DROP_CHANCE,
} from '../data/equipment.js';
import { MISSIONS } from '../data/missions.js';
import { REBIRTH_EFFECT_LABELS, REBIRTH_SKILLS } from '../data/rebirth.js';
import { formatNumber } from '../utils/format.js';

const HERO_TRAIT_GROUP_MAP = new Map(HERO_TRAIT_GROUPS.map((group) => [group.id, group]));
const HERO_TRAIT_MAP = HERO_TRAIT_GROUPS.reduce((acc, group) => {
    acc[group.id] = new Map(group.traits.map((trait) => [trait.id, trait]));
    return acc;
}, {});
const HERO_RARITY_MAP = new Map(HERO_RARITIES.map((rarity) => [rarity.id, rarity]));
const DEFAULT_HERO_RARITY_ID = 'common';

const EQUIPMENT_EFFECT_MAP = new Map(EQUIPMENT_EFFECTS.map((effect) => [effect.id, effect]));
const EQUIPMENT_TYPE_MAP = new Map(EQUIPMENT_TYPES.map((type) => [type.id, type]));
const EQUIPMENT_RARITY_MAP = new Map(EQUIPMENT_RARITIES.map((rarity) => [rarity.id, rarity]));
const MISSION_MAP = new Map(MISSIONS.map((mission) => [mission.id, mission]));

const BOSS_STAGE_INTERVAL = 5;
const BOSS_TIME_LIMIT = 30000;
const BOSS_TIME_LIMIT_SECONDS = Math.floor(BOSS_TIME_LIMIT / 1000);
const BOSS_WARNING_THRESHOLD = 5000;

const REBIRTH_STAGE_REQUIREMENT = 100;

const GACHA_SINGLE_COST = 1;
const GACHA_MULTI_COUNT = 10;
const GACHA_MULTI_COST = 9;
const GACHA_TOKEN_NORMAL_DROP_CHANCE = 0.02;
const GACHA_TOKEN_BOSS_DROP_CHANCE = 0.35;

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

const REBIRTH_SKILL_MAP = new Map(REBIRTH_SKILLS.map((skill) => [skill.id, skill]));
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

export class Hero {
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
            image: skin.image ?? null,
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
                image: typeof definition.image === 'string' ? definition.image : null,
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
                image: null,
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

export class Enemy {
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

export class GameState {
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

export {
    HERO_TRAIT_GROUP_MAP,
    HERO_TRAIT_MAP,
    HERO_RARITY_MAP,
    DEFAULT_HERO_RARITY_ID,
    EQUIPMENT_EFFECT_MAP,
    EQUIPMENT_TYPE_MAP,
    EQUIPMENT_RARITY_MAP,
    BOSS_STAGE_INTERVAL,
    BOSS_TIME_LIMIT,
    BOSS_TIME_LIMIT_SECONDS,
    BOSS_WARNING_THRESHOLD,
    REBIRTH_STAGE_REQUIREMENT,
    GACHA_SINGLE_COST,
    GACHA_MULTI_COUNT,
    GACHA_MULTI_COST,
    GACHA_TOKEN_NORMAL_DROP_CHANCE,
    GACHA_TOKEN_BOSS_DROP_CHANCE,
    CLICK_UPGRADE_CONFIG,
    CLICK_CRIT_CHANCE_UPGRADE_CONFIG,
    CLICK_CRIT_DAMAGE_UPGRADE_CONFIG,
    HERO_DPS_UPGRADE_CONFIG,
    STAGE_REWARD_CONFIG,
    calculateClickUpgradeCost,
    calculateScalingUpgradeCost,
    calculateClickDamageAtLevel,
    calculateStageRewardValue,
    calculateStageReward,
    calculateRebirthPoints,
    generateEquipmentName,
    generateEquipmentItem,
    clampEquipmentValue,
    calculateEquipmentValue,
    clampProbability,
    randomFromArray,
    randomInt,
    weightedRandom,
    chooseRarity,
};
