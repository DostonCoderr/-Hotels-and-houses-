'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/site/common/toast';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast(t('auth_toast_fill_required'));
      return;
    }
    if (form.password.length < 6) {
      toast(t('auth_toast_password_short'));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/users/register', form);
      localStorage.setItem('site-token', data.token);
      localStorage.setItem('site-user', JSON.stringify(data.user));
      toast(t('auth_toast_register_success'));
      router.push('/profile');
    } catch (err: any) {
      toast(err?.response?.data?.error || t('auth_toast_register_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="v-login">
      <div className="lgn" style={{ minHeight: 'calc(100vh - 68px)' }}>
        <img className="bg" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop" alt="" />
        <div className="lc">
          <h2 style={{ fontSize: 34 }}>{t('auth_register_title')}</h2>
          <p style={{ color: '#c9c3b6', marginTop: 6, marginBottom: 20 }}>{t('auth_register_sub')}</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t('auth_register_name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            <input
              type="email"
              placeholder={t('auth_register_email')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            <input
              type="tel"
              placeholder={t('auth_register_phone_optional')}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
            />
            <input
              type="password"
              placeholder={t('auth_register_password_hint')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />

            <button type="submit" className="bt" style={{ width: '100%', marginTop: 14 }} disabled={loading}>
              {loading ? t('auth_register_loading') : t('auth_register_btn')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ color: '#c9c3b6', fontSize: 13 }}>{t('auth_have_account')} </span>
            <Link href="/login" style={{ color: '#c9c3b6', fontSize: 13, textDecoration: 'underline' }}>
              {t('auth_login_btn_short')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}