import { getPublicRestaurantPayload } from '@/lib/public-restaurant-data';
import RestaurantShell from '@/components/restaurant/RestaurantShell';

export default async function Home() {
  const data = await getPublicRestaurantPayload();
  return <RestaurantShell data={data} />;
}
