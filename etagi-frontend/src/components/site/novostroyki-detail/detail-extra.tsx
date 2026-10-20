'use client';

import { useState } from 'react';
import { NovostroykaDetail } from '@/lib/static-data';
import { useTranslation } from '@/lib/i18n';

export function DetailExtra({ data }: { data: NovostroykaDetail }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'mort' | 'inst'>('mort');
  const [price, setPrice] = useState(data.price);
  const [down, setDown] = useState(Math.round(data.price * 0.3));
  const [rate, setRate] = useState(16);
  const [years, setYears] = useState(30);
  const [subsidy, setSubsidy] = useState(false);

  const Pn = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthlyPay = r === 0 ? Pn / n : (Pn * r) / (1 - Math.pow(1 + r, -n));
  const totalPay = monthlyPay * n;
  const overpay = totalPay - Pn;

  return (
    <>
      {/* 1. BANNER 6% */}
      <div className="nzd-section nzd-banner">
        <div>
          <b>{t('nzd_banner_title')}</b>
          <div className="nzd-banner-sub">{t('nzd_banner_sub')}</div>
          <div className="nzd-banner-btns">
            <button className="nzd-btn nzd-btn-red">{t('nzd_banner_btn1')}</button>
            <button className="nzd-btn nzd-btn-outline">{t('nzd_banner_btn2')}</button>
          </div>
        </div>
        <div className="nzd-banner-img">6%</div>
      </div>

      {/* 2. MORTGAGE */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_pay_title')}</h2>
        <div className="nzd-mort-tabs">
          <button className={`nzd-mort-tab ${tab === 'mort' ? 'on' : ''}`} onClick={() => setTab('mort')}>{t('nzd_tab_mortgage')}</button>
          <button className={`nzd-mort-tab ${tab === 'inst' ? 'on' : ''}`} onClick={() => setTab('inst')}>{t('nzd_tab_installment')}</button>
        </div>

        {tab === 'mort' ? (
          <div className="nzd-mort-body">
            <div className="nzd-mort-form">
              <div className="nzd-mort-field">
                <label>{t('nzd_price_property')} <span className="nzd-help">?</span></label>
                <div className="nzd-input">
                  <input type="text" value={price.toLocaleString('ru-RU')} onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, '')) || 0)} />
                  <span>₽</span>
                </div>
              </div>
              <div className="nzd-mort-field">
                <label>{t('nzd_down_payment')} <span className="nzd-help">?</span></label>
                <div className="nzd-input">
                  <input type="text" value={down.toLocaleString('ru-RU')} onChange={(e) => setDown(Number(e.target.value.replace(/\D/g, '')) || 0)} />
                  <span>₽</span>
                </div>
              </div>
              <div className="nzd-mort-field">
                <label>{t('nzd_rate')}</label>
                <div className="nzd-input">
                  <input type="text" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
                  <span>%</span>
                </div>
              </div>
              <div className="nzd-mort-field">
                <label>{t('nzd_term')}</label>
                <div className="nzd-input">
                  <input type="text" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} />
                  <span>{t('nzd_years')}</span>
                </div>
              </div>
            </div>

            {/* Subsidy Toggle */}
            <label className="nzd-subsidy">
              <input type="checkbox" checked={subsidy} onChange={() => setSubsidy(!subsidy)} />
              <span></span>
              {t('nzd_subsidy')} <span className="nzd-help">?</span>
            </label>

            <div className="nzd-mort-result">
              <div>
                <span className="mu">{t('nzd_monthly_payment')}</span>
                <div className="nzd-mort-pay">{isFinite(monthlyPay) && monthlyPay > 0 ? Math.round(monthlyPay).toLocaleString('ru-RU') : 0} ₽</div>
                <div className="mu" style={{ fontSize: 12, marginTop: 6 }}>
                  {t('nzd_overpay')}: {isFinite(overpay) && overpay > 0 ? Math.round(overpay).toLocaleString('ru-RU') : 0} ₽ · {t('nzd_total')}: {isFinite(totalPay) && totalPay > 0 ? Math.round(totalPay).toLocaleString('ru-RU') : 0} ₽
                </div>
              </div>
              <button className="nzd-btn nzd-btn-red">{t('nzd_apply_mortgage')}</button>
            </div>
          </div>
        ) : (
          <div className="nzd-mort-body">
            <div className="nzd-inst-info">
              <div className="nzd-inst-row"><span>{t('nzd_inst_term')}</span><b>{t('nzd_inst_term_val')}</b></div>
              <div className="nzd-inst-row"><span>{t('nzd_inst_down')}</span><b>{t('nzd_inst_down_val')}</b></div>
              <div className="nzd-inst-row"><span>{t('nzd_inst_markup')}</span><b>{t('nzd_inst_markup_val')}</b></div>
              <div className="nzd-inst-row"><span>{t('nzd_inst_fee')}</span><b>{t('nzd_inst_fee_val')}</b></div>
            </div>
            <div className="nzd-mort-result">
              <div>
                <span className="mu">{t('nzd_monthly_payment')}</span>
                <div className="nzd-mort-pay">{Math.round(Pn / 36).toLocaleString('ru-RU')} ₽</div>
              </div>
              <button className="nzd-btn nzd-btn-red">{t('nzd_apply_installment')}</button>
            </div>
          </div>
        )}
      </div>

      {/* 3. REVIEWS & DECLARATIONS */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_reviews_title')}</h2>
        <div className="nzd-reviews-empty">
          <div className="nzd-re-empty-img">🔍</div>
          <div>
            <b>{t('nzd_reviews_empty_title')}</b>
            <p className="mu">{t('nzd_reviews_empty_desc')}</p>
          </div>
          <button className="nzd-btn nzd-btn-blue">{t('nzd_leave_review')}</button>
        </div>
      </div>

      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_declarations_title')}</h2>
        <a href="#" className="nzd-decl">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          {t('nzd_declaration_1')}
        </a>
        <a href="#" className="nzd-decl">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          {t('nzd_declaration_2')}
        </a>
      </div>

      {/* 4. DISCLAIMER */}
      <div className="nzd-section">
        <p className="nzd-disclaimer">{t('nzd_disclaimer_1')}</p>
        <p className="nzd-disclaimer">{t('nzd_disclaimer_2')}</p>
        <p className="nzd-disclaimer">{t('nzd_disclaimer_3')}</p>
      </div>
    </>
  );
}