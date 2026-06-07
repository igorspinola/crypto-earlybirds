import Image from "next/image";

type BrandImagePanelProps = {
  quote?: string;
  author?: string;
};

export function BrandImagePanel({
  quote = "“O Bitcoin não é apenas o dinheiro para a internet, é a internet do dinheiro.”",
  author = "Andreas Antonopoulos",
}: BrandImagePanelProps) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden p-8 text-white md:flex">
      <Image
        src="/images/bitcoin-coin.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      <div className="relative flex items-center gap-2 font-display text-lg font-medium">
        <Image
          src="/images/logo.svg"
          alt=""
          width={28}
          height={24}
          className="h-6 w-auto"
        />
        CriptoCoin
      </div>
      <blockquote className="relative space-y-2 font-display">
        <p className="text-lg font-medium leading-snug md:text-xl">{quote}</p>
        <footer className="text-xs text-white/70 md:text-sm">— {author}</footer>
      </blockquote>
    </div>
  );
}
