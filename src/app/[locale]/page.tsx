import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/data/products";
import { fetchAlbums, albumLabel } from "@/lib/albums";
import { NEW_SLUG } from "@/data/albumTypes";
import { SITE_IMAGE_KEYS, fetchSiteImages, siteImageUrl } from "@/lib/siteImages";

export const revalidate = 60;

/** Homepage "new collection" showcase shows at most this many products. */
const NEW_COLLECTION_LIMIT = 4;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const products = await fetchProducts();
  const albums = await fetchAlbums();
  const siteImages = await fetchSiteImages();

  // The homepage showcases whichever products the admin has tagged with
  // the "new" album (renamed to e.g. "FIRST MOMENTS" from /admin/albums —
  // the section heading below is that album's own name, so renaming it
  // there is all it takes to relabel this section). Capped at
  // NEW_COLLECTION_LIMIT so the grid always matches the 4-up layout;
  // "К коллекции" links to the full, unclipped list in the catalog.
  const newCollectionAlbum = albums.find((a) => a.slug === NEW_SLUG);
  const newCollectionProducts = products
    .filter((p) => p.albums.includes(NEW_SLUG))
    .slice(0, NEW_COLLECTION_LIMIT);

  return (
    <>
      {/* Hero — dark atmospheric block */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-burgundy-deep text-on-dark">
        <Image
          src={siteImageUrl(siteImages, SITE_IMAGE_KEYS.homeHero)}
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover opacity-30"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/60 to-transparent" />
        <div className="container-content relative py-16 md:py-24">
          <p className="italic text-2xl text-on-dark-muted md:text-3xl">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[0.98] tracking-tight md:text-7xl lg:text-8xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-sm text-on-dark-muted md:text-base">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={`/catalog?album=${NEW_SLUG}`} variant="primary" size="lg">
              {t("heroCta")}
            </Button>
          </div>
        </div>
      </section>

      {/* Sign intro teaser — light, editorial */}
      <section className="container-content py-20 text-center md:py-28">
        <p className="italic text-2xl text-burgundy md:text-3xl">
          {t("signLine1")}
        </p>
        <p className="mt-1 italic text-2xl text-burgundy md:text-3xl">
          {t("signLine2")}
        </p>
        <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink md:text-xl">
          {t("signIntro")}
        </p>
      </section>

      {/* New collection showcase — shows whichever products the admin has
          tagged with the "new" album (named e.g. "FIRST MOMENTS" from
          /admin/albums); hidden if nothing is tagged yet. */}
      {newCollectionProducts.length > 0 && (
        <section className="container-content pb-20 md:pb-28">
          <div className="mb-10 border-b border-line pb-6 text-center">
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {newCollectionAlbum ? albumLabel(newCollectionAlbum, locale) : t("heroTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted">{t("newCollectionSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-px gap-y-12 md:grid-cols-4">
            {newCollectionProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={`/catalog?album=${NEW_SLUG}`} variant="primary" size="md">
              {t("viewCollectionCta")}
            </Button>
            <Button href="/catalog" variant="secondary" size="md">
              {t("viewCatalogCta")}
            </Button>
          </div>
        </section>
      )}

      {/* About teaser — dark block */}
      <section className="relative overflow-hidden bg-burgundy-deep py-20 text-on-dark md:py-28">
        <Image
          src={siteImageUrl(siteImages, SITE_IMAGE_KEYS.homeAboutTeaser)}
          alt=""
          fill
          aria-hidden
          className="object-cover opacity-20"
        />
        <div className="container-content relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
              {t("aboutTeaserTitle")}
            </h2>
            <p className="mt-5 max-w-md text-on-dark-muted">
              {t("aboutTeaserBody")}
            </p>
            <Button
              href="/about"
              variant="secondary"
              size="md"
              className="mt-8 border-on-dark text-on-dark hover:bg-on-dark hover:text-burgundy-deep"
            >
              {t("aboutTeaserCta")}
            </Button>
          </div>
          <div className="flex justify-center">
            <span className="font-display text-[7rem] leading-none tracking-tight text-on-dark-muted md:text-[10rem]">
              19:38
            </span>
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section className="container-content py-20 md:py-28">
        <h2 className="font-display text-center text-3xl tracking-tight md:text-4xl">{t("trustTitle")}</h2>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {(
            [
              ["trustHandmadeTitle", "trustHandmadeBody"],
              ["trustOneOfOneTitle", "trustOneOfOneBody"],
              ["trustWorldwideTitle", "trustWorldwideBody"],
            ] as const
          ).map(([titleKey, bodyKey]) => (
            <div key={titleKey} className="text-center sm:text-left">
              <h3 className="text-sm uppercase tracking-[0.14em] text-burgundy">
                {t(titleKey)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t(bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
