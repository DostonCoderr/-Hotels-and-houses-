export type ThemeKey = 'dark' | 'light' | 'emerald' | 'royal' | 'sunset';

export interface Theme {
  name: string;
  vars: Record<string, string>;
}

export const THEMES: Record<ThemeKey, Theme> = {
  dark: {
    name: 'Тёмная',
    vars: {
      '--bg': '#070c17', '--bg2': '#0d1525',
      '--cd': 'rgba(255, 255, 255, .045)', '--bd': 'rgba(255, 255, 255, .11)',
      '--tx': '#f2eee5', '--mu': '#98a1b4',
      '--g': '#c9a36a', '--g2': '#e6c993', '--og': '#1a1408',
      '--map': '#0b1424', '--md': '#13213a', '--rd2': '#2a4263', '--rd': '#1c2b44',
    },
  },
  light: {
    name: 'Светлая',
    vars: {
      '--bg': '#f7f3ea', '--bg2': '#efe8d9',
      '--cd': '#ffffff', '--bd': 'rgba(40, 30, 10, .13)',
      '--tx': '#1c1a16', '--mu': '#6b6556',
      '--g': '#a9793a', '--g2': '#8a5f27', '--og': '#ffffff',
      '--map': '#e4dcc8', '--md': '#f3eddf', '--rd2': '#cdbf9c', '--rd': '#d3c9b0',
    },
  },
  emerald: {
    name: 'Изумруд',
    vars: {
      '--bg': '#0a1410', '--bg2': '#0f1f18',
      '--cd': 'rgba(255, 255, 255, .05)', '--bd': 'rgba(255, 255, 255, .12)',
      '--tx': '#eaf5ee', '--mu': '#8ba89a',
      '--g': '#4ea87a', '--g2': '#7fd4a3', '--og': '#04140c',
      '--map': '#0d1e18', '--md': '#132b22', '--rd2': '#2a5344', '--rd': '#1a3a2e',
    },
  },
  royal: {
    name: 'Королевская',
    vars: {
      '--bg': '#0d0a1f', '--bg2': '#15102e',
      '--cd': 'rgba(255, 255, 255, .05)', '--bd': 'rgba(255, 255, 255, .12)',
      '--tx': '#eeeaff', '--mu': '#9a92b8',
      '--g': '#7c5cff', '--g2': '#b8a3ff', '--og': '#0a0620',
      '--map': '#100c26', '--md': '#1a1438', '--rd2': '#3a2e6b', '--rd': '#251c4a',
    },
  },
  sunset: {
    name: 'Закат',
    vars: {
      '--bg': '#1a0e0a', '--bg2': '#26160f',
      '--cd': 'rgba(255, 255, 255, .05)', '--bd': 'rgba(255, 255, 255, .12)',
      '--tx': '#fdf0e8', '--mu': '#b89786',
      '--g': '#e07a3f', '--g2': '#ffb27a', '--og': '#1a0a04',
      '--map': '#1e100a', '--md': '#2a1a10', '--rd2': '#5a3a25', '--rd': '#241610',
    },
  },
};

export function applyTheme(name: ThemeKey) {
  const t = THEMES[name] || THEMES.dark;
  const root = document.documentElement;
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.dataset.theme = name === 'light' ? 'light' : 'dark';
  try { localStorage.setItem('th', JSON.stringify(name)); } catch {}
  document.querySelectorAll('.theme-preset').forEach((b) => {
    const el = b as HTMLElement;
    el.classList.toggle('on', el.dataset.theme === name);
  });
}

export function getSavedTheme(): ThemeKey {
  try {
    const raw = localStorage.getItem('th');
    if (!raw) return 'dark';
    const parsed = JSON.parse(raw) as ThemeKey;
    return THEMES[parsed] ? parsed : 'dark';
  } catch { return 'dark'; }
}