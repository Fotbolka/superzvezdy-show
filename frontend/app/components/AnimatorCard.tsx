type AnimatorCardProps = {
  animator: any;
  onOpen: () => void;
};

export default function AnimatorCard({ animator, onOpen }: AnimatorCardProps) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white text-black shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* IMAGE */}
      <div className="relative h-[340px] w-full overflow-hidden rounded-t-[24px] bg-neutral-950 sm:h-[380px] md:h-[420px]">
        {/* Размытый фон из этой же картинки */}
        <img
          src={animator.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
        />

        {/* Основная картинка целиком */}
        <img
          src={animator.image}
          alt={animator.name}
          className="relative z-10 h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="cursor-pointer rounded-xl bg-white px-6 py-3 text-base font-bold text-black transition hover:scale-105 hover:bg-neutral-100 sm:text-lg"
          >
            Подробнее
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 sm:p-6">
        <h2 className="text-2xl font-bold">
          {animator.name}
        </h2>

        <div className="mt-3 inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
          Ростовая кукла / шоу-образ
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          Нажмите «Подробнее», чтобы посмотреть форматы поздравления, стоимость и оформить заявку.
        </p>
      </div>
    </div>
  );
}