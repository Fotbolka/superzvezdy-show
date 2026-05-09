"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthModal from "./AuthModal";
import ProfilePasswordModal from "./ProfilePasswordModal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Header() {
  const pathname = usePathname();

  const ADMIN_PHONE = "79137778829";

  const [isAuth, setIsAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/animators", label: "Аниматоры" },
    { href: "/services", label: "Услуги" },
    { href: "/reviews", label: "Отзывы" },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        setAuthChecked(true);
        return;
      }

      setName(localStorage.getItem("name") || "");
      setSurname(localStorage.getItem("surname") || "");
      setPhone(localStorage.getItem("phone") || "");
      setIsAuth(true);

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (!res.ok) {
          localStorage.clear();
          setIsAuth(false);
          setName("");
          setSurname("");
          setPhone("");
          setAuthChecked(true);
          return;
        }

        const data = await res.json();

        setIsAuth(true);
        setName(data.name || "");
        setSurname(data.surname || "");
        setPhone(data.phone || "");

        localStorage.setItem("name", data.name || "");
        localStorage.setItem("surname", data.surname || "");
        localStorage.setItem("phone", data.phone || "");
        localStorage.setItem("role", data.role || "USER");
      } catch (err) {
        console.log("FETCH ERROR:", err);

        localStorage.clear();
        setIsAuth(false);
        setName("");
        setSurname("");
        setPhone("");
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfile(false);
  }, [pathname]);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const isActive = (path: string) => pathname === path;

  const initials = `${name?.[0] || ""}${surname?.[0] || ""}`.trim();

  const isAdmin = phone.replace(/\D/g, "") === ADMIN_PHONE;

  const desktopLinkClass = (path: string) =>
    isActive(path)
      ? "rounded-full bg-white px-4 py-2 text-sm font-bold text-black shadow-lg"
      : "rounded-full px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white";

  const mobileLinkClass = (path: string) =>
    isActive(path)
      ? "rounded-2xl bg-white px-4 py-3 font-bold text-black"
      : "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-gray-300 transition hover:bg-white/[0.10] hover:text-white";

  return (
    <>
      <header className="fixed left-0 top-0 z-[100] w-full border-b border-white/10 bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {/* LOGO */}
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-black transition group-hover:scale-105 sm:h-12 sm:w-12 sm:text-xl">
              S
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
                Суперзвезды.Шоу
              </p>

              <p className="truncate text-xs font-medium text-gray-400">
                Ростовые куклы и шоу-образы
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={desktopLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP RIGHT */}
          <div className="hidden items-center justify-end gap-3 md:flex">
            {!authChecked && (
              <div className="h-12 w-[180px] animate-pulse rounded-full border border-white/10 bg-white/[0.06]" />
            )}

            {authChecked && !isAuth && (
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition hover:scale-[1.03] hover:bg-gray-200"
              >
                Войти
              </button>
            )}

            {authChecked && isAuth && isAdmin && (
              <Link
                href="/admin"
                className="rounded-full border border-purple-400/30 bg-purple-500/15 px-5 py-3 text-sm font-bold text-purple-100 transition hover:scale-[1.03] hover:bg-purple-500/25"
              >
                Админка
              </Link>
            )}

            {authChecked && isAuth && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex h-12 min-w-[180px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] py-2 pl-2 pr-4 transition hover:bg-white/[0.12]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black uppercase text-black">
                    {initials || name?.[0] || "👤"}
                  </div>

                  <div className="text-left leading-tight">
                    <p className="max-w-[110px] truncate text-sm font-bold text-white">
                      {name || "Профиль"}
                    </p>

                    <p className="max-w-[110px] truncate text-xs text-gray-400">
                      {phone || "Аккаунт"}
                    </p>
                  </div>
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 p-4 text-white shadow-2xl">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black uppercase text-black">
                          {initials || name?.[0] || "👤"}
                        </div>

                        <div>
                          <p className="font-bold">
                            {name} {surname}
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowProfile(false)}
                        className="mt-3 block w-full rounded-2xl border border-purple-400/30 bg-purple-500/15 py-3 text-center text-sm font-bold text-purple-100 transition hover:bg-purple-500/25"
                      >
                        Перейти в админку
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfile(false);
                        setShowChangePassword(true);
                      }}
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-sm font-bold transition hover:bg-white/[0.12]"
                    >
                      Изменить пароль
                    </button>

                    <button
                      type="button"
                      onClick={logout}
                      className="mt-3 w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl font-bold text-white transition hover:bg-white/[0.12] md:hidden"
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/95 px-4 pb-6 pt-4 shadow-2xl backdrop-blur-2xl md:hidden">
            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={mobileLinkClass(link.href)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
              {!authChecked && (
                <div className="h-12 w-full animate-pulse rounded-2xl bg-white/[0.06]" />
              )}

              {authChecked && !isAuth && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAuth(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200"
                >
                  Войти
                </button>
              )}

              {authChecked && isAuth && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black uppercase text-black">
                      {initials || name?.[0] || "👤"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-white">
                        {name} {surname}
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-400">
                        {phone}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-4 block w-full rounded-2xl border border-purple-400/30 bg-purple-500/15 py-3 text-center text-sm font-bold text-purple-100 transition hover:bg-purple-500/25"
                    >
                      Админка
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowChangePassword(true);
                    }}
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-sm font-bold text-white transition hover:bg-white/[0.12]"
                  >
                    Изменить пароль
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="mt-3 w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={() => {
            setIsAuth(true);
            setAuthChecked(true);
            setShowAuth(false);
            setName(localStorage.getItem("name") || "");
            setSurname(localStorage.getItem("surname") || "");
            setPhone(localStorage.getItem("phone") || "");
          }}
        />
      )}

      {showChangePassword && (
        <ProfilePasswordModal
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
}