"use client";
import { useState, useMemo } from "react";
import {
  Search, TrendingUp, Star, BadgeCheck, Layers3, ExternalLink, Sparkles,
  CalendarRange, Target, Gauge, Activity, ChevronRight, X, ArrowRight,
  ChevronLeft, BookOpen, Shield, AlertTriangle, FileText, Scale,
} from "lucide-react";

// ============================================================
// 🔧 KONFIGURATION — Ændr disse når du har rigtige data
// ============================================================

const AFFILIATE_LINKS = {
  // KRYPTO — Indsæt dine rigtige affiliate-links her
  "Bitget":  "#INDSÆT_BITGET_AFFILIATE_LINK",
  "BingX":   "#INDSÆT_BINGX_AFFILIATE_LINK",
  "Bybit":   "#INDSÆT_BYBIT_AFFILIATE_LINK",
  "OKX":     "#INDSÆT_OKX_AFFILIATE_LINK",
  "Binance": "#INDSÆT_BINANCE_AFFILIATE_LINK",
  // FOREX — Indsæt dine rigtige affiliate-links her
  "eToro":   "#INDSÆT_ETORO_AFFILIATE_LINK",
  "Vantage": "#INDSÆT_VANTAGE_AFFILIATE_LINK",
  "Exness":  "#INDSÆT_EXNESS_AFFILIATE_LINK",
  "XM":      "#INDSÆT_XM_AFFILIATE_LINK",
};

const GHL_WEBHOOK = "#INDSÆT_GHL_WEBHOOK_URL";  // Quiz data sendes hertil
const EMAIL_WEBHOOK = "#INDSÆT_EMAIL_WEBHOOK_URL";  // Email signup sendes hertil

// ============================================================
// 📊 TRADER DATA — Erstat med rigtige traders fra platformene
// ============================================================
// Brug Excel-regnearket eller SKILL_find_traders.md til at finde
// rigtige traders og indsæt dem her i dette format.
// Feltet "monthly" kan være tomt [] hvis du ikke har månedsdata.

const allTraders = [
  // === FOREX / AKTIER ===
  { id: "f1", name: "TRADER_FOREX_1", type: "forex", platform: "eToro", strategy: "Swing Trading", score: 93, ret: 38.2, dd: 7.1, risk: "Lav", followers: 22100, fNew: 156, consistency: 89, asset: "Forex majors", winRate: 61, trades: 1248, months: 36, monthly: [2.8, 3.1, -0.6, 4.2, 1.9, 3.5, -1.1, 2.7, 4.8, 1.4, 3.2, 2.6], bio: "INDSÆT BESKRIVELSE — Tre års track record med stabile resultater." },
  { id: "f2", name: "TRADER_FOREX_2", type: "forex", platform: "eToro", strategy: "Value Investing", score: 90, ret: 29.8, dd: 5.3, risk: "Lav", followers: 31400, fNew: 203, consistency: 94, asset: "US aktier", winRate: 59, trades: 680, months: 42, monthly: [1.9, 2.4, 3.1, -0.8, 2.6, 1.7, 3.4, 2.1, -0.3, 2.8, 3.6, 1.8], bio: "INDSÆT BESKRIVELSE — Value-investor med lav risiko." },
  { id: "f3", name: "TRADER_FOREX_3", type: "forex", platform: "Vantage", strategy: "Trend Following", score: 82, ret: 52.6, dd: 13.7, risk: "Middel", followers: 7800, fNew: 51, consistency: 76, asset: "Guld / Sølv", winRate: 54, trades: 1560, months: 14, monthly: [4.6, -2.3, 7.8, 3.2, 5.1, -1.8, 6.4, 2.9, -0.7, 8.2, 3.4, 5.6], bio: "INDSÆT BESKRIVELSE — Specialist i ædelmetaller." },
  { id: "f4", name: "TRADER_FOREX_4", type: "forex", platform: "Exness", strategy: "Carry Trade", score: 78, ret: 44.1, dd: 10.9, risk: "Middel", followers: 4200, fNew: 34, consistency: 72, asset: "EUR/NOK/SEK", winRate: 55, trades: 890, months: 20, monthly: [3.4, 4.1, -1.9, 5.6, 2.8, -0.4, 4.3, 3.7, 1.2, 5.1, -2.3, 3.8], bio: "INDSÆT BESKRIVELSE — Handler nordiske valutaer." },
  { id: "f5", name: "TRADER_FOREX_5", type: "forex", platform: "eToro", strategy: "Indeks-tracking", score: 86, ret: 25.3, dd: 3.8, risk: "Lav", followers: 15600, fNew: 98, consistency: 96, asset: "S&P 500, DAX", winRate: 62, trades: 420, months: 30, monthly: [1.6, 2.1, 2.4, -0.2, 1.9, 2.8, 1.3, 2.5, -0.5, 2.2, 3.1, 1.7], bio: "INDSÆT BESKRIVELSE — Følger de store indekser." },
  // === KRYPTO ===
  { id: "c1", name: "TRADER_KRYPTO_1", type: "crypto", platform: "Bitget", strategy: "Momentum", score: 91, ret: 72.4, dd: 16.3, risk: "Høj", followers: 14200, fNew: 84, consistency: 78, asset: "Bitcoin", winRate: 63, trades: 1840, months: 12, monthly: [5.2, 8.1, -3.4, 12.6, 4.8, -1.2, 9.3, 6.7, 3.1, 11.2, -2.8, 7.4], bio: "INDSÆT BESKRIVELSE — Bitcoin momentum-trader." },
  { id: "c2", name: "TRADER_KRYPTO_2", type: "crypto", platform: "Bybit", strategy: "Konservativ", score: 88, ret: 31.5, dd: 6.2, risk: "Lav", followers: 19700, fNew: 112, consistency: 92, asset: "BTC/ETH", winRate: 58, trades: 960, months: 24, monthly: [2.1, 3.4, 1.8, -0.9, 2.7, 3.1, 1.5, 2.9, -0.4, 3.8, 2.2, 1.6], bio: "INDSÆT BESKRIVELSE — Konservativ krypto-strategi." },
  { id: "c3", name: "TRADER_KRYPTO_3", type: "crypto", platform: "OKX", strategy: "Trend Following", score: 84, ret: 48.7, dd: 12.1, risk: "Middel", followers: 11500, fNew: 67, consistency: 81, asset: "Ethereum", winRate: 56, trades: 1120, months: 18, monthly: [3.8, 6.2, -2.1, 4.5, 7.8, -1.6, 5.3, 3.9, 2.4, -0.8, 8.1, 4.2], bio: "INDSÆT BESKRIVELSE — Ethereum trend-trader." },
  { id: "c4", name: "TRADER_KRYPTO_4", type: "crypto", platform: "BingX", strategy: "Swing Trading", score: 79, ret: 94.1, dd: 22.8, risk: "Høj", followers: 8100, fNew: 43, consistency: 64, asset: "Altcoins", winRate: 51, trades: 2100, months: 9, monthly: [12.4, -5.8, 18.2, 7.6, -8.1, 22.4, 9.3, -3.2, 15.7, 4.2, -2.1, 8.8], bio: "INDSÆT BESKRIVELSE — Altcoin swing-trader." },
  { id: "c5", name: "TRADER_KRYPTO_5", type: "crypto", platform: "Bitget", strategy: "Aggressiv", score: 74, ret: 108.3, dd: 31.4, risk: "Meget høj", followers: 6300, fNew: 28, consistency: 56, asset: "DeFi tokens", winRate: 48, trades: 3200, months: 7, monthly: [18.6, -12.4, 28.3, 14.2, -9.8, 32.1, 11.4, -4.2, 16.8, 8.4, -6.2, 19.1], bio: "INDSÆT BESKRIVELSE — DeFi-specialist." },
];

