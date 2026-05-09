"use client";

import Header from "./components/Header";
import Link from "next/link";
import LegalDisclaimer from "./components/LegalDisclaimer";

const advantages = [
  {
    icon: "⚡",
    title: "Быстрый подбор",
    text: "Выберите артиста и формат поздравления за пару минут без долгих переписок."
  },
  {
    icon: "🎤",
    title: "Три понятных формата",
    text: "Экспресс поздравление, шоу поздравление и супер шоу с разной длительностью."
  },
  {
    icon: "💬",
    title: "Отзывы гостей",
    text: "Можно посмотреть реальные отзывы и выбрать артиста увереннее."
  },
  {
    icon: "💰",
    title: "Понятные цены",
    text: "Стоимость, длительность и формат программы указаны сразу."
  },
  {
    icon: "🎉",
    title: "Для любых праздников",
    text: "Дни рождения, корпоративы, свадьбы, выпускные и частные мероприятия."
  },
  {
    icon: "✅",
    title: "Удобный заказ",
    text: "Открываете карточку артиста, выбираете программу и оставляете заявку."
  }
];

const formats = [
  "День рождения",
  "Корпоратив",
  "Свадьба",
  "Выпускной",
  "Детский праздник",
  "Частная вечеринка"
];

const steps = [
  {
    number: "01",
    title: "Выберите аниматора",
    text: "Посмотрите карточки артистов, фото и доступные форматы поздравления."
  },
  {
    number: "02",
    title: "Откройте подробности",
    text: "Нажмите «Подробнее», чтобы увидеть цену, длительность и формат программы."
  },
  {
    number: "03",
    title: "Оформите заказ",
    text: "Нажмите «Заказать», заполните данные и отправьте заявку."
  }
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-black pt-24 text-white">
        {/* HERO */}
        <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:min-h-[90vh] md:px-20 md:py-20">
          {/* Декоративные пятна */}
          <div className="pointer-events-none absolute left-[-160px] top-10 h-[280px] w-[280px] rounded-full bg-purple-600/25 blur-[110px] sm:h-[360px] sm:w-[360px]" />
          <div className="pointer-events-none absolute right-[-180px] top-40 h-[320px] w-[320px] rounded-full bg-pink-500/20 blur-[120px] sm:h-[420px] sm:w-[420px]" />
          <div className="pointer-events-none absolute bottom-10 left-1/2 h-[240px] w-[240px] rounded-full bg-blue-500/20 blur-[110px] sm:h-[300px] sm:w-[300px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Левая часть */}
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 backdrop-blur sm:px-4 sm:text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                <span className="truncate">Шоу-программы в Новосибирске</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                Аниматоры и артисты для праздника, который запомнят
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl">
                Выбирайте артиста, смотрите форматы поздравлений, длительность
                и стоимость, а затем оформляйте заказ прямо на сайте.
              </p>

              <div className="mt-6 max-w-2xl sm:mt-7">
                <LegalDisclaimer />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <Link
                  href="/animators"
                  className="rounded-2xl bg-white px-6 py-4 text-center text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:px-8 sm:text-lg"
                >
                  Смотреть аниматоров
                </Link>

                <Link
                  href="/reviews"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center text-base font-bold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white hover:text-black sm:px-8 sm:text-lg"
                >
                  Читать отзывы
                </Link>
              </div>

              {/* Статистика */}
              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-3xl font-black">9</p>s
                  <p className="mt-1 text-sm text-gray-400">артистов</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-3xl font-black">3</p>
                  <p className="mt-1 text-sm text-gray-400">формата</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-3xl font-black">от 2 500 ₽</p>
                  <p className="mt-1 text-sm text-gray-400">стоимость</p>
                </div>
              </div>
            </div>

            {/* Правая часть */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-2xl sm:-inset-4 sm:rounded-[40px]" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur sm:rounded-[36px] sm:p-5">
                <div className="rounded-[24px] bg-black/70 p-4 sm:rounded-[28px] sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
                    <div>
                      <p className="text-sm text-gray-400">Популярное шоу</p>
                      <h2 className="text-xl font-bold sm:text-2xl">
                        Супер шоу
                      </h2>
                    </div>

                    <div className="rounded-full bg-white px-3 py-2 text-xs font-bold text-black sm:px-4 sm:text-sm">
                      TOP
                    </div>
                  </div>

                  <div className="relative h-[320px] overflow-hidden rounded-[24px] bg-neutral-950 sm:h-[380px] sm:rounded-[28px] lg:h-[430px]">
                    <img
                      src="/images/pirojhok.jpg"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                    />

                    <img
                      src="/images/pirojhok.jpg"
                      alt="Артур Пирожков"
                      className="relative z-10 h-full w-full object-contain p-3"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-5 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold sm:text-xl">
                          Артур Пирожков
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          25–30 мин · микс из хитов артиста
                        </p>
                      </div>

                      <p className="text-2xl font-black">6 000 ₽</p>
                    </div>

                    <Link
                      href="/animators"
                      className="mt-5 block rounded-xl bg-white px-5 py-3 text-center font-bold text-black transition hover:bg-gray-200"
                    >
                      Выбрать программу
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ФОРМАТЫ */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Форматы мероприятий
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Подходит для любого праздника
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Можно подобрать короткое поздравление, полноценное шоу,
                интерактив, музыкальный формат или программу под конкретную аудиторию.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formats.map((format) => (
                <div
                  key={format}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08] sm:p-7"
                >
                  <div className="mb-6 h-12 w-12 rounded-2xl bg-white text-2xl leading-[48px] text-black transition group-hover:scale-110 sm:mb-8">
                    <span className="flex h-full w-full items-center justify-center">
                      ✦
                    </span>
                  </div>

                  <h3 className="text-xl font-bold sm:text-2xl">
                    {format}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                    Подберём программу, которая подходит под формат,
                    возраст гостей и атмосферу мероприятия.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ПРЕИМУЩЕСТВА */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                Почему выбирают нас
              </p>

              <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black sm:text-4xl md:text-5xl">
                Всё, чтобы заказать шоу было легко и понятно
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:mt-12 md:grid-cols-2 xl:grid-cols-3">
              {advantages.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-white/30 sm:p-7"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl sm:mb-6">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                    {item.text}
                  </p>
                </div>
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
                  Три простых шага
                </h2>

                <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
                  Мы сделали процесс максимально простым: без лишних страниц,
                  сложных форм и непонятных условий.
                </p>

                <Link
                  href="/animators"
                  className="mt-7 inline-block w-full rounded-2xl bg-white px-6 py-4 text-center text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:mt-8 sm:w-auto sm:px-8 sm:text-lg"
                >
                  Перейти к выбору
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

        {/* ОТЗЫВЫ CTA */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto grid max-w-7xl gap-5 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 sm:rounded-[32px] sm:p-8 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                Отзывы
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Смотрите мнения гостей перед заказом
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
                На странице отзывов можно посмотреть, какие программы уже
                заказывали пользователи, какого артиста выбирали и какие впечатления остались.
              </p>
            </div>

            <Link
              href="/reviews"
              className="group flex min-h-[220px] flex-col justify-between rounded-[28px] bg-white p-6 text-black transition hover:scale-[1.02] hover:bg-gray-200 sm:min-h-[260px] sm:rounded-[32px] sm:p-8"
            >
              <div>
                <p className="text-lg font-bold">Перейти</p>
                <h3 className="mt-2 text-3xl font-black sm:text-4xl">
                  Отзывы →
                </h3>
              </div>

              <p className="text-neutral-600">
                Посмотреть реальные впечатления и оценки.
              </p>
            </Link>
          </div>
        </section>

        {/* ФИНАЛЬНЫЙ CTA */}
        <section className="px-4 py-16 text-center sm:px-6 sm:py-24 md:px-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.04] px-5 py-12 sm:rounded-[44px] sm:px-6 sm:py-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-purple-500/30 blur-[100px] sm:h-[300px] sm:w-[300px] sm:blur-[110px]" />

            <div className="relative">
              <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
                Готовы выбрать артиста?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                Откройте каталог, выберите аниматора, посмотрите программы
                и оформите заявку за пару кликов.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
                <Link
                  href="/animators"
                  className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:px-9 sm:text-lg"
                >
                  Выбрать аниматора
                </Link>

                <Link
                  href="/services"
                  className="rounded-2xl border border-white/20 px-7 py-4 text-base font-bold transition hover:bg-white hover:text-black sm:px-9 sm:text-lg"
                >
                  Посмотреть услуги
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-gray-500 sm:px-6">
          © 2026 Аниматоры Новосибирск. Шоу-программы для ярких мероприятий.
        </footer>
      </main>
    </>
  );
}