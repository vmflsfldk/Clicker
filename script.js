const formatNumber = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    if (value >= 100) return Math.round(value).toString();
    if (value >= 10) return value.toFixed(1);
    if (value > 0) return value.toFixed(2);
    return '0';
};

const defaultHeroes = [
    {
        id: 'blade',
        name: '칼날 수련생',
        description: '초보지만 꾸준한 DPS를 제공하는 영웅.',
        baseCost: 25,
        costMultiplier: 1.08,
        baseDamage: 5,
    },
    {
        id: 'archer',
        name: '달빛 궁수',
        description: '빠른 속도로 화살을 쏘아 안정적인 피해를 입힙니다.',
        baseCost: 120,
        costMultiplier: 1.1,
        baseDamage: 18,
    },
    {
        id: 'mage',
        name: '마나 현자',
        description: '강력한 원소 마법으로 적을 녹입니다.',
        baseCost: 450,
        costMultiplier: 1.12,
        baseDamage: 75,
    },
    {
        id: 'assassin',
        name: '그림자 암살자',
        description: '중첩되는 출혈을 남기는 치명타 전문가.',
        baseCost: 1800,
        costMultiplier: 1.14,
        baseDamage: 220,
    },
    {
        id: 'samurai',
        name: '도깨비 사무라이',
        description: '일격필살! 강력한 단일 공격으로 보스를 처치합니다.',
        baseCost: 5200,
        costMultiplier: 1.15,
        baseDamage: 620,
    },
];

const EQUIPMENT_TYPES = [
    { id: 'tap', label: '탭 대미지', description: '클릭 공격력을 증가시킵니다.' },
    { id: 'hero', label: '용병 DPS', description: '자동 전투의 효율이 올라갑니다.' },
    { id: 'skill', label: '스킬 효율', description: '광분 스킬의 지속 시간이 늘어나고 배율이 강화됩니다.' },
];

const EQUIPMENT_BASE_NAMES = {
    tap: ['격투 장갑', '폭풍의 검집', '강화 건틀릿', '전설의 단검'],
    hero: ['용병 깃발', '전략의 서', '전투 북', '사령관의 망토'],
    skill: ['마법 부적', '고대 주문서', '신비한 수정', '시간의 모래시계'],
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
    },
];

const EQUIPMENT_MAX_VALUE = 0.6;
const EQUIPMENT_UPGRADE_RATE = 0.2;

const clampEquipmentValue = (value) => Math.min(EQUIPMENT_MAX_VALUE, Number(value.toFixed(3)));
const calculateEquipmentValue = (baseValue, level = 1) => {
    const normalizedLevel = Math.max(1, Math.floor(level));
    const multiplier = 1 + EQUIPMENT_UPGRADE_RATE * (normalizedLevel - 1);
    return clampEquipmentValue(baseValue * multiplier);
};

const EQUIPMENT_DROP_CHANCE = 0.2;
const EQUIPMENT_BOSS_DROP_CHANCE = 0.45;

const EQUIPMENT_RARITY_MAP = new Map(EQUIPMENT_RARITIES.map((rarity) => [rarity.id, rarity]));
const EQUIPMENT_TYPE_MAP = new Map(EQUIPMENT_TYPES.map((type) => [type.id, type]));

const BOSS_STAGE_INTERVAL = 5;
const BOSS_TIME_LIMIT = 30000;
const BOSS_TIME_LIMIT_SECONDS = Math.floor(BOSS_TIME_LIMIT / 1000);
const BOSS_WARNING_THRESHOLD = 5000;

const REBIRTH_STAGE_REQUIREMENT = 100;

const REBIRTH_EFFECT_LABELS = {
    tap: '탭 대미지',
    hero: '용병 DPS',
    skill: '스킬 효율',
    gold: '골드 획득',
};

