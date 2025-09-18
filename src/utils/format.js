const COUNTDOWN_UNIT_LABELS = {
    ko: { day: '일', hour: '시간', minute: '분', second: '초', zero: '0초' },
    en: { day: 'd', hour: 'h', minute: 'm', second: 's', zero: '0s' },
    ja: { day: '日', hour: '時間', minute: '分', second: '秒', zero: '0秒' },
};

const resolveCountdownLabels = (locale) => {
    if (!locale) return COUNTDOWN_UNIT_LABELS.ko;
    const key = locale.toLowerCase().split('-')[0];
    return COUNTDOWN_UNIT_LABELS[key] ?? COUNTDOWN_UNIT_LABELS.ko;
};

const resolveLocale = (locale) => {
    if (locale) return locale;
    if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language;
    }
    return 'ko-KR';
};

export const formatNumber = (value) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    if (value >= 100) return Math.round(value).toString();
    if (value >= 10) return value.toFixed(1);
    if (value > 0) return value.toFixed(2);
    return '0';
};

export const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

export const formatSignedPercent = (value) => {
    const normalized = Number.isFinite(value) ? value : 0;
    const sign = normalized >= 0 ? '+' : '-';
    return `${sign}${formatPercent(Math.abs(normalized))}`;
};

export const formatCountdown = (targetTime, now = Date.now(), options = {}) => {
    const { maxUnits = 3, locale: preferredLocale } = options;
    const locale = resolveLocale(preferredLocale);
    const labels = resolveCountdownLabels(locale);
    const target = Number(targetTime);
    const current = Number(now);
    if (!Number.isFinite(target) || !Number.isFinite(current)) {
        return labels.zero;
    }
    const remainingMs = Math.max(0, target - current);
    if (remainingMs <= 0) {
        return labels.zero;
    }
    const totalSeconds = Math.floor(remainingMs / 1000);
    const units = [
        { unit: 'day', size: 86400 },
        { unit: 'hour', size: 3600 },
        { unit: 'minute', size: 60 },
        { unit: 'second', size: 1 },
    ];
    const formatter = new Intl.NumberFormat(locale);
    const segments = [];
    let remainingSeconds = totalSeconds;
    for (const { unit, size } of units) {
        if (segments.length >= maxUnits) break;
        if (unit !== 'second' && remainingSeconds < size && segments.length === 0) {
            continue;
        }
        const value = Math.floor(remainingSeconds / size);
        if (value <= 0) {
            if (unit === 'second' && segments.length === 0) {
                segments.push(`${formatter.format(0)}${labels[unit]}`);
            }
            continue;
        }
        segments.push(`${formatter.format(value)}${labels[unit]}`);
        remainingSeconds -= value * size;
    }
    if (segments.length === 0) {
        return labels.zero;
    }
    return segments.join(' ');
};
