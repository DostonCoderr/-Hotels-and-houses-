'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Loader2,
  Settings as SettingsIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Camera,
  MessageCircle,
  Play,
  Users,
  Send,
  Palette,
  Eye,
  Search,
  X,
  RotateCcw,
  Download,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Building2,
  Hash,
  DollarSign,
  Languages,
  FileText,
  Info,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  fetchSettings,
  type SettingsGrouped,
} from '@/lib/api-settings';
import { useTranslation } from '@/lib/translations';
import { UPLOADS_URL } from '@/lib/constants';

interface SettingsFormProps {
  initialData?: SettingsGrouped | null;
  onSubmit: (data: { key: string; value: string }[]) => Promise<void>;
}

// ============================================================
// IKONKALAR
// ============================================================
const ICONS: Record<string, any> = {
  general: SettingsIcon,
  contacts: Phone,
  display: Palette,
  social: Globe,
};

const SETTING_ICONS: Record<string, any> = {
  site_name: Building2,
  site_description: FileText,
  logo: ImageIcon,
  phone: Phone,
  email: Mail,
  address: MapPin,
  working_hours: Clock,
  telegram: Send,
  instagram: Camera,
  whatsapp: MessageCircle,
  youtube: Play,
  facebook: Users,
  objects_per_page: Hash,
  main_categories: Sparkles,
  currency: DollarSign,
  language: Languages,
};

