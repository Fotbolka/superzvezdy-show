"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AnimatorCard from "../components/AnimatorCard";
import Header from "../components/Header";
import ShowCard from "../components/ShowCard";
import LegalDisclaimer from "../components/LegalDisclaimer";

type Show = {
  name: string;
  price: number;
  duration: string;
};

type Animator = {
  name: string;
  image: string;
  shows: Show[];
  description: string;
  tag: string;
  bestFor: string[];
};

const commonShows: Show[] = [
  {
    name: "Экспресс поздравление",
    price: 2500,
    duration: "5–7 мин",
  },
  {
    name: "Шоу поздравление",
    price: 3500,
    duration: "15–20 мин",
  },
  {
    name: "Супер шоу",
    price: 6000,
    duration: "25–30 мин",
  },
];

const animators: Animator[] = [
  {
    name: "Григорий Лепс",
    image: "/images/leps.png",
    description:
      "Яркий шоу-образ для поздравлений, корпоративов и статусных мероприятий. Подходит для формата, где нужен сильный музыкальный акцент.",
    tag: "Музыкальное поздравление",
    bestFor: ["Корпоратив", "Свадьба", "Частное мероприятие"],
    shows: commonShows,
  },
  {
    name: "Галустян, Супер-Жорик",
    image: "/images/jorik.png",
    description:
      "Энергичное поздравление с яркой подачей и узнаваемым образом. Хорошо подходит для весёлых и динамичных праздников.",
    tag: "Яркий образ",
    bestFor: ["Корпоратив", "Вечеринка", "Шоу-программа"],
    shows: commonShows,
  },
  {
    name: "Стас Михайлов",
    image: "/images/stas.png",
    description:
      "Подходит для тёплой праздничной атмосферы, свадеб, юбилеев и мероприятий с более взрослой аудиторией.",
    tag: "Поздравление",
    bestFor: ["Свадьба", "Юбилей", "Корпоратив"],
    shows: commonShows,
  },
  {
    name: "Артур Пирожков",
    image: "/images/pirojhok.jpg",
    description:
      "Танцевальный и харизматичный формат для драйвовых праздников. Отлично работает на активную публику.",
    tag: "Танцевальное поздравление",
    bestFor: ["Корпоратив", "Вечеринка", "День рождения"],
    shows: commonShows,
  },
  {
    name: "Аллегрова",
    image: "/images/alla.png",
    description:
      "Эффектный артистический образ для праздничных поздравлений, ярких выходов и эмоциональных программ.",
    tag: "Эстрадный образ",
    bestFor: ["Юбилей", "Свадьба", "Корпоратив"],
    shows: commonShows,
  },
  {
    name: "Влад А4",
    image: "/images/achetire.jpg",
    description:
      "Подходит для детских праздников и активных интерактивов. Особенно интересен для молодой аудитории.",
    tag: "Для детей",
    bestFor: ["День рождения", "Детский праздник", "Интерактив"],
    shows: commonShows,
  },
  {
    name: "Сергей Жуков",
    image: "/images/jykov.png",
    description:
      "Узнаваемый шоу-образ для массовой аудитории, ностальгической атмосферы и больших праздничных программ.",
    tag: "Хитовая программа",
    bestFor: ["Корпоратив", "Свадьба", "Большой праздник"],
    shows: commonShows,
  },
  {
    name: "Сюрприз из Африки",
    image: "/images/africa.jpg",
    description:
      "Яркий шуточный шоу-образ с африканской тематикой, танцем «Макарена», игрой «Банановое испытание», реалистичным образом африканца и поздравлением голосом персонажа.",
    tag: "Сюрприз-шоу",
    bestFor: ["День рождения", "Вечеринка", "Корпоратив"],
    shows: [
      {
        name: "Сюрприз из Африки",
        price: 5500,
        duration: "15–20 мин",
      },
    ],
  },
  {
    name: "Праздничное задержание",
    image: "/images/police.jpg",
    description:
      "Необычная поздравительная программа в образе полицейского: флешмоб, игра «Волшебный жезл», реквизит, спецэффекты, фотосессия и шуточное вручение поздравления.",
    tag: "Интерактивное шоу",
    bestFor: ["День рождения", "Корпоратив", "Вечеринка"],
    shows: [
      {
        name: "Праздничное задержание",
        price: 5500,
        duration: "15–20 мин",
      },
    ],
  },
];

const eventTypes = [
  "День рождения",
  "Корпоратив",
  "Свадьба",
  "Юбилей",
  "Вечеринка",
  "Детский праздник",
];

