import { getAdminBanners, getAdminCollections } from '@/actions/admin';
import { HeroBanner } from '@/components/shop/HeroBanner';
import { CategoryGrid } from '@/components/shop/CategoryGrid';
import { InstagramGrid } from '@/components/shop/InstagramGrid';
import {
  TrendingSection,
  FlashDeal,
  AIRecommendations,
  NewArrivals,
  LoyaltyBanner
} from '@/components/shop/HomeSections';

export default async function HomePage() {
  const [liveBanners, liveCollections] = await Promise.all([
    getAdminBanners(),
    getAdminCollections()
  ]);

  return (
    <div>
      <HeroBanner banners={liveBanners} />
      <CategoryGrid collections={liveCollections} />
      <TrendingSection />
      <FlashDeal />
      <AIRecommendations />
      <InstagramGrid />
      <NewArrivals />
      <LoyaltyBanner />
    </div>
  );
}
