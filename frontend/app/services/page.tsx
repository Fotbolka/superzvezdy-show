"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Header from "../components/Header";
import OrderModal from "../components/OrderModal";

type Package = {
  name: string;
  description: string;
  price: number;
  duration: string;
  badge: string;
  features: string[];
  popular?: boolean;
};

const packages: Package[] = [
  {
    name: "Экспресс поздравление",
    description:
      "Короткое поздравление от выбранного артиста: быстрый яркий сюрприз, один хит и время на фото.",
    price: 2500,
    duration: "5–7 мин",
    badge: "Быстро",
    features: [
      "Артист на выбор",
      "Один хит артиста",
      "Спецэффект: свеча-фонтан",
      "Время на фото неограниченно",
      "Поздравление голосом артиста",
    ],
  },
  {
    name: "Шоу поздравление",
    description:
      "Оптимальный формат: микс из хитов артиста, спецэффекты, поздравление, конкурс и подарок от звезды.",
    price: 3500,
    duration: "15–20 мин",
    badge: "Популярный",
    popular: true,
    features: [
      "Артист на выбор",
      "Микс из хитов артиста",
      "Спецэффекты: свеча-фонтан, хлопушка, денежный пистолет",
      "Время на фото неограниченно",
      "Поздравление голосом артиста",
      "Игра-конкурс от артиста",
      "Подарок от звезды: диадема или корона",
    ],
  },
  {
    name: "Супер шоу",
    description:
      "Самый насыщенный формат поздравления: хиты артиста, спецэффекты, конкурсы, танцевальный флешмоб и подарки.",
    price: 6000,
    duration: "25–30 мин",
    badge: "Максимум",
    features: [
      "Артист на выбор",
      "Микс из хитов артиста",
      "Спецэффекты: свеча-фонтан, хлопушка, денежный пистолет",
      "Время на фото неограниченно",
      "Поздравление голосом артиста",
      "Игры и конкурсы от артиста",
      "Танцевальный флешмоб",
      "Подарки от звезды: диадема или корона + живая роза",
    ],
  },
];

const eventTypes = [
  "День рождения",
  "Детский праздник",
  "Корпоратив",
  "Свадьба",
  "Выпускной",
  "Частная вечеринка",
];