const REBIRTH_SKILLS = [
    {
        id: 'tapPower',
        name: '환생의 일격',
        description: '환생의 힘으로 손끝을 강화해 더 강한 일격을 날립니다.',
        effectDescription: '레벨당 탭 대미지 +10%',
        effect: { tap: 0.1 },
        baseCost: 2,
        costGrowth: 2,
        maxLevel: 10,
    },
    {
        id: 'heroCommand',
        name: '전장의 지휘',
        description: '환생의 기억으로 용병들의 전투력을 끌어올립니다.',
        effectDescription: '레벨당 용병 DPS +8%',
        effect: { hero: 0.08 },
        baseCost: 2,
        costGrowth: 3,
        maxLevel: 10,
    },
    {
        id: 'manaOverflow',
        name: '마력 홍수',
        description: '끝없이 솟아나는 마력으로 광분 스킬을 강화합니다.',
        effectDescription: '레벨당 스킬 효율 +6%',
        effect: { skill: 0.06 },
        baseCost: 3,
        costGrowth: 3,
        maxLevel: 10,
    },
    {
        id: 'goldSense',
        name: '황금 감각',
        description: '적의 약점을 꿰뚫어 더 많은 전리품을 챙깁니다.',
        effectDescription: '레벨당 골드 획득 +5%',
        effect: { gold: 0.05 },
        baseCost: 4,
        costGrowth: 4,
        maxLevel: 10,
    },
];

const REBIRTH_SKILL_MAP = new Map(REBIRTH_SKILLS.map((skill) => [skill.id, skill]));

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

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
    const pool = EQUIPMENT_BASE_NAMES[typeId] ?? ['신비한 장비'];
    return randomFromArray(pool);
};

const generateEquipmentItem = (stage, isBoss) => {
    const rarity = chooseRarity(isBoss);
    const type = randomFromArray(EQUIPMENT_TYPES);
    const [min, max] = rarity.valueRange;
    const stageBonus = 1 + Math.min(stage, 150) * 0.002;
    const baseValue = clampEquipmentValue((min + Math.random() * (max - min)) * stageBonus);
    const value = calculateEquipmentValue(baseValue, 1);
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
    };
};

class Hero {
    constructor({ id, name, description, baseCost, baseDamage, costMultiplier }, savedState) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.baseCost = baseCost;
        this.baseDamage = baseDamage;
        this.costMultiplier = costMultiplier;
        this.level = savedState?.level ?? 0;
    }

    get damagePerSecond() {
        if (this.level === 0) return 0;
        const scalingBonus = 1 + Math.floor(this.level / 10) * 0.2;
        return this.baseDamage * this.level * scalingBonus;
    }

    get nextCost() {
        const cost = this.baseCost * Math.pow(this.costMultiplier, this.level);
        return Math.ceil(cost);
    }

    levelUp(playerGold) {
        const cost = this.nextCost;
        if (playerGold < cost) return { success: false, message: '골드가 부족합니다.' };
        this.level += 1;
        return { success: true, cost };
    }

    toJSON() {
        return { id: this.id, level: this.level };
    }
}