// ============================================================
// 📝 GUIDE-INDHOLD
// ============================================================

const guides = [
  {
    id: "hvad-er-copy-trading",
    title: "Hvad er copy trading?",
    category: "Begynder",
    content: `Copy trading betyder at du automatisk kopierer en anden traders handler. Når de køber, køber du. Når de sælger, sælger du. Du vælger en trader, sætter et beløb, og platformen klarer resten.

Det startede med eToro i 2010 og er siden eksploderet. I dag kan du kopiere traders på over 20 platforme — fra krypto til forex til aktier.

Sådan fungerer det i praksis: Du opretter en konto på en platform som eToro eller Bitget. Du browser deres leaderboard og finder en trader der passer til din risikoprofil. Du vælger hvor meget du vil investere. Fra det øjeblik kopierer din konto automatisk alle traderens handler — proportionelt til dit beløb.

Eksempel: Hvis traderen har 100.000 kr. og du investerer 10.000 kr., åbner din konto 10% af hver handel. Hvis traderen køber Bitcoin for 5.000 kr., køber din konto for 500 kr.

Du kan stoppe med at kopiere når som helst. Alle åbne positioner lukkes, og du beholder hvad der er tilbage.

Fordele: Du behøver ikke vide noget om trading. Du kan se præcis hvad traderen gør i realtid. Du kan sprede risiko over flere traders.

Ulemper: Du kan stadig tabe penge. Du har ingen kontrol over de enkelte handler. Og du betaler typisk en del af profitten til traderen (5-20%).`
  },
  {
    id: "vaelg-trader",
    title: "Sådan vælger du den rigtige trader",
    category: "Begynder",
    content: `De fleste kigger kun på afkast. Det er den største fejl du kan lave. En trader med +200% og 60% drawdown er langt værre end en med +30% og 5% drawdown.

Her er de 6 ting du skal kigge på, i prioriteret rækkefølge:

1. Max Drawdown — det vigtigste tal. Det viser det største fald fra top til bund. Under 10% er fremragende, 10-20% er okay, over 20% er risikabelt.

2. Konsistens — leverer de profit måned efter måned? Kig på antallet af profitable måneder. Over 70% er godt.

3. Track record — hvor længe har de handlet? Minimum 6 måneder, helst 12+. Enhver kan have en god uge.

4. Risikojusteret afkast — divider afkastet med drawdown. Over 4.0 er fremragende, under 1.0 er dårligt.

5. Antal følgere — social proof. Mange følgere betyder at andre har gjort deres research.

6. Gennemsigtighed — kommunikerer de med følgerne? Forklarer de deres strategi og fejl?

Røde flag du skal undgå: Afkast over 200% på under 3 måneder (gambling). 100% win rate (holder tabere åbne). Ingen beskrivelse eller kommunikation. Hyppige strategi-skift.`
  },
  {
    id: "risikostyring",
    title: "Risikostyring i copy trading",
    category: "Begynder",
    content: `Du kan tabe penge på copy trading. Ingen trader vinder altid. Her er hvordan du beskytter dig:

Spred dine kopieringer. Kopiér 3-5 traders i stedet for at sætte alt på én. Bland risikoprofiler — 2 konservative, 2 moderate, 1 aggressiv.

Invester aldrig mere end du kan tåle at miste. Copy trading er ikke en opsparingskonto. Brug penge du har råd til at miste helt.

Sæt stop loss. De fleste platforme lader dig sætte en grænse for hvor meget du maksimalt vil tabe på en trader. Sæt den til 20-30% af dit investerede beløb.

Tjek dine traders regelmæssigt. Mindst en gang om ugen. Har en trader ændret strategi? Er drawdown steget markant? Så overvej at stoppe kopieringen.

Start småt. Begynd med det minimum platformen tillader. Lær hvordan det føles at se din konto gå op og ned. Skaler op når du er komfortabel.

Diversificér på tværs af platforme og markeder. Kopiér ikke kun krypto-traders — bland med forex og aktier. Og brug gerne 2-3 forskellige platforme.`
  },
  {
    id: "skat-dk",
    title: "Copy trading og skat i Danmark",
    category: "Avanceret",
    content: `SKAT behandler copy trading-gevinster som kapitalindkomst. Her er hvad du skal vide:

Aktier og ETF'er beskattes efter aktieindkomstreglerne: 27% af de første 61.000 kr. (2026) og 42% af resten.

Krypto, forex og CFD'er beskattes som kapitalindkomst — typisk 37-42% afhængigt af din samlede indkomst.

Du skal indberette alle gevinster OG tab. Tab kan modregnes i gevinster inden for samme type indkomst. Det er vigtigt at holde styr på alle handler.

De fleste platforme giver dig en årlig oversigt du kan bruge til din selvangivelse. eToro og Bitget har begge rapporterings-funktioner.

Vigtigt: Valutakursgevinster (f.eks. hvis du har penge i USD og dollaren stiger) er også skattepligtige.

Vi anbefaler at du taler med en revisor hvis du handler for mere end 50.000 kr. Skattereglerne ændrer sig, og dette er ikke skatterådgivning.

Tip: Brug et regneark til at tracke alle ind- og udbetalinger, samt gevinster og tab pr. platform. Det gør selvangivelsen meget nemmere.`
  },
  {
    id: "begynder-guide",
    title: "Komplet startguide til copy trading",
    category: "Begynder",
    content: `Fra nul til din første kopiering på under 15 minutter. Her er hele processen:

Trin 1: Vælg en platform. Er du interesseret i krypto? Start med Bitget — de har flest traders at kopiere og $10 minimum. Er du interesseret i forex eller aktier? Start med eToro — de opfandt copy trading og det er gratis at kopiere.

Trin 2: Opret en konto. Du skal bruge email, telefonnummer og et ID-dokument (pas eller kørekort). Verifikation tager typisk 1-24 timer.

Trin 3: Indbetal penge. Brug bankoverførsel eller kreditkort. Start med det minimum du er komfortabel med — det kan altid skaleres op senere.

Trin 4: Find en trader. Gå til platformens leaderboard. Sortér efter lavest drawdown (ikke højest afkast!). Klik ind på 3-5 traders og tjek deres historik, strategi og risikoprofil.

Trin 5: Start kopieringen. Vælg din trader, angiv beløb, og tryk kopiér. Fra nu af følger din konto automatisk alle deres handler.

Trin 6: Overvåg ugentligt. Tjek din portefølje mindst en gang om ugen. Er du tilfreds med resultaterne? Skal du justere?

Bonus: Kopiér 2-3 traders med forskellige strategier for at sprede risikoen.`
  },
  {
    id: "copy-vs-selv",
    title: "Copy trading vs. at handle selv",
    category: "Avanceret",
    content: `Hvornår giver copy trading mening, og hvornår bør du handle selv?

Copy trading er bedst når: Du ikke har tid til at sidde foran en skærm hele dagen. Du er ny og vil lære af erfarne traders. Du vil have en passiv indkomststrategi. Du handler med et beløb der ikke retfærdiggør den tid aktiv trading kræver.

At handle selv er bedst når: Du har en edge du har testet og verificeret. Du nyder processen og har tid til det. Du vil have fuld kontrol over hver handel. Du handler med et stort nok beløb til at det er din primære beskæftigelse.

Mange gør begge dele. De kopierer 2-3 traders med 70-80% af deres kapital og handler aktivt med de resterende 20-30%. Kopieringerne giver stabil, passiv indkomst, mens den aktive del giver læring og potentielt højere afkast.

Den ærlige sandhed: De fleste private traders taber penge. Studier viser at 74-89% af detailhandlere taber på CFD-handel. Copy trading fjerner ikke risikoen, men det giver dig adgang til traders der har bevist at de kan slå markedet over tid.`
  },
];

