const formatNumber = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    if (value >= 100) return Math.round(value).toString();
    if (value >= 10) return value.toFixed(1);
    if (value > 0) return value.toFixed(2);
    return '0';
};

const formatPercent = (value, fractionDigits = 1) => {
    if (value === 0) return '0%';
    return `${(value * 100).toFixed(fractionDigits)}%`;
};

const toNonNegativeNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, parsed);
};

const equipmentCatalog = [
    {
        id: 'training-blade',
        name: '훈련용 검',
        description: '초보자 전사에게 지급되는 기본 검. 클릭 피해를 올려줍니다.',
        type: 'weapon',
        grade: 'C',
        stat: 'clickDamage',
        baseBonus: 0.15,
        bonusPerLevel: 0.08,
        maxLevel: 5,
        materialsPerLevel: 1,
        initialMaterials: 2,
    },
    {
        id: 'scout-armor',
        name: '정찰병의 경갑',
        description: '얇지만 가벼운 갑옷으로 영웅들의 공격 속도가 빨라집니다.',
        type: 'armor',
        grade: 'B',
        stat: 'dps',
        baseBonus: 0.12,
        bonusPerLevel: 0.07,
        maxLevel: 6,
        materialsPerLevel: 1,
        initialMaterials: 1,
    },
    {
        id: 'hunter-charm',
        name: '사냥꾼의 부적',
        description: '정밀한 타격을 도와주는 부적. 클릭 피해와 DPS를 모두 향상시킵니다.',
        type: 'trinket',
        grade: 'A',
        stat: 'allDamage',
        baseBonus: 0.1,
        bonusPerLevel: 0.05,
        maxLevel: 7,
        materialsPerLevel: 2,
        initialMaterials: 2,
    },
];

const equipmentTypeLabels = {
    weapon: '무기',
    armor: '방어구',
    trinket: '장신구',
};

const getEquipmentMaterialKey = (definition) => `${definition.type}:${definition.grade}`;

class EquipmentItem {
    constructor(definition, savedState) {
        this.id = definition.id;
        this.name = definition.name;
        this.description = definition.description;
        this.type = definition.type;
        this.grade = definition.grade;
        this.stat = definition.stat;
        this.baseBonus = definition.baseBonus;
        this.bonusPerLevel = definition.bonusPerLevel;
        this.maxLevel = definition.maxLevel;
        this.materialKey = getEquipmentMaterialKey(definition);
        this.materialsPerLevel = definition.materialsPerLevel ?? 1;
        const savedLevel = Number(savedState?.level);
        const initialLevel = Number.isFinite(savedLevel) ? savedLevel : 0;
        this.level = Math.max(0, Math.min(this.maxLevel, initialLevel));
    }

    get totalBonus() {
        return this.baseBonus + this.level * this.bonusPerLevel;
    }

    get isMaxLevel() {
        return this.level >= this.maxLevel;
    }

    increaseLevel() {
        if (this.isMaxLevel) return false;
        this.level += 1;
        return true;
    }

    toJSON() {
        return {
            id: this.id,
            level: this.level,
        };
    }
}

const createEquipmentInventory = (savedInventory) => {
    const saved = savedInventory ?? [];
    return equipmentCatalog.map((definition) => {
        const state = saved.find((item) => item.id === definition.id);
        return new EquipmentItem(definition, state);
    });
};

const createEquipmentMaterials = (savedEquipment, savedMaterials) => {
    const materials = {};
    equipmentCatalog.forEach((definition) => {
        const key = getEquipmentMaterialKey(definition);
        const savedValue = savedMaterials ? Number(savedMaterials[key]) : NaN;
        if (Number.isFinite(savedValue)) {
            materials[key] = Math.max(0, savedValue);
            return;
        }

        const savedEntry = savedEquipment?.find((item) => item.id === definition.id);
        const legacyDuplicates = savedEntry ? Number(savedEntry.duplicates) : NaN;
        if (Number.isFinite(legacyDuplicates)) {
            materials[key] = Math.max(0, legacyDuplicates);
            return;
        }

        const initial = definition.initialMaterials ?? 0;
        materials[key] = toNonNegativeNumber(initial, 0);
    });
    return materials;
};

