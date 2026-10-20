// src/lib/team-data.ts
import type { TeamMember } from './types';

/**
 * ⚠️ HOZIRCHA STATIK MA'LUMOT
 * Keyinchalik `fetchTeam()` bilan backend'dan olinadi.
 */
export const TEAM_STATIC: TeamMember[] = [
  {
    id: 1,
    name: 'Анна Иванова',
    role: 'Руководитель отдела новостроек',
    img: 'https://i.pravatar.cc/300?u=team1',
  },
  {
    id: 2,
    name: 'Дмитрий Петров',
    role: 'Эксперт по коммерческой недвижимости',
    img: 'https://i.pravatar.cc/300?u=team2',
  },
  {
    id: 3,
    name: 'Елена Смирнова',
    role: 'Ипотечный брокер',
    img: 'https://i.pravatar.cc/300?u=team3',
  },
  {
    id: 4,
    name: 'Максим Кузнецов',
    role: 'Специалист по загородной недвижимости',
    img: 'https://i.pravatar.cc/300?u=team4',
  },
];