"use client";

import { useEffect, useState } from "react";

type Step =
  | "choose"
  | "login"
  | "register"
  | "code"
  | "resetPhone"
  | "resetPassword";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthModal({ onAuth, onClose }: any) {
  const [step, setStep] = useState<Step>("choose");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [acceptedPersonalData, setAcceptedPersonalData] = useState(false);

  // ================= CLOSE BY ESC =================

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // ================= VALIDATE PHONE =================

  const validatePhone = (phoneValue: string): string | null => {
    const cleaned = phoneValue.replace(/\D/g, "");

    if (cleaned.length !== 11) return null;
    if (!cleaned.startsWith("7")) return null;

    return cleaned;
  };

  // ================= TIMER =================

  const startTimer = () => {
    setTimer(60);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  // ================= HELPERS =================

  const resetRegisterForm = () => {
    setPhone("");
    setPassword("");
    setCode("");
    setConfirmPassword("");
    setName("");
    setSurname("");
    setAcceptedPersonalData(false);
  };

  const resetLoginForm = () => {
    setPhone("");
    setPassword("");
    setCode("");
    setConfirmPassword("");
  };

  const saveUserToLocalStorage = (data: any, validPhone: string) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("phone", data.phone || validPhone);
    localStorage.setItem("name", data.name || "");
    localStorage.setItem("surname", data.surname || "");
    localStorage.setItem("role", data.role || "USER");
  };

  // ================= SEND REGISTER CODE =================

  const handleSendCode = async () => {
    if (!name.trim()) return alert("Введите имя");
    if (!surname.trim()) return alert("Введите фамилию");

    if (!acceptedPersonalData) {
      return alert(
        "Необходимо согласиться с политикой конфиденциальности и обработкой персональных данных"
      );
    }

    const validPhone = validatePhone(phone);

    if (!validPhone) {
      return alert("Телефон должен быть в формате 7XXXXXXXXXX");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: validPhone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return alert(data.error || "Ошибка отправки кода");
      }

      setPhone(validPhone);
      setCode("");
      setPassword("");
      setStep("code");
      startTimer();
    } catch (err) {
      console.log("SEND CODE ERROR:", err);
      alert("Ошибка отправки кода");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================

  const handleRegister = async () => {
    const validPhone = validatePhone(phone);

    if (!validPhone) {
      return alert("Телефон должен быть в формате 7XXXXXXXXXX");
    }

    if (!code.trim()) return alert("Введите код");
    if (!password.trim()) return alert("Введите пароль");

    if (password.length < 6) {
      return alert("Пароль должен быть минимум 6 символов");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: validPhone,
          code: code.trim(),
          password,
          name: name.trim(),
          surname: surname.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return alert(data.error || "Ошибка регистрации");
      }

      if (!data.token) {
        console.log("REGISTER RESPONSE WITHOUT TOKEN:", data);
        return alert("Сервер не вернул токен");
      }

      saveUserToLocalStorage(
        {
          ...data,
          name: data.name || name,
          surname: data.surname || surname,
        },
        validPhone
      );

      onAuth?.();
      window.location.reload();
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================

  const login = async () => {
    const validPhone = validatePhone(phone);

    if (!validPhone) {
      return alert("Телефон должен быть в формате 7XXXXXXXXXX");
    }

    if (!password.trim()) {
      return alert("Введите пароль");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: validPhone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return alert(data.error || "Ошибка входа");
      }

      if (!data.token) {
        console.log("LOGIN RESPONSE WITHOUT TOKEN:", data);
        return alert("Сервер не вернул токен");
      }

      saveUserToLocalStorage(data, validPhone);

      onAuth?.();
      window.location.reload();
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND RESET CODE =================

  const sendResetCode = async () => {
    const validPhone = validatePhone(phone);

    if (!validPhone) {
      return alert("Телефон должен быть в формате 7XXXXXXXXXX");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/send-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: validPhone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return alert(data.error || "Ошибка отправки кода");
      }

      setPhone(validPhone);
      setCode("");
      setPassword("");
      setConfirmPassword("");
      setStep("resetPassword");
      startTimer();
    } catch (err) {
      console.log("SEND RESET CODE ERROR:", err);
      alert("Ошибка отправки кода");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================

  const resetPassword = async () => {
    const validPhone = validatePhone(phone);

    if (!validPhone) {
      return alert("Телефон должен быть в формате 7XXXXXXXXXX");
    }

    if (!code.trim()) {
      return alert("Введите код");
    }

    if (!password.trim()) {
      return alert("Введите новый пароль");
    }

    if (!confirmPassword.trim()) {
      return alert("Повторите новый пароль");
    }

    if (password.length < 6) {
      return alert("Пароль должен быть минимум 6 символов");
    }

    if (password !== confirmPassword) {
      return alert("Пароли не совпадают");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: validPhone,
          code: code.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return alert(data.error || "Ошибка восстановления пароля");
      }

      if (!data.token) {
        console.log("RESET PASSWORD RESPONSE WITHOUT TOKEN:", data);
        return alert("Сервер не вернул токен");
      }

      saveUserToLocalStorage(data, validPhone);

      alert("Пароль успешно изменён");

      onAuth?.();
      window.location.reload();
    } catch (err) {
      console.log("RESET PASSWORD ERROR:", err);
      alert("Ошибка восстановления пароля");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-8"
      onClick={() => onClose?.()}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-6 text-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={() => onClose?.()}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl leading-none text-white transition hover:bg-neutral-800"
        >
          ×
        </button>

        {/* ВЫБОР */}
        {step === "choose" && (
          <>
            <h2 className="pr-12 text-2xl font-black">Вход в аккаунт</h2>

            <p className="mt-2 text-sm text-gray-500">
              Войдите или зарегистрируйтесь, чтобы оставлять отзывы и оформлять заявки.
            </p>

            <button
              type="button"
              onClick={() => {
                resetLoginForm();
                setStep("login");
              }}
              className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800"
            >
              Войти
            </button>

            <button
              type="button"
              onClick={() => {
                resetRegisterForm();
                setStep("register");
              }}
              className="mt-3 w-full rounded-xl border border-neutral-300 py-3 font-semibold transition hover:bg-neutral-100"
            >
              Зарегистрироваться
            </button>
          </>
        )}

        {/* ВХОД */}
        {step === "login" && (
          <>
            <h2 className="pr-12 text-2xl font-black">Вход</h2>

            <p className="mt-2 text-sm text-gray-500">
              Введите номер телефона и пароль.
            </p>

            <input
              placeholder="Телефон (7XXXXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-5 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <input
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-3 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <button
              type="button"
              onClick={login}
              disabled={loading}
              className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:bg-neutral-800"
              }`}
            >
              {loading ? "Вход..." : "Войти"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCode("");
                setPassword("");
                setConfirmPassword("");
                setStep("resetPhone");
              }}
              className="mt-4 w-full text-sm font-medium text-gray-500 transition hover:text-black"
            >
              Забыли пароль?
            </button>

            <button
              type="button"
              onClick={() => setStep("choose")}
              className="mt-2 w-full text-sm font-medium text-gray-500 transition hover:text-black"
            >
              Назад
            </button>
          </>
        )}

        {/* РЕГИСТРАЦИЯ */}
        {step === "register" && (
          <>
            <h2 className="pr-12 text-2xl font-black">Регистрация</h2>

            <p className="mt-2 text-sm text-gray-500">
              Заполните данные, согласитесь с документами и получите SMS-код.
            </p>

            <input
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-5 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <input
              placeholder="Фамилия"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="mt-3 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <input
              placeholder="Телефон (7XXXXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-3 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <label className="mt-4 flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs leading-relaxed text-gray-600">
              <input
                type="checkbox"
                checked={acceptedPersonalData}
                onChange={(e) => setAcceptedPersonalData(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
              />

              <span>
                Я соглашаюсь с{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-black underline"
                >
                  Политикой конфиденциальности
                </a>{" "}
                и даю{" "}
                <a
                  href="/personal-data-consent"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-black underline"
                >
                  согласие на обработку персональных данных
                </a>
                .
              </span>
            </label>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || timer > 0 || !acceptedPersonalData}
              className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
                loading || timer > 0 || !acceptedPersonalData
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:bg-neutral-800"
              }`}
            >
              {loading
                ? "Отправка..."
                : timer > 0
                ? `Повтор через ${timer}s`
                : "Получить код"}
            </button>

            <button
              type="button"
              onClick={() => setStep("choose")}
              className="mt-4 w-full text-sm font-medium text-gray-500 transition hover:text-black"
            >
              Назад
            </button>
          </>
        )}

        {/* КОД + ПАРОЛЬ ДЛЯ РЕГИСТРАЦИИ */}
        {step === "code" && (
          <>
            <h2 className="pr-12 text-2xl font-black">Подтверждение</h2>

            <p className="mt-2 text-sm text-gray-500">
              Введите код из SMS и придумайте пароль.
            </p>

            <p className="mt-4 rounded-xl bg-neutral-100 p-3 text-sm text-gray-600">
              {timer > 0
                ? `Повторная отправка будет доступна через ${timer}s`
                : "Можно запросить новый код"}
            </p>

            <input
              placeholder="Код из SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-4 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <input
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-3 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:bg-neutral-800"
              }`}
            >
              {loading ? "Создание..." : "Зарегистрироваться"}
            </button>

            {timer === 0 && (
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-neutral-300 py-3 font-semibold transition hover:bg-neutral-100"
              >
                Отправить код ещё раз
              </button>
            )}

            <button
              type="button"
              onClick={() => setStep("register")}
              className="mt-4 w-full text-sm font-medium text-gray-500 transition hover:text-black"
            >
              Назад
            </button>
          </>
        )}

        {/* ВОССТАНОВЛЕНИЕ: ТЕЛЕФОН */}
        {step === "resetPhone" && (
          <>
            <h2 className="pr-12 text-2xl font-black">Восстановление пароля</h2>

            <p className="mt-2 text-sm text-gray-500">
              Введите номер телефона, чтобы получить код восстановления.
            </p>

            <input
              placeholder="Телефон (7XXXXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-5 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <button
              type="button"
              onClick={sendResetCode}
              disabled={loading || timer > 0}
              className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
                loading || timer > 0
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:bg-neutral-800"
              }`}
            >
              {loading
                ? "Отправка..."
                : timer > 0
                ? `Повтор через ${timer}s`
                : "Получить код"}
            </button>

            <button
              type="button"
              onClick={() => setStep("login")}
              className="mt-4 w-full text-sm font-medium text-gray-500 transition hover:text-black"
            >
              Назад
            </button>
          </>
        )}

        {/* ВОССТАНОВЛЕНИЕ: КОД + НОВЫЙ ПАРОЛЬ */}
        {step === "resetPassword" && (
          <>
            <h2 className="pr-12 text-2xl font-black">Новый пароль</h2>

            <p className="mt-2 text-sm text-gray-500">
              Введите код из SMS и новый пароль.
            </p>

            <p className="mt-4 rounded-xl bg-neutral-100 p-3 text-sm text-gray-600">
              {timer > 0
                ? `Повторная отправка будет доступна через ${timer}s`
                : "Можно запросить новый код"}
            </p>

            <input
              placeholder="Код из SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-4 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <input
              placeholder="Новый пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-3 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <input
              placeholder="Повторите новый пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-3 w-full rounded-xl border border-neutral-300 p-3 outline-none transition focus:border-black"
            />

            <button
              type="button"
              onClick={resetPassword}
              disabled={loading}
              className={`mt-5 w-full rounded-xl py-3 font-semibold text-white transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:bg-neutral-800"
              }`}
            >
              {loading ? "Сохранение..." : "Сменить пароль"}
            </button>

            {timer === 0 && (
              <button
                type="button"
                onClick={sendResetCode}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-neutral-300 py-3 font-semibold transition hover:bg-neutral-100"
              >
                Отправить код ещё раз
              </button>
            )}

            <button
              type="button"
              onClick={() => setStep("resetPhone")}
              className="mt-4 w-full text-sm font-medium text-gray-500 transition hover:text-black"
            >
              Назад
            </button>
          </>
        )}
      </div>
    </div>
  );
}