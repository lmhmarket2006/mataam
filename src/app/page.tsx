import { getPublicRestaurantPayload } from '@/lib/public-restaurant-data';
import RestaurantShell from '@/components/restaurant/RestaurantShell';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getPublicRestaurantPayload();
  return <RestaurantShell data={data} />;
}
