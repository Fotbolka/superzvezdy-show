import Link from "next/link";

export default function LegalDisclaimer() {
  return (
    <div className="rounded-[28px] border border-yellow-400/20 bg-yellow-400/10 p-5 text-left text-sm leading-relaxed text-yellow-100">
      <p className="font-bold text-yellow-200">
        Важно: на сайте представлены ростовые куклы и пародийные шоу-образы.
      </p>

      <p className="mt-2 text-yellow-100/90">
        Мы не являемся официальными представителями артистов и не организуем
        выступления настоящих исполнителей. Все персонажи на сайте являются
        развлекательными образами для мероприятий.
      </p>

      <Link
        href="/terms"
        className="mt-3 inline-block font-semibold text-yellow-200 underline underline-offset-4 hover:text-white"
      >
        Подробнее в условиях оказания услуг
      </Link>
    </div>
  );
}