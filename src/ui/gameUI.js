import {
    BOSS_TIME_LIMIT_SECONDS,
    BOSS_WARNING_THRESHOLD,
    REBIRTH_STAGE_REQUIREMENT,
    GACHA_SINGLE_COST,
    GACHA_MULTI_COUNT,
    GACHA_MULTI_COST,
    GACHA_TOKEN_NORMAL_DROP_CHANCE,
    GACHA_TOKEN_BOSS_DROP_CHANCE,
    EQUIPMENT_EFFECT_MAP,
    EQUIPMENT_TYPE_MAP,
    EQUIPMENT_RARITY_MAP,
    HERO_TRAIT_GROUP_MAP,
    HERO_TRAIT_MAP,
    HERO_RARITIES,
    MISSIONS,
    clampProbability,
} from '../state/gameState.js';
import { HERO_SET_BONUSES } from '../data/heroes.js';
import { EQUIPMENT_TYPES, EQUIPMENT_DROP_CHANCE, EQUIPMENT_BOSS_DROP_CHANCE } from '../data/equipment.js';
import { REBIRTH_EFFECT_LABELS, REBIRTH_SKILLS } from '../data/rebirth.js';
import { saveGame } from '../storage/save.js';
import { formatNumber, formatPercent, formatSignedPercent } from '../utils/format.js';

