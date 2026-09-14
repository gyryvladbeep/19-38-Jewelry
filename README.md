# 19:38 Jewelry — сайт магазина

Next.js 16 + TypeScript + Tailwind CSS 4, мультиязычный (RU/EN) сайт-каталог для бренда handmade-украшений 19:38 Jewelry. MVP: каталог, карточка товара, корзина, избранное, заявка на заказ (без онлайн-оплаты).

## Стек

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS 4** — дизайн-токены в `src/app/globals.css` (`@theme`)
- **next-intl** — мультиязычность (`ru` / `en`), `src/i18n/`
- Состояние корзины/избранного — React Context + `localStorage` (`src/lib/store.tsx`), без бэкенда
- Данные товаров — статический файл `src/data/products.ts` (см. ниже, как перейти на CMS)

## Быстрый старт

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:3000/ru` (редирект с `/` определяет язык браузера).

```bash
npm run build   # прод-сборка
npm run start   # прод-сервер локально
npm run lint    # ESLint
```

## Управление товарами (сейчас — до подключения CMS)

Товары лежат в `src/data/products.ts` — это **8 демонстрационных товаров**, чтобы каталог, фильтры и карточка товара работали на реальных данных. Замените их на настоящие перед запуском.

Каждый товар — объект `Product`:

```ts
{
  slug: "pearl-drop-necklace",     // используется в URL /product/<slug>
  pieceNumber: "007",               // номер экземпляра (19:38 / 007)
  price: 9200,                      // цена в рублях (число)
  type: "necklace",                 // ring | necklace | earrings | bracelet
  materials: ["pearl", "rhodium"],  // stone | pearl | rhodium
  availability: "in_stock",         // in_stock | made_to_order
  personalization: ["size"],        // engraving | size | color (пусто — без персонализации)
  bestseller: true,                 // показывать на главной в "Заметные вещи"
  reviews: [ { author, rating, ru, en } ],
  ru: { name, shortDescription, description },
  en: { name, shortDescription, description },
}
```

Добавили товар в массив `products` — он автоматически появляется в каталоге, на главной (если `bestseller: true`) и получает свою страницу `/product/<slug>` на обоих языках.

### Переход на полноценную CMS/админку

В брифе вы указали 20–50+ товаров и необходимость полноценной админ-панели — статический файл для такого объёма быстро станет неудобным. Дальнейший шаг (не входит в этот MVP): подключить headless CMS (например, Sanity или Payload) или базу данных (Supabase/Postgres) и заменить `getProductBySlug` / `products` в `src/data/products.ts` на запросы к ней — остальной код (каталог, карточка, корзина) написан против этого файла и не потребует переделки, если сохранить те же поля.

## Фотографии товаров

**Реальных фото пока нет.** Вместо них используется `src/components/ProductImagePlaceholder.tsx` — нейтральная плашка с линейной иконкой типа украшения и номером экземпляра, а не поддельное фото. Это сделано намеренно: сайт не выдаёт плейсхолдер за реальный товар.

Чек-лист, что снять для каждого товара (минимум):
- 1 карточное фото на однотонном/нейтральном фоне (соотношение 1:1) — для каталога
- 2–4 фото крупным планом, editorial-стиль (глубина резкости, естественный свет) — для карточки товара
- 1 фото "в жизни" (на руке/шее/ухе) — усиливает доверие и масштаб
- По возможности — фото карточки-послания и упаковки (это часть УТП бренда, см. `/about`)

Когда фото будут готовы: замените `<ProductImagePlaceholder>` на `<Image src="/products/<slug>/1.jpg">` в `src/components/ProductCard.tsx` и `src/components/ProductDetailClient.tsx`, добавив поле `images: string[]` в `Product`.

## Шрифты

- **Aileron** (основной шрифт бренда) не распространяется через Google Fonts, поэтому пока используется **Archivo** — похожий нейтральный гротеск, загружается через `<link>` в `src/app/[locale]/layout.tsx` (не через `next/font/google`, см. комментарий в файле — это специально, чтобы сборка не зависела от доступа к fonts.googleapis.com в изолированных средах сборки).
- Рукописный логотип временно — **Permanent Marker** (Google Fonts), пока нет лицензированного файла реального шрифта логотипа.

Когда появятся лицензированные файлы Aileron и шрифта логотипа: положите `.woff2` в `src/fonts/`, подключите через `next/font/local` в `src/app/[locale]/layout.tsx` и обновите `--font-body` / `--font-logo` в `src/app/globals.css`.

## Промокоды

`src/data/promocodes.ts` — демо-коды `WELCOME10` (10%) и `SIGN15` (15%), проверяются **на клиенте**. Это временная демонстрация механики в корзине. Перед запуском перенесите проверку промокода на сервер (API route), иначе скидку можно подделать через консоль браузера.

## Подключение реальных уведомлений о заказах/сообщениях

Сейчас `src/app/api/order/route.ts` и `src/app/api/contact/route.ts` только валидируют данные и логируют их (`console.log`) — заявки никуда не отправляются. Перед запуском подключите реальный канал, например:

- **Telegram**: Bot API `sendMessage` (создать бота через @BotFather, добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в переменные окружения, вызвать `fetch` в обоих route-файлах)
- **E-mail**: Resend / Postmark — добавить API-ключ в переменные окружения и вызвать их SDK/API в тех же route-файлах

## Мультиязычность

- Роутинг: `/ru/...` и `/en/...` (см. `src/i18n/routing.ts`), middleware — `src/proxy.ts`
- Тексты интерфейса — `messages/ru.json` и `messages/en.json`
- Тексты товаров — прямо в `src/data/products.ts` (поля `ru` / `en` на каждом товаре)
- Добавить армянский (обсуждали как задачу на будущее): добавить `"hy"` в `routing.locales` в `src/i18n/routing.ts` и создать `messages/hy.json`

## Переменные окружения

Создайте `.env.local` (не коммитится):

```
NEXT_PUBLIC_SITE_URL=https://your-domain-or-vercel-url.vercel.app
```

Используется в `sitemap.ts` / `robots.ts` для абсолютных ссылок.

## Деплой

### 1. Залить код на GitHub (gyryvladbeep)

```bash
git add -A
git commit -m "Initial 19:38 Jewelry MVP site"
git branch -M main
git remote add origin https://github.com/gyryvladbeep/1938-jewelry.git
git push -u origin main
```

(Сначала создайте пустой репозиторий `1938-jewelry` на https://github.com/new под аккаунтом `gyryvladbeep` — без README/gitignore, чтобы не было конфликтов при первом пуше.)

### 2. Деплой на Vercel (бесплатный поддомен, без своего домена)

1. Зайдите на https://vercel.com и войдите через GitHub.
2. "Add New… → Project" → выберите репозиторий `1938-jewelry`.
3. Framework Preset определится автоматически как Next.js — ничего менять не нужно.
4. В Environment Variables добавьте `NEXT_PUBLIC_SITE_URL` со значением вида `https://1938-jewelry.vercel.app` (Vercel покажет точный адрес после первого деплоя — можно проставить и обновить переменную задним числом).
5. Нажмите Deploy.

После этого каждый `git push` в `main` будет автоматически передеплоивать сайт.

Когда будете готовы подключить свой домен — Vercel Project → Settings → Domains.

## Структура проекта

```
src/
  app/[locale]/        # страницы (App Router, ru/en)
  app/api/              # order + contact route handlers
  components/            # UI-компоненты
  components/layout/     # Header, Footer, Logo, LanguageSwitcher
  components/ui/         # Button, Badge
  data/                  # products.ts, promocodes.ts
  i18n/                  # next-intl конфигурация
  lib/                   # store.tsx (корзина/избранное), format.ts
messages/                # ru.json, en.json — тексты интерфейса
public/brand/            # логотип/референс-изображения из брендбука
```

## Известные ограничения MVP (см. "Future Features" в концепции)

- Нет онлайн-оплаты — заявка обрабатывается вручную
- Нет реальной админ-панели/CMS — товары редактируются в коде
- Нет реальных фото товаров — используются нейтральные плейсхолдеры
- Промокоды проверяются на клиенте (демо-логика)
- Уведомления о заказах/сообщениях только логируются на сервере, никуда не отправляются
