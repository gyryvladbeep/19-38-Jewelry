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

## Управление товарами

Товары редактируются через админ-панель на `/admin` (см. раздел "Админ-панель и редактирование контента" ниже) — там же загружаются фото. Админка хранит товары в Supabase; пока Supabase не настроен (или временно недоступен), сайт автоматически показывает **8 демонстрационных товаров** из `src/data/fallback-products.json`, чтобы каталог, фильтры и карточка товара всегда работали на каких-то данных.

Формат товара (поля в базе `products`, см. `supabase/schema.sql`):

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
  images: ["https://....supabase.co/storage/v1/object/public/media/products/..."],
  reviews: [ { author, rating, ru, en } ],
  ru: { name, shortDescription, description },
  en: { name, shortDescription, description },
}
```

Товар, сохранённый через `/admin`, автоматически появляется в каталоге, на главной (если отмечена галочка "Показывать в «Заметных вещах»") и получает свою страницу `/product/<slug>` на обоих языках — без передеплоя (см. ISR ниже).

## Фотографии товаров

Загружаются прямо в админ-панели (`/admin/products/<товар>` → "Фото" → "Добавить фото") — файлы уходят в приватный для записи, но публичный для чтения бакет Supabase Storage `media`, и ссылки на них сохраняются в поле `images` товара. Первое фото в списке используется как основное на карточке товара.

Пока у товара нет ни одного загруженного фото, вместо него показывается `src/components/ProductImagePlaceholder.tsx` — нейтральная плашка с линейной иконкой типа украшения и номером экземпляра, а не поддельное фото. Это сделано намеренно: сайт не выдаёт плейсхолдер за реальный товар.

Чек-лист, что снять для каждого товара (минимум):
- 1 карточное фото на однотонном/нейтральном фоне (соотношение 1:1) — для каталога
- 2–4 фото крупным планом, editorial-стиль (глубина резкости, естественный свет) — для карточки товара
- 1 фото "в жизни" (на руке/шее/ухе) — усиливает доверие и масштаб
- По возможности — фото карточки-послания и упаковки (это часть УТП бренда, см. `/about`)

## Админ-панель и редактирование контента (/admin)

Простая встроенная админка — без стороннего headless CMS. Она защищена одним общим паролем (без отдельных аккаунтов) и хранит данные в вашем собственном бесплатном проекте Supabase (база данных Postgres + файловое хранилище для фото).

Что можно редактировать:
- **Товары** (`/admin/products`) — создание, редактирование, удаление, загрузка/удаление фото, все поля из таблицы выше, на русском и английском.
- **Тексты страниц** (`/admin/content`) — главная, о бренде, доставка, возврат, конфиденциальность, описание на странице контактов, и вопросы/ответы в разделе FAQ (сами вопросы можно добавлять/удалять). Названия разделов меню и текст на кнопках (навигация, "В корзину" и т.п.) в админке не редактируются — это тексты интерфейса, они находятся в `messages/ru.json` / `messages/en.json`.

### Настройка (один раз)

1. **Создайте проект Supabase** — https://supabase.com/dashboard → "New project" (бесплатный тариф). Дождитесь, пока проект поднимется (пара минут).
2. **Примените схему базы данных** — в проекте откройте SQL Editor → "New query", вставьте содержимое файла `supabase/schema.sql` целиком и нажмите "Run". Это создаст таблицы `products` и `content_blocks`.
3. **Создайте бакет для фото** — в том же проекте: Storage → "New bucket" → имя строго `media` → включите переключатель "Public bucket" → Create bucket. (Через SQL-редактор бакет не создать, только через интерфейс.)
4. **Возьмите ключи подключения** — Settings → API: скопируйте "Project URL" (это `SUPABASE_URL`) и ключ из раздела "service_role" (это `SUPABASE_SERVICE_ROLE_KEY`, **не** "anon public" — у service_role больше прав, никогда не публикуйте его и не используйте в `NEXT_PUBLIC_`-переменных).
5. **Задайте пароль и секрет сессии** — `ADMIN_PASSWORD` — любой пароль, которым будете входить на `/admin`; `ADMIN_SESSION_SECRET` — случайная строка для подписи cookie входа, сгенерировать можно командой:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. **Добавьте все 4 переменные** и локально (`.env.local`, см. `.env.example`), и на Vercel (Project → Settings → Environment Variables) — иначе на проде админка будет недоступна (в разработке `/admin` тоже требует их, иначе покажет сообщение "Supabase не настроен").
7. **(Необязательно) Перенесите 8 демо-товаров в Supabase**, чтобы не начинать с пустого каталога:
   ```bash
   node --env-file=.env.local scripts/seed-supabase.mjs
   ```
   (Нужен Node 20.6+ для `--env-file`; на более старой версии — экспортируйте `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` в терминале и запустите без этого флага.) Скрипт безопасно запускать повторно — товары с уже существующим slug он пропускает.
8. Откройте `/admin`, войдите паролем из `ADMIN_PASSWORD`.

Изменения, сохранённые в админке, появляются на сайте в течение минуты (используется ISR-кэширование, `revalidate = 60`), без передеплоя.

Если Supabase временно недоступен (опечатка в URL, нет интернета у сервера и т.п.) — публичный сайт не падает, он просто показывает последние известные/демонстрационные данные; при попытке что-то сохранить в `/admin` появится понятное сообщение об ошибке на русском.

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

Создайте `.env.local` (не коммитится) по образцу `.env.example`:

```
NEXT_PUBLIC_SITE_URL=https://your-domain-or-vercel-url.vercel.app

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

`NEXT_PUBLIC_SITE_URL` используется в `sitemap.ts` / `robots.ts` для абсолютных ссылок. Остальные четыре — для админ-панели, см. "Админ-панель и редактирование контента" выше.

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
  app/admin/             # /admin — логин + защищённая админка (товары, тексты)
  app/api/              # order + contact + products + admin login/logout route handlers
  components/            # UI-компоненты
  components/layout/     # Header, Footer, Logo, LanguageSwitcher
  components/ui/         # Button, Badge
  data/                  # products.ts, fallback-products.json, promocodes.ts
  i18n/                  # next-intl конфигурация
  lib/                   # store.tsx (корзина/избранное), format.ts, supabase.ts, adminAuth.ts, content.ts
messages/                # ru.json, en.json — тексты интерфейса
public/brand/            # логотип/референс-изображения из брендбука
supabase/                # schema.sql — создать таблицы одним запуском в SQL Editor
scripts/                 # seed-supabase.mjs — перенос демо-товаров в Supabase
```

## Известные ограничения MVP (см. "Future Features" в концепции)

- Нет онлайн-оплаты — заявка обрабатывается вручную
- Реальных фото товаров пока нет (можно загрузить через `/admin`) — до загрузки используются нейтральные плейсхолдеры
- Промокоды проверяются на клиенте (демо-логика)
- Уведомления о заказах/сообщениях только логируются на сервере, никуда не отправляются
- Админка — один общий пароль на всех редакторов, без раздельных ролей/истории изменений
