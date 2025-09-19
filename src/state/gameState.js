import {
    HERO_SET_BONUSES,
    HERO_TRAIT_GROUPS,
    HERO_TRAIT_TYPES,
    HERO_RARITIES,
    HERO_BOND_EXP_REQUIREMENTS,
    HERO_BOND_MAX_LEVEL,
    HERO_BOND_REWARDS,
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
import { MISSIONS, MISSION_GROUPS } from '../data/missions.js';
import {
    REBIRTH_EFFECT_LABELS,
    REBIRTH_TREE,
    REBIRTH_NODES,
    REBIRTH_NODE_MAP,
    REBIRTH_BRANCHES,
    REBIRTH_BRANCH_MAP,
} from '../data/rebirth.js';
import {
    SKILLS,
    SKILL_EFFECT_TYPES,
    SKILL_MAP,
    DEFAULT_SKILL_LEVEL,
    getSkillLevelConfig,
    getSkillLevelDefinition,
    getSkillUpgradeCost as getSkillUpgradeCostValue,
} from '../data/skills.js';
import {
    ENEMY_STAGE_INTERVAL,
    ENEMY_NAME_POOLS,
    getEnemyStageGimmick,
    getEnemyNameForStage,
} from '../data/enemies.js';
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
const MISSION_GROUP_MAP = new Map(MISSION_GROUPS.map((group) => [group.id, group]));
const MISSION_MAP = new Map(MISSIONS.map((mission) => [mission.id, mission]));

const BOSS_STAGE_INTERVAL = ENEMY_STAGE_INTERVAL;
const BOSS_TIME_LIMIT = 30000;
const BOSS_TIME_LIMIT_SECONDS = Math.floor(BOSS_TIME_LIMIT / 1000);
const BOSS_WARNING_THRESHOLD = 5000;

const REBIRTH_STAGE_REQUIREMENT = 100;

const GACHA_SINGLE_COST = 1;
const GACHA_MULTI_COUNT = 10;
const GACHA_MULTI_COST = 9;
const GACHA_TOKEN_NORMAL_DROP_CHANCE = 0.02;
const GACHA_TOKEN_BOSS_DROP_CHANCE = 0.35;

const BOND_STAGE_GAIN = 1;
const BOND_STAGE_BOSS_GAIN = 3;
const BOND_DUPLICATE_GAIN_PER_LEVEL = 12;
const BOND_NEW_HERO_GAIN = 20;
const BOND_MISSION_SALVAGE_GAIN = 1;
const BOND_MISSION_REBIRTH_GAIN = 15;

const SKILL_MODULE_BOSS_REWARD = 1;

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

const HERO_CRIT_CHANCE_UPGRADE_CONFIG = {
    baseCost: 150,
    costGrowth: 1.3,
    baseChance: 0.1,
    increasePerLevel: 0.015,
    maxChance: 0.5,
};

const HERO_CRIT_DAMAGE_UPGRADE_CONFIG = {
    baseCost: 200,
    costGrowth: 1.27,
    baseMultiplier: 1.3,
    increasePerLevel: 0.12,
    maxMultiplier: 4,
};

const HERO_DPS_UPGRADE_CONFIG = {
    baseCost: 100,
    costGrowth: 1.25,
    increasePerLevel: 0.08,
};

const GOLD_GAIN_UPGRADE_CONFIG = {
    baseCost: 125,
    costGrowth: 1.27,
    increasePerLevel: 0.05,
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

const REBIRTH_NODE_IDS = new Set(REBIRTH_NODES.map((node) => node.id));
const REBIRTH_BRANCH_ID_SET = new Set(REBIRTH_BRANCHES.map((branch) => branch.id));
const DEFAULT_REBIRTH_BRANCH_FOCUS =
    REBIRTH_BRANCHES.find((branch) => branch.id && branch.id !== 'core')?.id ??
    REBIRTH_BRANCHES[0]?.id ??
    null;
const REBIRTH_BRANCH_FOCUS_FALLBACK =
    (DEFAULT_REBIRTH_BRANCH_FOCUS && REBIRTH_BRANCH_ID_SET.has(DEFAULT_REBIRTH_BRANCH_FOCUS))
        ? DEFAULT_REBIRTH_BRANCH_FOCUS
        : REBIRTH_BRANCHES.find((branch) => REBIRTH_BRANCH_ID_SET.has(branch.id))?.id ??
          Array.from(REBIRTH_BRANCH_ID_SET)[0] ??
          null;
const REBIRTH_RESPEC_COST = Math.max(0, Math.floor(REBIRTH_TREE.respecCost ?? 0));
const REBIRTH_CORE_REWARD_RATIO = 50;
const MIN_REBIRTH_CORE_REWARD = 1;

const getRebirthNodeInitialLevel = (node) =>
    Number.isFinite(node?.initialLevel) ? Math.max(0, Math.floor(node.initialLevel)) : 0;

const clampRebirthNodeLevel = (node, savedLevel) => {
    const initial = getRebirthNodeInitialLevel(node);
    if (!Number.isFinite(savedLevel)) return initial;
    const normalized = Math.max(0, Math.floor(savedLevel));
    const maxLevel = Number.isFinite(node?.maxLevel)
        ? Math.max(initial, Math.floor(node.maxLevel))
        : normalized;
    return Math.max(initial, Math.min(maxLevel, normalized));
};

const calculateRebirthNodeUpgradeCost = (node, level) => {
    if (!node) return 0;
    const baseCost = Number(node.baseCost ?? 0);
    const growth = Number(node.costGrowth ?? 0);
    const raw = baseCost + level * growth;
    return Math.max(1, Math.ceil(raw));
};

const calculateRebirthNodeTotalCost = (node, level) => {
    if (!node) return 0;
    const initial = getRebirthNodeInitialLevel(node);
    const normalizedLevel = Math.max(initial, Math.floor(level ?? initial));
    if (normalizedLevel <= initial) return 0;
    let total = 0;
    for (let current = initial; current < normalizedLevel; current += 1) {
        total += calculateRebirthNodeUpgradeCost(node, current);
    }
    return total;
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

const getMissionResetInterval = (mission) => {
    if (!mission) return null;
    const missionInterval = Number(mission.resetInterval);
    if (Number.isFinite(missionInterval) && missionInterval > 0) {
        return Math.floor(missionInterval);
    }
    const group = MISSION_GROUP_MAP.get(mission.type);
    const groupInterval = Number(group?.resetInterval);
    if (Number.isFinite(groupInterval) && groupInterval > 0) {
        return Math.floor(groupInterval);
    }
    return null;
};

const calculateNextMissionResetTime = (interval, referenceTime = Date.now()) => {
    if (!Number.isFinite(interval) || interval <= 0) {
        return null;
    }
    const normalizedInterval = Math.max(1, Math.floor(interval));
    const now = Number.isFinite(referenceTime) ? Math.max(0, Math.floor(referenceTime)) : Date.now();
    const remainder = now % normalizedInterval;
    const next = remainder === 0 ? now + normalizedInterval : now + (normalizedInterval - remainder);
    return next;
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
    static getTraitGroup(type) {
        if (!type) return null;
        return HERO_TRAIT_GROUP_MAP.get(type) ?? null;
    }

    static getTraitDefinition(type, traitId) {
        if (!type || !traitId) return null;
        const map = HERO_TRAIT_MAP[type];
        if (!map) return null;
        return map.get(traitId) ?? null;
    }

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
        const savedBondLevel = Number(savedState?.bondLevel ?? 0);
        this.bondLevel = Number.isFinite(savedBondLevel)
            ? Math.min(HERO_BOND_MAX_LEVEL, Math.max(0, Math.floor(savedBondLevel)))
            : 0;
        const savedBondExp = Number(savedState?.bondExp ?? 0);
        const normalizedBondExp = Number.isFinite(savedBondExp) ? Math.max(0, Math.floor(savedBondExp)) : 0;
        if (this.bondLevel >= this.bondMaxLevel) {
            this.bondLevel = this.bondMaxLevel;
            this.bondExp = 0;
        } else {
            const requirement = this.getBondRequirement(this.bondLevel + 1);
            this.bondExp = Math.min(normalizedBondExp, requirement);
        }
        this.refreshSkinUnlocks();
        if (!this.isUnlocked) {
            this.bondLevel = 0;
            this.bondExp = 0;
        }
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
        return Hero.getTraitDefinition('school', this.schoolId);
    }

    get weapon() {
        return Hero.getTraitDefinition('weapon', this.weaponId);
    }

    get position() {
        return Hero.getTraitDefinition('position', this.positionId);
    }

    get traitEntries() {
        return HERO_TRAIT_TYPES.map((type) => {
            const trait = Hero.getTraitDefinition(type, this.getTraitId(type));
            const group = Hero.getTraitGroup(type);
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

    get bondRequirements() {
        return HERO_BOND_EXP_REQUIREMENTS;
    }

    get bondMaxLevel() {
        return HERO_BOND_MAX_LEVEL;
    }

    get bondRewardDefinitions() {
        return HERO_BOND_REWARDS[this.id] ?? [];
    }

    get activeBondRewards() {
        return this.bondRewardDefinitions.filter((reward) => this.bondLevel >= reward.level);
    }

    get nextBondReward() {
        return this.bondRewardDefinitions.find((reward) => reward.level === this.bondLevel + 1) ?? null;
    }

    getBondRequirement(level) {
        if (!Number.isFinite(level) || level <= 0) return 0;
        const index = Math.min(this.bondRequirements.length - 1, Math.max(0, Math.floor(level)));
        return Math.max(0, Math.floor(this.bondRequirements[index] ?? 0));
    }

    getBondReward(level) {
        return this.bondRewardDefinitions.find((reward) => reward.level === level) ?? null;
    }

    getBondEffects() {
        if (!this.isUnlocked) return {};
        return this.activeBondRewards.reduce((acc, reward) => {
            Object.entries(reward.effects ?? {}).forEach(([effectId, value]) => {
                const numeric = Number(value);
                if (!Number.isFinite(numeric)) return;
                acc[effectId] = (acc[effectId] ?? 0) + numeric;
            });
            return acc;
        }, {});
    }

    get bondSelfBonus() {
        const effects = this.getBondEffects();
        const value = Number(effects.heroSelf ?? 0);
        return Number.isFinite(value) ? value : 0;
    }

    get bondSelfMultiplier() {
        return 1 + this.bondSelfBonus;
    }

    getBondProgress() {
        const level = this.bondLevel ?? 0;
        const maxLevel = this.bondMaxLevel ?? 0;
        if (level >= maxLevel) {
            return {
                level: maxLevel,
                maxLevel,
                currentExp: 0,
                requiredExp: 0,
                progress: 1,
                ready: false,
                atMax: true,
            };
        }
        const requirement = this.getBondRequirement(level + 1);
        const current = Math.min(Number(this.bondExp ?? 0), requirement);
        const progress = requirement > 0 ? Math.min(1, current / requirement) : 0;
        return {
            level,
            maxLevel,
            currentExp: current,
            requiredExp: requirement,
            progress,
            ready: requirement > 0 && current >= requirement,
            atMax: false,
        };
    }

    addBondExp(amount = 0) {
        if (!this.isUnlocked) {
            return { added: 0, currentExp: this.bondExp ?? 0, requiredExp: this.getBondRequirement(this.bondLevel + 1), ready: false, atMax: false, justReady: false };
        }
        if (this.bondLevel >= this.bondMaxLevel) {
            this.bondLevel = this.bondMaxLevel;
            this.bondExp = 0;
            return { added: 0, currentExp: 0, requiredExp: 0, ready: false, atMax: true, justReady: false };
        }
        const normalized = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (normalized <= 0) {
            const progress = this.getBondProgress();
            return {
                added: 0,
                currentExp: progress.currentExp,
                requiredExp: progress.requiredExp,
                ready: progress.ready,
                atMax: progress.atMax,
                justReady: false,
            };
        }
        const requirement = this.getBondRequirement(this.bondLevel + 1);
        const previous = Math.min(Number(this.bondExp ?? 0), requirement);
        const wasReady = requirement > 0 && previous >= requirement;
        const updated = Math.min(requirement, previous + normalized);
        const added = updated - previous;
        this.bondExp = updated;
        const ready = requirement > 0 && updated >= requirement;
        return {
            added,
            currentExp: updated,
            requiredExp: requirement,
            ready,
            atMax: false,
            justReady: ready && !wasReady,
        };
    }

    levelUpBond() {
        if (!this.isUnlocked) {
            return { success: false, message: '학생을 먼저 모집해야 합니다.' };
        }
        if (this.bondLevel >= this.bondMaxLevel) {
            return { success: false, message: '이미 호감도가 최대입니다.', level: this.bondLevel, atMax: true };
        }
        const requirement = this.getBondRequirement(this.bondLevel + 1);
        if (this.bondExp < requirement) {
            return {
                success: false,
                message: '호감도 경험치가 부족합니다.',
                requiredExp: requirement,
                currentExp: this.bondExp,
            };
        }
        this.bondLevel += 1;
        this.bondExp = 0;
        const reward = this.getBondReward(this.bondLevel);
        return { success: true, level: this.bondLevel, reward };
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
        this.bondLevel = 0;
        this.bondExp = 0;
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
            bondLevel: this.bondLevel,
            bondExp: this.bondExp,
        };
    }
}

export class Enemy {
    constructor(stage = 1, savedState) {
        this.namePools = ENEMY_NAME_POOLS;
        this.stage = Enemy.normalizeStage(stage);
        this.refreshStageContext();
        this.maxHp = this.calculateMaxHp(this.stage);
        this.hp = this.resolveSavedHp(savedState);
        this.defeated = this.normalizeDefeated(savedState?.defeated);
    }

    static normalizeStage(stage) {
        const numeric = Number(stage);
        if (!Number.isFinite(numeric)) return 1;
        return Math.max(1, Math.floor(numeric));
    }

    refreshStageContext() {
        const gimmick = getEnemyStageGimmick(this.stage);
        this.stageGimmick = {
            ...gimmick,
            modifiers: { ...gimmick.modifiers },
        };
    }

    normalizeDefeated(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.floor(numeric));
    }

    resolveSavedHp(savedState) {
        const savedHp = Number(savedState?.hp);
        const savedMaxHp = Number(savedState?.maxHp);
        if (Number.isFinite(savedHp) && Number.isFinite(savedMaxHp) && savedMaxHp > 0) {
            const ratio = Math.min(1, Math.max(0, savedHp / savedMaxHp));
            return Math.max(0, Math.floor(this.maxHp * ratio));
        }
        if (Number.isFinite(savedHp)) {
            return Math.max(0, Math.min(this.maxHp, Math.floor(savedHp)));
        }
        return this.maxHp;
    }

    getStageGimmick(stage = this.stage) {
        const normalized = Enemy.normalizeStage(stage);
        if (normalized === this.stage) {
            return {
                ...this.stageGimmick,
                modifiers: { ...this.stageGimmick.modifiers },
            };
        }
        const gimmick = getEnemyStageGimmick(normalized);
        return {
            ...gimmick,
            modifiers: { ...gimmick.modifiers },
        };
    }

    getStageModifiers(stage = this.stage) {
        const normalized = Enemy.normalizeStage(stage);
        const source = normalized === this.stage ? this.stageGimmick : getEnemyStageGimmick(normalized);
        const modifiers = source?.modifiers ?? {};
        return {
            hpMultiplier: Number.isFinite(modifiers.hpMultiplier) ? Math.max(0, modifiers.hpMultiplier) : 1,
            rewardMultiplier: Number.isFinite(modifiers.rewardMultiplier)
                ? Math.max(0, modifiers.rewardMultiplier)
                : 1,
            goldBonus: Number.isFinite(modifiers.goldBonus) ? modifiers.goldBonus : 0,
            equipmentDropBonus: Number.isFinite(modifiers.equipmentDropBonus)
                ? modifiers.equipmentDropBonus
                : 0,
            gachaDropBonus: Number.isFinite(modifiers.gachaDropBonus) ? modifiers.gachaDropBonus : 0,
        };
    }

    calculateMaxHp(stage) {
        const normalized = Enemy.normalizeStage(stage);
        const base = 10 + normalized * 8;
        const exponential = Math.pow(1.16, normalized - 1);
        const baseHp = Math.floor(base * exponential);
        const { hpMultiplier } = this.getStageModifiers(normalized);
        const multiplier = Number.isFinite(hpMultiplier) ? Math.max(0, hpMultiplier) : 1;
        return Math.max(1, Math.floor(baseHp * multiplier));
    }

    get name() {
        return getEnemyNameForStage(this.stage, this.stageGimmick, this.namePools);
    }

    applyDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
        const defeated = this.hp === 0;
        if (defeated) this.defeated += 1;
        return defeated;
    }

    advanceStage() {
        this.stage += 1;
        this.refreshStageContext();
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
        this.refreshStageContext();
        this.maxHp = this.calculateMaxHp(this.stage);
        this.hp = this.maxHp;
        this.defeated = 0;
    }

    reset(stage = 1) {
        this.stage = Enemy.normalizeStage(stage);
        this.refreshStageContext();
        this.maxHp = this.calculateMaxHp(this.stage);
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
        const savedHeroCritChanceLevel = Number(saved?.heroCritChanceLevel ?? 0);
        this.heroCritChanceLevel = Number.isFinite(savedHeroCritChanceLevel)
            ? Math.max(0, Math.floor(savedHeroCritChanceLevel))
            : 0;
        const savedHeroCritDamageLevel = Number(saved?.heroCritDamageLevel ?? 0);
        this.heroCritDamageLevel = Number.isFinite(savedHeroCritDamageLevel)
            ? Math.max(0, Math.floor(savedHeroCritDamageLevel))
            : 0;
        const savedHeroTrainingLevel = Number(saved?.heroDpsLevel ?? 0);
        this.heroDpsLevel = Number.isFinite(savedHeroTrainingLevel)
            ? Math.max(0, Math.floor(savedHeroTrainingLevel))
            : 0;
        const savedGoldGainLevel = Number(saved?.goldGainLevel ?? 0);
        this.goldGainLevel = Number.isFinite(savedGoldGainLevel)
            ? Math.max(0, Math.floor(savedGoldGainLevel))
            : 0;
        this.lastSave = saved?.lastSave ?? Date.now();
        this.initializeSkills(saved?.skills, saved);
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
        const loadedCores = Number(saved?.rebirthCores ?? 0);
        this.rebirthCores = Number.isFinite(loadedCores) ? Math.max(0, Math.floor(loadedCores)) : 0;
        const savedBranchFocus = typeof saved?.rebirthBranchFocus === 'string' ? saved.rebirthBranchFocus : null;
        const fallbackBranchFocus = REBIRTH_BRANCH_FOCUS_FALLBACK;
        this.rebirthBranchFocus =
            savedBranchFocus && REBIRTH_BRANCH_ID_SET.has(savedBranchFocus)
                ? savedBranchFocus
                : fallbackBranchFocus;
        const loadedRebirths = Number(saved?.totalRebirths ?? 0);
        this.totalRebirths = Number.isFinite(loadedRebirths) ? Math.max(0, Math.floor(loadedRebirths)) : 0;
        this.initializeRebirthNodes(saved?.rebirthNodes, saved?.rebirthSkills);
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

    initializeSkills(savedSkills = {}, legacySaved = null) {
        this.activeSkills = new Map();
        this.skillLevels = new Map();
        SKILLS.forEach((skill) => {
            const savedState = savedSkills?.[skill.id] ?? {};
            const savedCooldown = Number(savedState?.cooldownUntil ?? savedState?.cooldown ?? 0);
            const savedActive = Number(savedState?.activeUntil ?? savedState?.active ?? 0);
            const cooldownUntil = Number.isFinite(savedCooldown)
                ? Math.max(0, Math.floor(savedCooldown))
                : 0;
            const activeUntil = Number.isFinite(savedActive) ? Math.max(0, Math.floor(savedActive)) : 0;
            const context =
                savedState && typeof savedState.context === 'object' && savedState.context !== null
                    ? { ...savedState.context }
                    : null;
            this.activeSkills.set(skill.id, { cooldownUntil, activeUntil, context });
            const config = getSkillLevelConfig(skill.id);
            const maxLevel = Number(config?.maxLevel ?? DEFAULT_SKILL_LEVEL);
            const savedLevelCandidates = [
                savedState?.level,
                savedState?.lvl,
                savedSkills?.levels?.[skill.id],
                legacySaved?.skillLevels?.[skill.id],
            ];
            const savedLevel = savedLevelCandidates
                .map((value) => Number(value))
                .find((value) => Number.isFinite(value));
            const normalizedLevel = Number.isFinite(savedLevel)
                ? Math.max(DEFAULT_SKILL_LEVEL, Math.min(maxLevel, Math.floor(savedLevel)))
                : DEFAULT_SKILL_LEVEL;
            this.skillLevels.set(skill.id, normalizedLevel);
        });
        if (legacySaved) {
            const legacyCooldown = Number(legacySaved?.frenzyCooldown ?? 0);
            const legacyActive = Number(legacySaved?.frenzyActiveUntil ?? 0);
            if (Number.isFinite(legacyCooldown) || Number.isFinite(legacyActive)) {
                const current = this.activeSkills.get('frenzy') ?? { cooldownUntil: 0, activeUntil: 0, context: null };
                if (Number.isFinite(legacyCooldown)) {
                    current.cooldownUntil = Math.max(
                        current.cooldownUntil,
                        Math.max(0, Math.floor(legacyCooldown)),
                    );
                }
                if (Number.isFinite(legacyActive)) {
                    current.activeUntil = Math.max(current.activeUntil, Math.max(0, Math.floor(legacyActive)));
                }
                this.activeSkills.set('frenzy', current);
            }
        }
        const savedModules = Number(savedSkills?.modules ?? legacySaved?.skillModules ?? 0);
        this.skillModules = Number.isFinite(savedModules) ? Math.max(0, Math.floor(savedModules)) : 0;
    }

    resetSkillStates() {
        this.activeSkills.forEach((_, skillId) => {
            this.activeSkills.set(skillId, { cooldownUntil: 0, activeUntil: 0, context: null });
        });
    }

    serializeSkills() {
        const result = {};
        this.activeSkills.forEach((state, skillId) => {
            const entry = {
                cooldownUntil: Math.max(0, Math.floor(Number(state?.cooldownUntil ?? 0))),
                activeUntil: Math.max(0, Math.floor(Number(state?.activeUntil ?? 0))),
            };
            if (state?.context && typeof state.context === 'object') {
                entry.context = { ...state.context };
            }
            entry.level = this.getSkillLevel(skillId);
            result[skillId] = entry;
        });
        result.modules = this.skillModules;
        return result;
    }

    getSkillState(skillId) {
        if (!this.activeSkills.has(skillId)) {
            this.activeSkills.set(skillId, { cooldownUntil: 0, activeUntil: 0, context: null });
        }
        const state = this.activeSkills.get(skillId) ?? { cooldownUntil: 0, activeUntil: 0, context: null };
        return {
            cooldownUntil: Math.max(0, Math.floor(Number(state.cooldownUntil ?? 0))),
            activeUntil: Math.max(0, Math.floor(Number(state.activeUntil ?? 0))),
            context: state.context ? { ...state.context } : null,
        };
    }

    setSkillState(skillId, state) {
        const cooldownUntil = Math.max(0, Math.floor(Number(state?.cooldownUntil ?? 0)));
        const activeUntil = Math.max(0, Math.floor(Number(state?.activeUntil ?? 0)));
        const context = state?.context && typeof state.context === 'object' ? { ...state.context } : null;
        this.activeSkills.set(skillId, { cooldownUntil, activeUntil, context });
    }

    getSkillLevel(skillId) {
        if (!this.skillLevels) {
            this.skillLevels = new Map();
        }
        const config = getSkillLevelConfig(skillId);
        const maxLevel = Number(config?.maxLevel ?? DEFAULT_SKILL_LEVEL);
        if (!this.skillLevels.has(skillId)) {
            this.skillLevels.set(skillId, DEFAULT_SKILL_LEVEL);
        }
        const rawLevel = Number(this.skillLevels.get(skillId));
        if (!Number.isFinite(rawLevel)) {
            this.skillLevels.set(skillId, DEFAULT_SKILL_LEVEL);
            return DEFAULT_SKILL_LEVEL;
        }
        const normalized = Math.max(DEFAULT_SKILL_LEVEL, Math.floor(rawLevel));
        const clamped = Math.min(maxLevel, normalized);
        if (clamped !== rawLevel) {
            this.skillLevels.set(skillId, clamped);
        }
        return clamped;
    }

    setSkillLevel(skillId, level) {
        const config = getSkillLevelConfig(skillId);
        const maxLevel = Number(config?.maxLevel ?? DEFAULT_SKILL_LEVEL);
        const normalized = Math.max(
            DEFAULT_SKILL_LEVEL,
            Math.min(maxLevel, Math.floor(Number(level) || DEFAULT_SKILL_LEVEL)),
        );
        if (!this.skillLevels) {
            this.skillLevels = new Map();
        }
        this.skillLevels.set(skillId, normalized);
        return normalized;
    }

    getSkillUpgradeCost(skillId) {
        const currentLevel = this.getSkillLevel(skillId);
        const cost = getSkillUpgradeCostValue(skillId, currentLevel);
        if (cost === null) {
            return null;
        }
        const normalized = Number(cost);
        return Number.isFinite(normalized) ? Math.max(0, Math.floor(normalized)) : null;
    }

    getSkillComputedValues(skillId, { level = null } = {}) {
        const skill = SKILL_MAP.get(skillId);
        if (!skill) return null;
        const config = getSkillLevelConfig(skillId);
        const maxLevel = Number(config?.maxLevel ?? DEFAULT_SKILL_LEVEL);
        const resolvedLevel = Math.max(
            DEFAULT_SKILL_LEVEL,
            Math.min(maxLevel, Math.floor(Number(level ?? this.getSkillLevel(skillId)) || DEFAULT_SKILL_LEVEL)),
        );
        const definition = getSkillLevelDefinition(skillId, resolvedLevel) ?? null;
        const effectMultiplier = Number(definition?.effectMultiplier ?? 1) || 1;
        const durationMultiplier = Number(definition?.durationMultiplier ?? 1) || 1;
        const cooldownMultiplier = Number(definition?.cooldownMultiplier ?? 1) || 1;
        const baseCooldown = Math.max(0, Math.floor(Number(skill.cooldown ?? 0)));
        const baseDuration = Math.max(0, Math.floor(Number(skill.duration ?? 0)));
        let baseEffectValue = Number(skill.effectValue);
        if (!Number.isFinite(baseEffectValue)) {
            baseEffectValue = skill.effectType === SKILL_EFFECT_TYPES.DPS_MULTIPLIER ? 1 : 0;
        }
        const cooldown = Math.max(0, Math.floor(baseCooldown * cooldownMultiplier));
        const duration = Math.max(0, Math.floor(baseDuration * durationMultiplier));
        const effectValue = baseEffectValue * effectMultiplier;
        const nextLevel = resolvedLevel < maxLevel ? resolvedLevel + 1 : resolvedLevel;
        const nextDefinition = resolvedLevel < maxLevel ? getSkillLevelDefinition(skillId, resolvedLevel + 1) : null;
        return {
            skill,
            level: resolvedLevel,
            maxLevel,
            levelDefinition: definition,
            nextLevel,
            nextLevelDefinition: nextDefinition,
            effectMultiplier,
            durationMultiplier,
            cooldownMultiplier,
            cooldown,
            duration,
            baseCooldown,
            baseDuration,
            baseEffectValue,
            effectValue,
        };
    }

    isSkillActive(skillId, now = Date.now()) {
        const state = this.activeSkills.get(skillId);
        if (!state) return false;
        return Number(state.activeUntil ?? 0) > now;
    }

    getSkillStatus(skillId, now = Date.now()) {
        const state = this.activeSkills.get(skillId) ?? { cooldownUntil: 0, activeUntil: 0, context: null };
        const cooldownRemaining = Math.max(0, Number(state.cooldownUntil ?? 0) - now);
        const activeRemaining = Math.max(0, Number(state.activeUntil ?? 0) - now);
        return {
            skill: SKILL_MAP.get(skillId) ?? null,
            cooldownRemaining,
            activeRemaining,
            isActive: activeRemaining > 0,
            state,
        };
    }

    getActiveSkillsByType(effectType, now = Date.now()) {
        const entries = [];
        this.activeSkills.forEach((state, skillId) => {
            const skill = SKILL_MAP.get(skillId);
            if (!skill || skill.effectType !== effectType) return;
            if (Number(state.activeUntil ?? 0) > now) {
                entries.push({ skillId, skill, state });
            }
        });
        return entries;
    }

    getActiveDpsMultiplier(now = Date.now()) {
        const entries = this.getActiveSkillsByType(SKILL_EFFECT_TYPES.DPS_MULTIPLIER, now);
        if (entries.length === 0) {
            return 1;
        }
        return entries.reduce((total, { skillId, skill }) => {
            const computed = this.getSkillComputedValues(skillId) ?? { effectValue: skill.effectValue };
            const baseMultiplier = Number(computed?.effectValue ?? skill.effectValue ?? 1);
            const normalized = Number.isFinite(baseMultiplier) ? Math.max(1, baseMultiplier) : 1;
            return total * (normalized * (1 + this.skillBonus));
        }, 1);
    }

    getActiveBossTimerFreezeEntry(now = Date.now()) {
        for (const [skillId, state] of this.activeSkills.entries()) {
            const skill = SKILL_MAP.get(skillId);
            if (!skill || skill.effectType !== SKILL_EFFECT_TYPES.BOSS_TIMER_FREEZE) continue;
            const context = state.context ?? null;
            if (context?.resumed) continue;
            if (Number(state.activeUntil ?? 0) > now) {
                return { skillId, skill, state };
            }
        }
        return null;
    }

    resolveBossTimerFreeze(now = Date.now(), { force = false } = {}) {
        let updated = false;
        this.activeSkills.forEach((state, skillId) => {
            const skill = SKILL_MAP.get(skillId);
            if (!skill || skill.effectType !== SKILL_EFFECT_TYPES.BOSS_TIMER_FREEZE) return;
            const context = state.context ?? null;
            if (!context || context.resumed) return;
            const activeUntil = Number(state.activeUntil ?? 0);
            if (!force && activeUntil > now) return;
            const storedRemaining = Math.max(0, Number(context.bossTimerRemaining ?? 0));
            if (!force && storedRemaining > 0) {
                this.bossDeadline = now + storedRemaining;
            }
            context.resumed = true;
            state.context = context;
            state.activeUntil = 0;
            this.activeSkills.set(skillId, state);
            updated = true;
        });
        return updated;
    }

    getBossTimerInfo(now = Date.now()) {
        const isBossStage = this.isBossStage();
        this.resolveBossTimerFreeze(now);
        const hasDeadline = Number.isFinite(this.bossDeadline) && this.bossDeadline > 0;
        const info = {
            isBossStage,
            hasDeadline,
            remaining: 0,
            freezeRemaining: 0,
            isFrozen: false,
        };
        if (!isBossStage || !hasDeadline) {
            return info;
        }
        const freezeEntry = this.getActiveBossTimerFreezeEntry(now);
        if (freezeEntry) {
            const context = freezeEntry.state.context ?? null;
            info.isFrozen = true;
            info.remaining = Math.max(0, Number(context?.bossTimerRemaining ?? 0));
            info.freezeRemaining = Math.max(0, Number(freezeEntry.state.activeUntil ?? 0) - now);
            return info;
        }
        info.remaining = Math.max(0, this.bossDeadline - now);
        return info;
    }

    activateSkill(skillId) {
        const skill = SKILL_MAP.get(skillId);
        if (!skill) {
            return { success: false, reason: 'unknown' };
        }
        const now = Date.now();
        this.resolveBossTimerFreeze(now);
        const currentState = this.getSkillState(skillId);
        if (currentState.activeUntil > now) {
            return { success: false, reason: 'active', skill, remaining: currentState.activeUntil - now };
        }
        if (currentState.cooldownUntil > now) {
            return { success: false, reason: 'cooldown', skill, remaining: currentState.cooldownUntil - now };
        }
        const computed = this.getSkillComputedValues(skillId) ?? null;
        const baseCooldown = Math.max(0, Math.floor(Number(computed?.cooldown ?? skill.cooldown ?? 0)));
        const baseDuration = Math.max(0, Math.floor(Number(computed?.duration ?? skill.duration ?? 0)));
        const duration = baseDuration > 0 ? Math.floor(baseDuration * (1 + this.skillBonus)) : 0;
        const nextState = {
            cooldownUntil: now + baseCooldown,
            activeUntil: duration > 0 ? now + duration : 0,
            context: null,
        };
        const effect = {};
        switch (skill.effectType) {
            case SKILL_EFFECT_TYPES.DPS_MULTIPLIER: {
                const baseMultiplier = Number(computed?.effectValue ?? skill.effectValue ?? 1);
                const normalized = Number.isFinite(baseMultiplier) ? Math.max(1, baseMultiplier) : 1;
                effect.multiplier = normalized * (1 + this.skillBonus);
                break;
            }
            case SKILL_EFFECT_TYPES.BOSS_TIMER_FREEZE: {
                if (!this.isBossStage()) {
                    return { success: false, reason: 'notBoss', skill };
                }
                if (!this.bossDeadline) {
                    this.startBossTimer();
                }
                const remaining = Math.max(0, this.bossDeadline ? this.bossDeadline - now : BOSS_TIME_LIMIT);
                nextState.context = {
                    bossTimerRemaining: remaining,
                    resumed: false,
                };
                effect.freezeDuration = duration;
                effect.remaining = remaining;
                break;
            }
            case SKILL_EFFECT_TYPES.INSTANT_GOLD: {
                const effectValue = Number(computed?.effectValue ?? skill.effectValue ?? 0);
                const normalized = Number.isFinite(effectValue) ? Math.max(0, effectValue) : 0;
                const baseGain = Math.floor(this.totalDps * normalized * 0.25);
                const goldGain = Math.floor(baseGain * (1 + this.goldBonus));
                this.gold += goldGain;
                effect.goldGain = goldGain;
                nextState.activeUntil = 0;
                break;
            }
            default:
                break;
        }
        this.setSkillState(skillId, nextState);
        this.lastSave = now;
        return {
            success: true,
            skill,
            cooldown: baseCooldown,
            duration,
            effect,
            state: nextState,
            activatedAt: now,
            level: computed?.level ?? this.getSkillLevel(skillId),
        };
    }

    upgradeSkill(skillId) {
        const skill = SKILL_MAP.get(skillId);
        if (!skill) {
            return { success: false, reason: 'unknown' };
        }
        const config = getSkillLevelConfig(skillId);
        const maxLevel = Number(config?.maxLevel ?? DEFAULT_SKILL_LEVEL);
        const currentLevel = this.getSkillLevel(skillId);
        if (currentLevel >= maxLevel) {
            return { success: false, reason: 'max', skill, level: currentLevel, maxLevel };
        }
        const cost = this.getSkillUpgradeCost(skillId);
        if (cost !== null && cost > this.skillModules) {
            return { success: false, reason: 'resource', skill, cost, level: currentLevel, maxLevel };
        }
        if (cost) {
            this.skillModules = Math.max(0, this.skillModules - cost);
        }
        const nextLevel = this.setSkillLevel(skillId, currentLevel + 1);
        this.lastSave = Date.now();
        return {
            success: true,
            skill,
            level: nextLevel,
            maxLevel,
            cost: cost ?? 0,
        };
    }

    get totalDps() {
        const heroDps = this.heroes.reduce(
            (total, hero) => total + hero.damagePerSecond * (hero.bondSelfMultiplier ?? 1),
            0,
        );
        const heroMultiplier = 1 + this.heroBonus;
        const heroCritMultiplier = this.heroCritAverageMultiplier;
        const skillMultiplier = this.getActiveDpsMultiplier();
        return heroDps * heroMultiplier * heroCritMultiplier * skillMultiplier;
    }

    get tapBonus() {
        const equipment = this.getTotalEquipmentEffect('tap');
        const rebirth = this.getRebirthBonusValue('tap');
        const setBonus = this.getSetBonusEffect('tap');
        const bond = this.getBondEffect('tap');
        return equipment + rebirth + setBonus + bond;
    }

    get heroTrainingBonus() {
        return this.heroDpsLevel * HERO_DPS_UPGRADE_CONFIG.increasePerLevel;
    }

    get goldTrainingBonus() {
        return this.goldGainLevel * GOLD_GAIN_UPGRADE_CONFIG.increasePerLevel;
    }

    get heroBonus() {
        const equipment = this.getTotalEquipmentEffect('hero');
        const rebirth = this.getRebirthBonusValue('hero');
        const setBonus = this.getSetBonusEffect('hero');
        const bond = this.getBondEffect('hero');
        return equipment + rebirth + this.heroTrainingBonus + setBonus + bond;
    }

    get skillBonus() {
        const equipment = this.getTotalEquipmentEffect('skill');
        const rebirth = this.getRebirthBonusValue('skill');
        const setBonus = this.getSetBonusEffect('skill');
        const bond = this.getBondEffect('skill');
        return equipment + rebirth + setBonus + bond;
    }

    get goldBonus() {
        const equipment = this.getTotalEquipmentEffect('gold');
        const rebirth = this.getRebirthBonusValue('gold');
        const setBonus = this.getSetBonusEffect('gold');
        const bond = this.getBondEffect('gold');
        return equipment + rebirth + this.goldTrainingBonus + setBonus + bond;
    }

    get equipmentDropBonus() {
        const rebirth = this.getRebirthBonusValue('equipmentDrop');
        const setBonus = this.getSetBonusEffect('equipmentDrop');
        const bond = this.getBondEffect('equipmentDrop');
        return rebirth + setBonus + bond;
    }

    get gachaDropBonus() {
        const rebirth = this.getRebirthBonusValue('gachaDrop');
        const setBonus = this.getSetBonusEffect('gachaDrop');
        const bond = this.getBondEffect('gachaDrop');
        return rebirth + setBonus + bond;
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
        return REBIRTH_NODES.reduce((total, node) => {
            const level = this.getRebirthNodeLevel(node.id);
            if (level <= 0) return total;
            const effect = node.effect?.[type];
            if (!effect) return total;
            return total + effect * level;
        }, 0);
    }

    getRebirthBonusSummary() {
        return REBIRTH_NODES.reduce((acc, node) => {
            const level = this.getRebirthNodeLevel(node.id);
            if (level <= 0) return acc;
            Object.entries(node.effect ?? {}).forEach(([key, value]) => {
                acc[key] = (acc[key] ?? 0) + value * level;
            });
            return acc;
        }, {});
    }

    getRebirthNodeLevel(nodeId) {
        if (!REBIRTH_NODE_IDS.has(nodeId)) return 0;
        const node = REBIRTH_NODE_MAP.get(nodeId);
        if (!node) return 0;
        if (!this.rebirthNodes) {
            this.rebirthNodes = {};
        }
        const stored = this.rebirthNodes[nodeId];
        const level = clampRebirthNodeLevel(node, stored);
        if (level !== stored) {
            this.rebirthNodes[nodeId] = level;
        }
        return level;
    }

    getRebirthNodeCost(nodeId) {
        const node = REBIRTH_NODE_MAP.get(nodeId);
        if (!node) return Infinity;
        const level = this.getRebirthNodeLevel(nodeId);
        const maxLevel = Number.isFinite(node.maxLevel) ? Math.floor(node.maxLevel) : null;
        if (maxLevel !== null && level >= maxLevel) {
            return 0;
        }
        return calculateRebirthNodeUpgradeCost(node, level);
    }

    getRebirthNodeTotalCost(nodeId) {
        const node = REBIRTH_NODE_MAP.get(nodeId);
        if (!node) return 0;
        const level = this.getRebirthNodeLevel(nodeId);
        return calculateRebirthNodeTotalCost(node, level);
    }

    isRebirthNodeUnlocked(nodeId) {
        const node = REBIRTH_NODE_MAP.get(nodeId);
        if (!node) return false;
        const requirements = Array.isArray(node.prerequisites) ? node.prerequisites : [];
        if (requirements.length === 0) return true;
        return requirements.every((requirement) => {
            const requirementId = requirement?.node;
            if (!REBIRTH_NODE_IDS.has(requirementId)) return false;
            const requiredLevel = Number.isFinite(requirement?.level)
                ? Math.max(0, Math.floor(requirement.level))
                : 0;
            return this.getRebirthNodeLevel(requirementId) >= requiredLevel;
        });
    }

    canUpgradeRebirthNode(nodeId) {
        const node = REBIRTH_NODE_MAP.get(nodeId);
        if (!node) {
            return { canUpgrade: false, reason: '알 수 없는 환생 노드입니다.' };
        }
        const level = this.getRebirthNodeLevel(nodeId);
        const maxLevel = Number.isFinite(node.maxLevel) ? Math.floor(node.maxLevel) : null;
        if (maxLevel !== null && level >= maxLevel) {
            return { canUpgrade: false, reason: '이미 최대 레벨입니다.', node, level, cost: 0 };
        }
        if (!this.isRebirthNodeUnlocked(nodeId)) {
            return { canUpgrade: false, reason: '선행 노드를 먼저 강화해야 합니다.', node, level, cost: 0 };
        }
        const cost = this.getRebirthNodeCost(nodeId);
        if (cost > this.rebirthPoints) {
            return { canUpgrade: false, reason: '환생 포인트가 부족합니다.', node, level, cost };
        }
        return { canUpgrade: true, node, level, cost };
    }

    upgradeRebirthNode(nodeId) {
        const result = this.canUpgradeRebirthNode(nodeId);
        if (!result.canUpgrade) {
            return {
                success: false,
                message: result.reason ?? '강화할 수 없습니다.',
                node: result.node ?? null,
            };
        }
        this.rebirthPoints -= result.cost;
        const newLevel = result.level + 1;
        this.rebirthNodes[nodeId] = newLevel;
        if (result.node?.branch && REBIRTH_BRANCH_ID_SET.has(result.node.branch)) {
            this.rebirthBranchFocus = result.node.branch;
        }
        this.lastSave = Date.now();
        return { success: true, node: result.node, level: newLevel, cost: result.cost };
    }

    getRebirthTotalInvestment() {
        return REBIRTH_NODES.reduce((total, node) => total + this.getRebirthNodeTotalCost(node.id), 0);
    }

    getRebirthBranchSummary(branchId) {
        if (!branchId || !REBIRTH_BRANCH_ID_SET.has(branchId)) return {};
        return REBIRTH_NODES.reduce((acc, node) => {
            if (node.branch !== branchId) return acc;
            const level = this.getRebirthNodeLevel(node.id);
            if (level <= 0) return acc;
            Object.entries(node.effect ?? {}).forEach(([key, value]) => {
                acc[key] = (acc[key] ?? 0) + value * level;
            });
            return acc;
        }, {});
    }

    getRebirthBranchLevel(branchId) {
        if (!branchId || !REBIRTH_BRANCH_ID_SET.has(branchId)) return 0;
        return REBIRTH_NODES.reduce((total, node) => {
            if (node.branch !== branchId) return total;
            return total + this.getRebirthNodeLevel(node.id);
        }, 0);
    }

    setRebirthBranchFocus(branchId) {
        if (!branchId || !REBIRTH_BRANCH_ID_SET.has(branchId)) return false;
        if (this.rebirthBranchFocus === branchId) return false;
        this.rebirthBranchFocus = branchId;
        this.lastSave = Date.now();
        return true;
    }

    respecRebirthTree() {
        if (REBIRTH_RESPEC_COST <= 0) {
            return { success: false, message: '재분배 비용 정보가 없습니다.' };
        }
        if (this.rebirthCores < REBIRTH_RESPEC_COST) {
            return { success: false, message: '환생 코어가 부족합니다.' };
        }
        const refund = this.getRebirthTotalInvestment();
        if (refund <= 0) {
            return { success: false, message: '재분배할 노드가 없습니다.' };
        }
        this.rebirthCores -= REBIRTH_RESPEC_COST;
        this.rebirthPoints += refund;
        this.initializeRebirthNodes({});
        this.rebirthBranchFocus = REBIRTH_BRANCH_FOCUS_FALLBACK;
        this.lastSave = Date.now();
        return { success: true, refunded: refund, cost: REBIRTH_RESPEC_COST, cores: this.rebirthCores };
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
        const coresEarned =
            pointsEarned > 0
                ? Math.max(
                      MIN_REBIRTH_CORE_REWARD,
                      Math.floor(pointsEarned / REBIRTH_CORE_REWARD_RATIO),
                  )
                : 0;
        if (coresEarned > 0) {
            this.rebirthCores += coresEarned;
        }
        this.totalRebirths += 1;
        const earnedFrom = this.currentRunHighestStage;
        this.gold = 0;
        this.clickLevel = 1;
        this.clickDamage = 1;
        this.clickCritChanceLevel = 0;
        this.clickCritDamageLevel = 0;
        this.heroCritChanceLevel = 0;
        this.heroCritDamageLevel = 0;
        this.heroDpsLevel = 0;
        this.goldGainLevel = 0;
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.clearBossTimer();
        this.pendingBossEntry = false;
        this.resetSkillStates();
        this.currentRunHighestStage = 0;
        this.normalizeEquippedState();
        return {
            success: true,
            pointsEarned,
            coresEarned,
            coresTotal: this.rebirthCores,
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

    getHeroCritChanceAtLevel(level) {
        const normalizedLevel = Number.isFinite(level) ? Math.max(0, Math.floor(level)) : 0;
        const base = HERO_CRIT_CHANCE_UPGRADE_CONFIG.baseChance;
        const equipment = this.getTotalEquipmentEffect('heroCritChance');
        const rebirth = this.getRebirthBonusValue('heroCritChance');
        const setBonus = this.getSetBonusEffect('heroCritChance');
        const bond = this.getBondEffect('heroCritChance');
        const total =
            base +
            normalizedLevel * HERO_CRIT_CHANCE_UPGRADE_CONFIG.increasePerLevel +
            equipment +
            rebirth +
            setBonus +
            bond;
        const clamped = Math.min(HERO_CRIT_CHANCE_UPGRADE_CONFIG.maxChance, total);
        return Math.max(0, clamped);
    }

    get heroCritChance() {
        return this.getHeroCritChanceAtLevel(this.heroCritChanceLevel);
    }

    getHeroCritMultiplierAtLevel(level) {
        const normalizedLevel = Number.isFinite(level) ? Math.max(0, Math.floor(level)) : 0;
        const base = HERO_CRIT_DAMAGE_UPGRADE_CONFIG.baseMultiplier;
        const equipment = this.getTotalEquipmentEffect('heroCritDamage');
        const rebirth = this.getRebirthBonusValue('heroCritDamage');
        const setBonus = this.getSetBonusEffect('heroCritDamage');
        const bond = this.getBondEffect('heroCritDamage');
        const total =
            base +
            normalizedLevel * HERO_CRIT_DAMAGE_UPGRADE_CONFIG.increasePerLevel +
            equipment +
            rebirth +
            setBonus +
            bond;
        const clamped = Math.min(HERO_CRIT_DAMAGE_UPGRADE_CONFIG.maxMultiplier, total);
        return Math.max(1, clamped);
    }

    get heroCritMultiplier() {
        return this.getHeroCritMultiplierAtLevel(this.heroCritDamageLevel);
    }

    get heroCritAverageMultiplier() {
        const chance = this.heroCritChance;
        const multiplier = this.heroCritMultiplier;
        return 1 + chance * (multiplier - 1);
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
        const modifiers = this.enemy.getStageModifiers(stage);
        const goldBonus = this.goldBonus + (modifiers.goldBonus ?? 0);
        const baseReward = calculateStageReward(stage, this.isBossStage(stage), goldBonus);
        const rewardMultiplier = Number.isFinite(modifiers.rewardMultiplier)
            ? Math.max(0, modifiers.rewardMultiplier)
            : 1;
        return Math.ceil(baseReward * rewardMultiplier);
    }

    enemyReward(stage = this.enemy.stage) {
        return this.getStageReward(stage);
    }

    getStageGimmick(stage = this.enemy.stage) {
        return this.enemy.getStageGimmick(stage);
    }

    getStageModifiers(stage = this.enemy.stage) {
        return this.enemy.getStageModifiers(stage);
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

    getHeroCritChanceUpgradeContext() {
        const currentChance = this.heroCritChance;
        const currentAverageMultiplier = this.heroCritAverageMultiplier;
        const nextLevel = this.heroCritChanceLevel + 1;
        const nextChance = this.getHeroCritChanceAtLevel(nextLevel);
        const nextAverageMultiplier = 1 + nextChance * (this.heroCritMultiplier - 1);
        const gain = Math.max(0, nextChance - currentChance);
        const canUpgrade = gain > 0;
        const cost = canUpgrade
            ? calculateScalingUpgradeCost(this.heroCritChanceLevel, HERO_CRIT_CHANCE_UPGRADE_CONFIG)
            : 0;
        return {
            cost,
            currentChance,
            nextChance,
            gain,
            canUpgrade,
            currentAverageMultiplier,
            nextAverageMultiplier,
        };
    }

    levelUpHeroCritChance() {
        const context = this.getHeroCritChanceUpgradeContext();
        if (!context.canUpgrade) {
            return { success: false, message: '학생 치명타 확률이 이미 최대입니다.' };
        }
        if (this.gold < context.cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= context.cost;
        this.heroCritChanceLevel += 1;
        this.lastSave = Date.now();
        return {
            success: true,
            cost: context.cost,
            previousChance: context.currentChance,
            newChance: this.heroCritChance,
            previousAverageMultiplier: context.currentAverageMultiplier,
            newAverageMultiplier: this.heroCritAverageMultiplier,
        };
    }

    getHeroCritDamageUpgradeContext() {
        const currentMultiplier = this.heroCritMultiplier;
        const currentAverageMultiplier = this.heroCritAverageMultiplier;
        const nextLevel = this.heroCritDamageLevel + 1;
        const nextMultiplier = this.getHeroCritMultiplierAtLevel(nextLevel);
        const nextAverageMultiplier = 1 + this.heroCritChance * (nextMultiplier - 1);
        const gain = Math.max(0, nextMultiplier - currentMultiplier);
        const canUpgrade = gain > 0;
        const cost = canUpgrade
            ? calculateScalingUpgradeCost(this.heroCritDamageLevel, HERO_CRIT_DAMAGE_UPGRADE_CONFIG)
            : 0;
        return {
            cost,
            currentMultiplier,
            nextMultiplier,
            gain,
            canUpgrade,
            currentAverageMultiplier,
            nextAverageMultiplier,
        };
    }

    levelUpHeroCritDamage() {
        const context = this.getHeroCritDamageUpgradeContext();
        if (!context.canUpgrade) {
            return { success: false, message: '학생 치명타 피해 배율이 이미 최대입니다.' };
        }
        if (this.gold < context.cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= context.cost;
        this.heroCritDamageLevel += 1;
        this.lastSave = Date.now();
        return {
            success: true,
            cost: context.cost,
            previousMultiplier: context.currentMultiplier,
            newMultiplier: this.heroCritMultiplier,
            previousAverageMultiplier: context.currentAverageMultiplier,
            newAverageMultiplier: this.heroCritAverageMultiplier,
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

    getGoldGainUpgradeContext() {
        const cost = calculateScalingUpgradeCost(this.goldGainLevel, GOLD_GAIN_UPGRADE_CONFIG);
        const baseBonus = this.goldBonus - this.goldTrainingBonus;
        const currentTraining = this.goldTrainingBonus;
        const nextTraining = currentTraining + GOLD_GAIN_UPGRADE_CONFIG.increasePerLevel;
        const currentTotal = baseBonus + currentTraining;
        const nextTotal = baseBonus + nextTraining;
        return {
            cost,
            currentTraining,
            nextTraining,
            currentTotal,
            nextTotal,
            currentMultiplier: 1 + currentTotal,
            nextMultiplier: 1 + nextTotal,
            gain: GOLD_GAIN_UPGRADE_CONFIG.increasePerLevel,
            canUpgrade: true,
        };
    }

    levelUpGoldGain() {
        const cost = calculateScalingUpgradeCost(this.goldGainLevel, GOLD_GAIN_UPGRADE_CONFIG);
        if (this.gold < cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        const baseBonus = this.goldBonus - this.goldTrainingBonus;
        const previousTraining = this.goldTrainingBonus;
        const previousTotal = baseBonus + previousTraining;
        this.gold -= cost;
        this.goldGainLevel += 1;
        const newTraining = this.goldTrainingBonus;
        const newTotal = baseBonus + newTraining;
        this.lastSave = Date.now();
        return {
            success: true,
            cost,
            previousTraining,
            newTraining,
            previousTotal,
            newTotal,
        };
    }

    getHeroById(heroId) {
        return this.heroes.find((hero) => hero.id === heroId) ?? null;
    }

    gainBond(heroId, amount = 0) {
        const hero = this.getHeroById(heroId);
        if (!hero) {
            return { success: false, message: '학생을 찾을 수 없습니다.', hero: null, heroId };
        }
        const result = hero.addBondExp(amount);
        if (result.added > 0) {
            this.lastSave = Date.now();
        }
        return {
            ...result,
            hero,
            heroId: hero.id,
            success: result.added > 0 || result.justReady,
            locked: !hero.isUnlocked,
        };
    }

    grantBondToUnlocked(amount = 0, metadata = {}) {
        const normalized = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (normalized <= 0) {
            return { totalAdded: 0, affected: 0, entries: [], ...metadata };
        }
        const entries = [];
        let totalAdded = 0;
        this.heroes.forEach((hero) => {
            if (!hero.isUnlocked) return;
            const result = this.gainBond(hero.id, normalized);
            if (!result) return;
            if (result.added > 0 || result.justReady) {
                entries.push(result);
                totalAdded += result.added;
            }
        });
        return { totalAdded, affected: entries.length, entries, ...metadata };
    }

    getStageBondGain(stage) {
        if (!Number.isFinite(stage) || stage <= 0) return 0;
        return stage % BOSS_STAGE_INTERVAL === 0 ? BOND_STAGE_BOSS_GAIN : BOND_STAGE_GAIN;
    }

    grantBondForStage(stage) {
        const amount = this.getStageBondGain(stage);
        return this.grantBondToUnlocked(amount, { reason: 'stage', stage });
    }

    grantSkillModulesForStage(stage) {
        if (!this.isBossStage(stage)) {
            return null;
        }
        const reward = Math.max(0, Math.floor(SKILL_MODULE_BOSS_REWARD));
        if (reward <= 0) {
            return null;
        }
        this.skillModules += reward;
        this.lastSave = Date.now();
        return {
            amount: reward,
            stage,
            reason: 'boss',
        };
    }

    grantBondForMission(trigger, amount = 1) {
        const normalizedAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        let perHero = 0;
        switch (trigger) {
            case 'equipmentSalvage':
                perHero = normalizedAmount * BOND_MISSION_SALVAGE_GAIN;
                break;
            case 'rebirth':
                perHero = normalizedAmount * BOND_MISSION_REBIRTH_GAIN;
                break;
            default:
                perHero = 0;
                break;
        }
        if (perHero <= 0) {
            return { totalAdded: 0, affected: 0, entries: [], reason: 'mission', trigger, amount: normalizedAmount };
        }
        return this.grantBondToUnlocked(perHero, {
            reason: 'mission',
            trigger,
            amount: normalizedAmount,
        });
    }

    levelUpBond(heroId) {
        const hero = this.getHeroById(heroId);
        if (!hero) {
            return { success: false, message: '학생을 찾을 수 없습니다.' };
        }
        const result = hero.levelUpBond();
        if (!result.success) {
            return { ...result, hero };
        }
        this.lastSave = Date.now();
        return { ...result, hero };
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
            let bond = null;
            if (previousLevel === 0) {
                bond = this.gainBond(hero.id, BOND_NEW_HERO_GAIN);
            } else {
                const bondGain = levelGain * BOND_DUPLICATE_GAIN_PER_LEVEL;
                bond = this.gainBond(hero.id, bondGain);
            }
            results.push({
                hero,
                isNew: previousLevel === 0,
                previousLevel,
                newLevel: hero.level,
                levelGain,
                unlockedSkins,
                bond,
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
        const now = Date.now();
        this.resolveBossTimerFreeze(now);
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
        const freezeEntry = this.getActiveBossTimerFreezeEntry(now);
        if (freezeEntry) {
            return null;
        }
        if (now < this.bossDeadline) {
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
        const bond = this.grantBondForStage(defeatedStage);
        const skillModules = this.grantSkillModulesForStage(defeatedStage);
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
        this.resolveBossTimerFreeze(Date.now(), { force: !this.isBossStage() });
        return { reward, drop, gacha, defeatedStage, bond, skillModules };
    }

    reset() {
        this.gold = 0;
        this.clickLevel = 1;
        this.clickDamage = 1;
        this.clickCritChanceLevel = 0;
        this.clickCritDamageLevel = 0;
        this.heroCritChanceLevel = 0;
        this.heroCritDamageLevel = 0;
        this.heroDpsLevel = 0;
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.clearBossTimer();
        this.pendingBossEntry = false;
        this.heroes.forEach((hero) => {
            hero.resetProgress();
        });
        this.gachaTokens = 0;
        this.resetSkillStates();
        if (this.skillLevels) {
            SKILLS.forEach((skill) => {
                this.skillLevels.set(skill.id, DEFAULT_SKILL_LEVEL);
            });
        }
        this.skillModules = 0;
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
        this.goldGainLevel = 0;
        this.rebirthCores = 0;
        this.rebirthBranchFocus = REBIRTH_BRANCH_FOCUS_FALLBACK;
        this.initializeRebirthNodes({});
        this.initializeMissions({});
    }

    toJSON() {
        return {
            gold: this.gold,
            clickLevel: this.clickLevel,
            clickDamage: this.clickDamage,
            clickCritChanceLevel: this.clickCritChanceLevel,
            clickCritDamageLevel: this.clickCritDamageLevel,
            heroCritChanceLevel: this.heroCritChanceLevel,
            heroCritDamageLevel: this.heroCritDamageLevel,
            heroDpsLevel: this.heroDpsLevel,
            goldGainLevel: this.goldGainLevel,
            lastSave: Date.now(),
            enemy: this.enemy.toJSON(),
            heroes: this.heroes.map((hero) => hero.toJSON()),
            sortOrder: this.sortOrder,
            skills: this.serializeSkills(),
            inventory: this.inventory,
            equipped: this.equipped,
            upgradeMaterials: this.upgradeMaterials,
            skillModules: this.skillModules,
            highestStage: this.highestStage,
            currentRunHighestStage: this.currentRunHighestStage,
            bossDeadline: this.bossDeadline,
            pendingBossEntry: this.pendingBossEntry,
            gachaTokens: this.gachaTokens,
            rebirthPoints: this.rebirthPoints,
            rebirthCores: this.rebirthCores,
            rebirthBranchFocus: this.rebirthBranchFocus,
            totalRebirths: this.totalRebirths,
            rebirthNodes: this.rebirthNodes,
            rebirthSkills: this.rebirthNodes,
            missions: this.serializeMissions(),
        };
    }

    initializeRebirthNodes(savedNodes, legacySkills = null) {
        this.rebirthNodes = {};
        REBIRTH_NODES.forEach((node) => {
            const candidates = [savedNodes?.[node.id], legacySkills?.[node.id]];
            const savedLevel = candidates
                .map((value) => Number(value))
                .find((value) => Number.isFinite(value));
            const normalizedLevel = clampRebirthNodeLevel(node, savedLevel);
            this.rebirthNodes[node.id] = normalizedLevel;
        });
    }

    initializeMissions(savedMissions) {
        this.missionProgress = {};
        const now = Date.now();
        MISSIONS.forEach((mission) => {
            const saved = savedMissions?.[mission.id] ?? null;
            const interval = getMissionResetInterval(mission);
            const savedResetAt = Number(saved?.resetAt);
            const savedType = typeof saved?.type === 'string' ? saved.type : null;
            const hasMatchingType = !savedType || savedType === mission.type;
            const hasValidReset =
                Boolean(interval) && Number.isFinite(savedResetAt) && savedResetAt > now && hasMatchingType;
            const resetAt = interval
                ? hasValidReset
                    ? Math.floor(savedResetAt)
                    : calculateNextMissionResetTime(interval, now)
                : null;

            const expired = Boolean(interval) && (!hasValidReset || !hasMatchingType);
            const rawProgress = Number(saved?.progress ?? 0);
            const sanitizedProgress = Number.isFinite(rawProgress) ? Math.max(0, Math.floor(rawProgress)) : 0;
            const baseProgress = expired ? 0 : sanitizedProgress;
            const completed = !expired && (saved?.completed ?? baseProgress >= mission.goal);
            const claimed = !expired && (saved?.claimed ?? false);
            const normalizedProgress = Math.min(
                mission.goal,
                completed ? Math.max(baseProgress, mission.goal) : baseProgress,
            );

            this.missionProgress[mission.id] = {
                progress: normalizedProgress,
                completed: Boolean(completed),
                claimed: Boolean(claimed),
                resetAt: interval ? resetAt : null,
                type: mission.type,
            };
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
                    resetAt: Number.isFinite(state.resetAt) ? Math.floor(state.resetAt) : null,
                    type: state.type ?? mission.type,
                };
            }
            return acc;
        }, {});
    }

    checkMissionResets(now = Date.now()) {
        const resets = [];
        MISSIONS.forEach((mission) => {
            let state = this.missionProgress[mission.id];
            const interval = getMissionResetInterval(mission);
            if (!state) {
                this.missionProgress[mission.id] = {
                    progress: 0,
                    completed: false,
                    claimed: false,
                    resetAt: interval ? calculateNextMissionResetTime(interval, now) : null,
                    type: mission.type,
                };
                state = this.missionProgress[mission.id];
            }
            if (!interval) {
                state.resetAt = null;
                state.type = mission.type;
                return;
            }
            const resetAt = Number(state.resetAt);
            const previousType = state.type;
            const needsReset =
                !Number.isFinite(resetAt) ||
                resetAt <= now ||
                (typeof previousType === 'string' && previousType !== mission.type);
            if (needsReset) {
                const previous = {
                    progress: state.progress,
                    completed: state.completed,
                    claimed: state.claimed,
                };
                state.progress = 0;
                state.completed = false;
                state.claimed = false;
                state.resetAt = calculateNextMissionResetTime(interval, now);
                state.type = mission.type;
                resets.push({ mission, state, previous });
            } else {
                state.type = mission.type;
                if (Number.isFinite(state.resetAt)) {
                    state.resetAt = Math.floor(state.resetAt);
                }
            }
        });
        if (resets.length > 0) {
            this.lastSave = now;
        }
        return resets;
    }

    getMissionState(missionId) {
        const state = this.missionProgress[missionId];
        if (state) {
            return state;
        }
        const mission = MISSION_MAP.get(missionId);
        const interval = getMissionResetInterval(mission);
        return {
            progress: 0,
            completed: false,
            claimed: false,
            resetAt: interval ? calculateNextMissionResetTime(interval) : null,
            type: mission?.type ?? null,
        };
    }

    progressMissions(trigger, amount = 1) {
        this.checkMissionResets();
        const now = Date.now();
        const normalizedAmount = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
        if (normalizedAmount <= 0) {
            return [];
        }
        const completed = [];
        MISSIONS.forEach((mission) => {
            if (mission.trigger !== trigger) return;
            let state = this.missionProgress[mission.id];
            if (!state) {
                state = { ...this.getMissionState(mission.id) };
                this.missionProgress[mission.id] = state;
            }
            state.type = mission.type;
            const interval = getMissionResetInterval(mission);
            if (interval) {
                if (!Number.isFinite(state.resetAt) || state.resetAt <= now) {
                    state.resetAt = calculateNextMissionResetTime(interval, now);
                }
            } else {
                state.resetAt = null;
            }
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
        this.checkMissionResets();
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

    getBondSummary() {
        return this.heroes.reduce((acc, hero) => {
            if (!hero?.isUnlocked) return acc;
            const effects = hero.getBondEffects();
            Object.entries(effects).forEach(([effectId, value]) => {
                const numeric = Number(value);
                if (!Number.isFinite(numeric)) return;
                acc[effectId] = (acc[effectId] ?? 0) + numeric;
            });
            return acc;
        }, {});
    }

    getBondEffect(effectId) {
        if (!effectId) return 0;
        return this.heroes.reduce((total, hero) => {
            if (!hero?.isUnlocked) return total;
            const effects = hero.getBondEffects();
            const value = Number(effects[effectId] ?? 0);
            return total + (Number.isFinite(value) ? value : 0);
        }, 0);
    }

    getHeroEffectiveDps(hero) {
        if (!hero) return 0;
        const base = hero.damagePerSecond;
        if (base <= 0) return 0;
        return (
            base * (hero.bondSelfMultiplier ?? 1) * (1 + this.heroBonus) * this.heroCritAverageMultiplier
        );
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
        const modifiers = this.enemy.getStageModifiers(stage);
        const stageBonus = Number.isFinite(modifiers.gachaDropBonus) ? modifiers.gachaDropBonus : 0;
        const bonus = this.gachaDropBonus + stageBonus;
        const finalChance = clampProbability(baseChance + bonus);
        if (Math.random() > finalChance) return null;
        this.gachaTokens += 1;
        this.lastSave = Date.now();
        return { amount: 1, baseChance, chance: finalChance, isBoss };
    }

    tryDropEquipment(stage) {
        const isBoss = stage % BOSS_STAGE_INTERVAL === 0;
        const baseChance = isBoss ? EQUIPMENT_BOSS_DROP_CHANCE : EQUIPMENT_DROP_CHANCE;
        const modifiers = this.enemy.getStageModifiers(stage);
        const stageBonus = Number.isFinite(modifiers.equipmentDropBonus) ? modifiers.equipmentDropBonus : 0;
        const bonusMultiplier = Math.max(0, 1 + this.equipmentDropBonus + stageBonus);
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
    HERO_RARITIES,
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
    HERO_CRIT_CHANCE_UPGRADE_CONFIG,
    HERO_CRIT_DAMAGE_UPGRADE_CONFIG,
    HERO_DPS_UPGRADE_CONFIG,
    GOLD_GAIN_UPGRADE_CONFIG,
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
    MISSIONS,
    MISSION_GROUPS,
};
