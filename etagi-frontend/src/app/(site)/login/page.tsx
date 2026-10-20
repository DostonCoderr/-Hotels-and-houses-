'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/site/common/toast';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast(t('auth_toast_fill_email_password'));
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('site-token', data.token);
      localStorage.setItem('site-user', JSON.stringify(data.user));
      toast(t('auth_toast_welcome'));
      router.push('/profile');
    } catch (err: any) {
      toast(err?.response?.data?.error || t('auth_toast_invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="v-login">
      <div className="lgn" style={{ minHeight: 'calc(100vh - 68px)' }}>
        <img className="bg" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop" alt="" />
        <div className="lc">
          <h2 style={{ fontSize: 34 }}>{t('auth_login_title')}</h2>
          <p style={{ color: '#c9c3b6', marginTop: 6, marginBottom: 20 }}>{t('auth_login_sub')}</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder={t('auth_login_email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder={t('auth_login_password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button type="submit" className="bt" style={{ width: '100%', marginTop: 14 }} disabled={loading}>
              {loading ? t('auth_login_loading') : t('auth_login_btn')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ color: '#c9c3b6', fontSize: 13 }}>{t('auth_no_account')} </span>
            <Link href="/register" style={{ color: '#c9c3b6', fontSize: 13, textDecoration: 'underline' }}>
              {t('auth_register_btn_short')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}