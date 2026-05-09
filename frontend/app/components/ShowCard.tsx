"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import OrderModal from "./OrderModal";

export default function ShowCard({ show, animator }: any) {
  const [open, setOpen] = useState(false);
  const [currentShow, setCurrentShow] = useState<any>(null);

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentShow({
      ...show,
      animator: animator?.name || "Не указан",
      animatorImage: animator?.image || "",
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentShow(null);
  };

  return (
    <>
      <div
        className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:bg-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-black">
              {show.name}
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Длительность: {show.duration}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Формат поздравления с выбранным артистом.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
            <p className="text-2xl font-black text-black">
              {Number(show.price).toLocaleString("ru-RU")} ₽
            </p>

            <button
              type="button"
              onClick={handleOpen}
              className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
            >
              Заказать
            </button>
          </div>
        </div>
      </div>

      {open &&
        currentShow &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999]">
            <OrderModal
              show={currentShow}
              onClose={handleClose}
            />
          </div>,
          document.body
        )}
    </>
  );
}