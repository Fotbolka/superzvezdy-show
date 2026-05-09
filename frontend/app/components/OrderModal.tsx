"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const selectableAnimators = [
  "Григорий Лепс",
  "Галустян, Супер-Жорик",
  "Стас Михайлов",
  "Артур Пирожков",
  "Аллегрова",
  "Влад А4",
  "Сергей Жуков",
  "Сюрприз из Африки",
  "Праздничное задержание",
];

export default function OrderModal({ show, onClose }: any) {
  const isAnimatorChoiceNeeded =
    !show.animator ||
    show.animator === "Артист на выбор" ||
    show.animator === "Пакет услуг" ||
    show.animator === "Услуга сайта";

  const [selectedAnimator, setSelectedAnimator] = useState(
    isAnimatorChoiceNeeded ? "" : show.animator || ""
  );

  const [form, setForm] = useState({
    date: "",
    address: "",
    comment: "",
  });

  const [acceptedShowFormat, setAcceptedShowFormat] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, loading]);

  const submit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return alert("Сначала войдите в аккаунт");
    }

    if (!selectedAnimator.trim()) {
      return alert("Выберите аниматора");
    }

    if (!show.name) {
      return alert("Не выбран формат поздравления");
    }

    if (!show.duration) {
      return alert("Не указана длительность программы");
    }

    if (!show.price) {
      return alert("Не указана стоимость программы");
    }

    if (!form.date) {
      return alert("Выберите дату мероприятия");
    }

    if (!form.address.trim()) {
      return alert("Введите адрес мероприятия");
    }

    if (!acceptedShowFormat) {
      return alert(
        "Необходимо подтвердить, что вы понимаете формат услуги: ростовая кукла / пародийный шоу-образ, а не настоящий артист"
      );
    }

    if (!acceptedTerms) {
      return alert("Необходимо согласиться с условиями оказания услуг");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          animator: selectedAnimator,
          service: show.name,
          duration: show.duration,
          price: Number(show.price),
          date: form.date,
          address: form.address.trim(),
          comment: form.comment.trim(),
          acceptedShowFormat: true,
          acceptedTerms: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return alert(data.error || "Ошибка оформления заявки");
      }

      alert("Заявка отправлена 🚀");
      onClose();
    } catch (err) {
      console.log("ORDER ERROR:", err);
      alert("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-3 py-5 sm:px-4 sm:py-8"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-4 text-black shadow-2xl sm:rounded-[32px] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 sm:text-sm">
              Оформление заявки
            </p>

            <h2 className="mt-2 pr-2 text-2xl font-black sm:text-3xl">
              Заказать поздравление
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-2xl leading-none text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* SELECTED SHOW */}
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
          <p className="text-sm font-semibold text-neutral-500">
            Вы выбрали
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {show.name}
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-neutral-500">Длительность</p>
              <p className="mt-1 font-bold">
                {show.duration || "Не указана"}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-neutral-500">Стоимость</p>
              <p className="mt-1 font-bold">
                {Number(show.price || 0).toLocaleString("ru-RU")} ₽
              </p>
            </div>
          </div>

          {/* ВЫБОР АНИМАТОРА */}
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Аниматор / персонаж
            </label>

            {isAnimatorChoiceNeeded ? (
              <select
                value={selectedAnimator}
                onChange={(e) => setSelectedAnimator(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white p-3 outline-none transition focus:border-black"
              >
                <option value="">Выберите аниматора</option>

                {selectableAnimators.map((animator) => (
                  <option key={animator} value={animator}>
                    {animator}
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-neutral-300 bg-white p-3 font-bold">
                {selectedAnimator || "Не указан"}
              </div>
            )}
          </div>
        </div>

        {/* LEGAL NOTICE */}
        <div className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-50 p-4 text-sm leading-relaxed text-yellow-900 sm:p-5">
          <p className="font-bold">
            Важно: это ростовая кукла / пародийный шоу-образ.
          </p>

          <p className="mt-2">
            Услуга не является официальным выступлением настоящего артиста и не
            связана с его представителями, лейблом или правообладателями.
          </p>
        </div>

        {/* INPUTS */}
        <div className="mt-5 space-y-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Дата мероприятия
            </label>

            <input
              type="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={form.date}
              className="w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Адрес
            </label>

            <input
              placeholder="Например: Новосибирск, ул. Ленина, 10"
              value={form.address}
              className="w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Комментарий
            </label>

            <textarea
              placeholder="Укажите время, формат праздника, количество гостей или другие пожелания"
              value={form.comment}
              className="min-h-[110px] w-full resize-none rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
            />
          </div>
        </div>

        {/* CONFIRMATION */}
        <div className="mt-5 space-y-3">
          <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-700">
            <input
              type="checkbox"
              checked={acceptedShowFormat}
              onChange={(e) => setAcceptedShowFormat(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
            />

            <span>
              Я понимаю, что оформляю заявку на выступление ростовой куклы /
              пародийного шоу-образа, а не на выступление настоящего артиста.
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
            />

            <span>
              Я соглашаюсь с{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-black underline"
                onClick={(e) => e.stopPropagation()}
              >
                условиями оказания услуг
              </a>
              .
            </span>
          </label>
        </div>

        {/* BUTTONS */}
        <button
          type="button"
          onClick={submit}
          disabled={loading || !acceptedShowFormat || !acceptedTerms}
          className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
            loading || !acceptedShowFormat || !acceptedTerms
              ? "cursor-not-allowed bg-gray-400"
              : "bg-black hover:scale-[1.02] hover:bg-neutral-800"
          }`}
        >
          {loading ? "Отправка..." : "Отправить заявку"}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="mt-3 w-full rounded-xl border border-neutral-300 py-3 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}