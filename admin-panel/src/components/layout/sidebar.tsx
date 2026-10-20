'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, LogOut, ChevronLeft } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/nav';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from '@/lib/translations';
import { useThemeStore } from '@/store/theme';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFullImageUrl } from '@/components/profile/profile-header';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();
  const sidebarStyle = useThemeStore((s) => s.sidebarStyle);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };


  const avatarUrl = getFullImageUrl((admin as any)?.avatar);
  const initials = (admin?.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);


  // ============================================================
  // SIDEBAR BACKGROUND
  // ============================================================
  const getSidebarStyle = () => {
    if (sidebarStyle === 'gradient') {
      return {
        background: `linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 5%) 50%, hsl(var(--primary) / 0.15) 100%)`,
        borderColor: 'hsl(0 0% 10%)',
        color: 'hsl(0 0% 95%)',
      };
    }
    return {
      background: 'hsl(var(--sidebar-bg))',
      borderColor: 'hsl(var(--sidebar-border))',
      color: 'hsl(var(--sidebar-text))',
      colorMuted: 'hsl(var(--sidebar-text-muted))',
      hover: 'hsl(var(--sidebar-hover))',
    };
  };

  const styleObj = getSidebarStyle();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex flex-col h-screen border-r transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
      style={{
        background: styleObj.background,
        borderColor: styleObj.borderColor,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between h-16 px-5 border-b"
        style={{ borderColor: styleObj.borderColor }}
      >
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)`,
              boxShadow: `0 4px 20px hsl(var(--primary) / 0.3)`,
            }}
          >
            <Building2
              className="h-5 w-5"
              style={{ color: 'hsl(var(--primary-foreground))' }}
            />
          </motion.div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold"
              style={{ color: styleObj.color }}
            >
              Доверия
            </motion.span>
          )}
        </Link>

        {onToggle && (
          <button
            onClick={onToggle}
            className="transition-colors hover:opacity-80"
            style={{ color: styleObj.color }}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const label = (t as any)[item.key] || item.label;
          const colorMuted = (styleObj as any).colorMuted || `${styleObj.color}99`;
          const hoverBg = (styleObj as any).hover || 'hsl(var(--sidebar-hover))';

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group'
                )}
                style={{
                  color: isActive ? styleObj.color : colorMuted,
                  background: isActive
                    ? `hsl(var(--primary) / 0.15)`
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = hoverBg;
                    e.currentTarget.style.color = styleObj.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colorMuted;
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: 'hsl(var(--primary))' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className="h-5 w-5 flex-shrink-0 transition-colors"
                  style={{
                    color: isActive ? 'hsl(var(--primary))' : colorMuted,
                  }}
                />

                {!collapsed && (
                  <span className="flex-1 truncate">{label}</span>
                )}

                {item.badge === 'new' && !collapsed && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: 'hsl(var(--primary))' }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Admin card */}
      <div
        className="border-t p-3"
        style={{ borderColor: styleObj.borderColor }}
      >
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl',
            collapsed && 'justify-center'
          )}
          style={{
            background:
              sidebarStyle === 'gradient'
                ? 'hsl(0 0% 8%)'
                : 'hsl(var(--sidebar-hover))',
          }}
        >
          {/* ⚠️ AVATAR RASM YOKI INITIALS */}
          <Avatar className="w-9 h-9 flex-shrink-0">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={admin?.name || 'Admin'} />
            ) : null}
            <AvatarFallback
              className="text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)`,
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              {initials || '?'}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: styleObj.color }}
              >
                {admin?.name || 'Admin'}
              </p>
              <p
                className="text-xs truncate"
                style={{
                  color: (styleObj as any).colorMuted || `${styleObj.color}99`,
                }}
              >
                {admin?.role || 'super_admin'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="transition-colors hover:text-red-400"
              style={{
                color: (styleObj as any).colorMuted || `${styleObj.color}99`,
              }}
              title={t.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}