/**
 * Shared Looker-style chart configuration
 * Centralizes all Recharts styling to use CSS variables from the design system
 */

/**
 * Get a CSS variable value from the document root
 */
const getCSSVar = (varName: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

/**
 * Get chart color by index (1-8)
 */
export const getChartColor = (index: number): string => {
  const colorIndex = ((index - 1) % 8) + 1;
  const color = getCSSVar(`--chart-${colorIndex}`);
  // Fallback colors matching Looker palette from screenshots
  const fallbacks = ['#5B9BD5', '#CC5BC4', '#ED7D31', '#70AD47', '#FFC000', '#A5A5A5', '#4472C4', '#264478'];
  return color || fallbacks[colorIndex - 1];
};

/**
 * Get multiple chart colors as an array
 */
export const getChartColors = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => getChartColor(i + 1));
};

/**
 * CartesianGrid configuration - Looker's subtle grid style
 */
export const cartesianGridConfig = {
  strokeDasharray: "3 3",
  stroke: getCSSVar('--chart-grid') || '#EEEEEE',
  vertical: false,
  strokeOpacity: 1,
};

/**
 * XAxis configuration - Looker's clean axis style
 */
export const xAxisConfig = {
  tick: {
    fontFamily: getCSSVar('--font-family-base') || 'Roboto, sans-serif',
    fontSize: 12,
    fill: getCSSVar('--chart-axis-text') || '#666666',
  },
  axisLine: {
    stroke: getCSSVar('--chart-axis-line') || '#DDDDDD',
    strokeWidth: 1,
  },
  tickLine: false,
};

/**
 * YAxis configuration - Looker's minimal axis style
 */
export const yAxisConfig = {
  tick: {
    fontFamily: getCSSVar('--font-family-base') || 'Roboto, sans-serif',
    fontSize: 12,
    fill: getCSSVar('--chart-axis-text') || '#666666',
  },
  axisLine: false,
  tickLine: false,
};

/**
 * Tooltip configuration - Looker's clean tooltip style
 */
export const tooltipConfig = {
  contentStyle: {
    fontFamily: getCSSVar('--font-family-base') || 'Roboto, sans-serif',
    backgroundColor: getCSSVar('--chart-tooltip-bg') || '#FFFFFF',
    border: `1px solid ${getCSSVar('--chart-tooltip-border') || '#CCCCCC'}`,
    borderRadius: getCSSVar('--radius-md') || '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '12px',
  },
  cursor: {
    fill: 'rgba(0, 0, 0, 0.05)',
  },
};

/**
 * Legend configuration - Looker's legend style
 */
export const legendConfig = {
  wrapperStyle: {
    fontFamily: getCSSVar('--font-family-base') || 'Roboto, sans-serif',
    fontSize: 12,
    color: getCSSVar('--chart-axis-text') || '#666666',
  },
  iconType: "circle" as const,
  iconSize: 8,
};

/**
 * Default chart margin
 */
export const defaultMargin = {
  top: 5,
  right: 20,
  left: 0,
  bottom: 5,
};

/**
 * Looker-style bar corner radius
 */
export const barRadius: [number, number, number, number] = [4, 4, 0, 0];

/**
 * Line chart configuration
 */
export const lineConfig = {
  strokeWidth: 2,
  dot: false,
  activeDot: { r: 5 },
  type: "monotone" as const,
};

/**
 * Active dot configuration for line charts
 */
export const activeDotConfig = {
  r: 6,
  strokeWidth: 2,
  stroke: "var(--chart-background)",
};

/**
 * Scatter chart configuration
 */
export const scatterConfig = {
  fillOpacity: 0.7,
};

/**
 * Get computed chart color values (for direct usage in components)
 */
export const getChartColorValues = () => ({
  grid: getCSSVar('--chart-grid') || '#EEEEEE',
  axisText: getCSSVar('--chart-axis-text') || '#666666',
  axisLine: getCSSVar('--chart-axis-line') || '#DDDDDD',
  background: getCSSVar('--chart-background') || '#FFFFFF',
  tooltipBg: getCSSVar('--chart-tooltip-bg') || '#FFFFFF',
  tooltipBorder: getCSSVar('--chart-tooltip-border') || '#CCCCCC',
  blueLight: getCSSVar('--chart-blue-light') || '#9DC3E6',
  blueMedium: getCSSVar('--chart-blue-medium') || '#5B9BD5',
  blueDark: getCSSVar('--chart-blue-dark') || '#2F5597',
  gaugeBackground: getCSSVar('--chart-gauge-background') || '#E8E8E8',
  gaugePrimary: getCSSVar('--chart-gauge-primary') || '#5B9BD5',
  tableBar1: getCSSVar('--chart-table-bar-1') || '#9DC3E6',
  tableBar2: getCSSVar('--chart-table-bar-2') || '#CC5BC4',
  tableBar3: getCSSVar('--chart-table-bar-3') || '#ED7D31',
  tableBar4: getCSSVar('--chart-table-bar-4') || '#70AD47',
  chart1: getCSSVar('--chart-1') || '#5B9BD5',
  chart2: getCSSVar('--chart-2') || '#CC5BC4',
  chart3: getCSSVar('--chart-3') || '#ED7D31',
  chart4: getCSSVar('--chart-4') || '#70AD47',
  chart5: getCSSVar('--chart-5') || '#FFC000',
  chart6: getCSSVar('--chart-6') || '#A5A5A5',
  chart7: getCSSVar('--chart-7') || '#4472C4',
  chart8: getCSSVar('--chart-8') || '#264478',
});

/**
 * Get CSS variable directly (for component-level usage) - DEPRECATED, use getChartColorValues()
 */
export const chartVars = {
  grid: "var(--chart-grid)",
  axisText: "var(--chart-axis-text)",
  axisLine: "var(--chart-axis-line)",
  background: "var(--chart-background)",
  tooltipBg: "var(--chart-tooltip-bg)",
  tooltipBorder: "var(--chart-tooltip-border)",
  tooltipShadow: "var(--chart-tooltip-shadow)",
  blueLight: "var(--chart-blue-light)",
  blueMedium: "var(--chart-blue-medium)",
  blueDark: "var(--chart-blue-dark)",
  gaugeBackground: "var(--chart-gauge-background)",
  gaugePrimary: "var(--chart-gauge-primary)",
  tableBar1: "var(--chart-table-bar-1)",
  tableBar2: "var(--chart-table-bar-2)",
  tableBar3: "var(--chart-table-bar-3)",
  tableBar4: "var(--chart-table-bar-4)",
};
