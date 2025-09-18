const STORAGE_KEY = 'tap-titan-web-save';

export const saveGame = (state) => {
    try {
        const serialized = JSON.stringify(state.toJSON());
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        console.error('저장 실패', error);
    }
};

export const loadGame = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
            if (!parsed.rebirthNodes && parsed.rebirthSkills) {
                parsed.rebirthNodes = { ...parsed.rebirthSkills };
            }
            if (!Number.isFinite(parsed.rebirthCores)) {
                parsed.rebirthCores = 0;
            }
            if (parsed.rebirthBranchFocus && typeof parsed.rebirthBranchFocus !== 'string') {
                parsed.rebirthBranchFocus = null;
            }
        }
        return parsed;
    } catch (error) {
        console.error('저장 데이터를 불러올 수 없습니다.', error);
        return null;
    }
};
