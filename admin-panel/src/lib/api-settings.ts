import { api } from '@/lib/api';
import type { Setting } from '@/types';
import type { Translations } from '@/lib/translations';

// ============================================================
// TIPLAR
// ============================================================
export interface SettingsGrouped {
  [group: string]: {
    [key: string]: string;
  };
}

export interface SettingWithId {
  id: number;
  key: string;
  value: string;
  group: string;
  updatedAt: string;
}

// ============================================================
// HAMMASI
// ============================================================
export async function fetchSettings(): Promise<SettingsGrouped> {
  const { data } = await api.get('/settings');
  return data;
}

// ============================================================
// HAMMASI (xom)
// ============================================================
export async function fetchAllSettingsRaw(): Promise<SettingWithId[]> {
  const { data } = await api.get('/settings/all');
  return data.items || data;
}

// ============================================================
// KALIT BO'YICHA
// ============================================================
export async function fetchSetting(key: string): Promise<SettingWithId> {
  const { data } = await api.get(`/settings/${key}`);
  return data;
}

// ============================================================
// YANGILASH
// ============================================================
export async function updateSetting(
  key: string,
  value: string
): Promise<SettingWithId> {
  const { data } = await api.put(`/settings/${key}`, { value });
  return data;
}

// ============================================================
// KO'P YANGILASH
// ============================================================
export async function bulkUpdateSettings(
  settings: { key: string; value: string }[]
): Promise<void> {
  await api.put('/settings', { settings });
}

// ============================================================
// GURUHLAR YORLIQLARI (DINAMIK — tarjima orqali)
// ============================================================
export function getGroupLabels(t: Translations): Record<
  string,
  { label: string; icon: string; description: string }
> {
  return {
    general: {
      label: t.settingsGroupGeneral,
      icon: '⚙️',
      description: t.settingsGroupGeneralDesc,
    },
    contacts: {
      label: t.settingsGroupContacts,
      icon: '📞',
      description: t.settingsGroupContactsDesc,
    },
    display: {
      label: t.settingsGroupDisplay,
      icon: '🎨',
      description: t.settingsGroupDisplayDesc,
    },
    social: {
      label: t.settingsGroupSocial,
      icon: '📱',
      description: t.settingsGroupSocialDesc,
    },
  };
}

// ============================================================
// SOZLAMALAR YORLIQLARI (DINAMIK — tarjima orqali)
// ============================================================
export function getSettingLabels(t: Translations): Record<string, string> {
  return {
    site_name: t.settingSiteName,
    site_description: t.settingSiteDescription,
    logo: t.settingLogo,
    phone: t.phone,
    email: t.email,
    address: t.settingAddress,
    telegram: t.settingTelegram,
    instagram: t.settingInstagram,
    whatsapp: t.settingWhatsapp,
    facebook: t.settingFacebook,
    youtube: t.settingYoutube,
    objects_per_page: t.settingObjectsPerPage,
    main_categories: t.settingMainCategories,
    working_hours: t.settingWorkingHours,
    currency: t.settingCurrency,
    language: t.settingLanguage,
  };
}

// ============================================================
// SOZLAMALAR PLACEHOLDERLARI (DINAMIK — tarjima orqali)
// ============================================================
export function getSettingPlaceholders(
  t: Translations
): Record<string, string> {
  return {
    site_name: t.settingSiteNamePlaceholder,
    site_description: t.settingSiteDescriptionPlaceholder,
    logo: t.settingLogoPlaceholder,
    phone: t.settingPhonePlaceholder,
    email: t.settingEmailPlaceholder,
    address: t.settingAddressPlaceholder,
    working_hours: t.settingWorkingHoursPlaceholder,
    telegram: t.settingTelegramPlaceholder,
    instagram: t.settingInstagramPlaceholder,
    whatsapp: t.settingWhatsappPlaceholder,
    youtube: t.settingYoutubePlaceholder,
    facebook: t.settingFacebookPlaceholder,
    objects_per_page: t.settingObjectsPerPagePlaceholder,
    main_categories: t.settingMainCategoriesPlaceholder,
    currency: t.settingCurrencyPlaceholder,
    language: t.settingLanguagePlaceholder,
  };
}

// ============================================================
// SOZLAMALAR KO'RSATMALARI (DINAMIK — tarjima orqali)
// ============================================================
export function getSettingHints(t: Translations): Record<string, string> {
  return {
    site_name: t.settingSiteNameHint,
    site_description: t.settingSiteDescriptionHint,
    logo: t.settingLogoHint,
    phone: t.settingPhoneHint,
    email: t.settingEmailHint,
    address: t.settingAddressHint,
    working_hours: t.settingWorkingHoursHint,
    telegram: t.settingTelegramHint,
    instagram: t.settingInstagramHint,
    whatsapp: t.settingWhatsappHint,
    youtube: t.settingYoutubeHint,
    facebook: t.settingFacebookHint,
    objects_per_page: t.settingObjectsPerPageHint,
    main_categories: t.settingMainCategoriesHint,
    currency: t.settingCurrencyHint,
    language: t.settingLanguageHint,
  };
}