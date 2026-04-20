import "./globals.css";

export const metadata = {
  title: "CopyTrader.dk — Find de bedste traders at kopiere",
  description: "Vi scorer og rangerer copy traders på tværs af alle platforme. Find de bedste krypto og forex traders at kopiere i Danmark. Gratis quiz og personlige anbefalinger.",
  keywords: "copy trading, copytrader, copy trading danmark, bedste traders, krypto copy trading, forex copy trading, etoro, bitget, bingx, bybit",
  openGraph: {
    title: "CopyTrader.dk — Find de bedste traders at kopiere",
    description: "Vi scorer og rangerer copy traders på tværs af alle platforme — så du kan vælge dem der passer til dig.",
    url: "https://copytrader.dk",
    siteName: "CopyTrader.dk",
    locale: "da_DK",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://copytrader.dk" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