class Enemy {
    constructor(stage = 1, savedState) {
        this.stage = stage;
        this.baseNames = ['고블린 정찰병', '스켈레톤 창병', '늑대 인간', '오크 버서커', '암흑 기사'];
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
        const index = Math.floor((this.stage - 1) % this.baseNames.length);
        const suffix = this.stage % BOSS_STAGE_INTERVAL === 0 ? ' (보스)' : '';
        return `${this.baseNames[index]}${suffix}`;
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
        this.clickLevel = saved?.clickLevel ?? 1;
        this.clickDamage = saved?.clickDamage ?? 1;
        this.lastSave = saved?.lastSave ?? Date.now();
        this.frenzyCooldown = saved?.frenzyCooldown ?? 0;
        this.frenzyActiveUntil = saved?.frenzyActiveUntil ?? 0;
        this.enemy = new Enemy(saved?.enemy?.stage ?? 1, saved?.enemy);
        const heroStates = saved?.heroes ?? [];
        this.heroes = defaultHeroes.map((hero) => new Hero(hero, heroStates.find((h) => h.id === hero.id)));
        this.sortOrder = saved?.sortOrder ?? 'cost';
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
        this.normalizeEquippedState();
        const savedBossDeadline = Number(saved?.bossDeadline ?? 0);
        this.bossDeadline = Number.isFinite(savedBossDeadline)
            ? Math.max(0, Math.floor(savedBossDeadline))
            : 0;
        if (!this.isBossStage()) {
            this.clearBossTimer();
        } else if (this.bossDeadline === 0) {
            this.startBossTimer();
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
        const equipment = this.getEquippedItem('tap')?.value ?? 0;
        return equipment + this.getRebirthBonusValue('tap');
    }

    get heroBonus() {
        const equipment = this.getEquippedItem('hero')?.value ?? 0;
        return equipment + this.getRebirthBonusValue('hero');
    }

    get skillBonus() {
        const equipment = this.getEquippedItem('skill')?.value ?? 0;
        return equipment + this.getRebirthBonusValue('skill');
    }

    get goldBonus() {
        return this.getRebirthBonusValue('gold');
    }

    get pendingRebirthPoints() {
        return calculateRebirthPoints(this.currentRunHighestStage);
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
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.clearBossTimer();
        this.heroes.forEach((hero) => {
            hero.level = 0;
        });
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

    applyClick() {
        const damage = this.effectiveClickDamage;
        const defeated = this.enemy.applyDamage(damage);
        return { damage, defeated };
    }

    awardGold(amount) {
        this.gold += amount;
    }

    enemyReward() {
        const bossMultiplier = this.isBossStage() ? 5 : 1;
        const bonusMultiplier = 1 + this.goldBonus;
        return Math.ceil((10 + this.enemy.stage * 2) * bossMultiplier * bonusMultiplier);
    }

    levelUpClick() {
        const cost = Math.ceil(10 * Math.pow(1.2, this.clickLevel - 1));
        if (this.gold < cost) {
            return { success: false, message: '골드가 부족합니다.' };
        }
        this.gold -= cost;
        this.clickLevel += 1;
        this.clickDamage = Math.ceil(this.clickDamage + 1 + Math.pow(1.12, this.clickLevel));
        return { success: true, cost };
    }

    buyHero(heroId) {
        const hero = this.heroes.find((h) => h.id === heroId);
        if (!hero) return { success: false, message: '알 수 없는 영웅입니다.' };
        const { success, cost, message } = hero.levelUp(this.gold);
        if (!success) return { success, message };
        this.gold -= cost;
        return { success: true, hero };
    }

    isBossStage(stage = this.enemy.stage) {
        if (!Number.isFinite(stage) || stage <= 0) return false;
        return stage % BOSS_STAGE_INTERVAL === 0;
    }

    startBossTimer() {
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
        return { failedStage, revertedStage };
    }

    goNextEnemy() {
        const defeatedStage = this.enemy.stage;
        const reward = this.enemyReward();
        this.gold += reward;
        const drop = this.tryDropEquipment(defeatedStage);
        this.highestStage = Math.max(this.highestStage, defeatedStage);
        this.currentRunHighestStage = Math.max(this.currentRunHighestStage, defeatedStage);
        this.enemy.advanceStage();
        if (this.isBossStage()) {
            this.startBossTimer();
        } else {
            this.clearBossTimer();
        }
        return { reward, drop, defeatedStage };
    }

    reset() {
        this.gold = 0;
        this.clickLevel = 1;
        this.clickDamage = 1;
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.clearBossTimer();
        this.heroes.forEach((hero) => {
            hero.level = 0;
        });
        this.frenzyCooldown = 0;
        this.frenzyActiveUntil = 0;
        this.inventory = [];
        this.equipped = {};
        EQUIPMENT_TYPES.forEach(({ id }) => {
            this.equipped[id] = null;
        });
        this.highestStage = 0;
        this.currentRunHighestStage = 0;
        this.rebirthPoints = 0;
        this.totalRebirths = 0;
        this.initializeRebirthSkills({});
    }

    toJSON() {
        return {
            gold: this.gold,
            clickLevel: this.clickLevel,
            clickDamage: this.clickDamage,
            lastSave: Date.now(),
            enemy: this.enemy.toJSON(),
            heroes: this.heroes.map((hero) => hero.toJSON()),
            sortOrder: this.sortOrder,
            frenzyCooldown: this.frenzyCooldown,
            frenzyActiveUntil: this.frenzyActiveUntil,
            inventory: this.inventory,
            equipped: this.equipped,
            highestStage: this.highestStage,
            currentRunHighestStage: this.currentRunHighestStage,
            bossDeadline: this.bossDeadline,
            rebirthPoints: this.rebirthPoints,
            totalRebirths: this.totalRebirths,
            rebirthSkills: this.rebirthSkills,
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

    normalizeEquipmentItem(item) {
        if (!item) return null;
        const type = EQUIPMENT_TYPE_MAP.has(item.type) ? item.type : null;
        if (!type) return null;
        const rarity = EQUIPMENT_RARITY_MAP.has(item.rarity) ? item.rarity : 'common';
        const rarityData = EQUIPMENT_RARITY_MAP.get(rarity);
        const rawBaseValue = Number(item.baseValue ?? item.value ?? 0);
        const baseValue = clampEquipmentValue(Math.max(0, Number.isFinite(rawBaseValue) ? rawBaseValue : 0));
        const rawMaxLevel = Number(item.maxLevel ?? rarityData?.maxLevel ?? 3);
        const maxLevel = Math.max(1, Math.floor(Number.isFinite(rawMaxLevel) ? rawMaxLevel : 1));
        const rawLevel = Number(item.level ?? 1);
        const level = Math.min(maxLevel, Math.max(1, Math.floor(Number.isFinite(rawLevel) ? rawLevel : 1)));
        const value = calculateEquipmentValue(baseValue, level);
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

    canUpgradeEquipment(item) {
        if (!item) return false;
        if (item.level >= item.maxLevel) return false;
        return this.inventory.some(
            (entry) => entry.id !== item.id && entry.type === item.type && entry.rarity === item.rarity,
        );
    }

    upgradeEquipment(itemId) {
        const index = this.inventory.findIndex((entry) => entry.id === itemId);
        if (index === -1) {
            return { success: false, message: '장비를 찾을 수 없습니다.' };
        }
        const item = this.inventory[index];
        if (item.level >= item.maxLevel) {
            return { success: false, message: '이미 최대 강화 단계입니다.' };
        }
        const candidates = [];
        this.inventory.forEach((entry, entryIndex) => {
            if (entry.id === item.id) return;
            if (entry.type !== item.type || entry.rarity !== item.rarity) return;
            candidates.push({ entry, entryIndex });
        });
        if (candidates.length === 0) {
            return { success: false, message: '강화에 사용할 동일한 장비가 부족합니다.' };
        }

        const preferred = candidates.find(({ entry }) => this.equipped[item.type] !== entry.id);
        const chosen = preferred ?? candidates[0];
        const { entry: consumed, entryIndex } = chosen;
        const wasEquipped = this.equipped[item.type] === consumed.id;
        this.inventory.splice(entryIndex, 1);
        if (wasEquipped) {
            this.equipped[item.type] = null;
        }

        const previousLevel = item.level;
        const previousValue = item.value;
        if (!Number.isFinite(item.baseValue) || item.baseValue <= 0) {
            item.baseValue = previousValue;
        }
        item.level = Math.min(item.maxLevel, item.level + 1);
        item.value = calculateEquipmentValue(item.baseValue, item.level);

        this.normalizeEquippedState();
        const currentlyEquipped = this.getEquippedItem(item.type);
        if (!currentlyEquipped || currentlyEquipped.id === item.id || item.value > currentlyEquipped.value) {
            this.equipped[item.type] = item.id;
        }
        this.lastSave = Date.now();
        return {
            success: true,
            item,
            consumed,
            consumedWasEquipped: wasEquipped,
            previousLevel,
            previousValue,
        };
    }

    getEquipmentBonuses() {
        return EQUIPMENT_TYPES.reduce((acc, { id }) => {
            acc[id] = this.getEquippedItem(id)?.value ?? 0;
            return acc;
        }, {});
    }

    getHeroEffectiveDps(hero) {
        return hero.damagePerSecond * (1 + this.heroBonus);
    }

    addEquipment(item) {
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
            return { success: false, message: '장비를 찾을 수 없습니다.' };
        }
        const previous = this.getEquippedItem(item.type);
        this.equipped[item.type] = item.id;
        return { success: true, item, previous };
    }

    tryDropEquipment(stage) {
        const isBoss = stage % BOSS_STAGE_INTERVAL === 0;
        const dropChance = isBoss ? EQUIPMENT_BOSS_DROP_CHANCE : EQUIPMENT_DROP_CHANCE;
        if (Math.random() > dropChance) return null;
        const item = generateEquipmentItem(stage, isBoss);
        const result = this.addEquipment(item);
        return {
            item,
            autoEquipped: result.autoEquipped,
            replaced: result.replaced,
            isBoss,
        };
    }
}

const UI = {
    stage: document.getElementById('stage'),
    gold: document.getElementById('gold'),
    clickDamage: document.getElementById('clickDamage'),
    totalDps: document.getElementById('totalDps'),
    enemyName: document.getElementById('enemyName'),
    enemyCurrentHp: document.getElementById('enemyCurrentHp'),
    enemyMaxHp: document.getElementById('enemyMaxHp'),
    enemyHealthBar: document.getElementById('enemyHealthBar'),
    bossTimer: document.getElementById('bossTimer'),
    tapButton: document.getElementById('tapButton'),
    enemy: document.getElementById('enemy'),
    heroList: document.getElementById('heroList'),
    upgradeClick: document.getElementById('upgradeClick'),
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
    equipmentSlots: document.getElementById('equipmentSlots'),
    equipmentInventory: document.getElementById('equipmentInventory'),
    equipmentEmpty: document.getElementById('equipmentEmpty'),
    panelTabButtons: document.querySelectorAll('[data-tab-target]'),
    panelViews: document.querySelectorAll('[data-tab]'),
};

class GameUI {
    constructor(state) {
        this.state = state;
        this.heroTemplate = document.getElementById('heroTemplate');
        this.heroElements = new Map();
        this.rebirthSkillElements = new Map();
        this.sortState = state.sortOrder;
        this.tabButtons = [];
        this.tabPanels = new Map();
        this.setupTabs();
        this.setupEvents();
        this.renderHeroes();
        this.renderEquipmentUI();
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
    }

    setupEvents() {
        UI.tapButton.addEventListener('click', () => this.handleTap());
        UI.enemy.addEventListener('click', () => this.handleTap());
        UI.upgradeClick.addEventListener('click', () => this.handleClickUpgrade());
        UI.sortHeroes.addEventListener('click', () => this.toggleHeroSort());
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
        }
    }

    renderHeroes() {
        UI.heroList.innerHTML = '';
        this.heroElements.clear();
        const sorted = [...this.state.heroes];
        if (this.sortState === 'cost') {
            sorted.sort((a, b) => a.nextCost - b.nextCost);
        } else {
            sorted.sort((a, b) => this.state.getHeroEffectiveDps(b) - this.state.getHeroEffectiveDps(a));
        }
        sorted.forEach((hero) => this.addHero(hero));
    }

    addHero(hero) {
        const node = this.heroTemplate.content.firstElementChild.cloneNode(true);
        node.dataset.heroId = hero.id;
        const name = node.querySelector('.hero__name');
        const desc = node.querySelector('.hero__desc');
        const level = node.querySelector('.hero__level');
        const dps = node.querySelector('.hero__dps');
        const button = node.querySelector('.btn');

        name.textContent = hero.name;
        desc.textContent = hero.description;
        level.textContent = `Lv. ${hero.level}`;
        dps.textContent = `DPS: ${formatNumber(this.state.getHeroEffectiveDps(hero))}`;
        const costText = formatNumber(hero.nextCost);
        button.textContent = hero.level === 0 ? `${costText} 골드로 채용` : `레벨 업 (${costText} 골드)`;
        button.disabled = hero.nextCost > this.state.gold;
        button.addEventListener('click', () => this.handleHeroLevelUp(hero.id));

        UI.heroList.appendChild(node);
        this.heroElements.set(hero.id, { node, level, dps, button });
    }

    updateHero(hero) {
        const heroUI = this.heroElements.get(hero.id);
        if (!heroUI) return;
        heroUI.level.textContent = `Lv. ${hero.level}`;
        heroUI.dps.textContent = `DPS: ${formatNumber(this.state.getHeroEffectiveDps(hero))}`;
        const costText = formatNumber(hero.nextCost);
        heroUI.button.textContent = hero.level === 0 ? `${costText} 골드로 채용` : `레벨 업 (${costText} 골드)`;
        heroUI.button.disabled = hero.nextCost > this.state.gold;
    }

    updateHeroes() {
        this.state.heroes.forEach((hero) => this.updateHero(hero));
    }

    renderEquipmentUI() {
        this.renderEquipmentSlots();
        this.renderEquipmentInventory();
        this.updateEquipmentSummary();
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
        const equipmentElements = {
            tap: UI.equipmentTapBonus,
            hero: UI.equipmentHeroBonus,
            skill: UI.equipmentSkillBonus,
        };

        const summaryData = EQUIPMENT_TYPES.map(({ id, label }) => {
            const equipmentValue = equipmentBonuses[id] ?? 0;
            const rebirthValue = rebirthBonuses[id] ?? 0;
            this.setBonusDisplay(equipmentElements[id], equipmentValue, rebirthValue);
            return { label, equipmentValue, rebirthValue };
        });

        if (UI.equipmentSummary) {
            const summaryText = summaryData
                .map(({ label, equipmentValue, rebirthValue }) => {
                    const total = (equipmentValue ?? 0) + (rebirthValue ?? 0);
                    return `${label} +${formatPercent(total)}`;
                })
                .filter(Boolean)
                .join(' · ');
            UI.equipmentSummary.textContent = summaryText || '추가 보너스 없음';

            const tooltipParts = summaryData.map(({ label, equipmentValue, rebirthValue }) => {
                const breakdown = this.buildBonusBreakdown(equipmentValue, rebirthValue);
                return `${label}: ${breakdown}`;
            });
            UI.equipmentSummary.title = tooltipParts.length > 0 ? tooltipParts.join('\n') : '추가 보너스 없음';
        }
    }

    setBonusDisplay(element, equipmentValue = 0, rebirthValue = 0) {
        if (!element) return;
        const total = (equipmentValue ?? 0) + (rebirthValue ?? 0);
        element.textContent = `+${formatPercent(total)}`;
        element.title = this.buildBonusBreakdown(equipmentValue, rebirthValue);
    }

    buildBonusBreakdown(equipmentValue = 0, rebirthValue = 0) {
        const parts = [];
        if (equipmentValue > 0) parts.push(`장비 ${formatPercent(equipmentValue)}`);
        if (rebirthValue > 0) parts.push(`환생 ${formatPercent(rebirthValue)}`);
        if (parts.length === 0) return '추가 보너스 없음';
        return parts.join(' / ');
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
                value.textContent = `+${formatPercent(item.value)}`;
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

    renderEquipmentInventory() {
        if (!UI.equipmentInventory) return;
        UI.equipmentInventory.innerHTML = '';
        const items = [...this.state.inventory];
        items.sort((a, b) => {
            const rarityA = EQUIPMENT_RARITY_MAP.get(a.rarity)?.rank ?? 0;
            const rarityB = EQUIPMENT_RARITY_MAP.get(b.rarity)?.rank ?? 0;
            if (rarityA !== rarityB) return rarityB - rarityA;
            if (a.value !== b.value) return b.value - a.value;
            return a.name.localeCompare(b.name, 'ko');
        });

        if (UI.equipmentEmpty) {
            UI.equipmentEmpty.style.display = items.length === 0 ? 'block' : 'none';
        }

        items.forEach((item) => {
            const type = EQUIPMENT_TYPE_MAP.get(item.type);
            const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
            const equipped = this.state.equipped[item.type] === item.id;

            const entry = document.createElement('li');
            entry.className = 'equipment-item';
            entry.dataset.rarity = item.rarity;
            entry.dataset.equipped = equipped ? 'true' : 'false';

            const info = document.createElement('div');
            info.className = 'equipment-item__info';

            const name = document.createElement('span');
            name.className = 'equipment-item__name';
            const rarityLabel = rarity ? `[${rarity.name}] ` : '';
            name.textContent = `${rarityLabel}${item.name}`;

            const details = document.createElement('span');
            details.className = 'equipment-item__details';
            const typeLabel = type?.label ?? '장비';
            details.textContent = `${typeLabel} +${formatPercent(item.value)} · Lv. ${item.level}/${item.maxLevel} · 스테이지 ${item.stage}`;

            info.append(name, details);

            const actions = document.createElement('div');
            actions.className = 'equipment-item__actions';

            const materials = this.state.inventory.filter(
                (other) => other.id !== item.id && other.type === item.type && other.rarity === item.rarity,
            );
            const upgradeAvailable = item.level < item.maxLevel && materials.length > 0;

            const upgradeButton = document.createElement('button');
            upgradeButton.className = 'btn btn-upgrade equipment-item__upgrade';
            upgradeButton.dataset.upgradeId = item.id;
            if (item.level >= item.maxLevel) {
                upgradeButton.textContent = '최대 강화';
                upgradeButton.disabled = true;
                upgradeButton.title = '이미 최대 강화 단계입니다.';
            } else {
                upgradeButton.textContent = '강화';
                upgradeButton.disabled = !upgradeAvailable;
                if (!upgradeAvailable) {
                    upgradeButton.title = '동일 타입·등급의 장비가 추가로 필요합니다.';
                } else {
                    upgradeButton.title = `강화에 동일 타입·등급 장비 1개가 소모됩니다. (보유 ${materials.length}개)`;
                }
            }

            const equipButton = document.createElement('button');
            equipButton.className = 'btn btn-secondary equipment-item__equip';
            equipButton.textContent = equipped ? '장착 중' : '장착';
            equipButton.disabled = equipped;
            equipButton.dataset.equipId = item.id;

            actions.append(upgradeButton, equipButton);

            entry.append(info, actions);
            UI.equipmentInventory.appendChild(entry);
        });
    }

    handleEquipmentInventoryClick(event) {
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
            const label = type?.label ?? '장비';
            const previousLevel = result.previousLevel;
            const previousValueText = formatPercent(result.previousValue);
            const newValueText = formatPercent(result.item.value);
            this.addLog(
                `${prefix}${result.item.name} 강화 성공! Lv. ${previousLevel} → ${result.item.level}, ${label} ${previousValueText} → ${newValueText}`,
                'success',
            );
            if (result.consumed) {
                const consumedRarity = EQUIPMENT_RARITY_MAP.get(result.consumed.rarity);
                const consumedPrefix = consumedRarity ? `[${consumedRarity.name}] ` : '';
                this.addLog(
                    `소모된 장비: ${consumedPrefix}${result.consumed.name} (Lv. ${result.consumed.level}/${result.consumed.maxLevel})`,
                    'info',
                );
            }
            if (result.consumedWasEquipped) {
                this.addLog('강화 재료로 사용된 장착 장비가 해제되었습니다.', 'warning');
            }
            this.renderEquipmentSlots();
            this.renderEquipmentInventory();
            this.updateStats();
            this.updateHeroes();
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
        const bonusText = `${type?.label ?? '장비'} +${formatPercent(result.item.value)} · Lv. ${result.item.level}/${result.item.maxLevel}`;
        this.addLog(`${prefix}${result.item.name}을 장착했습니다. ${bonusText}`, 'success');
        if (result.previous && result.previous.id !== result.item.id) {
            const previousRarity = EQUIPMENT_RARITY_MAP.get(result.previous.rarity);
            const previousPrefix = previousRarity ? `[${previousRarity.name}] ` : '';
            this.addLog(
                `이전 장비 ${previousPrefix}${result.previous.name} (Lv. ${result.previous.level}/${result.previous.maxLevel})은 인벤토리에 보관됩니다.`,
                'info',
            );
        }
        this.renderEquipmentSlots();
        this.renderEquipmentInventory();
        this.updateStats();
        this.updateHeroes();
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
        saveGame(this.state);
    }

    handleEquipmentDrop(drop) {
        const { item, autoEquipped, replaced } = drop;
        const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
        const type = EQUIPMENT_TYPE_MAP.get(item.type);
        const prefix = rarity ? `[${rarity.name}] ` : '';
        const bonusText = `${type?.label ?? '장비'} +${formatPercent(item.value)}`;
        const levelText = `Lv. ${item.level}/${item.maxLevel}`;
        const autoText = autoEquipped ? ' (자동 장착)' : '';
        this.addLog(`${prefix}${item.name}을 획득했습니다! ${bonusText} · ${levelText}${autoText}`, 'success');
        if (autoEquipped && replaced) {
            const replacedRarity = EQUIPMENT_RARITY_MAP.get(replaced.rarity);
            const replacedPrefix = replacedRarity ? `[${replacedRarity.name}] ` : '';
            this.addLog(
                `기존 ${type?.label ?? '장비'} ${replacedPrefix}${replaced.name} (Lv. ${replaced.level}/${replaced.maxLevel})이(가) 인벤토리로 이동했습니다.`,
                'info',
            );
        } else if (!autoEquipped) {
            this.addLog(`${type?.label ?? '장비'} 장비가 기존보다 약해 자동 장착되지 않았습니다.`, 'info');
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
        UI.clickDamage.textContent = formatNumber(this.state.effectiveClickDamage);
        UI.totalDps.textContent = formatNumber(this.state.totalDps);
        const clickCost = Math.ceil(10 * Math.pow(1.2, this.state.clickLevel - 1));
        UI.upgradeClick.textContent = `레벨 업 (${formatNumber(clickCost)} 골드)`;
        this.updateEquipmentSummary();
        this.updateRebirthUI();
    }

    updateFrenzyUI() {
        const now = Date.now();
        const remainingCooldown = Math.max(0, this.state.frenzyCooldown - now);
        if (this.state.isFrenzyActive) {
            const secondsLeft = ((this.state.frenzyActiveUntil - now) / 1000).toFixed(1);
            UI.skillCooldown.textContent = `광분 지속: ${secondsLeft}s`;
            UI.skillFrenzy.disabled = true;
        } else if (remainingCooldown > 0) {
            const seconds = Math.ceil(remainingCooldown / 1000);
            UI.skillCooldown.textContent = `쿨타임: ${seconds}s`;
            UI.skillFrenzy.disabled = true;
        } else {
            UI.skillCooldown.textContent = '사용 가능';
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

    updateUI() {
        this.updateStats();
        this.updateHeroes();
        this.updateEnemy();
        this.updateFrenzyUI();
        this.updateBossTimerUI();
    }

    handleTap() {
        const { damage, defeated } = this.state.applyClick();
        this.showDamageIndicator(damage);
        if (defeated) {
            this.handleEnemyDefeat();
        }
        this.updateUI();
    }

    showDamageIndicator(damage) {
        const indicator = UI.damageIndicator;
        indicator.textContent = `-${formatNumber(damage)}`;
        indicator.style.opacity = '1';
        indicator.style.transform = 'translate(-50%, -60%)';
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translate(-50%, -40%)';
        }, 180);
    }

    handleEnemyDefeat() {
        const previousBest = this.state.currentRunHighestStage;
        const { reward, drop, defeatedStage } = this.state.goNextEnemy();
        this.addLog(`스테이지 ${defeatedStage}의 적을 처치하고 ${formatNumber(reward)} 골드를 획득했습니다!`);
        if (drop) {
            this.handleEquipmentDrop(drop);
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
    }

    handleHeroLevelUp(heroId) {
        const result = this.state.buyHero(heroId);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        this.addLog(`${result.hero.name} 레벨이 ${result.hero.level}이 되었습니다!`);
        this.renderHeroes();
        this.updateStats();
    }

    handleClickUpgrade() {
        const result = this.state.levelUpClick();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        this.addLog(`검술 훈련 레벨이 ${this.state.clickLevel}이 되었습니다!`);
        this.updateStats();
    }

    toggleHeroSort() {
        this.sortState = this.sortState === 'cost' ? 'dps' : 'cost';
        this.state.sortOrder = this.sortState;
        this.renderHeroes();
        this.updateSortButton();
    }

    updateSortButton() {
        const label = this.sortState === 'cost' ? '비용 순' : 'DPS 순';
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
        this.updateHeroes();
        this.updateBossTimerUI();
    }

    useFrenzy() {
        const now = Date.now();
        if (this.state.frenzyCooldown > now || this.state.isFrenzyActive) {
            this.addLog('아직 스킬을 사용할 수 없습니다.', 'warning');
            return;
        }
        const baseDuration = 15000; // 15초 기본 지속
        const cooldown = 60000; // 60초 쿨타임
        const duration = Math.floor(baseDuration * (1 + this.state.skillBonus));
        const multiplier = this.state.frenzyMultiplier;
        this.state.frenzyActiveUntil = now + duration;
        this.state.frenzyCooldown = now + cooldown;
        this.addLog(
            `자동 전투 스킬 발동! ${(duration / 1000).toFixed(1)}초 동안 DPS가 ${multiplier.toFixed(1)}배입니다!`,
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
        this.renderHeroes();
        this.renderEquipmentUI();
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
