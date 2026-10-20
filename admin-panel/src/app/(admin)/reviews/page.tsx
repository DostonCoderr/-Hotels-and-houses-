'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReviewStatsCards } from '@/components/reviews/review-stats';
import { ReviewTable } from '@/components/reviews/review-table';
import {
  fetchAdminReviews,
  fetchReviewStats,
  publishReview,
  unpublishReview,
  deleteReview,
  type ReviewStats,
} from '@/lib/api-reviews';
import type { Review } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 20;

  // ============================================================
  // YUKLASH
  // ============================================================
  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        fetchAdminReviews({
          page,
          limit,
          search: search || undefined,
          published: publishedFilter,
          rating: ratingFilter,
          sort: 'newest',
        }),
        fetchReviewStats(),
      ]);
      setReviews(reviewsData.items);
      setTotal(reviewsData.total);
      setTotalPages(reviewsData.totalPages);
      setStats(statsData);
    } catch (err) {
      console.error('Xato:', err);
      toast.error(t.reviewsLoadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, publishedFilter, ratingFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // E'LON QILISH
  // ============================================================
  const handlePublish = async (id: number) => {
    try {
      await publishReview(id);
      toast.success(t.reviewPublished);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // YASHIRISH
  // ============================================================
  const handleUnpublish = async (id: number) => {
    try {
      await unpublishReview(id);
      toast.success(t.reviewUnpublished);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // O'CHIRISH
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm(t.reviewDeleteConfirm)) return;
    try {
      await deleteReview(id);
      toast.success(t.reviewDeleted);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {t.reviewsTitle}
            </h1>
            <span className="text-sm text-muted-foreground">({total})</span>
          </div>
          <p className="text-muted-foreground mt-1">
            {t.reviewsSubtitle}
          </p>
        </div>
      </div>

      {/* ============================================================
          STATISTIKA
          ============================================================ */}
      <ReviewStatsCards stats={stats} />

      {/* ============================================================
          FILTRLAR
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-card"
      >
        {/* Qidirish */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchReview}
            className="pl-9 h-10 rounded-full bg-muted/50 border-0"
          />
        </div>

        {/* E'lon holati filtri */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPublishedFilter(undefined)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              publishedFilter === undefined
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.all}
          </button>
          <button
            onClick={() => setPublishedFilter(true)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              publishedFilter === true
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.published}
          </button>
          <button
            onClick={() => setPublishedFilter(false)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              publishedFilter === false
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.pending}
          </button>
        </div>

        {/* Reyting filtri */}
        <div className="flex items-center gap-1 flex-wrap">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setRatingFilter(ratingFilter === rating ? undefined : rating)
              }
              className={cn(
                'px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1',
                ratingFilter === rating
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              <Star
                className={cn(
                  'h-3 w-3',
                  ratingFilter === rating ? 'fill-current' : ''
                )}
              />
              {rating}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ============================================================
          JADVAL
          ============================================================ */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-card animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ReviewTable
          reviews={reviews}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onDelete={handleDelete}
        />
      )}

      {/* ============================================================
          SAHIFALASH
          ============================================================ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t.page} {page} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full"
            >
              {t.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full"
            >
              {t.next}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}