// ============================================================
// 🔧 QUIZ-TRIN
// ============================================================

const quizSteps = [
  { q: "Hvor skal vi sende din personlige trader-liste?", type: "email" },
  { q: "Hvad hedder du, og hvor kan vi nå dig?", type: "contact" },
  { q: "Hvor erfaren er du med trading?", type: "select", opts: ["Helt ny — har aldrig handlet", "Lidt — under et år", "En del — 1 til 3 år", "Erfaren — mere end 3 år"] },
  { q: "Hvor meget risiko er du komfortabel med?", type: "select", opts: ["Lav risiko — beskytte min kapital", "Middel risiko — balanceret vækst", "Høj risiko — størst muligt afkast", "Ved ikke — hjælp mig med at vælge"] },
  { q: "Hvad har du tænkt dig at starte med?", type: "select", opts: ["Under 2.500 kr.", "2.500 — 25.000 kr.", "25.000 — 250.000 kr.", "Mere end 250.000 kr."] },
  { q: "Hvad interesserer dig?", type: "multi", opts: ["Krypto (Bitcoin, Ethereum osv.)", "Valutahandel (forex)", "Aktier og ETF'er", "Råvarer (guld, olie)", "Indekser (S&P 500, DAX)"] },
];

// ============================================================
// 🧩 HJÆLPE-KOMPONENTER
// ============================================================

function monthlyToPath(monthly, start = 10000) {
  const p = [start]; monthly.forEach(m => p.push(p[p.length - 1] * (1 + m / 100))); return p;
}
function Spark({ data, h = 36 }) {
  const w = 200, mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / rng) * (h - 6) - 3}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h, display: "block" }}><polyline points={pts} fill="none" stroke={data[data.length-1] > data[0] ? "#059669" : "#DC2626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" /></svg>;
}
function ScorePill({ score }) {
  const t = score >= 85 ? "bg-emerald-50 text-emerald-700" : score >= 70 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${t}`}><Star className="h-3 w-3" /> {score}</span>;
}
function RiskPill({ risk }) {
  const c = { "Lav": "bg-emerald-50 text-emerald-700", "Middel": "bg-amber-50 text-amber-700", "Høj": "bg-rose-50 text-rose-700", "Meget høj": "bg-rose-100 text-rose-800" };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c[risk] || "bg-slate-100"}`}>{risk}</span>;
}
function fmt(n) { return Math.round(n).toLocaleString("da-DK"); }

function sendToWebhook(url, data) {
  if (url.startsWith("#")) { console.log("Webhook ikke konfigureret:", data); return; }
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(e => console.error("Webhook fejl:", e));
}

// ============================================================
// 🚀 HOVEDKOMPONENT
// ============================================================

