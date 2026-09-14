import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import { getBestsellers } from "@/data/products";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const bestsellers = getBestsellers();

  return (
    <>
      {/* Hero — dark atmospheric block */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-burgundy-deep text-on-dark">
        <Image
          src="/brand/mood-texture.jpg"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover opacity-30"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-deep via-burgundy-deep/60 to-transparent" />
        <div className="container-content relative py-16 md:py-24">
          <p className="font-script text-2xl text-on-dark-muted md:text-3xl">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-[1.1] md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-sm text-on-dark-muted md:text-base">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/catalog" variant="primary" size="lg">
              {t("heroCta")}
            </Button>
            <Button
              href="/about"
              variant="secondary"
              size="lg"
              className="border-on-dark text-on-dark hover:bg-on-dark hover:text-burgundy-deep"
            >
              {t("heroSecondaryCta")}
            </Button>
          </div>
        </div>
      </section>

      {/* Sign intro teaser — light, editorial */}
      <section className="container-content py-20 text-center md:py-28">
        <p className="font-script text-2xl text-burgundy md:text-3xl">
          {t("signLine1")}
        </p>
        <p className="mt-1 font-script text-2xl text-burgundy md:text-3xl">
          {t("signLine2")}
        </p>
        <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink md:text-xl">
          {t("signIntro")}
        </p>
      </section>

      {/* Bestsellers */}
      <section className="container-content pb-20 md:pb-28">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl md:text-3xl">{t("bestsellersTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("bestsellersSubtitle")}</p>
          </div>
          <Link
            href="/catalog"
            className="text-xs uppercase tracking-[0.14em] text-ink underline underline-offset-4 hover:text-burgundy"
          >
            {t("heroCta")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* About teaser — dark block */}
      <section className="relative overflow-hidden bg-burgundy-deep py-20 text-on-dark md:py-28">
        <Image
          src="/brand/mood-texture.jpg"
          alt=""
          fill
          aria-hidden
          className="object-cover opacity-20"
        />
        <div className="container-content relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl leading-tight md:text-4xl">
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
            <span className="font-script text-[7rem] leading-none text-on-dark-muted md:text-[10rem]">
              19:38
            </span>
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section className="container-content py-20 md:py-28">
        <h2 className="text-center text-2xl md:text-3xl">{t("trustTitle")}</h2>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["trustHandmadeTitle", "trustHandmadeBody"],
              ["trustOneOfOneTitle", "trustOneOfOneBody"],
              ["trustWorldwideTitle", "trustWorldwideBody"],
              ["trustPersonalTitle", "trustPersonalBody"],
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
