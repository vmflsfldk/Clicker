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
        return JSON.parse(data);
    } catch (error) {
        console.error('저장 데이터를 불러올 수 없습니다.', error);
        return null;
    }
};
