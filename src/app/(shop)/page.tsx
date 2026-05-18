import { getAdminBanners, getAdminCollections } from '@/actions/admin';
import { HeroBanner } from '@/components/shop/HeroBanner';
import { PremiumCategoryGrid } from '@/components/shop/PremiumCategoryGrid';
import { InstagramGrid } from '@/components/shop/InstagramGrid';
import {
  TrendingSection,
  FlashDeal,
  AIRecommendations,
  NewArrivals,
  LoyaltyBanner
} from '@/components/shop/HomeSections';

export default async function HomePage() {
  const [liveBanners] = await Promise.all([
    getAdminBanners(),
  ]);

  return (
    <div>
      <HeroBanner banners={liveBanners} />
      <PremiumCategoryGrid />
      <TrendingSection />
      <FlashDeal />
      <AIRecommendations />
      <InstagramGrid />
      <NewArrivals />
      <LoyaltyBanner />
    </div>
  );
}