// ============================================================
// KOMPONENT
// ============================================================
export function SettingsForm({ initialData, onSubmit }: SettingsFormProps) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SettingsGrouped>(initialData || {});
  const [originalSettings, setOriginalSettings] = useState<SettingsGrouped>(
    initialData || {}
  );
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>('general');
  const [search, setSearch] = useState('');

  // ============================================================
  // GURUHLAR TARJIMASI
  // ============================================================
  const GROUP_LABELS: Record<string, { label: string; description: string }> = {
    general: {
      label: t.settingsGroupGeneral,
      description: t.settingsGroupGeneralDesc,
    },
    contacts: {
      label: t.settingsGroupContacts,
      description: t.settingsGroupContactsDesc,
    },
    display: {
      label: t.settingsGroupDisplay,
      description: t.settingsGroupDisplayDesc,
    },
    social: {
      label: t.settingsGroupSocial,
      description: t.settingsGroupSocialDesc,
    },
  };

  // ============================================================
  // SOZLAMALAR TARJIMASI
  // ============================================================
  const SETTING_LABELS: Record<string, string> = {
    site_name: t.settingSiteName,
    site_description: t.settingSiteDescription,
    logo: t.settingLogo,
    phone: t.phone,
    email: t.email,
    address: t.settingAddress,
    working_hours: t.settingWorkingHours,
    telegram: t.settingTelegram,
    instagram: t.settingInstagram,
    whatsapp: t.settingWhatsapp,
    youtube: t.settingYoutube,
    facebook: t.settingFacebook,
    objects_per_page: t.settingObjectsPerPage,
    main_categories: t.settingMainCategories,
    currency: t.settingCurrency,
    language: t.settingLanguage,
  };

  const SETTING_PLACEHOLDERS: Record<string, string> = {
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

  const SETTING_HINTS: Record<string, string> = {
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

  // ============================================================
  // YUKLASH
  // ============================================================
  useEffect(() => {
    if (initialData) {
      setSettings(initialData);
      setOriginalSettings(initialData);
      return;
    }
    async function load() {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
        setOriginalSettings(data);
        const groups = Object.keys(data);
        if (groups.length > 0) setActiveGroup(groups[0]);
      } catch (err) {
        toast.error(t.settingsLoadFailed);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialData, t]);

  // ============================================================
  // O'ZGARGANLAR SONI
  // ============================================================
  const changedCount = useMemo(() => {
    let count = 0;
    Object.entries(settings).forEach(([group, items]) => {
      Object.entries(items).forEach(([key, value]) => {
        if (originalSettings[group]?.[key] !== value) count++;
      });
    });
    return count;
  }, [settings, originalSettings]);

  // ============================================================
  // FILTRLANGAN GURUHLAR
  // ============================================================
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return Object.keys(settings);

    const q = search.toLowerCase();
    return Object.keys(settings).filter((group) => {
      const label = GROUP_LABELS[group]?.label?.toLowerCase() || group;
      if (label.includes(q)) return true;

      return Object.entries(settings[group]).some(([key, value]) => {
        const settingLabel =
          SETTING_LABELS[key]?.toLowerCase() || key.toLowerCase();
        return (
          settingLabel.includes(q) ||
          String(value).toLowerCase().includes(q)
        );
      });
    });
  }, [settings, search, GROUP_LABELS, SETTING_LABELS]);

  // ============================================================
  // QIYMATNI YANGILASH
  // ============================================================
  const updateValue = (group: string, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  // ============================================================
  // SAQLASH
  // ============================================================
  const handleSave = async () => {
    try {
      setSaving(true);
      const flat: { key: string; value: string }[] = [];
      Object.entries(settings).forEach(([group, items]) => {
        Object.entries(items).forEach(([key, value]) => {
          flat.push({ key, value: String(value) });
        });
      });
      await onSubmit(flat);
      setOriginalSettings(settings);
      toast.success(t.settingsSaved);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // BEKOR QILISH
  // ============================================================
  const handleReset = () => {
    if (!confirm(t.settingsResetConfirm)) return;
    setSettings(originalSettings);
    toast.success(t.settingsResetDone);
  };

  // ============================================================
  // JSON EKSPORT
  // ============================================================
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.settingsExported);
  };

  // ============================================================
  // YUKLANMOQDA
  // ============================================================
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-card rounded-2xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-card rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const groups = Object.keys(settings);

  return (
    <div className="space-y-5">
      {/* ============================================================
          QIDIRISH + AMALLAR PANELI
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-3 p-3 rounded-2xl bg-card sticky top-0 z-30 backdrop-blur-xl"
      >
        {/* Qidirish */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchSettings}
            className="pl-9 pr-9 h-10 rounded-full bg-muted/50 border-0"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* O'zgarishlar soni */}
          {changedCount > 0 && (
            <Badge
              variant="outline"
              className="border-0 bg-amber-500/10 text-amber-500 gap-1 h-10 px-3"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {changedCount} {t.changesCount}
            </Badge>
          )}

          {/* Bekor qilish */}
          {changedCount > 0 && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t.cancel}
            </Button>
          )}

          {/* Eksport */}
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {t.export}
          </Button>
        </div>
      </motion.div>

      {/* ============================================================
          TABLAR
          ============================================================ */}
      {filteredGroups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Search className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            "{search}" {t.noResultsFound}
          </p>
        </motion.div>
      ) : (
        <Tabs value={activeGroup} onValueChange={setActiveGroup}>
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto flex-wrap w-full justify-start">
            {groups.map((group) => {
              const groupInfo = GROUP_LABELS[group];
              const Icon = ICONS[group] || SettingsIcon;
              const isHidden = !filteredGroups.includes(group);

              return (
                <TabsTrigger
                  key={group}
                  value={group}
                  disabled={isHidden}
                  className={cn(
                    'rounded-xl h-10 data-[state=active]:bg-card data-[state=active]:text-foreground gap-2',
                    isHidden && 'opacity-30'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{groupInfo?.label || group}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {groups.map((group) => {
            const items = settings[group];
            const groupInfo = GROUP_LABELS[group];
            const GroupIcon = ICONS[group] || SettingsIcon;
            const filteredItems = search
              ? Object.entries(items).filter(([key, value]) => {
                  const settingLabel =
                    SETTING_LABELS[key]?.toLowerCase() || key.toLowerCase();
                  const q = search.toLowerCase();
                  return (
                    settingLabel.includes(q) ||
                    String(value).toLowerCase().includes(q)
                  );
                })
              : Object.entries(items);

            return (
              <TabsContent key={group} value={group} className="mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 bg-card rounded-2xl overflow-hidden">
                    {/* Sarlavha */}
                    <CardHeader className="border-b border-border/40">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <GroupIcon className="h-4.5 w-4.5 text-primary" />
                          </div>
                          <div>
                            <p>{groupInfo?.label || group}</p>
                            <p className="text-xs text-muted-foreground font-normal mt-0.5">
                              {groupInfo?.description ||
                                `${items ? Object.keys(items).length : 0} ${t.settingsCount}`}
                            </p>
                          </div>
                        </CardTitle>

                        <Badge
                          variant="outline"
                          className="border-0 bg-muted text-xs"
                        >
                          {filteredItems.length}
                        </Badge>
                      </div>
                    </CardHeader>

                    {/* Kontent */}
                    <CardContent className="p-5 space-y-5">
                      {filteredItems.map(([key, value], index) => {
                        const SettingIcon = SETTING_ICONS[key];
                        const label = SETTING_LABELS[key] || key;
                        const placeholder = SETTING_PLACEHOLDERS[key] || '';
                        const hint = SETTING_HINTS[key];
                        const isLong =
                          key.includes('description') ||
                          key.includes('address');
                        const isChanged =
                          originalSettings[group]?.[key] !== value;

                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={cn(
                              'space-y-2 p-3 -mx-3 rounded-xl transition-colors',
                              isChanged && 'bg-amber-500/5'
                            )}
                          >
                            {/* Yorliq */}
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor={key}
                                className="flex items-center gap-2"
                              >
                                {label}
                                {isChanged && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                )}
                              </Label>
                              <span className="text-xs text-muted-foreground font-mono">
                                {key}
                              </span>
                            </div>

                            {/* Kiritish */}
                            <div className="relative">
                              {SettingIcon && !isLong && (
                                <SettingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                              )}
                              {isLong ? (
                                <Textarea
                                  id={key}
                                  value={value}
                                  onChange={(e) =>
                                    updateValue(group, key, e.target.value)
                                  }
                                  rows={3}
                                  placeholder={placeholder}
                                  className="bg-muted/30 border-0 resize-none"
                                />
                              ) : (
                                <Input
                                  id={key}
                                  value={value}
                                  onChange={(e) =>
                                    updateValue(group, key, e.target.value)
                                  }
                                  placeholder={placeholder}
                                  className={cn(
                                    'h-11 bg-muted/30 border-0',
                                    SettingIcon && 'pl-10'
                                  )}
                                />
                              )}
                            </div>

                            {/* Ko'rsatma */}
                            {hint && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Info className="h-3 w-3 flex-shrink-0" />
                                <span>{hint}</span>
                              </div>
                            )}

                            {/* Logo ko'rinishi */}
                            {key === 'logo' && value && (
                              <div className="mt-2 p-3 rounded-xl bg-muted/30 flex items-center gap-3">
                                <img
                                  src={
                                    value.startsWith('http')
                                      ? value
                                      : `${UPLOADS_URL}${value}`
                                  }
                                  alt="Logo"
                                  className="h-10 w-auto object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display =
                                      'none';
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {t.logoPreview}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* ============================================================
          SAQLASH TUGMASI (yopishqoq)
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 sticky bottom-4 bg-background/95 backdrop-blur-xl p-3 rounded-2xl border border-border/40 shadow-lg"
      >
        {/* Ma'lumot */}
        <div className="flex items-center gap-3">
          {changedCount > 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {changedCount}
                </span>{' '}
                {t.unsavedChanges}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <p className="text-sm text-muted-foreground">
                {t.allChangesSaved}
              </p>
            </div>
          )}
        </div>

        {/* Saqlash tugmasi */}
        <Button
          onClick={handleSave}
          disabled={saving || changedCount === 0}
          className={cn(
            'rounded-full min-w-[140px]',
            changedCount > 0 && 'shadow-lg shadow-primary/25'
          )}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.saving}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t.save}
              {changedCount > 0 && ` (${changedCount})`}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}