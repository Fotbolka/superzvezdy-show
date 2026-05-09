"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

type OrderStatus = "new" | "done";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<OrderStatus>("new");

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);

      const data = await res.json();

      if (!res.ok) {
        console.log("LOAD ORDERS BACKEND ERROR:", data);
        alert(data.error || "Ошибка загрузки заказов");
        setOrders([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.log("ORDERS IS NOT ARRAY:", data);
        setOrders([]);
        return;
      }

      setOrders(data);
    } catch (err) {
      console.log("LOAD ORDERS ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("Удалить заказ?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Ошибка удаления заказа");
        return;
      }

      loadOrders();
    } catch (err) {
      console.log("DELETE ORDER ERROR:", err);
      alert("Ошибка удаления заказа");
    }
  };

  const markDone = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Ошибка");
        return;
      }

      loadOrders();
    } catch (err) {
      console.log("MARK DONE ERROR:", err);
      alert("Ошибка обновления заказа");
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
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
          window.location.href = "/";
          return;
        }

        const data = await res.json();

        console.log("ADMIN CHECK:", data);

        const adminPhone = "79137778829";
        const currentPhone = String(data.phone || "").replace(/\D/g, "");
        const isAdmin = data.role === "ADMIN" || currentPhone === adminPhone;

        if (!isAdmin) {
          window.location.href = "/";
          return;
        }

        localStorage.setItem("role", data.role || "USER");
        localStorage.setItem("phone", data.phone || "");
        localStorage.setItem("name", data.name || "");
        localStorage.setItem("surname", data.surname || "");

        loadOrders();
      } catch (err) {
        console.log("ADMIN CHECK ERROR:", err);
        window.location.href = "/";
      }
    };

    checkAdmin();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders
    .filter((o) => (o.status || "new") === tab)
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.id).getTime() -
        new Date(a.createdAt || a.id).getTime()
    );

  const newOrdersCount = useMemo(
    () => safeOrders.filter((o) => (o.status || "new") === "new").length,
    [safeOrders]
  );

  const doneOrdersCount = useMemo(
    () => safeOrders.filter((o) => (o.status || "new") === "done").length,
    [safeOrders]
  );

  const totalRevenue = useMemo(
    () =>
      safeOrders
        .filter((o) => (o.status || "new") === "done")
        .reduce((sum, order) => sum + Number(order.price || 0), 0),
    [safeOrders]
  );

  const formatPrice = (price: number | string | undefined) => {
    if (!price) return "Не указана";
    return `${Number(price).toLocaleString("ru-RU")} ₽`;
  };

  const formatDateTime = (value: string | number | undefined) => {
    if (!value) return "Не указано";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("ru-RU");
  };

  const statusLabel = (status: string | undefined) => {
    return (status || "new") === "done" ? "Обработан" : "Новый";
  };

  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-black pt-24 text-white">
        {/* HERO */}
        <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-20">
          <div className="pointer-events-none absolute left-[-160px] top-10 h-[280px] w-[280px] rounded-full bg-purple-600/25 blur-[110px] sm:h-[360px] sm:w-[360px]" />
          <div className="pointer-events-none absolute right-[-180px] top-40 h-[320px] w-[320px] rounded-full bg-pink-500/20 blur-[120px] sm:h-[420px] sm:w-[420px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-[240px] w-[240px] rounded-full bg-blue-500/20 blur-[110px] sm:h-[300px] sm:w-[300px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 backdrop-blur sm:mb-8 sm:px-4 sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
              <span className="truncate">Панель администратора</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                  Админка заказов
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:mt-6 sm:text-lg">
                  Управляйте заявками, отмечайте обработанные заказы и удаляйте
                  ненужные обращения из панели администратора.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur sm:rounded-[32px] sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm">
                  Быстрый обзор
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-2xl font-black">{safeOrders.length}</p>
                    <p className="mt-1 text-xs text-gray-400">всего</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-2xl font-black">{newOrdersCount}</p>
                    <p className="mt-1 text-xs text-gray-400">новых</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-2xl font-black">{doneOrdersCount}</p>
                    <p className="mt-1 text-xs text-gray-400">готово</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="px-4 pb-20 sm:px-6 md:px-20">
          <div className="mx-auto max-w-7xl">
            {/* STATS */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm">
                  Новые заявки
                </p>

                <p className="mt-4 text-4xl font-black sm:text-5xl">
                  {newOrdersCount}
                </p>

                <p className="mt-2 text-sm text-gray-400 sm:text-base">
                  Ожидают обработки администратором.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm">
                  Обработанные
                </p>

                <p className="mt-4 text-4xl font-black sm:text-5xl">
                  {doneOrdersCount}
                </p>

                <p className="mt-2 text-sm text-gray-400 sm:text-base">
                  Уже отмечены как выполненные.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 sm:text-sm">
                  Сумма обработанных
                </p>

                <p className="mt-4 text-4xl font-black sm:text-5xl">
                  {totalRevenue.toLocaleString("ru-RU")} ₽
                </p>

                <p className="mt-2 text-sm text-gray-400 sm:text-base">
                  Сумма заявок со статусом «Обработан».
                </p>
              </div>
            </div>

            {/* TABS */}
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Список заказов</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Переключайтесь между новыми и обработанными заявками.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 rounded-3xl border border-white/10 bg-black/40 p-1 sm:grid-cols-2 sm:rounded-full">
                <button
                  type="button"
                  onClick={() => setTab("new")}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    tab === "new"
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Новые · {newOrdersCount}
                </button>

                <button
                  type="button"
                  onClick={() => setTab("done")}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    tab === "done"
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Обработанные · {doneOrdersCount}
                </button>
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />

                <p className="mt-5 text-gray-400">Загрузка заказов...</p>
              </div>
            )}

            {/* EMPTY */}
            {!loading && filteredOrders.length === 0 && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center sm:rounded-[36px] sm:p-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl">
                  📭
                </div>

                <h3 className="mt-6 text-3xl font-black">
                  Заказов в этой вкладке нет
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-gray-400">
                  Когда появятся заявки, они будут отображаться здесь.
                </p>
              </div>
            )}

            {/* ORDERS */}
            {!loading && filteredOrders.length > 0 && (
              <div className="space-y-5">
                {filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] transition hover:border-white/30 sm:rounded-[32px]"
                  >
                    <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
                      {/* LEFT */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-2xl font-black">
                                {o.name || "Не указано"} {o.surname || ""}
                              </h3>

                              <span
                                className={`rounded-full px-4 py-2 text-xs font-bold ${
                                  (o.status || "new") === "done"
                                    ? "bg-green-500/15 text-green-300"
                                    : "bg-yellow-500/15 text-yellow-300"
                                }`}
                              >
                                {statusLabel(o.status)}
                              </span>
                            </div>

                            <p className="mt-2 text-gray-400">
                              Заявка на поздравление от клиента
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3">
                            <p className="text-sm text-gray-500">Цена</p>
                            <p className="text-2xl font-black">
                              {formatPrice(o.price)}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <InfoCard label="Телефон" value={o.phone || "Не указан"} icon="📞" />
                          <InfoCard label="Аниматор" value={o.animator || "Не указан"} icon="🎭" />
                          <InfoCard label="Формат" value={o.service || "Не указан"} icon="🎬" />
                          <InfoCard label="Длительность" value={o.duration || "Не указана"} icon="⏱" />
                          <InfoCard label="Дата мероприятия" value={o.date || "Не указана"} icon="📅" />
                          <InfoCard label="Адрес" value={o.address || "Не указан"} icon="📍" />
                          <InfoCard label="ID заказа" value={String(o.id)} icon="🆔" />
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                          <p className="text-sm font-semibold text-gray-500">
                            Комментарий клиента
                          </p>

                          <p className="mt-2 break-words leading-relaxed text-gray-300">
                            {o.comment || "Нет комментария"}
                          </p>
                        </div>

                        <p className="mt-4 text-xs text-gray-600">
                          Создано: {formatDateTime(o.createdAt || o.id)}
                        </p>
                      </div>

                      {/* RIGHT BUTTONS */}
                      <div className="flex w-full flex-col gap-3 lg:w-[180px]">
                        {(o.status || "new") !== "done" && (
                          <button
                            type="button"
                            onClick={() => markDone(o.id)}
                            className="rounded-2xl bg-green-500 px-5 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-green-600"
                          >
                            Выполнено
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteOrder(o.id)}
                          className="rounded-2xl bg-red-500 px-5 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-red-600"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
        <span>{icon}</span>
        <span>{label}</span>
      </div>

      <p className="break-words font-bold text-white">{value}</p>
    </div>
  );
}