import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://superzvezdy-show.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Аниматоры Новосибирск — заказать шоу-образы и поздравления | Суперзвезды.Шоу",
    template: "%s | Суперзвезды.Шоу",
  },

  description:
    "Суперзвезды.Шоу — сайт для выбора и заказа аниматоров, ростовых кукол и пародийных шоу-образов в Новосибирске. Поздравления на день рождения, корпоратив, свадьбу, юбилей и детский праздник.",

  keywords: [
    "аниматоры Новосибирск",
    "заказать аниматора Новосибирск",
    "аниматор на праздник Новосибирск",
    "ростовые куклы Новосибирск",
    "шоу-образы Новосибирск",
    "артисты на праздник Новосибирск",
    "поздравление на день рождения Новосибирск",
    "аниматоры на корпоратив Новосибирск",
    "аниматоры на свадьбу Новосибирск",
    "детский праздник Новосибирск",
    "Суперзвезды Шоу",
  ],

  authors: [
    {
      name: "Суперзвезды.Шоу",
    },
  ],

  creator: "Суперзвезды.Шоу",
  publisher: "Суперзвезды.Шоу",

  applicationName: "Суперзвезды.Шоу",

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title:
      "Аниматоры Новосибирск — шоу-образы и поздравления | Суперзвезды.Шоу",
    description:
      "Выберите аниматора, ростовую куклу или пародийный шоу-образ для праздника в Новосибирске. Каталог персонажей, программы, цены, отзывы и онлайн-заявка.",
    url: SITE_URL,
    siteName: "Суперзвезды.Шоу",
    locale: "ru_RU",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Аниматоры Новосибирск — шоу-образы и поздравления | Суперзвезды.Шоу",
    description:
      "Каталог аниматоров и шоу-образов для праздников в Новосибирске. Выбор программы, стоимость и заявка онлайн.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  category: "event services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}