"use client";

import { useEffect, useState } from "react";

type Props = {
  onClose: () => void;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePasswordModal({ onClose }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const changePassword = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Вы не авторизованы");
      return;
    }

    if (!oldPassword.trim()) {
      alert("Введите старый пароль");
      return;
    }

    if (!newPassword.trim()) {
      alert("Введите новый пароль");
      return;
    }

    if (!confirmPassword.trim()) {
      alert("Повторите новый пароль");
      return;
    }

    if (newPassword.length < 6) {
      alert("Новый пароль должен быть минимум 6 символов");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Новые пароли не совпадают");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Ошибка изменения пароля");
        return;
      }

      alert("Пароль успешно изменён");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onClose();
    } catch (error) {
      console.log("CHANGE PASSWORD ERROR:", error);
      alert("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-8"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-[28px] bg-white p-6 text-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl leading-none text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ×
        </button>

        <p className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
          Профиль
        </p>

        <h2 className="mt-2 pr-12 text-2xl font-black">
          Изменить пароль
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Введите старый пароль, затем новый пароль и его подтверждение.
        </p>

        <div className="mt-6 space-y-3">
          <input
            type="password"
            placeholder="Старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
          />

          <input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
          />

          <input
            type="password"
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
          />
        </div>

        <button
          type="button"
          onClick={changePassword}
          disabled={loading}
          className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-black hover:scale-[1.02] hover:bg-neutral-800"
          }`}
        >
          {loading ? "Сохранение..." : "Сохранить пароль"}
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