export default function CopyTraderDK() {
  const [tab, setTab] = useState("home");
  const [sort, setSort] = useState("score");
  const [riskFilter, setRiskFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selTrader, setSelTrader] = useState(null);
  const [selGuide, setSelGuide] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [capital, setCapital] = useState("10000");
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selOpts, setSelOpts] = useState([]);
  const [quizRisk, setQuizRisk] = useState(null);
  const [quizMarket, setQuizMarket] = useState(null);
  const [quizData, setQuizData] = useState({});
  const [emailInput, setEmailInput] = useState("");

  const typeFilter = tab === "crypto" ? "crypto" : tab === "forex" ? "forex" : null;
  const filtered = useMemo(() => {
    let t = typeFilter ? allTraders.filter(x => x.type === typeFilter) : allTraders;
    if (riskFilter !== "all") t = t.filter(x => x.risk === riskFilter);
    if (search) t = t.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.platform.toLowerCase().includes(search.toLowerCase()));
    return [...t].sort((a, b) => sort === "score" ? b.score - a.score : sort === "ret" ? b.ret - a.ret : a.dd - b.dd);
  }, [typeFilter, riskFilter, search, sort]);

  const togglePort = (t) => setPortfolio(p => p.find(x => x.id === t.id) ? p.filter(x => x.id !== t.id) : [...p, t].slice(0, 4));
  const portRet = portfolio.length ? (portfolio.reduce((s, t) => s + t.ret, 0) / portfolio.length) : 0;
  const portDD = portfolio.length ? (portfolio.reduce((s, t) => s + t.dd, 0) / portfolio.length) : 0;

  const sel = selTrader || allTraders[0];
  const cap = Number(capital) || 10000;
  const path = [cap]; sel.monthly.forEach(m => path.push(path[path.length - 1] * (1 + m / 100)));
  const finalVal = path[path.length - 1];
  const avgM = sel.monthly.reduce((a, b) => a + b, 0) / sel.monthly.length;
  const riskScore = sel.risk === "Lav" ? 28 : sel.risk === "Middel" ? 55 : sel.risk === "Høj" ? 78 : 92;

  function closeQuiz() { setQuizOpen(false); setQuizStep(0); setQuizDone(false); setSelOpts([]); setQuizRisk(null); setQuizMarket(null); }
  function advanceQuiz() {
    if (quizStep === 3) {
      const r = selOpts[0]; setQuizRisk(r?.includes("Lav") ? "low" : r?.includes("Høj") ? "high" : "mid");
    }
    if (quizStep === 5) {
      const hasCrypto = selOpts.some(o => o.includes("Krypto"));
      const hasForex = selOpts.some(o => !o.includes("Krypto"));
      setQuizMarket(hasCrypto && hasForex ? "both" : hasCrypto ? "crypto" : "forex");
      sendToWebhook(GHL_WEBHOOK, { ...quizData, risk: quizRisk, market: hasCrypto ? "crypto" : "forex", answers: selOpts });
      setQuizDone(true); return;
    }
    setQuizStep(quizStep + 1); setSelOpts([]);
  }
  function handleEmailSignup() {
    if (emailInput) { sendToWebhook(EMAIL_WEBHOOK, { email: emailInput, source: "homepage" }); setEmailInput(""); }
  }

  const S = ({ children, className = "" }) => <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;

  // ============================================================
  // 📄 GUIDE-VISNING
  // ============================================================
  if (selGuide) {
    const g = guides.find(x => x.id === selGuide);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900" style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <S className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelGuide(null); setTab("home"); }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900"><TrendingUp className="h-4 w-4 text-white" /></div>
              <span className="text-lg font-bold tracking-tight">CopyTrader</span>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">.dk</span>
            </div>
          </S>
        </nav>
        <S className="py-8 max-w-3xl">
          <button onClick={() => setSelGuide(null)} className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft className="h-4 w-4" /> Tilbage til guides</button>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">{g?.category || "Guide"}</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{g?.title}</h1>
          <div className="mt-6 text-base text-slate-700 leading-relaxed whitespace-pre-line">{g?.content}</div>
          <div className="mt-10 rounded-2xl bg-slate-900 p-6 text-center text-white">
            <h3 className="text-lg font-bold">Klar til at komme i gang?</h3>
            <p className="mt-1 text-sm text-slate-400">Tag vores quiz og få personlige trader-anbefalinger.</p>
            <button onClick={() => { setSelGuide(null); setQuizOpen(true); }} className="mt-4 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900">Find mine traders</button>
          </div>
        </S>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900" style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", scrollBehavior: "smooth" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <S className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setTab("home"); setSelTrader(null); }}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900"><TrendingUp className="h-4 w-4 text-white" /></div>
            <span className="text-lg font-bold tracking-tight">CopyTrader</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">.dk</span>
          </div>
          <div className="flex items-center gap-1">
            {[["home", "Forside"], ["crypto", "Krypto"], ["forex", "Forex & aktier"]].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setSelTrader(null); }} className={`rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${tab === id ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`} style={{ transition: "all .15s" }}>{label}</button>
            ))}
            <button onClick={() => setQuizOpen(true)} className="ml-2 sm:ml-3 rounded-lg bg-slate-900 px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 hidden sm:block" style={{ transition: "all .15s" }}>Find mine traders</button>
            <button onClick={() => setQuizOpen(true)} className="ml-2 rounded-lg bg-slate-900 p-2 text-white sm:hidden"><Sparkles className="h-4 w-4" /></button>
          </div>
        </S>
      </nav>

      {/* ============================================================ */}
      {/* FORSIDE */}
      {/* ============================================================ */}
      {tab === "home" && (
        <div>
          {/* HERO */}
          <S className="pb-8 sm:pb-12 pt-10 sm:pt-16 text-center">
            <div className="mx-auto max-w-xl">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Opdateret april 2026
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ lineHeight: 1.1 }}>Stop med at gætte.<br/>Kopiér dem der leverer.</h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-500 px-4 sm:px-0">Vi scorer og rangerer copy traders på tværs af alle platforme — så du kan vælge dem der passer til dig.</p>
              <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
                <button onClick={() => setQuizOpen(true)} className="group rounded-xl bg-slate-900 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-slate-800" style={{ transition: "all .15s" }}>
                  Besvar 6 spørgsmål → få dine matches <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                <span className="text-xs text-slate-400">Gratis · 30 sekunder · Ingen forpligtelse</span>
              </div>
            </div>
          </S>

          {/* FEATURED TRADERS */}
          <S className="pb-12">
            <h2 className="mb-1 text-xl font-bold">Denne uges top traders</h2>
            <p className="mb-5 text-sm text-slate-500">De bedste inden for hvert marked lige nu. Klik for historik og afkastsimulering.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Bedste krypto-trader", ...allTraders.find(t => t.type === "crypto"), accent: "emerald" },
                { label: "Bedste forex-trader", ...allTraders.find(t => t.type === "forex"), accent: "blue" },
                { label: "Bedste aktie-trader", ...allTraders.filter(t => t.asset?.includes("aktie"))[0] || allTraders.find(t => t.type === "forex"), accent: "violet" },
              ].filter(t => t.name).map((t, i) => (
                <div key={i} onClick={() => { setTab(t.type); setSelTrader(allTraders.find(x => x.id === t.id)); }} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md" style={{ transition: "all .15s" }}>
                  <div className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${t.accent === "emerald" ? "text-emerald-600" : t.accent === "blue" ? "text-blue-600" : "text-violet-600"}`}>{t.label}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{t.name?.slice(0, 2)}</div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold">{t.name} {t.score >= 85 && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}</div>
                      <div className="text-xs text-slate-500">{t.strategy} · {t.platform}</div>
                    </div>
                    <div className="ml-auto"><ScorePill score={t.score} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="rounded-lg bg-slate-50 p-2"><div className="text-[10px] text-slate-400">Afkast</div><div className="text-sm font-bold text-emerald-600">+{t.ret}%</div></div>
                    <div className="rounded-lg bg-slate-50 p-2"><div className="text-[10px] text-slate-400">Drawdown</div><div className="text-sm font-bold text-rose-600">{t.dd}%</div></div>
                    <div className="rounded-lg bg-slate-50 p-2"><div className="text-[10px] text-slate-400">Kopierer</div><div className="text-sm font-bold">{t.followers?.toLocaleString("da-DK")}</div></div>
                  </div>
                  {t.monthly?.length > 0 && <div className="mb-3"><Spark data={monthlyToPath(t.monthly)} h={32} /></div>}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">10.000 kr. → <span className="font-semibold text-emerald-600">{fmt(10000 * (1 + t.ret / 100))} kr.</span></div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${t.accent === "emerald" ? "text-emerald-600" : t.accent === "blue" ? "text-blue-600" : "text-violet-600"}`}>Se profil <ChevronRight className="h-3 w-3" /></div>
                  </div>
                </div>
              ))}
            </div>
          </S>

          {/* HOW IT WORKS */}
          <S className="pb-12">
            <h2 className="mb-1 text-xl font-bold">Sådan virker det</h2>
            <p className="mb-5 text-sm text-slate-500">Fra nybegynder til copy trader på under 10 minutter.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[["01", "Tag quizzen", "6 spørgsmål om din erfaring, kapital og interesser."], ["02", "Få dine matches", "Vi anbefaler traders og platforme tilpasset din profil."], ["03", "Opret konto", "Vælg en platform, indbetal — det tager 2 minutter."], ["04", "Tryk kopiér", "Vælg en trader, tryk kopiér. De handler, du følger med."]].map(([n, t, d], i) => (
                <div key={i} className="rounded-2xl bg-white p-5 border border-slate-200 hover:border-slate-300" style={{ transition: "all .15s" }}>
                  <div className="text-2xl font-bold text-slate-200">{n}</div>
                  <div className="mt-2 text-sm font-semibold">{t}</div>
                  <div className="mt-1 text-xs text-slate-500 leading-relaxed">{d}</div>
                </div>
              ))}
            </div>
          </S>

          {/* MINI LEADERBOARD */}
          <S className="pb-12">
            <div className="flex items-baseline justify-between mb-4">
              <div><h2 className="text-xl font-bold">Alle traders — rangeret efter score</h2><p className="text-sm text-slate-500">Klik for historik og afkastsimulering.</p></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead><tr className="border-b border-slate-200 bg-slate-50">{["#", "Trader", "Score", "Afkast", "DD", "Risiko", "Marked", "12 mdr"].map((h, i) => <th key={i} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>)}</tr></thead>
                <tbody>
                  {[...allTraders].sort((a, b) => b.score - a.score).slice(0, 6).map((t, i) => (
                    <tr key={t.id} onClick={() => { setTab(t.type); setSelTrader(t); }} className="border-b border-slate-100 cursor-pointer hover:bg-blue-50/50" style={{ transition: "background .1s" }}>
                      <td className="px-3 py-3 font-semibold text-slate-400">#{i + 1}</td>
                      <td className="px-3 py-3"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{t.name.slice(0, 2)}</div><div><div className="flex items-center gap-1 font-semibold">{t.name} {t.score >= 85 && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}</div><div className="text-xs text-slate-500">{t.platform}</div></div></div></td>
                      <td className="px-3 py-3"><ScorePill score={t.score} /></td>
                      <td className="px-3 py-3 font-semibold text-emerald-600">+{t.ret}%</td>
                      <td className="px-3 py-3 text-rose-600">{t.dd}%</td>
                      <td className="px-3 py-3"><RiskPill risk={t.risk} /></td>
                      <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${t.type === "crypto" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{t.type === "crypto" ? "Krypto" : "Forex"}</span></td>
                      <td className="px-3 py-3">{t.monthly?.length > 0 && <Spark data={monthlyToPath(t.monthly)} h={22} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div className="flex items-center justify-center gap-4 border-t border-slate-100 py-3">
                <button onClick={() => setTab("crypto")} className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800">Se alle krypto-traders <ChevronRight className="h-3.5 w-3.5" /></button>
                <span className="text-slate-300">|</span>
                <button onClick={() => setTab("forex")} className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800">Se alle forex/aktie-traders <ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </S>

          {/* GUIDES */}
          <S className="pb-12">
            <h2 className="mb-1 text-xl font-bold">Ny til copy trading?</h2>
            <p className="mb-5 text-sm text-slate-500">Start her — det tager 5 minutter at forstå.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {guides.slice(0, 6).map((g, i) => (
                <div key={g.id} onClick={() => setSelGuide(g.id)} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 cursor-pointer" style={{ transition: "all .15s" }}>
                  <div className={`mb-3 h-1 w-8 rounded-full ${i % 3 === 0 ? "bg-emerald-500" : i % 3 === 1 ? "bg-blue-500" : "bg-amber-500"}`} />
                  <h3 className="text-sm font-bold mb-2">{g.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{g.content.slice(0, 120)}...</p>
                </div>
              ))}
            </div>
          </S>

          {/* EMAIL SIGNUP */}
          <S className="pb-16">
            <div className="rounded-2xl bg-slate-900 p-6 sm:p-8 text-center text-white">
              <h3 className="text-lg sm:text-xl font-bold">Hver mandag kl. 8: de 5 bedste traders lige nu</h3>
              <p className="mt-2 text-sm text-slate-400">Vores team gennemgår tallene. Du får resultatet i din indbakke.</p>
              <div className="mt-5 mx-auto flex max-w-md gap-2">
                <input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="din@email.dk" className="flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-white/10 focus:border-white/30" />
                <button onClick={handleEmailSignup} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100" style={{ transition: "all .15s" }}>Tilmeld</button>
              </div>
              <p className="mt-3 text-xs text-slate-500">Gratis. Afmeld med ét klik.</p>
            </div>
          </S>
        </div>
      )}

      {/* ============================================================ */}
      {/* LEADERBOARD (krypto eller forex) */}
      {/* ============================================================ */}
      {(tab === "crypto" || tab === "forex") && !selTrader && (
        <S className="py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{tab === "crypto" ? "Krypto" : "Forex & aktie"} traders</h2>
                <p className="text-sm text-slate-500">Rangeret efter score. Opdateret ugentligt. Klik for detaljer.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søg trader eller platform..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400" />
                </div>
                {[["score", "Score"], ["ret", "Afkast"], ["dd", "Lavest DD"]].map(([k, l]) => (
                  <button key={k} onClick={() => setSort(k)} className={`rounded-lg px-3.5 py-2 text-xs font-medium ${sort === k ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`} style={{ transition: "all .15s" }}>{l}</button>
                ))}
                <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none">
                  <option value="all">Alle risikoniveauer</option>
                  <option value="Lav">Lav risiko</option>
                  <option value="Middel">Middel</option>
                  <option value="Høj">Høj</option>
                </select>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead><tr className="border-b border-slate-200 bg-slate-50">{["#", "Trader", "Score", "Afkast", "DD", "Risiko", "Kopierer", "12 mdr", ""].map((h, i) => <th key={i} className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>)}</tr></thead>
                  <tbody>
                    {filtered.map((t, i) => (
                      <tr key={t.id} onClick={() => setSelTrader(t)} className="border-b border-slate-100 cursor-pointer hover:bg-blue-50/50" style={{ transition: "background .1s" }}>
                        <td className="px-3 py-3.5 font-semibold text-slate-400">#{i + 1}</td>
                        <td className="px-3 py-3.5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{t.name.slice(0, 2)}</div><div><div className="flex items-center gap-1.5 font-semibold">{t.name} {t.score >= 85 && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}</div><div className="text-xs text-slate-500">{t.strategy} · {t.platform}</div></div></div></td>
                        <td className="px-3 py-3.5"><ScorePill score={t.score} /></td>
                        <td className="px-3 py-3.5 font-semibold text-emerald-600">+{t.ret}%</td>
                        <td className="px-3 py-3.5 text-rose-600">{t.dd}%</td>
                        <td className="px-3 py-3.5"><RiskPill risk={t.risk} /></td>
                        <td className="px-3 py-3.5"><div className="font-medium">{t.followers.toLocaleString("da-DK")}</div><div className="text-[10px] text-emerald-600">+{t.fNew} denne uge</div></td>
                        <td className="px-3 py-3.5">{t.monthly?.length > 0 && <Spark data={monthlyToPath(t.monthly)} h={24} />}</td>
                        <td className="px-3 py-3.5"><button onClick={e => { e.stopPropagation(); togglePort(t); }} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${portfolio.find(x => x.id === t.id) ? "bg-blue-100 text-blue-700" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                          {portfolio.find(x => x.id === t.id) ? "✓ I portefølje" : "+ Tilføj"}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
              {/* NORDNET BOX (kun forex) */}
              {tab === "forex" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-base font-bold">Bruger du Nordnet i dag?</h3>
                  <p className="mt-1 text-sm text-slate-600">Nordnet er stærkt til aktier og fonde — men de tilbyder ikke copy trading. Platforme som eToro og Vantage lader dig automatisk kopiere professionelle traders.</p>
                  <button onClick={() => setQuizOpen(true)} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Se alternativer til Nordnet</button>
                </div>
              )}
            </div>
            {/* SIDEBAR */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
              {portfolio.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold"><Layers3 className="h-4 w-4 text-blue-600" /> Din portefølje ({portfolio.length})</div>
                  {portfolio.map(t => <div key={t.id} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"><div className="text-xs"><div className="font-semibold">{t.name}</div><div className="text-slate-500">{t.platform}</div></div><span className="text-xs font-bold text-emerald-600">+{t.ret}%</span></div>)}
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
                    <div className="flex justify-between mb-1"><span className="text-slate-500">Gns. afkast</span><span className="font-bold text-emerald-600">+{portRet.toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Gns. drawdown</span><span className="font-bold text-rose-600">{portDD.toFixed(1)}%</span></div>
                  </div>
                  <button onClick={() => setQuizOpen(true)} className="mt-3 w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white">Start denne portefølje</button>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-bold mb-1">Få den fulde liste</div>
                <div className="text-xs text-slate-500 mb-3">Ugentlige opdateringer direkte i din indbakke.</div>
                <input placeholder="Fornavn" className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none" />
                <input placeholder="Email" type="email" className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none" />
                <button className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white">Få adgang</button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-bold mb-3">Sammenligninger</div>
                {(tab === "crypto" ? [["Bitget vs Bybit", "Krypto copy trading"], ["Bitget vs BingX", "Budget vs volumen"], ["OKX vs Bybit", "Multi-asset"]] : [["eToro vs Vantage", "Copy trading"], ["eToro vs Nordnet", "Copy trading vs fonde"], ["Exness vs XM", "Avanceret forex"]]).map(([t, d], i) => (
                  <div key={i} className="mb-2 last:mb-0 rounded-xl border border-slate-100 p-3 cursor-pointer hover:bg-slate-50"><div className="text-xs font-semibold">{t}</div><div className="text-[10px] text-slate-500">{d}</div></div>
                ))}
              </div>
            </div>
          </div>
        </S>
      )}

      {/* ============================================================ */}
      {/* TRADER PROFIL */}
      {/* ============================================================ */}
      {selTrader && (
        <S className="py-8">
          <button onClick={() => setSelTrader(null)} className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft className="h-4 w-4" /> Tilbage</button>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 space-y-5">
              <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 p-5 sm:p-7 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 text-xs text-sky-300 font-medium flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Trader-profil</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-bold">{sel.name}</h2>
                      {sel.score >= 85 && <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-medium"><BadgeCheck className="mr-1 inline h-3 w-3" />Verificeret</span>}
                      <ScorePill score={sel.score} />
                    </div>
                    <div className="mt-2 flex gap-1.5 flex-wrap">{[sel.strategy, sel.platform, sel.asset].map((t, i) => <span key={i} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px]">{t}</span>)}</div>
                    <p className="mt-3 max-w-lg text-sm text-slate-300 leading-relaxed">{sel.bio}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button onClick={() => togglePort(sel)} className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10">{portfolio.find(x => x.id === sel.id) ? "✓ I portefølje" : "Tilføj til portefølje"}</button>
                    <a href={AFFILIATE_LINKS[sel.platform] || "#"} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 inline-flex items-center">Kopiér på {sel.platform} <ExternalLink className="ml-1 h-3 w-3" /></a>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[["Afkast", `+${sel.ret}%`, "text-emerald-300"], ["Drawdown", `${sel.dd}%`, "text-rose-300"], ["Win rate", `${sel.winRate}%`, ""], ["Kopierer", sel.followers.toLocaleString("da-DK"), ""], ["Konsistens", sel.consistency, ""]].map(([l, v, c], i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[10px] uppercase tracking-wider text-slate-400">{l}</div><div className={`mt-1 text-2xl font-bold ${c}`}>{v}</div></div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500 mb-1">Start med</div><input value={capital} onChange={e => setCapital(e.target.value.replace(/[^\d]/g, ""))} className="w-full text-xl font-bold outline-none" /><div className="text-[10px] text-slate-400 mt-1">Rediger for at simulere</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500 mb-1">Værdi efter 12 mdr.</div><div className="text-xl font-bold text-emerald-600">{fmt(finalVal)} kr.</div><div className="text-[10px] text-slate-500 mt-1">Profit: {fmt(finalVal - cap)} kr.</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500 mb-1">Gns. måned</div><div className="text-xl font-bold">+{avgM.toFixed(1)}%</div><div className="text-[10px] text-slate-500 mt-1">Bedste: +{Math.max(...sel.monthly)}%</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs text-slate-500 mb-1">Værste måned</div><div className="text-xl font-bold text-rose-600">{Math.min(...sel.monthly)}%</div><div className="text-[10px] text-slate-500 mt-1">{sel.trades.toLocaleString("da-DK")} trades</div></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-4"><div className="text-sm font-bold">Hvad dine penge kunne blive til</div><span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">12 mdr</span></div>
                  <div className="rounded-xl bg-slate-50 p-3 mb-3"><div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Activity className="h-3 w-3" /> {fmt(cap)} kr. → {fmt(finalVal)} kr.</div><Spark data={path.slice(1)} h={48} /></div>
                  <div className="grid grid-cols-4 gap-1.5">{path.slice(1).map((v, i) => <div key={i} className="rounded-lg bg-slate-50 p-1.5 sm:p-2 text-center"><div className="text-[9px] text-slate-400">Mdr {i + 1}</div><div className="text-[11px] sm:text-xs font-semibold">{fmt(v)}</div><div className={`text-[10px] font-medium ${sel.monthly[i] >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{sel.monthly[i] > 0 ? "+" : ""}{sel.monthly[i]}%</div></div>)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2 text-sm font-bold mb-4"><Target className="h-4 w-4 text-blue-600" /> Snapshot</div>
                  <div className="grid grid-cols-2 gap-2 mb-4">{[["Marked", sel.asset], ["Strategi", sel.strategy], ["Track record", `${sel.months} mdr`], ["Platform", sel.platform]].map(([k, v], i) => <div key={i} className="rounded-lg border border-slate-100 p-3"><div className="text-[10px] text-slate-400">{k}</div><div className="text-sm font-bold mt-0.5">{v}</div></div>)}</div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1"><CalendarRange className="h-3.5 w-3.5 text-blue-600" /> Månedlige afkast</div>
                    <div className="grid grid-cols-4 gap-1">{sel.monthly.map((m, i) => <div key={i} className="text-center rounded bg-white p-1.5"><div className="text-[8px] text-slate-400">{i + 1}</div><div className={`text-[11px] font-bold ${m >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{m > 0 ? "+" : ""}{m}%</div></div>)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-56 shrink-0 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-bold mb-3"><Gauge className="h-4 w-4 text-blue-600" /> Risiko</div>
                <div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">Risikoscore</span><span className="font-bold">{riskScore}/100</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 mb-3"><div className={`h-full rounded-full ${riskScore < 40 ? "bg-emerald-500" : riskScore < 70 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${riskScore}%` }} /></div>
                <div className={`text-lg font-bold ${riskScore < 40 ? "text-emerald-600" : riskScore < 70 ? "text-amber-600" : "text-rose-600"}`}>{sel.risk} risiko</div>
              </div>
              <a href={AFFILIATE_LINKS[sel.platform] || "#"} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800">Kopiér på {sel.platform}</a>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-bold mb-3">FAQ</div>
                <div className="space-y-3 text-xs text-slate-600">
                  <div><div className="font-semibold text-slate-900">Hvordan virker det?</div><p className="mt-0.5">Du forbinder dig med {sel.platform} og kopierer automatisk denne traders handler.</p></div>
                  <div><div className="font-semibold text-slate-900">Er afkastet garanteret?</div><p className="mt-0.5">Nej. Du kan tabe penge. Tidligere resultater er ingen garanti.</p></div>
                </div>
              </div>
            </div>
          </div>
        </S>
      )}

      {/* FOOTER */}
      <footer className="mt-8 border-t border-slate-200 bg-white">
        <S className="py-6 text-center">
          <p className="mx-auto max-w-xl text-[10px] text-slate-400 leading-relaxed">Trading indebærer risiko. Du kan tabe hele dit indskud. 74-89% af privatinvestorer taber penge på CFD-handel. Vi modtager kommission fra platforme vi linker til. Denne side giver ikke investeringsrådgivning. Gør altid din egen research.</p>
          <p className="mt-3 text-xs text-slate-500">CopyTrader.dk — 2026</p>
          <div className="mt-1 flex justify-center gap-3 text-[10px] text-slate-400">
            <span className="cursor-pointer hover:text-slate-600">Privatlivspolitik</span>
            <span className="cursor-pointer hover:text-slate-600">Vilkår</span>
            <span className="cursor-pointer hover:text-slate-600">Cookies</span>
            <span className="cursor-pointer hover:text-slate-600">Kontakt</span>
          </div>
        </S>
      </footer>

      {/* ============================================================ */}
      {/* QUIZ MODAL */}
      {/* ============================================================ */}
      {quizOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" style={{ animation: "fadeIn .2s ease" }}>
          <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ animation: "slideUp .25s ease" }}>
            <button onClick={closeQuiz} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            {!quizDone ? (
              <>
                <div className="mb-6 flex gap-1">{quizSteps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= quizStep ? "bg-slate-900" : "bg-slate-200"}`} />)}</div>
                <div className="mb-1 text-xs text-slate-500">Trin {quizStep + 1} af 6</div>
                <h3 className="mb-5 text-xl font-bold">{quizSteps[quizStep].q}</h3>
                {quizSteps[quizStep].type === "email" && <input type="email" placeholder="din@email.dk" onChange={e => setQuizData({...quizData, email: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />}
                {quizSteps[quizStep].type === "contact" && <div className="space-y-2"><input placeholder="Fornavn" onChange={e => setQuizData({...quizData, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" /><input placeholder="+45 12 34 56 78" onChange={e => setQuizData({...quizData, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" /></div>}
                {quizSteps[quizStep].type === "select" && <div className="space-y-2">{quizSteps[quizStep].opts.map((o, i) => <button key={i} onClick={() => setSelOpts([o])} className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${selOpts.includes(o) ? "border-slate-900 bg-slate-50 font-semibold" : "border-slate-200 hover:bg-slate-50"}`}>{o}</button>)}</div>}
                {quizSteps[quizStep].type === "multi" && <div className="space-y-2">{quizSteps[quizStep].opts.map((o, i) => <button key={i} onClick={() => setSelOpts(p => p.includes(o) ? p.filter(x => x !== o) : [...p, o])} className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm ${selOpts.includes(o) ? "border-slate-900 bg-slate-50 font-semibold" : "border-slate-200 hover:bg-slate-50"}`}><div className={`flex items-center justify-center rounded border ${selOpts.includes(o) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"}`} style={{ width: 18, height: 18 }}>{selOpts.includes(o) && <span className="text-[10px]">✓</span>}</div>{o}</button>)}</div>}
                <button onClick={advanceQuiz} className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">{quizStep === 5 ? "Se mine resultater" : "Næste"}</button>
              </>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50"><BadgeCheck className="h-6 w-6 text-emerald-600" /></div>
                  <h3 className="text-xl font-bold">Din profil er klar</h3>
                  <p className="mt-1 text-sm text-slate-500">Her er hvad vi anbefaler</p>
                </div>
                {(quizMarket === "crypto" || quizMarket === "both") && (
                  <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-[10px] font-semibold text-emerald-700 uppercase">Krypto-platform</div>
                    <div className="mt-1 text-lg font-bold">Bitget</div>
                    <div className="text-xs text-slate-600">120M+ brugere. Flest traders at kopiere. Fra $10.</div>
                    <a href={AFFILIATE_LINKS.Bitget} target="_blank" rel="noopener noreferrer" className="mt-3 block w-full rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white">Opret gratis konto</a>
                  </div>
                )}
                {(quizMarket === "forex" || quizMarket === "both") && (
                  <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="text-[10px] font-semibold text-blue-700 uppercase">Forex & aktier</div>
                    <div className="mt-1 text-lg font-bold">eToro</div>
                    <div className="text-xs text-slate-600">Nemmest at starte. Gratis copy trading. Reguleret i EU.</div>
                    <a href={AFFILIATE_LINKS.eToro} target="_blank" rel="noopener noreferrer" className="mt-3 block w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white">Opret gratis konto</a>
                  </div>
                )}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <div className="mb-2 text-[10px] font-semibold text-slate-500 uppercase">Traders der matcher din profil</div>
                  {allTraders
                    .filter(t => quizMarket === "crypto" ? t.type === "crypto" : quizMarket === "forex" ? t.type === "forex" : true)
                    .filter(t => quizRisk === "low" ? t.risk === "Lav" : quizRisk === "high" ? (t.risk === "Høj" || t.risk === "Meget høj") : true)
                    .sort((a, b) => b.score - a.score).slice(0, 3)
                    .map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-200 last:border-0">
                      <div><div className="text-sm font-semibold">{t.name}</div><div className="flex items-center gap-1.5 text-xs text-slate-500">{t.platform} · <RiskPill risk={t.risk} /></div></div>
                      <div className="text-right"><div className="text-sm font-bold text-emerald-600">+{t.ret}%</div><ScorePill score={t.score} /></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
