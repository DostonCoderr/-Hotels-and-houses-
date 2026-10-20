import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  Inbox,
  Gift,
  Star,
  UserCog,
  Settings,
  Search,
  FileText,
  ShieldCheck,
  Bell,
  User,
  Hammer,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  key: string;          // Tarjima kaliti
  label: string;        // Fallback
  icon: LucideIcon;     // ← LucideIcon tipi
  badge?: 'new' | 'count';
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', key: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/properties', key: 'properties', label: 'Объекты', icon: Building2 },
  { href: '/projects', label: 'Проекты домов', icon: Hammer, key: 'projects' },
  { href: '/complexes', key: 'complexes', label: 'ЖК', icon: Building },
  { href: '/users', key: 'users', label: 'Пользователи', icon: Users },
  { href: '/applications', key: 'applications', label: 'Заявки', icon: Inbox, badge: 'new' },
  { href: '/notifications', label: 'Bildirishnomalar', icon: Bell, key: 'notifications' },
  { href: '/promotions', key: 'promotions', label: 'Акции', icon: Gift },
  { href: '/reviews', key: 'reviews', label: 'Отзывы', icon: Star },
  { href: '/employees', key: 'employees', label: 'Сотрудники', icon: UserCog },
  { href: '/settings', key: 'settings', label: 'Настройки', icon: Settings },
  { href: '/seo', key: 'seo', label: 'SEO', icon: Search },
  { href: '/logs', key: 'logs', label: 'Журнал', icon: FileText },
  { href: '/admins', key: 'admins', label: 'Администраторы', icon: ShieldCheck }, 
   { href: '/profile', label: 'Profil', icon: User, key: 'profile' },
];