const getEquipmentBonuses = (equipmentList) => {
    return equipmentList.reduce(
        (bonuses, item) => {
            const value = item.totalBonus;
            switch (item.stat) {
                case 'clickDamage':
                    bonuses.clickDamage += value;
                    break;
                case 'dps':
                    bonuses.dps += value;
                    break;
                case 'allDamage':
                    bonuses.clickDamage += value;
                    bonuses.dps += value;
                    break;
                default:
                    break;
            }
            return bonuses;
        },
        { clickDamage: 0, dps: 0 }
    );
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
        const suffix = this.stage % 5 === 0 ? ' (보스)' : '';
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
        this.equipment = createEquipmentInventory(saved?.equipment);
        this.equipmentMaterials = createEquipmentMaterials(saved?.equipment, saved?.equipmentMaterials);
    }

    get totalDps() {
        const heroDps = this.heroes.reduce((total, hero) => total + hero.damagePerSecond, 0);
        const frenzyMultiplier = this.isFrenzyActive ? 2 : 1;
        const dpsBonus = 1 + this.equipmentBonuses.dps;
        return heroDps * frenzyMultiplier * dpsBonus;
    }

    get isFrenzyActive() {
        return Date.now() < this.frenzyActiveUntil;
    }

    get equipmentBonuses() {
        return getEquipmentBonuses(this.equipment);
    }

    getEquipmentMaterialCount(materialKey) {
        return this.equipmentMaterials?.[materialKey] ?? 0;
    }

    canEnhanceEquipment(item) {
        if (!item || item.isMaxLevel) return false;
        return this.getEquipmentMaterialCount(item.materialKey) >= item.materialsPerLevel;
    }

    consumeEquipmentMaterial(materialKey, amount = 1) {
        if (!this.equipmentMaterials) {
            this.equipmentMaterials = {};
        }
        const current = this.getEquipmentMaterialCount(materialKey);
        const nextValue = Math.max(0, current - amount);
        this.equipmentMaterials[materialKey] = nextValue;
    }

    get effectiveClickDamage() {
        const bonusMultiplier = 1 + this.equipmentBonuses.clickDamage;
        return Math.ceil(this.clickDamage * bonusMultiplier);
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
        const bossMultiplier = this.enemy.stage % 5 === 0 ? 5 : 1;
        return Math.ceil((10 + this.enemy.stage * 2) * bossMultiplier);
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

    goNextEnemy() {
        const reward = this.enemyReward();
        this.gold += reward;
        this.enemy.advanceStage();
        return reward;
    }

    reset() {
        this.gold = 0;
        this.clickLevel = 1;
        this.clickDamage = 1;
        this.lastSave = Date.now();
        this.enemy.reset(1);
        this.heroes.forEach((hero) => {
            hero.level = 0;
        });
        this.frenzyCooldown = 0;
        this.frenzyActiveUntil = 0;
        this.equipment = createEquipmentInventory();
        this.equipmentMaterials = createEquipmentMaterials();
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
            equipment: this.equipment.map((item) => item.toJSON()),
            equipmentMaterials: this.equipmentMaterials,
        };
    }

    enhanceEquipment(equipmentId) {
        const item = this.equipment.find((equipmentItem) => equipmentItem.id === equipmentId);
        if (!item) {
            return { success: false, message: '장비를 찾을 수 없습니다.' };
        }
        if (item.isMaxLevel) {
            return { success: false, message: '이미 최대 강화 단계입니다.' };
        }
        const availableMaterials = this.getEquipmentMaterialCount(item.materialKey);
        if (availableMaterials < item.materialsPerLevel) {
            return { success: false, message: '강화에 필요한 동일 타입·등급 장비가 부족합니다.' };
        }

        const enhanced = item.increaseLevel();
        if (!enhanced) {
            return { success: false, message: '강화에 실패했습니다.' };
        }

        this.consumeEquipmentMaterial(item.materialKey, item.materialsPerLevel);

        return { success: true, item, materialKey: item.materialKey };
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
    equipmentList: document.getElementById('equipmentList'),
    equipmentSummary: document.getElementById('equipmentSummary'),
};

