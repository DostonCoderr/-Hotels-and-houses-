'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { toast } from './toast';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

interface ConsultModalStore {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const useConsultModal = create<ConsultModalStore>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));

export function ConsultModal() {
  const { t } = useTranslation(); // ✅ Hook
  const { open, setOpen } = useConsultModal();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.replace(/\D/g, '').length < 9) {
      toast(t('toast_phone_error'));
      return;
    }
    if (!name.trim()) {
      toast(t('toast_name_error'));
      return;
    }

    setLoading(true);

    try {
      await api.post('/applications', {
        type: 'consultation',
        name: name,
        phone: phone,
        message: msg,
        source: 'site'
      });

      toast(t('toast_consult_success'));
      setOpen(false);
      setName('');
      setPhone('');
      setMsg('');
    } catch (error: any) {
      console.error('Xatolik:', error);
      toast(error?.response?.data?.error || t('toast_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal on" id="consultModal">
      <div className="modal-content">
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>{t('modal_consult_title')}</h2>
        <p className="mu" style={{ marginBottom: 20 }}>
          {t('modal_consult_desc')}
        </p>
        <form onSubmit={submit}>
          <input
            className="fd"
            placeholder={t('modal_name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 10 }}
            disabled={loading}
          />
          <input
            className="fd"
            placeholder={t('modal_phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginBottom: 10 }}
            disabled={loading}
          />
          <textarea
            className="fd"
            placeholder={t('modal_message')}
            rows={3}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{ height: 80, padding: 12, marginBottom: 16 }}
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="bo" onClick={() => setOpen(false)} disabled={loading}>
              {t('modal_cancel')}
            </button>
            <button type="submit" className="bt" disabled={loading}>
              {loading ? t('modal_sending') : t('modal_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}