const steps = [
  {
    number: "01",
    title: "Выберите формат",
    text: "Посмотрите длительность, стоимость и то, что входит в поздравление.",
  },
  {
    number: "02",
    title: "Оставьте заявку",
    text: "Нажмите «Заказать» и заполните форму с датой, адресом и комментарием.",
  },
  {
    number: "03",
    title: "Согласуйте детали",
    text: "После заявки можно уточнить артиста, время, формат праздника и пожелания.",
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any>(null);

  const openOrder = (pack: Package) => {
    setSelectedService({
      name: pack.name,
      price: pack.price,
      duration: pack.duration,
      animator: "Артист на выбор",
    });
  };

  const closeOrder = () => {
    setSelectedService(null);
  };

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
                <span className="truncate">Основные варианты поздравлений</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                Выберите формат поздравления для яркого праздника
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl">
                Доступны три основных варианта: короткое экспресс-поздравление,
                шоу-поздравление и большое супер-шоу с конкурсами, спецэффектами
                и подарками.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <a
                  href="#packages"
                  className="rounded-2xl bg-white px-6 py-4 text-center text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:px-8 sm:text-lg"
                >
                  Смотреть прайс
                </a>

                <Link
                  href="/animators"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center text-base font-bold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white hover:text-black sm:px-8 sm:text-lg"
                >
                  Выбрать аниматора
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                  <p className="text-3xl font-black">3</p>
                  <p className="mt-1 text-sm text-gray-400">формата</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                  <p className="text-3xl font-black">5–30</p>
                  <p className="mt-1 text-sm text-gray-400">минут</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                  <p className="text-3xl font-black">от 2 500 ₽</p>
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
                      <p className="text-sm text-gray-400">Популярный формат</p>
                      <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                        Шоу поздравление
                      </h2>
                    </div>

                    <div className="rounded-full bg-white px-3 py-2 text-xs font-bold text-black sm:px-4 sm:text-sm">
                      TOP
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 p-5 sm:rounded-[28px] sm:p-7">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl sm:h-24 sm:w-24 sm:text-5xl">
                      🎉
                    </div>

                    <h3 className="mt-6 text-3xl font-black sm:mt-8 sm:text-4xl">
                      Микс из хитов артиста
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                      Артист на выбор, спецэффекты, фото, поздравление голосом
                      артиста, игра-конкурс и подарок от звезды.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                        <p className="text-sm text-gray-400">Длительность</p>
                        <p className="mt-1 text-xl font-bold">15–20 мин</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                        <p className="text-sm text-gray-400">Цена</p>
                        <p className="mt-1 text-xl font-bold">3 500 ₽</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openOrder(packages[1])}
                      className="mt-7 w-full rounded-2xl bg-white px-6 py-4 text-base font-bold text-black transition hover:scale-[1.02] hover:bg-gray-200 sm:text-lg"
                    >
                      Заказать
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
                  Для каких мероприятий
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Подходит почти для любого формата
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Можно выбрать короткий сюрприз, полноценное поздравление или
                насыщенную программу с конкурсами, подарками и спецэффектами.
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

        {/* ПАКЕТЫ */}
        <section id="packages" className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Прайс
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Основные варианты поздравлений
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Выберите формат по длительности, наполнению и стоимости.
                Артиста можно выбрать отдельно в каталоге.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              {packages.map((pack) => (
                <div
                  key={pack.name}
                  className={`relative rounded-[28px] border p-5 transition hover:-translate-y-1 sm:rounded-[36px] sm:p-7 ${
                    pack.popular
                      ? "border-white/40 bg-white text-black shadow-2xl"
                      : "border-white/10 bg-white/[0.05] text-white hover:border-white/30"
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-2 text-xs font-bold text-white sm:right-6 sm:top-6 sm:px-4 sm:text-sm">
                      Рекомендуем
                    </div>
                  )}

                  <div
                    className={`mb-6 inline-flex rounded-full px-4 py-2 text-sm font-bold sm:mb-8 ${
                      pack.popular
                        ? "bg-black text-white"
                        : "border border-white/10 bg-black/40 text-gray-300"
                    }`}
                  >
                    {pack.badge}
                  </div>

                  <h3 className="text-3xl font-black sm:text-4xl">
                    {pack.name}
                  </h3>

                  <p
                    className={`mt-4 text-sm leading-relaxed sm:text-base ${
                      pack.popular ? "text-neutral-600" : "text-gray-400"
                    }`}
                  >
                    {pack.description}
                  </p>

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div
                      className={`rounded-2xl p-4 ${
                        pack.popular
                          ? "bg-neutral-100"
                          : "border border-white/10 bg-black/30"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          pack.popular ? "text-neutral-500" : "text-gray-500"
                        }`}
                      >
                        Длительность
                      </p>

                      <p className="mt-1 text-xl font-black">
                        {pack.duration}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl p-4 ${
                        pack.popular
                          ? "bg-neutral-100"
                          : "border border-white/10 bg-black/30"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          pack.popular ? "text-neutral-500" : "text-gray-500"
                        }`}
                      >
                        Цена
                      </p>

                      <p className="mt-1 text-xl font-black">
                        {pack.price.toLocaleString("ru-RU")} ₽
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-3 sm:mt-8 sm:space-y-4">
                    {pack.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                            pack.popular
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          ✓
                        </span>

                        <span className="text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => openOrder(pack)}
                    className={`mt-7 w-full rounded-2xl px-6 py-4 text-base font-bold transition hover:scale-[1.02] sm:mt-8 sm:text-lg ${
                      pack.popular
                        ? "bg-black text-white hover:bg-neutral-800"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    Заказать
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* КАК ЗАКАЗАТЬ */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:rounded-[40px] sm:p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Как заказать
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Всё просто и понятно
                </h2>

                <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
                  Выберите формат, нажмите кнопку заказа и оставьте данные для связи.
                </p>

                <Link
                  href="/reviews"
                  className="mt-7 inline-block w-full rounded-2xl border border-white/20 px-6 py-4 text-center text-base font-bold transition hover:bg-white hover:text-black sm:mt-8 sm:w-auto sm:px-8 sm:text-lg"
                >
                  Посмотреть отзывы
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
                Хотите яркий праздник?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                Выберите подходящий формат или конкретного аниматора —
                и отправьте заявку прямо на сайте.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
                <a
                  href="#packages"
                  className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:px-9 sm:text-lg"
                >
                  Выбрать формат
                </a>

                <Link
                  href="/animators"
                  className="rounded-2xl border border-white/20 px-7 py-4 text-base font-bold transition hover:bg-white hover:text-black sm:px-9 sm:text-lg"
                >
                  Смотреть аниматоров
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-gray-500 sm:px-6">
          © 2026 Аниматоры Новосибирск. Основные варианты поздравлений для праздников.
        </footer>

        {selectedService &&
          typeof document !== "undefined" &&
          createPortal(
            <div className="fixed inset-0 z-[9999]">
              <OrderModal show={selectedService} onClose={closeOrder} />
            </div>,
            document.body
          )}
      </main>
    </>
  );
}