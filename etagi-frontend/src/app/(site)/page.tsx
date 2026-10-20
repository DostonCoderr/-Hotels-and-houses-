import { fetchProperties } from '@/lib/api-properties';
import { fetchJournal } from '@/lib/api-journal';
import { TEAM_STATIC } from '@/lib/team-data';   
import { Hero } from '@/components/site/home/hero';
import { SearchPanel } from '@/components/site/home/search-panel';
import { AdBanner } from '@/components/site/home/ad-banner';
import { FeaturedSlider } from '@/components/site/home/featured-slider';
import { SwiperSection } from '@/components/site/home/swiper-section';
import { MapSection } from '@/components/site/home/map-section';
import { QuickSearch } from '@/components/site/home/quick-search';
import { FeaturesGrid } from '@/components/site/home/features-grid';
import { TeamSection } from '@/components/site/home/team-section';
import { ConsultSection } from '@/components/site/home/consult-section';
import { JournalSection } from '@/components/site/home/journal-section';
import { NewSection } from '@/components/site/home/new-section';

export const revalidate = 60; // 60 sekundda bir marta qayta yuklash (ISR)

export default async function HomePage() {
  // ✅ Backend'dan parallel yuklash
  const [propertiesRes, journal] = await Promise.all([
    fetchProperties({ limit: 8, published: true }).catch(() => ({ items: [], total: 0, totalPages: 1 })),
    fetchJournal(4).catch(() => []),
  ]);

  const properties = propertiesRes.items || [];

  // ✅ static-data formatidan backend formatiga moslashtirish
  // (FeaturedSlider / SwiperSection / MapSection / PropertyCard kutayotgan format)
  const formattedProperties = properties.map((p: any) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    metro: p.metro || '',
    price: p.price,
    rooms: p.rooms ? `${p.rooms}` : '—',
    area: p.area,
    lat: p.lat || 41.311081,
    lng: p.lng || 69.240562,
    img: p.images?.[0]?.url
      ? (p.images[0].url.startsWith('http') ? p.images[0].url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${p.images[0].url}`)
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    type: p.type === 'house' ? 'house' : p.type === 'commercial' ? 'com' : 'new',
    date: 1,
  }));
   const team = TEAM_STATIC;

  return (
    <main id="v-home" style={{ overflowX: 'hidden' }}>
      <Hero />

      <div className="w" style={{ position: 'relative', zIndex: 10 }}>
        <SearchPanel />
      </div>

      <AdBanner />

      <FeaturedSlider items={formattedProperties.slice(0, 8)} />
      <SwiperSection items={formattedProperties.slice(0, 8)} />

      <NewSection />

      <MapSection items={formattedProperties} />
      <QuickSearch />
      <FeaturesGrid />
      <TeamSection members={team} /> 
      <ConsultSection />
      <JournalSection items={journal} />
    </main>
  );
}