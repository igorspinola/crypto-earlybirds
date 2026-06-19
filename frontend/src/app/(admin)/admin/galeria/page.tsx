import { CoinGallery } from "@/components/features/trader/CoinGallery";
import { getGalleryCoins } from "@/lib/server-gallery";

export default async function AdminGaleriaPage() {
  const { coins, isFallback } = await getGalleryCoins();

  return <CoinGallery coins={coins} isFallback={isFallback} />;
}
