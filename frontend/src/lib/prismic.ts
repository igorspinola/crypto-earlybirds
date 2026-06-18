import { asText, createClient, type RichTextField } from "@prismicio/client";

type PrismicImageField = {
  url?: string | null;
  alt?: string | null;
};

type HomeDocument = {
  data?: {
    hero_image?: PrismicImageField | null;
    hero_title?: string | null;
    hero_subtitle?: string | null;
  };
};

type AboutDocument = {
  data?: {
    title?: string | null;
    content?: RichTextField | null;
  };
};

type CategoryDocument = {
  uid?: string | null;
  data?: {
    name?: string | null;
    image?: PrismicImageField | null;
  };
};

export type CmsHome = {
  heroImageUrl: string | null;
  heroImageAlt: string;
  heroTitle: string;
  heroSubtitle: string;
};

export type CmsAbout = {
  title: string;
  content: string;
};

export type CmsCategory = {
  uid: string;
  name: string;
  imageUrl: string | null;
  imageAlt: string;
};

const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

const HOME_FALLBACK: CmsHome = {
  heroImageUrl: null,
  heroImageAlt: "Hero da CriptoCoin",
  heroTitle: "O Futuro do Seu Dinheiro Começa Aqui.",
  heroSubtitle:
    "Compre, venda e guarde Bitcoin, Ethereum e as principais criptomoedas do mercado em uma plataforma simples, rápida e 100% segura.",
};

const ABOUT_FALLBACK: CmsAbout = {
  title: "Sobre Nós",
  content:
    "A CriptoCoin acredita que o acesso ao mercado de criptoativos deve ser para todos. Simplificamos a complexidade da blockchain para oferecer a você uma experiência fluida, seja você um investidor iniciante ou um trader experiente.",
};

const CATEGORY_FALLBACK: CmsCategory[] = [
  {
    uid: "defi",
    name: "DeFi",
    imageUrl: null,
    imageAlt: "Categoria DeFi",
  },
  {
    uid: "nft",
    name: "NFT",
    imageUrl: null,
    imageAlt: "Categoria NFT",
  },
  {
    uid: "metaverse",
    name: "Metaverse",
    imageUrl: null,
    imageAlt: "Categoria Metaverse",
  },
  {
    uid: "stablecoins",
    name: "Stablecoins",
    imageUrl: null,
    imageAlt: "Categoria Stablecoins",
  },
];

function getPrismicClient() {
  if (!repositoryName) {
    return null;
  }

  return createClient(repositoryName, {
    accessToken: accessToken || undefined,
  });
}

export async function getHomeContent(): Promise<CmsHome> {
  const client = getPrismicClient();

  if (!client) {
    return HOME_FALLBACK;
  }

  try {
    const document = await client.getSingle("home");
    const home = document as HomeDocument;

    return {
      heroImageUrl: home.data?.hero_image?.url ?? null,
      heroImageAlt: home.data?.hero_image?.alt || HOME_FALLBACK.heroImageAlt,
      heroTitle: home.data?.hero_title?.trim() || HOME_FALLBACK.heroTitle,
      heroSubtitle:
        home.data?.hero_subtitle?.trim() || HOME_FALLBACK.heroSubtitle,
    };
  } catch {
    return HOME_FALLBACK;
  }
}

export async function getAboutContent(): Promise<CmsAbout> {
  const client = getPrismicClient();

  if (!client) {
    return ABOUT_FALLBACK;
  }

  try {
    const document = await client.getSingle("about");
    const about = document as AboutDocument;
    const content = about.data?.content ? asText(about.data.content) : "";

    return {
      title: about.data?.title?.trim() || ABOUT_FALLBACK.title,
      content: content.trim() || ABOUT_FALLBACK.content,
    };
  } catch {
    return ABOUT_FALLBACK;
  }
}

export async function getCategories(): Promise<CmsCategory[]> {
  const client = getPrismicClient();

  if (!client) {
    return CATEGORY_FALLBACK;
  }

  try {
    const response = await client.getAllByType("category");
    const categories = response as CategoryDocument[];

    if (!categories.length) {
      return CATEGORY_FALLBACK;
    }

    return categories.map((category) => ({
      uid: category.uid || "category",
      name: category.data?.name?.trim() || "Categoria",
      imageUrl: category.data?.image?.url ?? null,
      imageAlt:
        category.data?.image?.alt || category.data?.name?.trim() || "Categoria",
    }));
  } catch {
    return CATEGORY_FALLBACK;
  }
}
