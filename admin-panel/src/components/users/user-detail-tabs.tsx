'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Eye,
  Inbox,
  Building2,
  MapPin,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Application } from '@/types';
import {
  fetchUserFavorites,
  fetchUserViews,
  fetchUserApplications,
  type UserFavorite,
  type UserView,
} from '@/lib/api-users';
import { UPLOADS_URL, STATUS_COLORS } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface UserDetailTabsProps {
  userId: number;
}

// ============================================================
// BO'SH HOLAT
// ============================================================
function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export function UserDetailTabs({ userId }: UserDetailTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [views, setViews] = useState<UserView[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // STATUS VA VAQT YORLIQLARI
  // ============================================================
  const statusLabels: Record<string, string> = {
    new: t.statusNew,
    in_work: t.statusInWork,
    done: t.statusDone,
    closed: t.statusClosed,
  };

  const timeLabels = {
    now: t.timeNow,
    minutesAgo: t.timeMinutesAgo,
    hoursAgo: t.timeHoursAgo,
    daysAgo: t.timeDaysAgo,
  };

  // ============================================================
  // HAMMASINI YUKLASH
  // ============================================================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [fav, vw, apps] = await Promise.all([
          fetchUserFavorites(userId).catch(() => []),
          fetchUserViews(userId).catch(() => []),
          fetchUserApplications(userId).catch(() => []),
        ]);
        setFavorites(fav);
        setViews(vw);
        setApplications(apps);
      } catch (err) {
        console.error('Xato:', err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-muted/50 p-1 rounded-2xl w-full grid grid-cols-3 h-auto">
        <TabsTrigger
          value="favorites"
          className="rounded-xl h-10 data-[state=active]:bg-card data-[state=active]:text-foreground gap-2"
        >
          <Heart className="h-4 w-4" />
          <span>{t.favorites}</span>
          <Badge
            variant="outline"
            className="ml-1 text-xs border-0 bg-muted"
          >
            {favorites.length}
          </Badge>
        </TabsTrigger>

        <TabsTrigger
          value="views"
          className="rounded-xl h-10 data-[state=active]:bg-card data-[state=active]:text-foreground gap-2"
        >
          <Eye className="h-4 w-4" />
          <span>{t.views}</span>
          <Badge
            variant="outline"
            className="ml-1 text-xs border-0 bg-muted"
          >
            {views.length}
          </Badge>
        </TabsTrigger>

        <TabsTrigger
          value="applications"
          className="rounded-xl h-10 data-[state=active]:bg-card data-[state=active]:text-foreground gap-2"
        >
          <Inbox className="h-4 w-4" />
          <span>{t.applications}</span>
          <Badge
            variant="outline"
            className="ml-1 text-xs border-0 bg-muted"
          >
            {applications.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {/* ============================================================
          SEVIMLILAR
          ============================================================ */}
      <TabsContent value="favorites" className="mt-4">
        {loading ? (
          <LoadingState />
        ) : favorites.length === 0 ? (
          <EmptyState icon={Heart} text={t.noFavorites} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/properties/${fav.property.id}`}
                  className="block group"
                >
                  <div className="rounded-2xl bg-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/40">
                    {/* Rasm */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {fav.property.images?.[0]?.url ? (
                        <img
                          src={`${UPLOADS_URL}${fav.property.images[0].url}`}
                          alt={fav.property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <Badge
                        className={cn(
                          'absolute top-2 left-2 text-xs border-0',
                          STATUS_COLORS[fav.property.status] ||
                            'bg-muted text-muted-foreground'
                        )}
                      >
                        {fav.property.status}
                      </Badge>
                    </div>

                    {/* Ma'lumot */}
                    <div className="p-3 space-y-1.5">
                      <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {fav.property.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {fav.property.address}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(fav.property.price)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(fav.createdAt, timeLabels)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ============================================================
          KO'RISHLAR
          ============================================================ */}
      <TabsContent value="views" className="mt-4">
        {loading ? (
          <LoadingState />
        ) : views.length === 0 ? (
          <EmptyState icon={Eye} text={t.noViews} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {views.map((view, index) => (
              <motion.div
                key={view.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/properties/${view.property.id}`}
                  className="block group"
                >
                  <div className="rounded-2xl bg-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/40">
                    {/* Rasm */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {view.property.images?.[0]?.url ? (
                        <img
                          src={`${UPLOADS_URL}${view.property.images[0].url}`}
                          alt={view.property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <Badge
                        className={cn(
                          'absolute top-2 left-2 text-xs border-0',
                          STATUS_COLORS[view.property.status] ||
                            'bg-muted text-muted-foreground'
                        )}
                      >
                        {view.property.status}
                      </Badge>
                    </div>

                    {/* Ma'lumot */}
                    <div className="p-3 space-y-1.5">
                      <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {view.property.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {view.property.address}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(view.property.price)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(view.createdAt, timeLabels)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ============================================================
          ZAYAVKALAR
          ============================================================ */}
      <TabsContent value="applications" className="mt-4">
        {loading ? (
          <LoadingState />
        ) : applications.length === 0 ? (
          <EmptyState icon={Inbox} text={t.noApplications} />
        ) : (
          <div className="space-y-3">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="rounded-2xl bg-card border border-border/40 p-4 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground line-clamp-1">
                          {app.property?.name || t.noData}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs border-0',
                            STATUS_COLORS[app.status] ||
                              'bg-muted text-muted-foreground'
                          )}
                        >
                          {statusLabels[app.status] || app.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(app.createdAt, timeLabels)}
                        </span>
                        {app.phone && (
                          <span className="flex items-center gap-1">
                            {app.phone}
                          </span>
                        )}
                      </div>

                      {app.message && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {app.message}
                        </p>
                      )}
                    </div>

                    <Link href={`/applications`}>
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {t.view}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}