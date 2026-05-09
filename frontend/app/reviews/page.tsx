"use client";

import { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import Header from "../components/Header";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Review = {
  id: number;
  text: string;
  rating: number;
  service: string;
  user: string;
  phone?: string;
  date: string;
};

const commonServices = [
  "Экспресс поздравление — 5–7 мин",
  "Шоу поздравление — 15–20 мин",
  "Супер шоу — 25–30 мин",
];

const servicesMap: Record<string, string[]> = {
  "Григорий Лепс": commonServices,
  "Галустян, Супер-Жорик": commonServices,
  "Стас Михайлов": commonServices,
  "Артур Пирожков": commonServices,
  "Аллегрова": commonServices,
  "Влад А4": commonServices,
  "Сергей Жуков": commonServices,

  "Сюрприз из Африки": ["Сюрприз из Африки — 15–20 мин"],
  "Праздничное задержание": ["Праздничное задержание — 15–20 мин"],
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedAnimator, setSelectedAnimator] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");

  const normalizePhone = (phone: string) => {
    return String(phone || "").replace(/\D/g, "");
  };

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews`);
      const data = await res.json();

      if (!res.ok) {
        console.log("Ошибка backend при загрузке отзывов:", data);
        setReviews([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.log("Отзывы пришли не массивом:", data);
        setReviews([]);
        return;
      }

      setReviews(data);
    } catch (err) {
      console.log("Ошибка загрузки отзывов:", err);
      setReviews([]);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const phone = localStorage.getItem("phone") || "";

    setCurrentPhone(normalizePhone(phone));

    if (!token) {
      setIsAuth(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        localStorage.clear();
        setIsAuth(false);
        setCurrentPhone("");
        return;
      }

      const data = await res.json();

      setIsAuth(true);
      setCurrentPhone(normalizePhone(data.phone || phone));

      localStorage.setItem("phone", data.phone || "");
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("surname", data.surname || "");
      localStorage.setItem("role", data.role || "USER");
    } catch (err) {
      console.log("FETCH ERROR:", err);
      localStorage.clear();
      setIsAuth(false);
      setCurrentPhone("");
    }
  };

  useEffect(() => {
    loadReviews();
    checkAuth();
  }, []);

  const submitReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowAuth(true);
      return;
    }

    if (!selectedAnimator || !selectedService) {
      alert("Выберите аниматора и формат поздравления");
      return;
    }

    if (!rating) {
      alert("Поставьте оценку");
      return;
    }

    if (!text.trim()) {
      alert("Введите текст отзыва");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: text.trim(),
          rating,
          service: `${selectedAnimator} — ${selectedService}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Ошибка добавления отзыва");
        return;
      }

      alert("Отзыв добавлен ✅");

      setText("");
      setSelectedAnimator("");
      setSelectedService("");
      setRating(0);

      loadReviews();
    } catch (err) {
      console.log("Ошибка отправки отзыва:", err);
      alert("Не удалось отправить отзыв");
    }
  };

  const deleteReview = async (id: number) => {
    const confirmDelete = confirm("Удалить отзыв?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Вы не авторизованы");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Не удалось удалить отзыв");
        return;
      }

      loadReviews();
    } catch (err) {
      console.log("Ошибка удаления отзыва:", err);
      alert("Не удалось удалить отзыв");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const getUserInitial = (user: string) => {
    if (!user) return "?";
    return user.trim().charAt(0).toUpperCase();
  };

  const canDeleteReview = (review: Review) => {
    return (
      normalizePhone(review.phone || "") === currentPhone ||
      normalizePhone(review.user || "") === currentPhone
    );
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

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 backdrop-blur sm:mb-6 sm:px-4 sm:text-sm">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
                  <span className="truncate">Реальные отзывы гостей</span>
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                  Отзывы о шоу и аниматорах
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl">
                  Посмотрите, каких артистов выбирали пользователи, какие форматы
                  поздравлений заказывали и какие впечатления остались после мероприятия.
                </p>

                <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                    <p className="text-3xl font-black">{reviews.length}</p>
                    <p className="mt-1 text-sm text-gray-400">отзывов</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                    <p className="text-3xl font-black">{averageRating}</p>
                    <p className="mt-1 text-sm text-gray-400">средняя оценка</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
                    <p className="text-3xl font-black">5★</p>
                    <p className="mt-1 text-sm text-gray-400">рейтинг</p>
                  </div>
                </div>
              </div>

              {/* Правый информационный блок */}
              <div className="relative">
                <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 blur-2xl sm:-inset-4 sm:rounded-[40px]" />

                <div className="relative rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur sm:rounded-[36px] sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 sm:text-sm sm:tracking-[0.3em]">
                    Почему отзывы важны
                  </p>

                  <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                    Помогают выбрать артиста увереннее
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                    В отзывах видно, какого аниматора выбирали, какой формат
                    поздравления был заказан и какую оценку поставил пользователь.
                  </p>

                  <div className="mt-6 space-y-3 sm:mt-7 sm:space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
                      <p className="font-bold">⭐ Оценка по 5-балльной шкале</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Можно быстро понять общее впечатление.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
                      <p className="font-bold">🎤 Конкретный формат</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Видно, какой артист и какое поздравление были выбраны.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
                      <p className="font-bold">💬 Живой текст от пользователя</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Отзыв помогает понять атмосферу мероприятия.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ФОРМА ОТЗЫВА */}
        <section className="px-4 py-12 sm:px-6 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
              {/* Левая карточка */}
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:rounded-[36px] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Оставить отзыв
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  Поделитесь впечатлением
                </h2>

                <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
                  Если вы уже заказывали поздравление, выберите аниматора,
                  формат, поставьте оценку и напишите отзыв. Он появится в общем списке.
                </p>

                {!isAuth && (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5 sm:mt-8 sm:p-6">
                    <h3 className="text-2xl font-bold">
                      Нужно войти в аккаунт
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                      Авторизуйтесь, чтобы оставить отзыв от своего имени.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowAuth(true)}
                      className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:w-auto sm:px-8 sm:text-lg"
                    >
                      Войти и оставить отзыв
                    </button>
                  </div>
                )}
              </div>

              {/* Форма */}
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-5 shadow-2xl backdrop-blur sm:rounded-[36px] sm:p-6 md:p-8">
                {isAuth ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* АНИМАТОР */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-300">
                          Аниматор
                        </label>

                        <select
                          className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 text-white outline-none transition focus:border-white/40"
                          value={selectedAnimator}
                          onChange={(e) => {
                            setSelectedAnimator(e.target.value);
                            setSelectedService("");
                          }}
                        >
                          <option value="">Выберите аниматора</option>
                          {Object.keys(servicesMap).map((animator) => (
                            <option key={animator} value={animator}>
                              {animator}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* ФОРМАТ */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-300">
                          Формат поздравления
                        </label>

                        <select
                          className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 text-white outline-none transition focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedService}
                          disabled={!selectedAnimator}
                          onChange={(e) => setSelectedService(e.target.value)}
                        >
                          <option value="">Выберите формат</option>
                          {selectedAnimator &&
                            servicesMap[selectedAnimator]?.map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* РЕЙТИНГ */}
                    <div className="mt-6">
                      <p className="mb-3 text-sm font-semibold text-gray-300">
                        Ваша оценка
                      </p>

                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-4xl transition hover:scale-110 sm:text-5xl ${
                              star <= rating
                                ? "text-yellow-400"
                                : "text-gray-600 hover:text-yellow-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ТЕКСТ */}
                    <div className="mt-6">
                      <label className="mb-2 block text-sm font-semibold text-gray-300">
                        Текст отзыва
                      </label>

                      <textarea
                        className="min-h-[150px] w-full resize-none rounded-2xl border border-white/10 bg-black/50 p-4 text-white outline-none transition placeholder:text-gray-500 focus:border-white/40 sm:min-h-[160px]"
                        placeholder="Расскажите, как прошло мероприятие..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={submitReview}
                      className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-base font-bold text-black transition hover:scale-[1.01] hover:bg-gray-200 sm:px-8 sm:text-lg"
                    >
                      Отправить отзыв
                    </button>
                  </>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center sm:min-h-[360px]">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl">
                      🔒
                    </div>

                    <h3 className="mt-6 text-3xl font-black">
                      Авторизуйтесь
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">
                      После входа здесь появится форма для добавления отзыва.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowAuth(true)}
                      className="mt-7 w-full rounded-2xl bg-white px-6 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200 sm:w-auto sm:px-8 sm:text-lg"
                    >
                      Войти
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* СПИСОК ОТЗЫВОВ */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm sm:tracking-[0.3em]">
                  Все отзывы
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl md:text-5xl">
                  Что говорят пользователи
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Здесь отображаются отзывы, которые пользователи оставили после выбора
                аниматора и формата поздравления.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-center sm:rounded-[36px] sm:p-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl">
                  💬
                </div>

                <h3 className="mt-6 text-3xl font-black">
                  Пока нет отзывов
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                  Станьте первым, кто оставит отзыв о выбранном артисте и формате.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="group rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-white/30 sm:rounded-[32px] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-black sm:h-14 sm:w-14 sm:text-xl">
                          {getUserInitial(r.user)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-white">
                            {r.user || "Пользователь"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {r.date
                              ? new Date(r.date).toLocaleDateString("ru-RU")
                              : "Дата не указана"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-sm font-bold text-yellow-400">
                        {r.rating}/5
                      </div>
                    </div>

                    <div className="mt-5 text-2xl text-yellow-400">
                      {"★".repeat(Number(r.rating))}
                      <span className="text-gray-600">
                        {"☆".repeat(5 - Number(r.rating))}
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-sm font-semibold text-gray-400">
                        Выбранная программа
                      </p>

                      <p className="mt-1 break-words font-bold text-white">
                        {r.service}
                      </p>
                    </div>

                    <p className="mt-5 break-words text-sm leading-relaxed text-gray-300 sm:text-base">
                      {r.text}
                    </p>

                    {canDeleteReview(r) && (
                      <button
                        type="button"
                        onClick={() => deleteReview(r.id)}
                        className="mt-6 w-full rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto sm:py-2"
                      >
                        Удалить отзыв
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-gray-500 sm:px-6">
          © 2026 Суперзвезды.Шоу. Отзывы пользователей о шоу-программах.
        </footer>

        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onAuth={() => {
              setIsAuth(true);
              setCurrentPhone(normalizePhone(localStorage.getItem("phone") || ""));
              setShowAuth(false);
            }}
          />
        )}
      </main>
    </>
  );
}