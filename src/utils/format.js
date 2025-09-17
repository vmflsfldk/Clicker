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
