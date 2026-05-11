import { getAdminBanners, getAdminCollections } from '@/actions/admin';
export const dynamic = 'force-dynamic';
import { StorefrontLaunch } from '@/components/shop/StorefrontLaunch';

export default async function HomePage() {
  const [liveBanners, liveCollections] = await Promise.all([
    getAdminBanners(),
    getAdminCollections()
  ]);

  return (
    <StorefrontLaunch banners={liveBanners} collections={liveCollections} />
  );
}