const steps = [
  {
    number: "01",
    title: "Выберите аниматора",
    text: "Посмотрите фото, формат выступления и откройте подробную информацию.",
  },
  {
    number: "02",
    title: "Откройте программы",
    text: "Нажмите «Подробнее», чтобы увидеть длительность, стоимость и варианты поздравления.",
  },
  {
    number: "03",
    title: "Оформите заказ",
    text: "Нажмите «Заказать» у нужной программы и заполните форму заявки.",
  },
];

export default function AnimatorsPage() {
  const [selectedAnimator, setSelectedAnimator] = useState<Animator | null>(null);

  const totalPrograms = useMemo(() => {
    return animators.reduce((sum, animator) => sum + animator.shows.length, 0);
  }, []);

  const minPrice = useMemo(() => {
    const prices = animators.flatMap((animator) =>
      animator.shows.map((show) => show.price)
    );
    return Math.min(...prices);
  }, []);

  const featuredAnimator = animators.find(
    (animator) => animator.name === "Артур Пирожков"
  )!;

  const featuredShow = featuredAnimator.shows[2];

  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-black pt-24 text-white">
        {/* HERO */}
        <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-20 md:py-20">
          <div className="pointer-events-none absolute left-[-160px] top-10 h-[280px] w-[280px] rounded-full bg-purple-600/25 blur-[110px] sm:h-[360px] sm:w-[360px]" />
          <div className="pointer-events-none absolute right-[-180px] top-40 h-[320px] w-[320px] rounded-full bg-pink-500/20 blur-[120px] sm:h-[420px] sm:w-[420px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-[240px] w-[240px] rounded-full bg-blue-500/20 blur-[110px] sm:h-[300px] sm:w-[300px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 backdrop-blur sm:mb-6 sm:px-4 sm:text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                <span className="truncate">Каталог аниматоров и артистов</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                Выберите артиста для яркого праздника
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl">
                Смотрите фото, открывайте подробности, выбирайте формат поздравления
                и оформляйте заказ прямо на сайте.
              </p>

              <div className="mt-6 max-w-2xl sm:mt-7">
                <LegalDisclaimer />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <a
                  href="#catalog"
                  className="rounded-2xl bg-white px-6 py-4 text-center text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:px-8 sm:text-lg"
                >
                  Смотреть каталог
                </a>

                <Link
                  href="/reviews"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center text-base font-bold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white hover:text-black sm:px-8 sm:text-lg"
                >
                  Читать отзывы
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                  <p className="text-3xl font-black">{animators.length}</p>
                  <p className="mt-1 text-sm text-gray-400">артистов</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                  <p className="text-3xl font-black">{totalPrograms}</p>
                  <p className="mt-1 text-sm text-gray-400">программ</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                  <p className="text-3xl font-black">
                    от {minPrice.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="mt-1 text-sm text-gray-400">стоимость</p>
                </div>
              </div>
            </div>

            {/* Правая карточка */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-2xl sm:-inset-4 sm:rounded-[40px]" />

              <div className="relative rounded-[28px] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur sm:rounded-[36px] sm:p-6">
                <div className="rounded-[24px] bg-black/70 p-4 sm:rounded-[28px] sm:p-6">
                  <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
                    <div>
                      <p className="text-sm text-gray-400">Популярный артист</p>
                      <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                        {featuredAnimator.name}
                      </h2>
                    </div>

                    <div className="rounded-full bg-white px-3 py-2 text-xs font-bold text-black sm:px-4 sm:text-sm">
                      TOP
                    </div>
                  </div>

                  <div className="relative h-[320px] overflow-hidden rounded-[24px] bg-neutral-950 sm:h-[380px] sm:rounded-[28px] lg:h-[430px]">
                    <img
                      src={featuredAnimator.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                    />

                    <img
                      src={featuredAnimator.image}
                      alt={featuredAnimator.name}
                      className="relative z-10 h-full w-full object-contain p-3"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-5 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold sm:text-xl">
                          {featuredShow.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {featuredShow.duration} · {featuredAnimator.tag}
                        </p>
                      </div>

                      <p className="text-2xl font-black">
                        {featuredShow.price.toLocaleString("ru-RU")} ₽
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedAnimator(featuredAnimator)}
                      className="mt-5 block w-full rounded-xl bg-white px-5 py-3 text-center font-bold text-black transition hover:bg-gray-200"
                    >
                      Открыть подробнее
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ТИПЫ МЕРОПРИЯТИЙ */}
        <section className="px-4 py-12 sm:px-6 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Форматы мероприятий
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Подберём артиста под ваш формат
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Можно выбрать короткое поздравление, шоу-программу или насыщенный
                формат с конкурсами, спецэффектами и подарками.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              {eventTypes.map((type) => (
                <div
                  key={type}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08] sm:px-6 sm:py-4 sm:text-lg"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* КАТАЛОГ */}
        <section id="catalog" className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center sm:mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                Каталог аниматоров
              </p>

              <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black sm:text-4xl md:text-5xl">
                Выберите артиста и откройте подробности
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
                У каждого артиста доступны три формата поздравления:
                экспресс, шоу и супер шоу.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
              {animators.map((animator, index) => (
                <AnimatorCard
                  key={index}
                  animator={animator}
                  onOpen={() => setSelectedAnimator(animator)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:rounded-[40px] sm:p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Как заказать
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Всё просто и удобно
                </h2>

                <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
                  Открываете карточку, смотрите подробности, выбираете формат
                  поздравления и отправляете заявку.
                </p>

                <Link
                  href="/services"
                  className="mt-7 inline-block w-full rounded-2xl border border-white/20 px-6 py-4 text-center text-base font-bold transition hover:bg-white hover:text-black sm:mt-8 sm:w-auto sm:px-8 sm:text-lg"
                >
                  Посмотреть услуги
                </Link>
              </div>

              <div className="grid gap-4 sm:gap-5">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-base font-black text-black sm:h-14 sm:w-14 sm:text-lg">
                        {step.number}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold sm:text-2xl">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-gray-400 sm:text-base">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ФИНАЛЬНЫЙ CTA */}
        <section className="px-4 py-16 text-center sm:px-6 sm:py-24 md:px-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.04] px-5 py-12 sm:rounded-[44px] sm:px-6 sm:py-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-purple-500/30 blur-[100px] sm:h-[300px] sm:w-[300px] sm:blur-[110px]" />

            <div className="relative">
              <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
                Готовы выбрать аниматора?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                Посмотрите каталог, откройте подробности и оформите заказ на
                подходящую программу прямо на сайте.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
                <a
                  href="#catalog"
                  className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:px-9 sm:text-lg"
                >
                  Перейти к каталогу
                </a>

                <Link
                  href="/reviews"
                  className="rounded-2xl border border-white/20 px-7 py-4 text-base font-bold transition hover:bg-white hover:text-black sm:px-9 sm:text-lg"
                >
                  Смотреть отзывы
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-gray-500 sm:px-6">
          © 2026 Аниматоры Новосибирск. Каталог артистов и шоу-программ.
        </footer>

        {/* МОДАЛЬНОЕ ОКНО */}
        {selectedAnimator && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-3 py-5 sm:px-4 sm:py-8"
            onClick={() => setSelectedAnimator(null)}
          >
            <div
              className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[24px] bg-white p-4 text-black shadow-2xl sm:rounded-[32px] sm:p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedAnimator(null)}
                className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl leading-none text-white transition hover:bg-neutral-800 sm:right-5 sm:top-5 sm:h-11 sm:w-11"
              >
                ×
              </button>

              <div className="grid gap-6 md:grid-cols-[360px_1fr] md:gap-8">
                {/* Фото */}
                <div className="relative h-[320px] overflow-hidden rounded-3xl bg-neutral-950 sm:h-[400px] md:h-[440px]">
                  <img
                    src={selectedAnimator.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                  />

                  <img
                    src={selectedAnimator.image}
                    alt={selectedAnimator.name}
                    className="relative z-10 h-full w-full object-contain p-3"
                  />
                </div>

                {/* Информация */}
                <div className="pr-0 md:pr-8">
                  <div className="flex flex-wrap items-center gap-3 pr-12 sm:pr-14">
                    <h2 className="text-3xl font-bold sm:text-4xl">
                      {selectedAnimator.name}
                    </h2>

                    <span className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                      {selectedAnimator.tag}
                    </span>
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                    {selectedAnimator.description}
                  </p>

                  <div className="mt-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm leading-relaxed text-yellow-900">
                    <p className="font-bold">
                      Важно: это ростовая кукла / пародийный шоу-образ.
                    </p>

                    <p className="mt-1">
                      Услуга не является официальным выступлением настоящего артиста и не связана
                      с его представителями, лейблом или правообладателями.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                    {selectedAnimator.bestFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 sm:px-4 sm:text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    Программы и стоимость
                  </h3>

                  <div className="mt-5 space-y-4">
                    {selectedAnimator.shows.map((show, index) => (
                      <ShowCard
                        key={index}
                        show={show}
                        animator={selectedAnimator}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAnimator(null)}
                    className="mt-6 w-full rounded-xl border border-neutral-300 px-6 py-3 font-semibold transition hover:bg-neutral-100 sm:w-auto"
                  >
                    Вернуться к выбору
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}