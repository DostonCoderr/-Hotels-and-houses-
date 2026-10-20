'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Calendar, Heart, Clock, Settings,
  LogOut, Camera, Check, ArrowRight, ShieldCheck, Edit3, CalendarCheck
} from 'lucide-react';
import { toast } from '@/components/site/common/toast';
import { getProfile, updateProfile, getFavorites, getViewHistory, getScheduled, UserProfile } from '@/lib/api-users';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const getImageUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url}`;
};

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [views, setViews] = useState<any[]>([]);
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'fav' | 'views' | 'scheduled' | 'settings'>('fav');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ✅ TABS — komponent ichida (t() hook natijasi)
  const TABS: { id: string; key: TranslationKey; icon: any }[] = [
    { id: 'fav', key: 'prof_tab_fav', icon: Heart },
    { id: 'views', key: 'prof_tab_views', icon: Clock },
    { id: 'scheduled', key: 'prof_tab_scheduled', icon: CalendarCheck },
    { id: 'settings', key: 'prof_tab_settings', icon: Settings },
  ];

  useEffect(() => {
    const token = localStorage.getItem('site-token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function load() {
      try {
        const [profile, favs, hist, sched] = await Promise.all([
          getProfile(),
          getFavorites().catch(() => []),
          getViewHistory().catch(() => []),
          getScheduled().catch(() => []),
        ]);
        setUser(profile);
        setFavorites(favs);
        setViews(hist);
        setScheduled(sched);
        if (profile.avatar) setAvatarPreview(getImageUrl(profile.avatar));
      } catch {
        localStorage.removeItem('site-token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('site-token');
    localStorage.removeItem('site-user');
    toast(t('prof_toast_logged_out'));
    router.push('/');
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile({ name: user.name, phone: user.phone });
      toast(t('prof_toast_saved'));
    } catch {
      toast(t('prof_toast_save_error'));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      toast(t('prof_toast_avatar_updated'));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--bd)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main id="v-prof">
      <div className="w" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 1200 }}>

        <motion.div variants={containerVariants} initial="hidden" animate="show">

          {/* PROFILE HERO */}
          <motion.div variants={itemVariants} style={{
            position: 'relative', background: 'var(--card)', borderRadius: 24,
            padding: 40, marginBottom: 30, overflow: 'hidden', border: '1px solid var(--bd)'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(135deg, rgba(201,163,106,0.15) 0%, transparent 100%)' }} />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 30, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 120, height: 120, borderRadius: '50%', overflow: 'hidden',
                  border: '4px solid var(--card)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  background: 'var(--bg)'
                }}>
                  <img src={avatarPreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: 5, right: 5, width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', border: '3px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Camera size={14} color="#000" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 style={{ fontSize: 32, margin: 0, fontFamily: 'serif' }}>{user.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--mu)', marginTop: 6 }}>
                  <Mail size={14} /> {user.email}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <span style={{ background: 'rgba(201,163,106,0.15)', color: 'var(--gold)', padding: '6px 12px', borderRadius: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={14} /> {t('prof_verified')}
                  </span>
                  <span style={{ background: 'rgba(80,180,120,0.15)', color: '#7fd4a3', padding: '6px 12px', borderRadius: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              <div>
                <button className="bt" onClick={() => setActiveTab('settings')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit3 size={16} /> {t('prof_edit')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
            <StatCard icon={<Heart size={22} />} value={favorites.length} label={t('prof_stat_fav')} color="#c9a36a" />
            <StatCard icon={<Clock size={22} />} value={views.length} label={t('prof_stat_views')} color="#7fd4a3" />
            <StatCard icon={<CalendarCheck size={22} />} value={scheduled.length} label={t('prof_stat_scheduled')} color="#f59e0b" />
            <StatCard icon={<Calendar size={22} />} value={Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} label={t('prof_stat_days')} color="#ff9b9b" />
          </motion.div>

          {/* TABS */}
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--bd)', paddingBottom: 1, overflowX: 'auto' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500,
                  color: activeTab === tab.id ? 'var(--fg)' : 'var(--mu)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                <tab.icon size={18} /> {t(tab.key)}
              </button>
            ))}
          </motion.div>

          {/* TAB CONTENT */}
          <AnimatePresence mode="wait">
            {activeTab === 'fav' && (
              <motion.div key="fav" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {favorites.length > 0 ? favorites.map((p: any) => (
                  <a href={`/commercial/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--card)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bd)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: 180, width: '100%', position: 'relative' }}>
                        <img src={getImageUrl(p.images?.[0]?.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#e04b4b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Heart size={16} fill="#e04b4b" />
                        </button>
                      </div>
                      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: 18, margin: '0 0 6px', fontWeight: 'bold' }}>{p.name}</h3>
                        <div style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 12 }}>{p.address}</div>
                        <div style={{ marginTop: 'auto', fontSize: 20, fontWeight: 'bold', color: 'var(--gold)' }}>{p.price?.toLocaleString('ru-RU')} ₽</div>
                      </div>
                    </motion.div>
                  </a>
                )) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
                    <Heart size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <p>{t('prof_empty_fav')}</p>
                    <a href="/novostroyki" style={{ color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, textDecoration: 'none' }}>
                      {t('prof_find_property')} <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'views' && (
              <motion.div key="views" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {views.length > 0 ? views.map((p: any) => (
                  <a href={`/commercial/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--card)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bd)' }}>
                      <div style={{ height: 160, width: '100%' }}>
                        <img src={getImageUrl(p.images?.[0]?.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 16, margin: '0 0 4px', fontWeight: 'bold' }}>{p.name}</h3>
                        <div style={{ fontSize: 12, color: 'var(--mu)' }}>{p.address}</div>
                        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'var(--gold)' }}>{p.price?.toLocaleString('ru-RU')} ₽</div>
                      </div>
                    </motion.div>
                  </a>
                )) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
                    <Clock size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <p>{t('prof_empty_views')}</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'scheduled' && (
              <motion.div key="scheduled" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {scheduled.length > 0 ? scheduled.map((p: any) => (
                  <a href={`/commercial/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ y: -5 }} style={{ background: 'var(--card)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bd)' }}>
                      <div style={{ height: 160, width: '100%' }}>
                        <img src={getImageUrl(p.images?.[0]?.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 16, margin: '0 0 4px', fontWeight: 'bold' }}>{p.name}</h3>
                        <div style={{ fontSize: 12, color: 'var(--mu)' }}>{p.address}</div>
                        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'var(--gold)' }}>{p.price?.toLocaleString('ru-RU')} ₽</div>
                      </div>
                    </motion.div>
                  </a>
                )) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
                    <CalendarCheck size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <p>{t('prof_empty_scheduled')}</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ background: 'var(--card)', borderRadius: 24, padding: 30, border: '1px solid var(--bd)', maxWidth: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,163,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    <User size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{t('prof_settings_title')}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--mu)' }}>{t('prof_settings_sub')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 6, display: 'block' }}>{t('prof_label_name')}</label>
                    <input className="fd" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--bd)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 6, display: 'block' }}>{t('prof_label_email')}</label>
                    <input className="fd" value={user.email} readOnly style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--bd)', background: 'var(--bg)', color: 'var(--mu)', outline: 'none', opacity: 0.6 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 6, display: 'block' }}>{t('prof_label_phone')}</label>
                    <input className="fd" value={user.phone || ''} onChange={(e) => setUser({...user, phone: e.target.value})} placeholder={t('prof_phone_placeholder')} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--bd)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 30, paddingTop: 20, borderTop: '1px solid var(--bd)' }}>
                  <button className="bt" onClick={handleSaveSettings} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
                    {saving ? t('prof_saving') : <><Check size={16} /> {t('prof_save_changes')}</>}
                  </button>
                  <button onClick={handleLogout} style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(255,100,100,0.3)', background: 'transparent', color: '#ff6b6b', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LogOut size={16} /> {t('prof_logout')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </main>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 20, padding: 24, border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--fg)' }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--mu)' }}>{label}</div>
      </div>
    </div>
  );
}