class GameUI {
    constructor(state) {
        this.state = state;
        this.heroTemplate = document.getElementById('heroTemplate');
        this.equipmentTemplate = document.getElementById('equipmentTemplate');
        this.heroElements = new Map();
        this.equipmentElements = new Map();
        this.sortState = state.sortOrder;
        this.setupEvents();
        this.renderHeroes();
        this.renderEquipment();
        this.updateSortButton();
        this.updateUI();
        this.startLoops();
    }

    setupEvents() {
        UI.tapButton.addEventListener('click', () => this.handleTap());
        UI.enemy.addEventListener('click', () => this.handleTap());
        UI.upgradeClick.addEventListener('click', () => this.handleClickUpgrade());
        UI.sortHeroes.addEventListener('click', () => this.toggleHeroSort());
        UI.skillFrenzy.addEventListener('click', () => this.useFrenzy());
        UI.saveProgress.addEventListener('click', () => this.manualSave());
        UI.resetProgress.addEventListener('click', () => this.resetGame());
    }

    renderHeroes() {
        UI.heroList.innerHTML = '';
        this.heroElements.clear();
        const sorted = [...this.state.heroes];
        if (this.sortState === 'cost') {
            sorted.sort((a, b) => a.nextCost - b.nextCost);
        } else {
            sorted.sort((a, b) => b.damagePerSecond - a.damagePerSecond);
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
        const dpsMultiplier = 1 + this.state.equipmentBonuses.dps;
        dps.textContent = `DPS: ${formatNumber(hero.damagePerSecond * dpsMultiplier)}`;
        const costText = formatNumber(hero.nextCost);
        button.textContent = hero.level === 0 ? `${costText} 골드로 채용` : `레벨 업 (${costText} 골드)`;
        button.disabled = hero.nextCost > this.state.gold;
        button.addEventListener('click', () => this.handleHeroLevelUp(hero.id));

        UI.heroList.appendChild(node);
        this.heroElements.set(hero.id, { node, level, dps, button });
        this.updateHero(hero);
    }

    updateHero(hero, dpsMultiplier = 1 + this.state.equipmentBonuses.dps) {
        const heroUI = this.heroElements.get(hero.id);
        if (!heroUI) return;
        heroUI.level.textContent = `Lv. ${hero.level}`;
        heroUI.dps.textContent = `DPS: ${formatNumber(hero.damagePerSecond * dpsMultiplier)}`;
        const costText = formatNumber(hero.nextCost);
        heroUI.button.textContent = hero.level === 0 ? `${costText} 골드로 채용` : `레벨 업 (${costText} 골드)`;
        heroUI.button.disabled = hero.nextCost > this.state.gold;
    }

    updateHeroes() {
        const dpsMultiplier = 1 + this.state.equipmentBonuses.dps;
        this.state.heroes.forEach((hero) => this.updateHero(hero, dpsMultiplier));
    }

    renderEquipment() {
        if (!UI.equipmentList || !this.equipmentTemplate) return;
        UI.equipmentList.innerHTML = '';
        this.equipmentElements.clear();
        this.state.equipment.forEach((item) => this.addEquipment(item));
        this.updateEquipmentSummary();
    }

    addEquipment(item) {
        const node = this.equipmentTemplate.content.firstElementChild.cloneNode(true);
        node.dataset.equipmentId = item.id;
        const name = node.querySelector('.equipment__name');
        const desc = node.querySelector('.equipment__desc');
        const grade = node.querySelector('.equipment__grade');
        const level = node.querySelector('.equipment__level');
        const bonus = node.querySelector('.equipment__bonus');
        const materials = node.querySelector('.equipment__duplicates');
        const button = node.querySelector('.btn');

        if (name) name.textContent = item.name;
        if (desc) desc.textContent = item.description;
        if (grade) {
            const typeLabel = equipmentTypeLabels[item.type] ?? item.type.toUpperCase();
            grade.textContent = `${typeLabel} · ${item.grade} 등급`;
            grade.dataset.grade = item.grade;
        }

        button.addEventListener('click', () => this.handleEquipmentEnhance(item.id));

        UI.equipmentList.appendChild(node);
        this.equipmentElements.set(item.id, { node, level, bonus, materials, button });
        this.updateEquipmentItem(item);
    }

    updateEquipmentItem(item) {
        const equipmentUI = this.equipmentElements.get(item.id);
        if (!equipmentUI) return;
        if (equipmentUI.level) {
            equipmentUI.level.textContent = `강화 단계: +${item.level} / +${item.maxLevel}`;
        }
        if (equipmentUI.bonus) {
            equipmentUI.bonus.textContent = `효과: ${this.getEquipmentBonusText(item)}`;
        }
        if (equipmentUI.materials) {
            const available = this.state.getEquipmentMaterialCount(item.materialKey);
            const typeLabel = equipmentTypeLabels[item.type] ?? item.type.toUpperCase();
            equipmentUI.materials.textContent = `재료 (${typeLabel} · ${item.grade} 등급): 필요 ${item.materialsPerLevel}개 / 보유 ${formatNumber(available)}개`;
        }
        if (item.isMaxLevel) {
            equipmentUI.button.textContent = '최대 강화';
            equipmentUI.button.disabled = true;
        } else {
            equipmentUI.button.textContent = `강화 (-${item.materialsPerLevel} 재료)`;
            equipmentUI.button.disabled = !this.state.canEnhanceEquipment(item);
        }
    }

    getEquipmentBonusText(item) {
        const bonus = item.totalBonus;
        if (item.stat === 'clickDamage') {
            return `클릭 피해 +${formatPercent(bonus)}`;
        }
        if (item.stat === 'dps') {
            return `총 DPS +${formatPercent(bonus)}`;
        }
        if (item.stat === 'allDamage') {
            return `클릭 피해 및 총 DPS +${formatPercent(bonus)}`;
        }
        return `보너스 +${formatPercent(bonus)}`;
    }

    updateEquipmentSummary() {
        if (!UI.equipmentSummary) return;
        const bonuses = this.state.equipmentBonuses;
        UI.equipmentSummary.innerHTML = `<span>클릭 피해 +${formatPercent(bonuses.clickDamage)}</span><span>총 DPS +${formatPercent(bonuses.dps)}</span>`;
    }

    updateEquipment() {
        this.state.equipment.forEach((item) => this.updateEquipmentItem(item));
        this.updateEquipmentSummary();
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

    updateUI() {
        this.updateStats();
        this.updateHeroes();
        this.updateEnemy();
        this.updateFrenzyUI();
        this.updateEquipment();
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
        const reward = this.state.goNextEnemy();
        this.addLog(`스테이지 ${this.state.enemy.stage - 1}의 적을 처치하고 ${formatNumber(reward)} 골드를 획득했습니다!`);
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

    startLoops() {
        this.damageLoop = setInterval(() => this.applyDps(), 250);
        this.saveLoop = setInterval(() => this.autoSave(), 10000);
        this.frenzyLoop = setInterval(() => this.updateFrenzyUI(), 200);
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
    }

    useFrenzy() {
        const now = Date.now();
        if (this.state.frenzyCooldown > now || this.state.isFrenzyActive) {
            this.addLog('아직 스킬을 사용할 수 없습니다.', 'warning');
            return;
        }
        const duration = 15000; // 15초 동안 지속
        const cooldown = 60000; // 60초 쿨타임
        this.state.frenzyActiveUntil = now + duration;
        this.state.frenzyCooldown = now + cooldown;
        this.addLog('자동 전투 스킬 발동! 15초 동안 DPS가 2배입니다!', 'success');
        this.updateFrenzyUI();
    }

    handleEquipmentEnhance(equipmentId) {
        const result = this.state.enhanceEquipment(equipmentId);
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        this.addLog(`${result.item.name}이(가) +${result.item.level} 단계로 강화되었습니다!`, 'success');
        this.updateEquipment();
        this.updateStats();
        this.updateHeroes();
        saveGame(this.state);
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
            const offlineGold = Math.floor(state.totalDps * elapsed * 0.25);
            if (offlineGold > 0) {
                state.gold += offlineGold;
                ui.addLog(`오프라인 동안 ${elapsed}초가 지났습니다. ${formatNumber(offlineGold)} 골드를 획득했습니다!`);
                ui.updateUI();
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', init);
