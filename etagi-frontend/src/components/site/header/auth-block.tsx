'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

interface User { name: string; email: string; }

export function AuthBlock() {
  const { t } = useTranslation(); // ✅ Hook
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const raw = localStorage.getItem('site-user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    } else {
      setUser(null);
    }
    setOpen(false);
  }, [pathname]);

  if (!user) {
    return (
      <Link href="/login" className="bt">
        {t('auth_login')}
      </Link>
    );
  }

  return (
    <div id="au" className={open ? 'open' : ''}>
      <button className="av" onClick={() => setOpen(!open)} aria-label="Профиль">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces" alt="Avatar" />
      </button>
      <div className="dd">
        <div style={{ padding: 6 }}>
          <b>{user.name}</b>
          <div className="mu" style={{ fontSize: 12.5 }}>{user.email}</div>
        </div>
        <Link href="/profile" onClick={() => setOpen(false)}>
          {t('auth_profile')}
        </Link>
        <a onClick={() => { 
          localStorage.removeItem('site-user'); 
          setUser(null); 
          router.push('/'); 
        }}>
          {t('auth_logout')}
        </a>
      </div>
    </div>
  );
}