const UI = {
    stage: document.getElementById('stage'),
    gold: document.getElementById('gold'),
    upgradeMaterials: document.getElementById('upgradeMaterials'),
    gachaTokensHeader: document.getElementById('gachaTokensHeader'),
    clickDamage: document.getElementById('clickDamage'),
    totalDps: document.getElementById('totalDps'),
    heroCritChance: document.getElementById('heroCritChance'),
    heroCritMultiplier: document.getElementById('heroCritMultiplier'),
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
    heroDetailOverlay: document.getElementById('heroDetailOverlay'),
    heroDetailBackdrop: document.getElementById('heroDetailBackdrop'),
    heroDetailClose: document.getElementById('heroDetailClose'),
    heroDetailContent: document.getElementById('heroDetailContent'),
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
    upgradeHeroCritChance: document.getElementById('upgradeHeroCritChance'),
    upgradeHeroCritChanceInfo: document.getElementById('heroCritChanceUpgradeInfo'),
    upgradeHeroCritDamage: document.getElementById('upgradeHeroCritDamage'),
    upgradeHeroCritDamageInfo: document.getElementById('heroCritDamageUpgradeInfo'),
    upgradeHeroDps: document.getElementById('upgradeHeroDps'),
    upgradeHeroDpsInfo: document.getElementById('heroDpsUpgradeInfo'),
    upgradeGoldGain: document.getElementById('upgradeGoldGain'),
    upgradeGoldGainInfo: document.getElementById('goldGainUpgradeInfo'),
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
    equipmentCollection: document.getElementById('equipmentCollection'),
    equipmentCollectionEmpty: document.getElementById('equipmentCollectionEmpty'),
    equipmentInventory: document.getElementById('equipmentInventory'),
    equipmentEmpty: document.getElementById('equipmentEmpty'),
    equipmentFilterSalvageable: document.getElementById('equipmentFilterSalvageable'),
    equipmentSelectSalvageable: document.getElementById('equipmentSelectSalvageable'),
    equipmentSalvageSelected: document.getElementById('equipmentSalvageSelected'),
    equipmentSalvageHint: document.getElementById('equipmentSalvageHint'),
    equipmentSelectionCount: document.getElementById('equipmentSelectionCount'),
    equipmentDetailOverlay: document.getElementById('equipmentDetailOverlay'),
    equipmentDetailBackdrop: document.getElementById('equipmentDetailBackdrop'),
    equipmentDetailClose: document.getElementById('equipmentDetailClose'),
    equipmentDetailContent: document.getElementById('equipmentDetailContent'),
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

const EQUIPMENT_TYPE_ICONS = new Map([
    ['tap', '⚔️'],
    ['hero', '🛡️'],
    ['skill', '📡'],
]);

const describeEquipmentEffect = (effectId, value = 0) => {
    const effect = EQUIPMENT_EFFECT_MAP.get(effectId);
    if (!effect) return null;
    const formattedValue = effect.format === 'percent' ? formatSignedPercent(value) : formatNumber(value);
    const label = effect.shortLabel ?? effect.label;
    return `${label} ${formattedValue}`;
};

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

export class GameUI {
    constructor(state) {
        this.state = state;
        this.heroIconTemplate = document.getElementById('heroIconTemplate');
        this.heroDetailTemplate = document.getElementById('heroDetailTemplate');
        this.heroElements = new Map();
        this.heroDetailUI = null;
        this.activeHeroDetailId = null;
        this.heroDetailReturnFocus = null;
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
        this.heroDetailOverlay = UI.heroDetailOverlay ?? null;
        this.heroDetailBackdrop = UI.heroDetailBackdrop ?? null;
        this.heroDetailClose = UI.heroDetailClose ?? null;
        this.heroDetailContent = UI.heroDetailContent ?? null;
        if (this.heroDetailClose) {
            this.heroDetailClose.setAttribute('aria-hidden', 'true');
            this.heroDetailClose.setAttribute('tabindex', '-1');
        }
        this.equipmentDetailTemplate = document.getElementById('equipmentDetailTemplate');
        this.equipmentDetailOverlay = UI.equipmentDetailOverlay ?? null;
        this.equipmentDetailBackdrop = UI.equipmentDetailBackdrop ?? null;
        this.equipmentDetailClose = UI.equipmentDetailClose ?? null;
        this.equipmentDetailContent = UI.equipmentDetailContent ?? null;
        this.equipmentDetailReturnFocus = null;
        this.activeEquipmentDetail = null;
        if (this.equipmentDetailClose) {
            this.equipmentDetailClose.setAttribute('aria-hidden', 'true');
            this.equipmentDetailClose.setAttribute('tabindex', '-1');
        }
        this.handleDoubleClick = (event) => {
            event.preventDefault();
        };
        this.setupTabs();
        this.setupEvents();
        this.handleViewportChange();
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
                if (!target) {
                    return;
                }
                if (this.activeTab === target && this.isPanelOverlayOpen()) {
                    this.clearActiveTab();
                    this.closePanelOverlay();
                    return;
                }
                this.activateTab(target);
                this.openPanelOverlay();
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

    clearActiveTab() {
        this.tabButtons.forEach((button) => {
            button.classList.remove('is-active');
            button.setAttribute('aria-selected', 'false');
            button.setAttribute('tabindex', '0');
        });
        this.tabPanels.forEach((panel) => {
            panel.classList.remove('is-active');
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('hidden', '');
        });
        this.activeTab = null;
        this.updateOverlayAriaState();
    }

    isPanelOverlayOpen() {
        return this.panelOverlay?.classList.contains('is-overlay-open') ?? false;
    }

    openPanelOverlay() {
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
        const isOpen = this.isPanelOverlayOpen();
        this.tabButtons.forEach((button) => {
            const isActive = button.dataset.tabTarget === this.activeTab;
            button.setAttribute('aria-expanded', isOpen && isActive ? 'true' : 'false');
        });
        if (this.panelOverlayBackdrop) {
            this.panelOverlayBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        }
        if (this.panelOverlayClose) {
            this.panelOverlayClose.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            this.panelOverlayClose.setAttribute('tabindex', isOpen ? '0' : '-1');
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
        if (UI.upgradeHeroCritChance) {
            UI.upgradeHeroCritChance.addEventListener('click', () => this.handleHeroCritChanceUpgrade());
        }
        if (UI.upgradeHeroCritDamage) {
            UI.upgradeHeroCritDamage.addEventListener('click', () => this.handleHeroCritDamageUpgrade());
        }
        if (UI.upgradeHeroDps) {
            UI.upgradeHeroDps.addEventListener('click', () => this.handleHeroDpsUpgrade());
        }
        if (UI.upgradeGoldGain) {
            UI.upgradeGoldGain.addEventListener('click', () => this.handleGoldGainUpgrade());
        }
        UI.sortHeroes.addEventListener('click', () => this.toggleHeroSort());
        if (UI.heroList) {
            UI.heroList.addEventListener('click', (event) => this.handleHeroListClick(event));
        }
        if (this.heroDetailClose) {
            this.heroDetailClose.addEventListener('click', () => this.closeHeroDetail());
        }
        if (this.heroDetailBackdrop) {
            this.heroDetailBackdrop.addEventListener('click', () => this.closeHeroDetail());
        }
        if (this.heroDetailContent) {
            this.heroDetailContent.addEventListener('click', (event) =>
                this.handleHeroDetailContentClick(event),
            );
        }
        if (this.equipmentDetailClose) {
            this.equipmentDetailClose.addEventListener('click', () => this.closeEquipmentDetail());
        }
        if (this.equipmentDetailBackdrop) {
            this.equipmentDetailBackdrop.addEventListener('click', () => this.closeEquipmentDetail());
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
        if (UI.equipmentCollection) {
            UI.equipmentCollection.addEventListener('click', (event) => this.handleEquipmentInventoryClick(event));
        }
        if (UI.equipmentSlots) {
            UI.equipmentSlots.addEventListener('click', (event) => this.handleEquipmentSlotClick(event));
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
            this.panelOverlayClose.addEventListener('click', () => {
                this.clearActiveTab();
                this.closePanelOverlay();
            });
        }
        if (this.panelOverlayBackdrop) {
            this.panelOverlayBackdrop.addEventListener('click', () => {
                this.clearActiveTab();
                this.closePanelOverlay();
            });
        }
        document.addEventListener('dblclick', this.handleDoubleClick, { passive: false });
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
        if (!this.heroIconTemplate) return;
        const node = this.heroIconTemplate.content.firstElementChild.cloneNode(true);
        node.dataset.heroId = hero.id;
        const button = node.querySelector('.hero-icon__button');
        const image = node.querySelector('.hero-icon__image');
        const name = node.querySelector('.hero-icon__name');
        const media = node.querySelector('.hero-icon__media');

        if (button) {
            button.dataset.heroId = hero.id;
        }
        if (image) {
            image.dataset.loadError = 'false';
            image.addEventListener('error', () => {
                node.dataset.hasImage = 'false';
                image.dataset.loadError = 'true';
                image.dataset.failedSrc = image.dataset.currentSrc ?? image.src ?? '';
                delete image.dataset.currentSrc;
                if (image.hasAttribute('src')) {
                    image.removeAttribute('src');
                }
                image.hidden = true;
            });
            image.addEventListener('load', () => {
                image.dataset.loadError = 'false';
                delete image.dataset.failedSrc;
                node.dataset.hasImage = 'true';
                image.hidden = false;
            });
        }

        this.heroElements.set(hero.id, {
            node,
            button,
            image,
            name,
            media,
        });
        this.updateHero(hero);

        UI.heroList.appendChild(node);
    }

    createHeroDetailBindings(node) {
        if (!node) return null;
        const skinPreview = node.querySelector('.hero__skin-preview');
        const skinPreviewImage = node.querySelector('.hero__skin-preview-image');
        if (skinPreview && skinPreviewImage) {
            skinPreviewImage.dataset.loadError = 'false';
            skinPreviewImage.addEventListener('error', () => {
                skinPreview.dataset.hasImage = 'false';
                skinPreview.setAttribute('aria-hidden', 'true');
                skinPreviewImage.dataset.loadError = 'true';
                skinPreviewImage.dataset.failedSrc = skinPreviewImage.dataset.currentSrc ?? skinPreviewImage.src ?? '';
                delete skinPreviewImage.dataset.currentSrc;
                if (skinPreviewImage.hasAttribute('src')) {
                    skinPreviewImage.removeAttribute('src');
                }
                skinPreviewImage.hidden = true;
            });
            skinPreviewImage.addEventListener('load', () => {
                skinPreviewImage.dataset.loadError = 'false';
                delete skinPreviewImage.dataset.failedSrc;
                skinPreview.dataset.hasImage = 'true';
                skinPreview.setAttribute('aria-hidden', 'false');
            });
        }
        return {
            node,
            name: node.querySelector('.hero__name'),
            desc: node.querySelector('.hero__desc'),
            level: node.querySelector('.hero__level'),
            dps: node.querySelector('.hero__dps'),
            statusState: node.querySelector('.hero__status-state'),
            statusDetail: node.querySelector('.hero__status-detail'),
            rarity: node.querySelector('.hero__rarity'),
            traits: node.querySelector('.hero__traits'),
            skinPreview,
            skinPreviewImage,
            skinList: node.querySelector('.hero__skin-list'),
            skinButtons: new Map(),
        };
    }

    buildHeroDetailSkinButtons(hero, heroUI) {
        if (!heroUI?.skinList) return;
        heroUI.skinList.innerHTML = '';
        heroUI.skinButtons = new Map();
        const skins = Array.isArray(hero.skins) ? hero.skins : [];
        skins.forEach((skin) => {
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
            heroUI.skinList.appendChild(button);
            heroUI.skinButtons.set(skin.id, { button, name: skinName, status: skinStatus, desc: skinDesc });
        });
    }

    openHeroDetail(heroId) {
        if (!this.heroDetailTemplate || !this.heroDetailContent) {
            return;
        }
        const hero = this.state.getHeroById(heroId);
        if (!hero) {
            return;
        }
        if (!this.heroDetailReturnFocus) {
            this.heroDetailReturnFocus = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        }
        const node = this.heroDetailTemplate.content.firstElementChild.cloneNode(true);
        const heroUI = this.createHeroDetailBindings(node);
        if (!heroUI) {
            return;
        }
        this.buildHeroDetailSkinButtons(hero, heroUI);
        this.heroDetailContent.innerHTML = '';
        this.heroDetailContent.appendChild(node);
        this.heroDetailUI = heroUI;
        this.activeHeroDetailId = hero.id;
        this.updateHeroDetail(hero);
        if (this.heroDetailOverlay) {
            this.heroDetailOverlay.classList.add('is-open');
            this.heroDetailOverlay.setAttribute('aria-hidden', 'false');
        }
        if (this.heroDetailClose) {
            this.heroDetailClose.setAttribute('aria-hidden', 'false');
            this.heroDetailClose.setAttribute('tabindex', '0');
            this.heroDetailClose.focus({ preventScroll: true });
        }
        document.body.classList.add('is-hero-detail-open');
    }

    closeHeroDetail() {
        const returnFocus = this.heroDetailReturnFocus;
        if (this.heroDetailOverlay) {
            this.heroDetailOverlay.classList.remove('is-open');
            this.heroDetailOverlay.setAttribute('aria-hidden', 'true');
        }
        if (this.heroDetailContent) {
            this.heroDetailContent.innerHTML = '';
        }
        if (this.heroDetailClose) {
            this.heroDetailClose.setAttribute('aria-hidden', 'true');
            this.heroDetailClose.setAttribute('tabindex', '-1');
        }
        document.body.classList.remove('is-hero-detail-open');
        this.heroDetailUI = null;
        this.activeHeroDetailId = null;
        if (returnFocus && typeof returnFocus.focus === 'function' && document.contains(returnFocus)) {
            returnFocus.focus({ preventScroll: true });
        }
        this.heroDetailReturnFocus = null;
    }

    isHeroDetailOpen() {
        return Boolean(this.heroDetailOverlay?.classList.contains('is-open'));
    }

    updateHero(hero) {
        this.updateHeroIcon(hero);
        if (this.activeHeroDetailId === hero.id) {
            this.updateHeroDetail(hero);
        }
        this.updateHeroGachaEntry(hero);
    }

    updateHeroIcon(hero) {
        const heroUI = this.heroElements.get(hero.id);
        if (!heroUI) return;
        heroUI.node.dataset.rarity = hero.rarityId;
        heroUI.node.dataset.recruited = hero.isUnlocked ? 'true' : 'false';
        if (heroUI.button) {
            heroUI.button.dataset.heroId = hero.id;
            heroUI.button.title = hero.name;
            heroUI.button.setAttribute('aria-label', hero.name);
        }
        if (heroUI.name) {
            heroUI.name.textContent = hero.name;
        }
        const accent = hero.activeSkin?.accentColor ?? hero.rarity?.color ?? null;
        if (accent) {
            heroUI.node.style.setProperty('--hero-icon-accent', accent);
        } else {
            heroUI.node.style.removeProperty('--hero-icon-accent');
        }
        if (heroUI.media) {
            heroUI.media.title = hero.description ?? '';
        }
        const image = heroUI.image;
        if (image) {
            const imagePath = hero.isUnlocked && hero.activeSkin?.image ? hero.activeSkin.image : null;
            const previousFailedSrc = image.dataset?.failedSrc ?? '';
            const previouslyErrored = image.dataset?.loadError === 'true';
            const canDisplayImage = Boolean(imagePath)
                && (!previouslyErrored || previousFailedSrc !== imagePath);
            if (canDisplayImage && imagePath) {
                const currentSrc = image.dataset.currentSrc ?? '';
                if (currentSrc !== imagePath) {
                    image.dataset.currentSrc = imagePath;
                    image.src = imagePath;
                }
                image.hidden = false;
                image.alt = `${hero.name} 아이콘`;
                heroUI.node.dataset.hasImage = 'true';
            } else {
                delete image.dataset.currentSrc;
                if (image.hasAttribute('src')) {
                    image.removeAttribute('src');
                }
                if (!imagePath) {
                    delete image.dataset.failedSrc;
                    image.dataset.loadError = 'false';
                }
                image.hidden = true;
                image.alt = '';
                heroUI.node.dataset.hasImage = 'false';
            }
        }
    }

    updateHeroDetail(hero) {
        if (!this.heroDetailUI || this.activeHeroDetailId !== hero.id) {
            return;
        }
        const heroUI = this.heroDetailUI;
        heroUI.node.dataset.heroId = hero.id;
        heroUI.node.dataset.rarity = hero.rarityId;
        heroUI.node.dataset.recruited = hero.isUnlocked ? 'true' : 'false';
        if (heroUI.name) {
            heroUI.name.textContent = hero.name;
        }
        if (heroUI.desc) {
            heroUI.desc.textContent = hero.description ?? '';
        }
        if (heroUI.rarity) {
            heroUI.rarity.classList.add('rarity-badge');
            heroUI.rarity.textContent = hero.rarityName;
            heroUI.rarity.title = hero.rarity?.description ?? '';
        }
        if (heroUI.level) {
            heroUI.level.textContent = `Lv. ${hero.level}`;
        }
        if (heroUI.dps) {
            heroUI.dps.textContent = `DPS: ${formatNumber(this.state.getHeroEffectiveDps(hero))}`;
        }
        this.renderHeroTraits(hero, heroUI.traits);
        if (hero.isUnlocked) {
            if (heroUI.statusState) {
                heroUI.statusState.textContent = '합류 완료';
            }
            if (heroUI.statusDetail) {
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
            }
        } else {
            if (heroUI.statusState) {
                heroUI.statusState.textContent = '미합류';
            }
            if (heroUI.statusDetail) {
                const detailParts = [`${hero.rarityName} 학생을 가챠로 모집하세요.`];
                const firstSkin = hero.skins?.[0];
                if (firstSkin) {
                    detailParts.push(`첫 스킨 Lv. ${firstSkin.requiredLevel} ${firstSkin.name}`);
                }
                heroUI.statusDetail.textContent = detailParts.join(' · ');
            }
        }
        this.updateHeroSkinState(hero, heroUI);
    }

    renderHeroTraits(hero, container) {
        if (!container) return;
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
            if (trait?.accentColor) {
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

    updateHeroSkinState(hero, heroUI) {
        if (!heroUI) return;
        const activeSkin = hero.activeSkin;
        const skinImageElement = heroUI.skinPreviewImage ?? null;
        const imagePath = hero.isUnlocked && activeSkin?.image ? activeSkin.image : null;
        const previousFailedSrc = skinImageElement?.dataset?.failedSrc ?? '';
        const previouslyErrored = skinImageElement?.dataset?.loadError === 'true';
        const canDisplayImage = Boolean(imagePath) && Boolean(skinImageElement)
            && (!previouslyErrored || previousFailedSrc !== imagePath);

        if (heroUI.skinPreview) {
            if (hero.isUnlocked && activeSkin) {
                heroUI.skinPreview.dataset.locked = 'false';
                heroUI.skinPreview.dataset.hasImage = canDisplayImage ? 'true' : 'false';
                heroUI.skinPreview.setAttribute('aria-hidden', canDisplayImage ? 'false' : 'true');
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
                heroUI.skinPreview.dataset.hasImage = 'false';
                heroUI.skinPreview.setAttribute('aria-hidden', 'true');
                heroUI.skinPreview.style.background = 'linear-gradient(135deg, #334155 0%, #0f172a 100%)';
                heroUI.skinPreview.style.borderColor = 'rgba(148, 163, 184, 0.28)';
                heroUI.skinPreview.style.boxShadow = 'none';
                heroUI.skinPreview.title = '학생 모집 후 스킨을 확인할 수 있습니다.';
            }
        }
        if (skinImageElement) {
            if (canDisplayImage && imagePath) {
                const currentSrc = skinImageElement.dataset.currentSrc ?? '';
                if (currentSrc !== imagePath) {
                    skinImageElement.dataset.currentSrc = imagePath;
                    skinImageElement.src = imagePath;
                }
                skinImageElement.dataset.loadError = 'false';
                delete skinImageElement.dataset.failedSrc;
                skinImageElement.alt = `${hero.name} - ${activeSkin?.name ?? '스킨'}`;
                skinImageElement.hidden = false;
            } else {
                delete skinImageElement.dataset.currentSrc;
                if (skinImageElement.hasAttribute('src')) {
                    skinImageElement.removeAttribute('src');
                }
                if (!imagePath) {
                    delete skinImageElement.dataset.failedSrc;
                    skinImageElement.dataset.loadError = 'false';
                }
                skinImageElement.alt = '';
                skinImageElement.hidden = true;
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
            const skins = Array.isArray(hero.skins) ? hero.skins : [];
            skins.forEach((skin) => {
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
        const button = event.target.closest('.hero-icon__button');
        if (!button) return;
        const heroElement = button.closest('.hero-icon');
        const heroId = heroElement?.dataset.heroId ?? button.dataset.heroId;
        if (!heroId) return;
        this.heroDetailReturnFocus = button;
        this.openHeroDetail(heroId);
    }

    handleHeroDetailContentClick(event) {
        const button = event.target.closest('.hero-skin');
        if (!button) return;
        const heroId = this.activeHeroDetailId;
        const skinId = button.dataset.heroSkinId;
        if (!heroId || !skinId) return;
        this.handleHeroSkinSelection(heroId, skinId);
    }

    handleHeroSkinSelection(heroId, skinId) {
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

    getEquipmentEffectSummary(item) {
        if (!item) return '';
        const effects = this.getEquipmentEffectDescriptions(item);
        const primaryValue = this.getPrimaryEquipmentEffectValue(item);
        const fallback = describeEquipmentEffect(item.type, primaryValue) ?? formatSignedPercent(primaryValue);
        return effects.length > 0 ? effects.join(' · ') : fallback;
    }

    getEquipmentTypeIcon(typeId) {
        if (!typeId) return '🎖️';
        return EQUIPMENT_TYPE_ICONS.get(typeId) ?? '🎖️';
    }

    getEquipmentEffectDetails(item, type) {
        if (!item) {
            if (!type) return [];
            const effectId = type.primaryEffect ?? type.id;
            if (!effectId) return [];
            const definition = EQUIPMENT_EFFECT_MAP.get(effectId);
            if (!definition) {
                return [];
            }
            return [
                {
                    id: effectId,
                    label: definition.label ?? '주요 효과',
                    value: null,
                    description: definition.description ?? null,
                },
            ];
        }
        const order = Array.isArray(item.effectOrder) && item.effectOrder.length > 0
            ? item.effectOrder
            : Object.keys(item.effects ?? {});
        return order
            .map((effectId) => {
                const effect = item.effects?.[effectId];
                if (!effect) return null;
                const definition = EQUIPMENT_EFFECT_MAP.get(effectId);
                const label = definition?.label ?? effectId;
                const rawValue = effect.value ?? 0;
                const formattedValue = definition?.format === 'percent'
                    ? formatSignedPercent(rawValue)
                    : formatNumber(rawValue);
                return {
                    id: effectId,
                    label,
                    value: formattedValue,
                    description: definition?.description ?? null,
                };
            })
            .filter(Boolean);
    }

    getEquipmentStatusDetails(item) {
        if (!item) return [];
        const statuses = [];
        const isEquipped = this.state.equipped?.[item.type] === item.id;
        statuses.push(isEquipped ? '현재 장착 중입니다.' : '인벤토리에 보관 중입니다.');
        statuses.push(item.locked ? '잠금 상태: 잠금됨' : '잠금 상태: 해제됨');
        const upgradeContext = this.getEquipmentUpgradeContext(item);
        if (item.level >= item.maxLevel) {
            statuses.push('최대 강화 단계에 도달했습니다.');
        } else if (upgradeContext.canUpgrade) {
            const costText = upgradeContext.cost > 0 ? formatNumber(upgradeContext.cost) : '소모 없음';
            statuses.push(`강화 가능 · 필요 재료 ${costText}개`);
        } else if (!upgradeContext.hasMaterials && upgradeContext.cost > 0) {
            statuses.push(`강화 재료 부족 · 필요 ${formatNumber(upgradeContext.cost)}개`);
        }
        const salvageable = this.state.canSalvageItem(item);
        statuses.push(salvageable ? '분해 가능 상태입니다.' : '잠금 또는 장착 중이라 분해할 수 없습니다.');
        return statuses;
    }

    handleEquipmentSlotClick(event) {
        const button = event.target.closest('[data-equipment-slot]');
        if (!button) return;
        const typeId = button.dataset.equipmentSlot;
        if (!typeId) return;
        this.openEquipmentDetail({ typeId, trigger: button });
    }

    openEquipmentDetail({ itemId = null, typeId = null, trigger = null } = {}) {
        if (!this.equipmentDetailTemplate || !this.equipmentDetailContent) {
            return;
        }
        const normalizedTypeId = typeId ?? null;
        let item = null;
        if (itemId) {
            item = this.state.inventory.find((entry) => entry.id === itemId) ?? null;
        }
        if (!item && normalizedTypeId) {
            item = this.state.getEquippedItem(normalizedTypeId);
        }
        const resolvedTypeId = normalizedTypeId ?? item?.type ?? null;
        const type = resolvedTypeId ? EQUIPMENT_TYPE_MAP.get(resolvedTypeId) ?? null : null;
        const node = this.equipmentDetailTemplate.content.firstElementChild.cloneNode(true);
        this.populateEquipmentDetail(node, item, type);
        this.equipmentDetailContent.innerHTML = '';
        this.equipmentDetailContent.appendChild(node);
        if (trigger instanceof HTMLElement) {
            this.equipmentDetailReturnFocus = trigger;
        } else if (!this.equipmentDetailReturnFocus && document.activeElement instanceof HTMLElement) {
            this.equipmentDetailReturnFocus = document.activeElement;
        }
        this.activeEquipmentDetail = {
            itemId: item?.id ?? null,
            typeId: resolvedTypeId,
        };
        if (this.equipmentDetailOverlay) {
            this.equipmentDetailOverlay.classList.add('is-open');
            this.equipmentDetailOverlay.setAttribute('aria-hidden', 'false');
        }
        if (this.equipmentDetailClose) {
            this.equipmentDetailClose.setAttribute('aria-hidden', 'false');
            this.equipmentDetailClose.setAttribute('tabindex', '0');
            this.equipmentDetailClose.focus({ preventScroll: true });
        }
        document.body.classList.add('is-equipment-detail-open');
    }

    populateEquipmentDetail(node, item, type) {
        if (!node) return;
        const resolvedTypeId = type?.id ?? item?.type ?? null;
        node.dataset.rarity = item?.rarity ?? 'none';
        const icon = node.querySelector('.equipment-detail__icon');
        if (icon) {
            icon.textContent = this.getEquipmentTypeIcon(resolvedTypeId);
        }
        const typeLabel = node.querySelector('.equipment-detail__type');
        if (typeLabel) {
            typeLabel.textContent = type?.label ?? '전술 장비';
        }
        const nameEl = node.querySelector('.equipment-detail__name');
        if (nameEl) {
            const rarity = item ? EQUIPMENT_RARITY_MAP.get(item.rarity) : null;
            nameEl.textContent = item
                ? `${rarity ? `[${rarity.name}] ` : ''}${item.name}`
                : '장착된 전술 장비 없음';
        }
        const metaEl = node.querySelector('.equipment-detail__meta');
        if (metaEl) {
            if (item) {
                const metaParts = [`Lv. ${item.level}/${item.maxLevel}`];
                if (Number.isFinite(item.stage)) {
                    metaParts.push(`${formatNumber(item.stage)}층 획득`);
                }
                metaEl.textContent = metaParts.join(' · ');
            } else {
                metaEl.textContent = type?.description ?? '장비를 장착해 전술 지원을 강화하세요.';
            }
        }
        const descriptionEl = node.querySelector('.equipment-detail__description');
        if (descriptionEl) {
            if (item) {
                const summary = this.getEquipmentEffectSummary(item);
                descriptionEl.textContent = summary || type?.description || '장비 효과 정보가 없습니다.';
            } else {
                descriptionEl.textContent = type?.description ?? '장비를 장착하면 효과가 적용됩니다.';
            }
        }
        const effectList = node.querySelector('.equipment-detail__effect-list');
        if (effectList) {
            effectList.innerHTML = '';
            const effects = this.getEquipmentEffectDetails(item, type);
            if (effects.length > 0) {
                effects.forEach(({ label, value, description }) => {
                    const li = document.createElement('li');
                    if (label) {
                        const labelSpan = document.createElement('span');
                        labelSpan.className = 'equipment-detail__effect-label';
                        labelSpan.textContent = label;
                        li.appendChild(labelSpan);
                    }
                    if (value) {
                        const valueStrong = document.createElement('strong');
                        valueStrong.textContent = value;
                        li.appendChild(valueStrong);
                    }
                    if (description) {
                        const desc = document.createElement('span');
                        desc.className = 'equipment-detail__effect-desc';
                        desc.textContent = description;
                        li.appendChild(desc);
                    }
                    effectList.appendChild(li);
                });
            } else {
                const empty = document.createElement('li');
                empty.textContent = item ? '추가 효과 없음' : '장비를 장착하면 상세 효과가 표시됩니다.';
                effectList.appendChild(empty);
            }
        }
        const statusSection = node.querySelector('.equipment-detail__section--status');
        const statusList = node.querySelector('.equipment-detail__status-list');
        if (statusSection && statusList) {
            statusList.innerHTML = '';
            const statuses = this.getEquipmentStatusDetails(item);
            if (statuses.length > 0) {
                statuses.forEach((status) => {
                    const li = document.createElement('li');
                    li.textContent = status;
                    statusList.appendChild(li);
                });
                statusSection.hidden = false;
            } else {
                statusSection.hidden = true;
            }
        }
    }

    closeEquipmentDetail() {
        const returnFocus = this.equipmentDetailReturnFocus;
        if (this.equipmentDetailOverlay) {
            this.equipmentDetailOverlay.classList.remove('is-open');
            this.equipmentDetailOverlay.setAttribute('aria-hidden', 'true');
        }
        if (this.equipmentDetailContent) {
            this.equipmentDetailContent.innerHTML = '';
        }
        if (this.equipmentDetailClose) {
            this.equipmentDetailClose.setAttribute('aria-hidden', 'true');
            this.equipmentDetailClose.setAttribute('tabindex', '-1');
        }
        document.body.classList.remove('is-equipment-detail-open');
        this.activeEquipmentDetail = null;
        if (returnFocus && typeof returnFocus.focus === 'function' && document.contains(returnFocus)) {
            returnFocus.focus({ preventScroll: true });
        }
        this.equipmentDetailReturnFocus = null;
    }

    isEquipmentDetailOpen() {
        return Boolean(this.equipmentDetailOverlay?.classList.contains('is-open'));
    }

    refreshEquipmentDetail() {
        if (!this.isEquipmentDetailOpen() || !this.activeEquipmentDetail) {
            return;
        }
        const { itemId, typeId } = this.activeEquipmentDetail;
        let item = null;
        if (itemId) {
            item = this.state.inventory.find((entry) => entry.id === itemId) ?? null;
        }
        let type = null;
        if (item) {
            type = EQUIPMENT_TYPE_MAP.get(item.type) ?? null;
        }
        if (!item && typeId) {
            item = this.state.getEquippedItem(typeId);
            type = EQUIPMENT_TYPE_MAP.get(typeId) ?? null;
        }
        if (!type && (item?.type)) {
            type = EQUIPMENT_TYPE_MAP.get(item.type) ?? null;
        }
        if (!this.equipmentDetailTemplate || !this.equipmentDetailContent) {
            return;
        }
        const node = this.equipmentDetailTemplate.content.firstElementChild.cloneNode(true);
        this.populateEquipmentDetail(node, item, type);
        this.equipmentDetailContent.innerHTML = '';
        this.equipmentDetailContent.appendChild(node);
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

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'equipment-slot__button';
            button.dataset.equipmentSlot = type.id;
            button.dataset.rarity = item?.rarity ?? 'none';
            button.dataset.equipped = item ? 'true' : 'false';

            const icon = document.createElement('span');
            icon.className = 'equipment-slot__icon';
            icon.textContent = this.getEquipmentTypeIcon(type.id);

            const typeLabel = document.createElement('span');
            typeLabel.className = 'equipment-slot__type';
            typeLabel.textContent = type.label;

            const name = document.createElement('span');
            name.className = 'equipment-slot__name';
            const rarity = item ? EQUIPMENT_RARITY_MAP.get(item.rarity) : null;
            if (item) {
                const rarityTag = rarity ? `[${rarity.name}] ` : '';
                name.textContent = `${rarityTag}${item.name}`;
            } else {
                name.textContent = '미장착';
                name.classList.add('equipment-slot__empty');
            }

            const meta = document.createElement('span');
            meta.className = 'equipment-slot__meta';
            if (item) {
                const metaParts = [`Lv. ${item.level}/${item.maxLevel}`];
                if (Number.isFinite(item.stage)) {
                    metaParts.push(`${formatNumber(item.stage)}층 획득`);
                }
                meta.textContent = metaParts.join(' · ');
            } else {
                meta.textContent = type.description ?? '장비를 장착해 효과를 활성화하세요.';
                meta.classList.add('equipment-slot__empty');
            }

            const value = document.createElement('span');
            value.className = 'equipment-slot__value';
            if (item) {
                const summary = this.getEquipmentEffectSummary(item);
                value.textContent = summary || '효과 정보 없음';
                if (!summary) {
                    value.classList.add('equipment-slot__empty');
                }
            } else {
                const effectId = type.primaryEffect ?? type.id;
                const effect = EQUIPMENT_EFFECT_MAP.get(effectId);
                const label = effect?.shortLabel ?? effect?.label ?? '전술 지원';
                value.textContent = `${label} 특화`;
                value.classList.add('equipment-slot__empty');
            }

            const labelText = item
                ? `${type.label} 슬롯 - ${name.textContent} (${value.textContent})`
                : `${type.label} 슬롯 - 장비 없음`;
            button.setAttribute('aria-label', labelText);

            button.append(icon, typeLabel, name, meta, value);
            slot.appendChild(button);
            UI.equipmentSlots.appendChild(slot);
        });
        this.refreshEquipmentDetail();
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

    createEquipmentListEntry(item, { includeSelection = true, includeSalvage = true } = {}) {
        if (!item) return null;
        const type = EQUIPMENT_TYPE_MAP.get(item.type);
        const rarity = EQUIPMENT_RARITY_MAP.get(item.rarity);
        const equipped = this.state.equipped[item.type] === item.id;
        const salvageable = this.state.canSalvageItem(item);

        const entry = document.createElement('li');
        entry.className = 'equipment-item';
        entry.dataset.rarity = item.rarity;
        entry.dataset.equipped = equipped ? 'true' : 'false';
        entry.dataset.salvageable = salvageable ? 'true' : 'false';
        entry.dataset.itemId = item.id;

        let selectWrapper;
        if (includeSelection) {
            selectWrapper = document.createElement('label');
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
        } else {
            selectWrapper = document.createElement('div');
            selectWrapper.className = 'equipment-item__select equipment-item__select--placeholder';
            selectWrapper.setAttribute('aria-hidden', 'true');
        }

        const info = document.createElement('button');
        info.type = 'button';
        info.className = 'equipment-item__info';
        info.dataset.detailId = item.id;

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
        const stageLabel = Number.isFinite(item.stage) ? ` · 스테이지 ${item.stage}` : '';
        details.textContent = `${typeLabel} · ${effectText} · Lv. ${item.level}/${item.maxLevel}${stageLabel}`;

        info.title = '전술 장비 상세 정보 보기';
        info.setAttribute('aria-label', `${name.textContent} 상세 정보 보기`);

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
                upgradeContext.cost > 0 ? `강화 (${formatNumber(upgradeContext.cost)}개)` : '강화';
            upgradeButton.disabled = !upgradeContext.canUpgrade;
            if (!upgradeContext.canUpgrade) {
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

        actions.append(lockButton, upgradeButton, equipButton);

        if (includeSalvage) {
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
            actions.appendChild(salvageButton);
        }

        entry.append(selectWrapper, info, actions);
        return entry;
    }

    renderEquipmentInventory() {
        this.sanitizeSelectedEquipment();

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

        const salvageItems = this.filterSalvageable
            ? sorted.filter((item) => this.state.canSalvageItem(item))
            : sorted;

        if (UI.equipmentCollection) {
            UI.equipmentCollection.innerHTML = '';
            if (UI.equipmentCollectionEmpty) {
                if (sorted.length === 0) {
                    UI.equipmentCollectionEmpty.textContent = '아직 확보한 전술 장비가 없습니다.';
                    UI.equipmentCollectionEmpty.style.display = 'block';
                } else {
                    UI.equipmentCollectionEmpty.style.display = 'none';
                }
            }
            sorted.forEach((item) => {
                const entry = this.createEquipmentListEntry(item, {
                    includeSelection: false,
                    includeSalvage: false,
                });
                if (entry) {
                    UI.equipmentCollection.appendChild(entry);
                }
            });
        }

        if (UI.equipmentInventory) {
            UI.equipmentInventory.innerHTML = '';
            if (UI.equipmentEmpty) {
                if (sorted.length === 0) {
                    UI.equipmentEmpty.textContent = '아직 확보한 전술 장비가 없습니다.';
                    UI.equipmentEmpty.style.display = 'block';
                } else if (salvageItems.length === 0) {
                    UI.equipmentEmpty.textContent =
                        '조건을 만족하는 전술 장비가 없습니다. 잠금 또는 장착 상태를 확인하세요.';
                    UI.equipmentEmpty.style.display = 'block';
                } else {
                    UI.equipmentEmpty.style.display = 'none';
                }
            }
            salvageItems.forEach((item) => {
                const entry = this.createEquipmentListEntry(item, {
                    includeSelection: true,
                    includeSalvage: true,
                });
                if (entry) {
                    UI.equipmentInventory.appendChild(entry);
                }
            });
        }

        this.updateEquipmentControls();
        this.refreshEquipmentDetail();
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
        const updateUpgradeButtons = (root) => {
            if (!root) return;
            const upgradeButtons = root.querySelectorAll('[data-upgrade-id]');
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
        };
        updateUpgradeButtons(UI.equipmentInventory);
        updateUpgradeButtons(UI.equipmentCollection);
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
        if (this.isEquipmentDetailOpen()) {
            event.preventDefault();
            this.closeEquipmentDetail();
            return;
        }
        if (this.isHeroDetailOpen()) {
            event.preventDefault();
            this.closeHeroDetail();
            return;
        }
        if (this.isPanelOverlayOpen()) {
            event.preventDefault();
            this.clearActiveTab();
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

        const detailButton = event.target.closest('[data-detail-id]');
        if (detailButton) {
            const itemId = detailButton.dataset.detailId;
            if (!itemId) return;
            this.openEquipmentDetail({ itemId, trigger: detailButton });
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
        if (UI.heroCritChance) {
            UI.heroCritChance.textContent = formatPercent(this.state.heroCritChance);
        }
        if (UI.heroCritMultiplier) {
            UI.heroCritMultiplier.textContent = `${this.state.heroCritMultiplier.toFixed(2)}배`;
        }
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
        if (UI.upgradeHeroCritChance) {
            const context = this.state.getHeroCritChanceUpgradeContext();
            if (context.canUpgrade) {
                UI.upgradeHeroCritChance.textContent = `학생 치명타 교정 (${formatNumber(context.cost)} 골드)`;
                UI.upgradeHeroCritChance.disabled = false;
            } else {
                UI.upgradeHeroCritChance.textContent = '학생 치명타 교정 (최대)';
                UI.upgradeHeroCritChance.disabled = true;
            }
            if (UI.upgradeHeroCritChanceInfo) {
                const infoParts = [];
                infoParts.push(
                    `치명타 확률 ${formatPercent(context.currentChance)} → ${formatPercent(context.nextChance)}`,
                );
                infoParts.push(
                    `평균 배율 ${context.currentAverageMultiplier.toFixed(2)}배 → ${context.nextAverageMultiplier.toFixed(2)}배`,
                );
                if (context.canUpgrade) {
                    infoParts.push(`증가량 +${formatPercent(context.gain)}`);
                } else {
                    infoParts.push('이미 최대 강화');
                }
                UI.upgradeHeroCritChanceInfo.textContent = infoParts.join(' · ');
            }
        }
        if (UI.upgradeHeroCritDamage) {
            const context = this.state.getHeroCritDamageUpgradeContext();
            if (context.canUpgrade) {
                UI.upgradeHeroCritDamage.textContent = `학생 탄두 개량 (${formatNumber(context.cost)} 골드)`;
                UI.upgradeHeroCritDamage.disabled = false;
            } else {
                UI.upgradeHeroCritDamage.textContent = '학생 탄두 개량 (최대)';
                UI.upgradeHeroCritDamage.disabled = true;
            }
            if (UI.upgradeHeroCritDamageInfo) {
                const infoParts = [];
                infoParts.push(
                    `치명타 배율 ${context.currentMultiplier.toFixed(2)}배 → ${context.nextMultiplier.toFixed(2)}배`,
                );
                infoParts.push(
                    `평균 배율 ${context.currentAverageMultiplier.toFixed(2)}배 → ${context.nextAverageMultiplier.toFixed(2)}배`,
                );
                if (context.canUpgrade) {
                    infoParts.push(`증가량 +${context.gain.toFixed(2)}배`);
                } else {
                    infoParts.push('이미 최대 강화');
                }
                UI.upgradeHeroCritDamageInfo.textContent = infoParts.join(' · ');
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
        if (UI.upgradeGoldGain) {
            const context = this.state.getGoldGainUpgradeContext();
            UI.upgradeGoldGain.textContent = `자금 운용 훈련 (${formatNumber(context.cost)} 골드)`;
            if (UI.upgradeGoldGainInfo) {
                const infoParts = [];
                infoParts.push(
                    `훈련 보너스 ${formatPercent(context.currentTraining)} → ${formatPercent(context.nextTraining)}`,
                );
                infoParts.push(
                    `총 배율 ${context.currentMultiplier.toFixed(2)}배 → ${context.nextMultiplier.toFixed(2)}배`,
                );
                UI.upgradeGoldGainInfo.textContent = infoParts.join(' · ');
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

    handleHeroCritChanceUpgrade() {
        const result = this.state.levelUpHeroCritChance();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const previousChanceText = formatPercent(result.previousChance);
        const newChanceText = formatPercent(this.state.heroCritChance);
        const previousAverageText = `${result.previousAverageMultiplier.toFixed(2)}배`;
        const newAverageText = `${result.newAverageMultiplier.toFixed(2)}배`;
        this.addLog(
            `학생 정밀 사격 훈련 레벨이 ${this.state.heroCritChanceLevel}이 되었습니다! (치명타 확률 ${previousChanceText} → ${newChanceText} · 평균 배율 ${previousAverageText} → ${newAverageText})`,
            'success',
        );
        this.updateStats();
    }

    handleHeroCritDamageUpgrade() {
        const result = this.state.levelUpHeroCritDamage();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const previousMultiplierText = `${result.previousMultiplier.toFixed(2)}배`;
        const newMultiplierText = `${this.state.heroCritMultiplier.toFixed(2)}배`;
        const previousAverageText = `${result.previousAverageMultiplier.toFixed(2)}배`;
        const newAverageText = `${result.newAverageMultiplier.toFixed(2)}배`;
        this.addLog(
            `학생 탄두 개량 연구 레벨이 ${this.state.heroCritDamageLevel}이 되었습니다! (치명타 배율 ${previousMultiplierText} → ${newMultiplierText} · 평균 배율 ${previousAverageText} → ${newAverageText})`,
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

    handleGoldGainUpgrade() {
        const context = this.state.getGoldGainUpgradeContext();
        const result = this.state.levelUpGoldGain();
        if (!result.success) {
            this.addLog(result.message, 'warning');
            return;
        }
        const previousTrainingText = formatPercent(result.previousTraining);
        const newTrainingText = formatPercent(result.newTraining);
        const previousMultiplierText = `${(1 + result.previousTotal).toFixed(2)}배`;
        const newMultiplierText = `${(1 + result.newTotal).toFixed(2)}배`;
        const detailParts = [
            `훈련 보너스 ${previousTrainingText} → ${newTrainingText}`,
            `총 배율 ${previousMultiplierText} → ${newMultiplierText}`,
        ];
        if (context.gain > 0) {
            detailParts.push(`증가량 +${formatPercent(context.gain)}`);
        }
        this.addLog(
            `자금 운용 훈련 레벨이 ${this.state.goldGainLevel}이 되었습니다! (${detailParts.join(' · ')})`,
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
        this.addLog('진행 상황이 초기화되었습니다. 다시 시작해 볼까요?', 'warning');
        saveGame(this.state);
    }
}
