import { GameState } from './state/gameState.js';
import { GameUI } from './ui/gameUI.js';
import { loadGame, saveGame } from './storage/save.js';
import { formatNumber } from './utils/format.js';

const init = () => {
    const saved = loadGame();
    const state = new GameState(saved);
    const ui = new GameUI(state);

    window.addEventListener('beforeunload', () => {
        saveGame(state);
    });

    if (saved?.lastSave) {
        const elapsed = Math.floor((Date.now() - saved.lastSave) / 1000);
        if (elapsed > 5) {
            const offlineGold = Math.floor(state.totalDps * elapsed * 0.25 * (1 + state.goldBonus));
            if (offlineGold > 0) {
                state.gold += offlineGold;
                ui.addLog(
                    `오프라인 동안 ${elapsed}초가 지났습니다. ${formatNumber(offlineGold)} 골드를 획득했습니다!`,
                );
                ui.updateUI();
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', init);
