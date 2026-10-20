'use client';

import { useState } from 'react';
import { toast } from '@/components/site/common/toast';
import { useTranslation } from '@/lib/i18n';

export function ConsultSection() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      toast(t('toast_phone_error')); // ✅ Tarjima qilindi
      return;
    }
    toast(t('toast_success')); // ✅ Tarjima qilindi
    setName('');
    setPhone('');
  };

  return (
    <section className="sc">
      <div className="w">
        <div className="cs" id="consult">
          <h2>{t('consult_title')}</h2>
          <p className="mu" style={{ marginTop: 8 }}>{t('consult_desc')}</p>
          <form onSubmit={submit} className="rw">
            <input
              className="fd"
              placeholder={t('consult_name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="fd"
              placeholder={t('consult_phone')}
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="bt" style={{ height: 48, borderRadius: 12 }} type="submit">
              {t('consult_btn')}
            </button>
          </form>
          <p className="mu" style={{ fontSize: 12, marginTop: 14 }}>{t('consult_agree')}</p>
        </div>
      </div>
    </section>
  );
}