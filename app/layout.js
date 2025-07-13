import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "XpensoSync – Smart Expense Tracker App",
  description: "XpensoSync is a modern full stack expense tracker that helps users manage budgets, track spending, and visualize financial data with a clean, responsive, and secure dashboard.",
  keywords: [
    "expense tracker",
    "budget manager",
    "XpensoSync",
    "track expenses",
    "financial management",
    "money tracker app",
    "next.js expense app",
    "secure budgeting tool",
    "personal finance",
    "React financial app"
  ],
  authors: [{ name: "Aman Mittal", url: "https://www.alphacoderaman.netlify.app" }],
  creator: "Aman Mittal",
  openGraph: {
    title: "XpensoSync – Modern Expense Management",
    description:
      "XpensoSync empowers users to take control of their finances with smart tracking, beautiful UI, and cloud-based access.",
    url: "https://www.xpensosync.vercel.app",
    siteName: "XpensoSync",
    images: [
      {
        url: "https://www.xpensosync.vercel.app",
        width: 1200,
        height: 630,
        alt: "XpensoSync – Expense Tracker Dashboard"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "XpensoSync – Smart Expense Tracker App",
    description:
      "Track expenses, manage budgets, and visualize financial trends securely with XpensoSync.",
    creator: "@xpensosync",
    images: ["https://www.xpensosync.com/twitter-card.png"]
  },
  themeColor: "#4338ca",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
