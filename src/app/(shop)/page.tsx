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
import { ComboOffersSection } from '@/components/shop/ComboOffersSection';

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
      <ComboOffersSection />
      <AIRecommendations />
      <InstagramGrid />
      <NewArrivals />
      <LoyaltyBanner />
    </div>
  );
}
