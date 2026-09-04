import { useState, useEffect, useRef, Fragment, type ReactNode, type ComponentType } from "react";
import {
  ShoppingCart, MapPin, Building2, CreditCard, Settings,
  ArrowRight, Menu, X, Check, BarChart3, Users, Globe,
  Package, Bell, Code2, Headphones, GraduationCap,
  RefreshCw, DollarSign, Mail,
  TrendingUp, Zap, ChevronRight, ChevronLeft, Phone, Search,
  FileText, Activity, Send, Loader2, AlertCircle, Quote,
} from "lucide-react";
import {
  SiJavascript, SiReact, SiTypescript, SiAngular, SiNodedotjs,
  SiMongodb, SiDocker, SiPython, SiDjango,
} from "react-icons/si";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { useLocale, type Locale } from "../i18n/LocaleProvider";
import type { Translations } from "../i18n/fr";

// ─────────────────────────────────────────────
// DATA — structure/couleurs/icônes uniquement (langue-agnostique).
// Le texte affiché vient de src/i18n/fr.ts / en.ts, fusionné par index/id
// avec ces tableaux au moment du rendu.
// ─────────────────────────────────────────────

const NAV_HREFS = ["#accueil", "#solutions", "#services"];

// Clé publique web3forms (docs.web3forms.com) — conçue pour être exposée
// côté client, contrairement à une clé API classique : le service la
// rate-limite et la restreint par domaine depuis son dashboard, pas nous.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

const TRUST_ICONS = [Code2, Zap, Headphones, Globe];

// Légère rotation d'entrée par carte témoignage ("flocon" qui se pose),
// alternée pour ne jamais donner un angle uniforme — reste toujours dans la
// grille (aucun positionnement absolu), l'angle revient à 0° une fois visible.
const TESTIMONIAL_TILTS = [-3, 4, -2];

const DEV_SKILLS = [
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Angular", Icon: SiAngular, color: "#DD0031" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "Django", Icon: SiDjango, color: "#092E20" },
];

const DOMAIN_ICONS = [BarChart3, Search];

const IMPACT_ICONS_VALUES = [
  { icon: Package, value: 10 },
  { icon: Headphones, value: 7 },
  { icon: Zap, value: 5 },
  { icon: Settings, value: 3 },
  { icon: Globe, value: 4 },
];

// Kept in sync with --primary / --turquoise in src/styles/theme.css — used to
// shade each "Notre approche" timeline step consistently with the gradient line.
const APPROACH_GRADIENT_FROM = "#1234B0";
const APPROACH_GRADIENT_TO = "#22D3EE";

// Interpolates between two "#rrggbb" colors, t in [0, 1] — used to shade each
// timeline step consistently with the primary → turquoise gradient line.
function mixHex(hexA: string, hexB: string, t: number) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

// "name" est un nom de marque propre, identique en FR/EN — ne vient pas des
// fichiers de traduction. tagline/description/features/useCase viennent de
// t.solutions.products[id].
const PRODUCTS_BASE = [
  { id: "store", name: "KumpaX Store", icon: ShoppingCart, color: "#6366F1" },
  { id: "visitapp", name: "VisitApp", icon: MapPin, color: "#10B981" },
  { id: "maximmo", name: "MaxImmo", icon: Building2, color: "#F59E0B" },
  { id: "kumpacard", name: "KumpaCard", icon: CreditCard, color: "#3B5BFF" },
] as const;

const ODOO_SERVICE_ICONS = [Search, Settings, Code2, Zap, RefreshCw, GraduationCap, Headphones, Globe];

const ODOO_MODULE_ICONS = [Users, TrendingUp, DollarSign, Package, ShoppingCart, Users, BarChart3, Globe, FileText, Settings, Bell, Activity];

// Style de chaque couture (langue-agnostique — le texte vient de t.seams[i]).
// Inclinaison alternée, fonds alternés anthracite/primary/turquoise/anthracite
// — voir docs/HISTORIQUE.md pour la validation visuelle de ces valeurs sur la
// maquette (piste "bandeau oblique 3D"). Pas de couture avant Contact (retirée
// le 2026-08-19, voir docs/HISTORIQUE.md).
const SEAM_STYLES = [
  { angle: -2.4, background: "#080C1E", textColor: "rgba(255,255,255,.65)", diamondColor: "#22D3EE", durationClass: "seam-1-marquee-track" },
  { angle: 2.4, background: "#1234B0", textColor: "rgba(255,255,255,.8)", diamondColor: "#22D3EE", durationClass: "seam-2-marquee-track" },
  { angle: -2.4, background: "#22D3EE", textColor: "#080C1E", diamondColor: "rgba(8,12,30,.4)", durationClass: "seam-3-marquee-track" },
  { angle: 1.8, background: "#080C1E", textColor: "rgba(255,255,255,.65)", diamondColor: "#22D3EE", durationClass: "seam-4-marquee-track" },
] as const;

// ─────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <img
        src={light ? "/kumpax-logo-blue.png" : "/kumpax-logo.png"}
        alt="KumpaX"
        className={`flex-shrink-0 object-contain ${light ? "h-14 w-auto" : "h-11 w-auto"}`}
      />
      <span
        className={`text-[1.3rem] font-black tracking-tight leading-none ${light ? "text-white" : "text-foreground"}`}
        style={{ fontFamily: "var(--font-title)" }}
      >
        Kumpa<span style={{ color: light ? "#93A8FF" : "var(--primary)" }}>X</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// SÉLECTEUR DE LANGUE — segmenté FR|EN
// ─────────────────────────────────────────────

function LangSwitch({
  locale,
  setLocale,
  t,
  className = "",
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations["langSwitcher"];
  className?: string;
}) {
  const options: Locale[] = ["fr", "en"];
  return (
    <div
      role="group"
      aria-label={t.ariaLabel}
      className={`inline-flex items-center rounded-lg bg-gray-100 p-1 text-sm font-semibold ${className}`}
    >
      {options.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-3 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] ${
            locale === l ? "bg-white text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
          }`}
        >
          {t[l]}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// BROWSER FRAME WRAPPER
// ─────────────────────────────────────────────

function BrowserFrame({ url, children, height = 300 }: { url: string; children: ReactNode; height?: number }) {
  return (
    <div className="rounded-xl overflow-hidden border border-black/10 shadow-2xl bg-[#0F1117]">
      <div className="bg-[#1C1F2A] px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-3">
          <div className="bg-white/10 rounded px-3 py-0.5 text-white/40 text-[9px] text-center max-w-[180px] mx-auto">
            {url}
          </div>
        </div>
      </div>
      <div style={{ height }} className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCT MOCK UIs — reçoivent leur tranche de traduction en prop
// ─────────────────────────────────────────────

function StoreMockUI({ t }: { t: Translations["solutions"]["mockUi"]["store"] }) {
  return (
    <BrowserFrame url="store.kumpax.com" height={308}>
      <div className="flex h-full text-xs">
        <div className="w-36 bg-[#161B2E] border-r border-white/10 p-2.5 flex flex-col gap-0.5 flex-shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
            <div className="w-5 h-5 rounded bg-[#1234B0] flex items-center justify-center text-white text-[7px] font-black flex-shrink-0">KX</div>
            <span className="text-white text-[10px] font-semibold">Store</span>
          </div>
          {t.nav.map((item, i) => (
            <div key={item} className={`px-2.5 py-1.5 rounded text-[10px] flex items-center gap-2 ${i === 0 ? "bg-[#1234B0] text-white" : "text-white/40"}`}>
              <div className={`w-1 h-1 rounded-full flex-shrink-0 ${i === 0 ? "bg-white" : "bg-white/20"}`} />
              {item}
            </div>
          ))}
        </div>
        <div className="flex-1 p-3 overflow-hidden bg-[#0F1117]">
          <div className="text-white/80 font-semibold text-[11px] mb-2.5">{t.overview}</div>
          <div className="grid grid-cols-3 gap-2 mb-2.5">
            {t.stats.map((s) => (
              <div key={s.label} className="bg-[#1C2035] rounded-lg p-2">
                <div className="text-white/30 text-[8px] uppercase tracking-wider">{s.label}</div>
                <div className="text-white text-[12px] font-bold mt-0.5">{s.value}</div>
                <div className="text-green-400 text-[8px]">{s.change}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#1C2035] rounded-lg p-2.5 mb-2.5">
            <div className="flex justify-between mb-1.5">
              <span className="text-white/50 text-[9px]">{t.salesTitle}</span>
              <span className="text-white/20 text-[8px]">{t.salesRange}</span>
            </div>
            <svg width="100%" height="48" viewBox="0 0 200 48" preserveAspectRatio="none">
              <defs>
                <linearGradient id="storeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B5BFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B5BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 38 L33 32 L66 26 L100 15 L133 20 L166 8 L200 4" stroke="#3B5BFF" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <path d="M0 38 L33 32 L66 26 L100 15 L133 20 L166 8 L200 4 L200 48 L0 48 Z" fill="url(#storeGrad)" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {t.products.map((p) => (
              <div key={p.name} className="bg-[#1C2035] rounded-lg p-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#1234B0]/40 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-white/80 text-[9px] font-medium truncate">{p.name}</div>
                  <div className="text-[#3B5BFF] text-[8px]">{p.price}</div>
                  <div className="text-white/30 text-[8px]">{p.sold}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function VisitAppMockUI({ t }: { t: Translations["solutions"]["mockUi"]["visitapp"] }) {
  const reps = [
    { init: "MT", color: "#10B981", name: t.repNames[0], status: t.repsStatus[0] },
    { init: "SA", color: "#1234B0", name: t.repNames[1], status: t.repsStatus[1] },
    { init: "PF", color: "#F59E0B", name: t.repNames[2], status: t.repsStatus[2] },
  ];
  const pins = [
    { x: 28, y: 36, ...reps[0] },
    { x: 57, y: 60, ...reps[1] },
    { x: 43, y: 78, ...reps[2] },
  ];
  return (
    <div className="rounded-xl overflow-hidden border border-black/10 shadow-2xl bg-white text-xs select-none">
      <div className="bg-[#0D1117] px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-white/50 text-[9px]">{t.title}</span>
      </div>
      <div className="flex" style={{ height: 308 }}>
        <div className="flex-1 relative bg-[#EBF0F7] overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #C2CDE0 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 308" preserveAspectRatio="none">
            <path d="M0 110 Q90 95 130 160 Q175 220 260 200" stroke="#B8C8DE" strokeWidth="8" fill="none" />
            <path d="M0 215 Q65 190 130 160 Q200 130 260 90" stroke="#C2D0E4" strokeWidth="5" fill="none" />
            <path d="M85 0 Q95 85 130 160 Q165 235 155 308" stroke="#D0DCED" strokeWidth="4" fill="none" />
          </svg>
          {pins.map((pin) => (
            <div key={pin.name} className="absolute flex flex-col items-center" style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -50%)" }}>
              <div className="w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[7px] font-bold text-white" style={{ background: pin.color }}>
                {pin.init}
              </div>
              <div className="bg-white/90 px-1.5 py-0.5 rounded text-[7px] font-medium text-gray-700 mt-0.5 shadow-sm whitespace-nowrap">
                {pin.name}
              </div>
            </div>
          ))}
        </div>
        <div className="w-44 bg-white border-l border-gray-100 p-3 flex flex-col gap-3 flex-shrink-0">
          <div>
            <div className="text-gray-400 text-[8px] uppercase tracking-wider mb-2 font-medium">{t.today}</div>
            <div className="grid grid-cols-2 gap-1.5">
              {t.todayStats.map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-400 text-[7px] uppercase">{s.label}</div>
                  <div className="text-gray-900 text-[13px] font-bold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[8px] uppercase tracking-wider mb-2 font-medium">{t.repsTitle}</div>
            <div className="space-y-2">
              {reps.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <div>
                    <div className="text-gray-800 text-[9px] font-medium">{c.name}</div>
                    <div className="text-gray-400 text-[8px]">{c.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 mt-auto">
            <div className="text-gray-400 text-[8px] mb-1.5 uppercase tracking-wider font-medium">{t.goalTitle}</div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#10B981]" style={{ width: "68%" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-400 text-[8px]">68%</span>
              <span className="text-gray-600 text-[8px] font-medium">{t.goalCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaxImmoMockUI({ t }: { t: Translations["solutions"]["mockUi"]["maximmo"] }) {
  const statusColors: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    late: "bg-red-50 text-red-700",
  };
  const statColors = ["#F59E0B", "#10B981", "#EF4444", "#1234B0"];
  return (
    <div className="rounded-xl overflow-hidden border border-black/10 shadow-2xl bg-white text-xs select-none">
      <div className="bg-[#0D1117] px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-white/50 text-[9px]">{t.title}</span>
      </div>
      <div style={{ height: 308 }} className="overflow-hidden">
        <div className="grid grid-cols-4 border-b border-gray-100">
          {t.stats.map((s, i) => (
            <div key={s.label} className={`p-3 text-center ${i < 3 ? "border-r border-gray-100" : ""}`}>
              <div className="font-bold text-base" style={{ color: statColors[i] }}>{s.value}</div>
              <div className="text-gray-400 text-[8px] uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {t.tableHeaders.map((h) => (
                <th key={h} className="px-3 py-2 text-[8px] uppercase text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row) => (
              <tr key={row.bien} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="px-3 py-2.5 text-[9px] text-gray-800 font-medium">{row.bien}</td>
                <td className="px-3 py-2.5 text-[9px] text-gray-500">{row.tenant}</td>
                <td className="px-3 py-2.5 text-[9px] text-gray-800 font-mono">{row.loyer}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-semibold ${statusColors[row.status]}`}>
                    {t.statusLabels[row.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KumpaCardMockUI({ t }: { t: Translations["solutions"]["mockUi"]["kumpacard"] }) {
  const contactIcons = [Mail, Phone, Globe];
  return (
    <div className="rounded-xl overflow-hidden border border-black/10 shadow-2xl bg-[#F0F3FA] text-xs select-none">
      <div className="bg-[#0D1117] px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-white/50 text-[9px]">{t.title}</span>
      </div>
      <div className="flex gap-5 p-5" style={{ height: 308 }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-52 rounded-2xl p-5 shadow-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F1B8C 0%, #1234B0 55%, #3B5BFF 100%)" }}>
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 mb-3 flex items-center justify-center">
                <span className="text-white text-xs font-black">AK</span>
              </div>
              <div className="text-white font-bold text-sm">{t.name}</div>
              <div className="text-white/60 text-[10px] mt-0.5">{t.role}</div>
              <div className="mt-3.5 space-y-1.5">
                {t.contacts.map((text, i) => {
                  const Icon = contactIcons[i];
                  return (
                    <div key={text} className="text-white/50 text-[9px] flex items-center gap-1.5">
                      <Icon className="w-2.5 h-2.5 flex-shrink-0" />{text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="w-36 flex flex-col gap-3 flex-shrink-0">
          <div className="bg-white rounded-xl p-3 flex flex-col items-center shadow-sm">
            <div className="text-gray-400 text-[8px] uppercase tracking-wider mb-2 font-medium">{t.qr}</div>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="4" fill="white" />
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#080C1E" />
              <rect x="5" y="5" width="14" height="14" rx="1" fill="white" />
              <rect x="7" y="7" width="10" height="10" rx="0.5" fill="#080C1E" />
              <rect x="43" y="3" width="18" height="18" rx="2" fill="#080C1E" />
              <rect x="45" y="5" width="14" height="14" rx="1" fill="white" />
              <rect x="47" y="7" width="10" height="10" rx="0.5" fill="#080C1E" />
              <rect x="3" y="43" width="18" height="18" rx="2" fill="#080C1E" />
              <rect x="5" y="45" width="14" height="14" rx="1" fill="white" />
              <rect x="7" y="47" width="10" height="10" rx="0.5" fill="#080C1E" />
              {[24,28,32,36,40,24,40,28,36,24,28,32,36,40,24,28,40].map((x, i) => {
                const ys = [3,3,3,3,3,7,7,11,11,15,15,15,15,15,19,19,19];
                return <rect key={i} x={x} y={ys[i]} width="3" height="3" fill="#080C1E" />;
              })}
              {[3,7,11,15,19,23,27,31,35,39,43,47,51,55,59].map((x, i) => (
                i % 3 !== 1 ? <rect key={`r${i}`} x={x} y={24} width="3" height="3" fill="#080C1E" /> : null
              ))}
              {[3,11,19,27,35,43,51,59].map((x, i) => (
                <rect key={`b${i}`} x={x} y={i % 2 === 0 ? 28 : 32} width="3" height="3" fill="#080C1E" />
              ))}
            </svg>
            <div className="text-[#3B5BFF] text-[8px] mt-2 font-semibold">{t.share}</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm flex-1">
            <div className="text-gray-400 text-[8px] uppercase tracking-wider mb-3 font-medium">{t.analyticsTitle}</div>
            <div className="space-y-2.5">
              {t.analytics.map((s, i) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500 text-[9px]">{s.label}</span>
                    <span className="text-gray-900 text-[10px] font-bold">{s.value}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#3B5BFF]" style={{ width: `${[80, 95, 40][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AFRICA MAP HERO VISUAL
// ─────────────────────────────────────────────

// Large, low-opacity Africa silhouette used as a single background watermark
// spanning the whole hero — deliberately covers the full section (not just the
// right column) so the left (text) and right (map) halves read as one unified
// backdrop instead of two separate zones.
function AfricaBackdrop() {
  return (
    <svg
      viewBox="0 0 210 260"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none hidden lg:block"
      aria-hidden="true"
    >
      <path
        d="M72 10 L138 6 L168 15 L175 42 C185 60,192 80,196 100 L200 110 L188 130 L174 152 L164 178 L154 202 L140 225 L108 242 L84 228 L65 206 L54 182 L48 158 L40 135 L28 118 L22 102 L26 86 L22 74 L22 64 L20 56 L24 48 L20 42 L28 35 L38 26 L52 16 Z"
        fill="#1234B0"
      />
    </svg>
  );
}

function AfricaMapVisual({ t }: { t: Translations["hero"]["map"] }) {
  // HQ = Sénégal (siège à Dakar).
  const kx = 50;
  const ky = 60;

  // `delay` staggers the traveling-signal animation so it reads as radiating
  // outward from the HQ node — roughly proportional to distance from it.
  const cities = [
    { x: 35, y: 95,  name: t.cities[0], side: "left",  delay: 0    },
    { x: 42, y: 122, name: t.cities[1], side: "left",  delay: 0.35 },
    { x: 95, y: 190, name: t.cities[2], side: "right", delay: 0.7  },
  ];

  return (
    <div className="relative w-full h-full min-h-[420px]">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 rounded-none"
        style={{
          backgroundImage: "radial-gradient(circle, #C9D5EC 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Main SVG */}
      <svg
        viewBox="0 0 210 260"
        className="absolute inset-0 w-full h-full"
        style={{ maxHeight: 520 }}
        aria-label={t.alt}
      >
        <defs>
          <radialGradient id="kxGlow" cx="38%" cy="57%" r="45%">
            <stop offset="0%" stopColor="#1234B0" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#1234B0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft glow behind the continent */}
        <ellipse cx="108" cy="135" rx="90" ry="108" fill="url(#kxGlow)" />

        {/* Africa silhouette */}
        <path
          d="M72 10 L138 6 L168 15 L175 42 C185 60,192 80,196 100 L200 110 L188 130 L174 152 L164 178 L154 202 L140 225 L108 242 L84 228 L65 206 L54 182 L48 158 L40 135 L28 118 L22 102 L26 86 L22 74 L22 64 L20 56 L24 48 L20 42 L28 35 L38 26 L52 16 Z"
          fill="rgba(18,52,176,0.045)"
          stroke="#1234B0"
          strokeWidth="1.2"
          strokeOpacity="0.2"
          strokeLinejoin="round"
        />

        {/* Connection lines from the HQ — the dash pattern travels outward on a
            loop, standing in for live signal/traffic instead of a static line. */}
        {cities.map((c, i) => (
          <line
            key={i}
            className="map-connection"
            x1={kx} y1={ky} x2={c.x} y2={c.y}
            stroke="#1234B0"
            strokeWidth="0.65"
            strokeOpacity="0.22"
            strokeDasharray="4 4"
            style={{ animationDelay: `${c.delay}s` }}
          />
        ))}

        {/* Remote city dots + labels */}
        {cities.map((c) => (
          <g key={c.name}>
            <circle
              className="map-ping"
              cx={c.x} cy={c.y} r="2"
              fill="none"
              stroke="#3B5BFF"
              strokeWidth="1"
              style={{ animationDelay: `${c.delay}s` }}
            />
            <circle cx={c.x} cy={c.y} r="4.5" fill="#3B5BFF" fillOpacity="0.12" />
            <circle cx={c.x} cy={c.y} r="2.5" fill="#3B5BFF" fillOpacity="0.55" />
            <circle cx={c.x} cy={c.y} r="1.2" fill="#3B5BFF" />
            <text
              x={c.side === "right" ? c.x + 6 : c.side === "left" ? c.x - 6 : c.x}
              y={c.side === "middle" ? c.y - 6 : c.y + 1.5}
              fontSize="6.5"
              fill="#6B7491"
              textAnchor={c.side === "right" ? "start" : c.side === "left" ? "end" : "middle"}
              fontFamily="Inter,sans-serif"
            >
              {c.name}
            </text>
          </g>
        ))}

        {/* KumpaX HQ — Sénégal */}
        <circle className="map-ping" cx={kx} cy={ky} r="2" fill="none" stroke="#1234B0" strokeWidth="1" />
        <circle cx={kx} cy={ky} r="18" fill="#1234B0" fillOpacity="0.07" />
        <circle cx={kx} cy={ky} r="10" fill="#1234B0" fillOpacity="0.13" />
        <circle cx={kx} cy={ky} r="5"  fill="#1234B0" />
        <circle cx={kx} cy={ky} r="2"  fill="white" />

        {/* Label chip — placed above the dot (HQ sits near the top-left of the canvas) */}
        <rect x="22" y="20" width="62" height="14" rx="3.5" fill="white" fillOpacity="0.92" />
        <text x="53" y="30.5" fontSize="6.8" fill="#1234B0" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="600">
          {t.hqLabel}
        </text>
      </svg>

      {/* Floating stat cards */}
      <div className="absolute top-6 right-6 bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-gray-100 pointer-events-none">
        <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{t.presenceLabel}</div>
        <div className="text-lg font-bold text-[#080C1E]" style={{ fontFamily: "var(--font-ui)" }}>{t.presenceValue}</div>
      </div>
      <div className="absolute bottom-16 left-6 bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-gray-100 pointer-events-none">
        <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{t.companiesLabel}</div>
        <div className="text-lg font-bold text-[#1234B0]" style={{ fontFamily: "var(--font-ui)" }}>{t.companiesValue}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCROLL REVEAL
// Fades a block in + slight translate-y when it enters the viewport.
// Native IntersectionObserver, no animation library. Respects
// prefers-reduced-motion by skipping the observer and showing content immediately.
// ─────────────────────────────────────────────

function Reveal({
  children,
  className = "",
  delayMs = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms`, ...style } : style}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// ANIMATED STAT
// Counts up from 0 to its target value once the stat enters the viewport
// (native IntersectionObserver + requestAnimationFrame, ease-out, no library).
// Respects prefers-reduced-motion by showing the final value immediately.
// ─────────────────────────────────────────────

function AnimatedStat({
  icon: Icon,
  value,
  suffix = "",
  label,
  duration = 1000,
}: {
  icon: ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) * (1 - progress); // ease-out quad
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center gap-3">
      <div className="w-11 h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div
        className="text-4xl md:text-5xl font-bold text-primary-foreground tabular-nums"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {display}
        {suffix}
      </div>
      <div className="text-primary-foreground/60 text-sm">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SEAM BANNER
// Oblique typographic divider between two stacked segments — a full-width
// band, rotated a few degrees, with a very slow (~150-190s desktop, ~120s
// mobile — see .seam-marquee-track in tailwind.css) marquee announcing the
// segment coming up next. A second, lighter band sits offset behind it for
// a stacked-material feel rather than a flat tilted rectangle. Purely
// decorative (the same content is reachable via normal page flow / nav), so
// hidden from the accessibility tree.
// ─────────────────────────────────────────────

function SeamBanner({
  style,
  keywords,
  heightPx = 134,
  glueBottomColor,
}: {
  style: (typeof SEAM_STYLES)[number];
  keywords: readonly string[];
  /** Container height — the ribbon/echo keep their own fixed offsets from the
   * top, so shrinking this trims trailing space at the *bottom* only,
   * pulling the following section up flush against the banner. */
  heightPx?: number;
  /**
   * A rotated band doesn't sit at a uniform height across its width — one
   * side lifts, the other dips (roughly ± halfWidth·sin(angle) px). At the
   * lifted side it can fall short of the container's bottom edge, exposing
   * a sliver of page background before the next section starts, even
   * though the container itself is flush (0px layout gap). Passing the
   * next section's own background here paints a flat (unrotated) safety
   * fill behind the ribbon so any such sliver is invisible — matches the
   * colour it would be covering anyway, regardless of viewport width.
   */
  glueBottomColor?: string;
}) {
  const items: string[] = [];
  for (let rep = 0; rep < 6; rep++) {
    keywords.forEach((k) => {
      items.push(k);
      items.push("◆");
    });
  }

  const phrase = (hidden: boolean) => (
    <div
      className={`flex items-center gap-[34px] pr-[34px] whitespace-nowrap font-semibold text-[15px] tracking-[0.16em] uppercase ${hidden ? "seam-marquee-duplicate" : ""}`}
      style={{ fontFamily: "var(--font-ui)" }}
      aria-hidden={hidden || undefined}
    >
      {items.map((item, idx) =>
        item === "◆" ? (
          <span key={idx} style={{ color: style.diamondColor }}>◆</span>
        ) : (
          <span key={idx} style={{ color: style.textColor }}>{item}</span>
        )
      )}
    </div>
  );

  return (
    <div className="relative overflow-hidden" style={{ height: heightPx }} aria-hidden="true">
      {glueBottomColor && (
        <div className="absolute inset-x-0 bottom-0" style={{ height: 60, background: glueBottomColor }} />
      )}
      {/* Echo layer — a second, lighter band offset behind the main one */}
      <div
        className="absolute left-[-3%] right-[-3%]"
        style={{ top: 70, height: 26, background: "#B9C0D6", transform: `rotate(${style.angle}deg)` }}
      />
      <div
        className="absolute left-[-3%] right-[-3%] overflow-hidden py-4"
        style={{
          top: 32,
          background: style.background,
          transform: `rotate(${style.angle}deg)`,
          boxShadow: "0 18px 34px -20px rgba(8,12,30,.5)",
        }}
      >
        <div className={`flex w-max items-center seam-marquee-track ${style.durationClass}`}>
          {phrase(false)}
          {phrase(true)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────

export default function App() {
  const { locale, setLocale, t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ nom: "", entreprise: "", email: "", telephone: "", sujet: "", message: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const testimonialsTrackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollTestimonialsPrev, setCanScrollTestimonialsPrev] = useState(false);
  const [canScrollTestimonialsNext, setCanScrollTestimonialsNext] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Carrousel Témoignages : défilement horizontal natif (scroll-snap) plutôt
  // qu'un slider à index géré en JS — s'adapte sans calcul à n'importe quel
  // nombre de témoignages (jusqu'à 10 prévus, voir CLAUDE.md) et au swipe
  // tactile gratuitement. Les flèches ne font que déclencher un scrollBy.
  const updateTestimonialsScrollState = () => {
    const el = testimonialsTrackRef.current;
    if (!el) return;
    setCanScrollTestimonialsPrev(el.scrollLeft > 4);
    setCanScrollTestimonialsNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateTestimonialsScrollState();
    window.addEventListener("resize", updateTestimonialsScrollState);
    return () => window.removeEventListener("resize", updateTestimonialsScrollState);
  }, []);

  const scrollTestimonials = (direction: 1 | -1) => {
    const el = testimonialsTrackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = 24; // gap-6
    const amount = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) {
      // Honeypot rempli : probable bot. On simule un succès sans rien
      // envoyer à web3forms, plutôt que de révéler que la soumission a été
      // détectée comme spam.
      setSubmitted(true);
      return;
    }
    setSubmitError(null);
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nouveau message depuis kumpax.com — ${form.sujet || "Contact"}`,
          from_name: form.nom,
          nom: form.nom,
          entreprise: form.entreprise,
          email: form.email,
          telephone: form.telephone,
          sujet: form.sujet,
          message: form.message,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!data?.success) {
        console.error("web3forms submission failed", data);
        setSubmitError(t.contact.form.errorGeneric);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(t.contact.form.errorNetwork);
    } finally {
      setSending(false);
    }
  };

  const products = PRODUCTS_BASE.map((p) => ({ ...p, ...t.solutions.products[p.id] }));

  const mockUIs = [
    <StoreMockUI key="store" t={t.solutions.mockUi.store} />,
    <VisitAppMockUI key="visit" t={t.solutions.mockUi.visitapp} />,
    <MaxImmoMockUI key="immo" t={t.solutions.mockUi.maximmo} />,
    <KumpaCardMockUI key="card" t={t.solutions.mockUi.kumpacard} />,
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-sm" : "bg-white border-b border-black/[0.06]"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {NAV_HREFS.map((href, i) => (
              <a key={href} href={href} className="text-sm font-medium text-foreground/55 hover:text-foreground transition-colors">
                {t.nav.links[i]}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <LangSwitch locale={locale} setLocale={setLocale} t={t.langSwitcher} />
            <button className="text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-colors">
              {t.nav.login}
            </button>
            <a href="#contact" className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-[#0F2A90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] transition-colors">
              {t.nav.contact}
            </a>
          </div>
          <button className="md:hidden p-2 rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none" onClick={() => setMenuOpen(!menuOpen)} aria-label={t.nav.menuToggle}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-black/10 px-6 py-4 space-y-1">
            {NAV_HREFS.map((href, i) => (
              <a key={href} href={href} className="block text-sm text-foreground/70 hover:text-foreground font-medium py-2.5 transition-colors" onClick={() => setMenuOpen(false)}>
                {t.nav.links[i]}
              </a>
            ))}
            <div className="pt-2">
              <LangSwitch locale={locale} setLocale={setLocale} t={t.langSwitcher} />
            </div>
            <a href="#contact" className="block w-full mt-2 text-sm font-semibold px-4 py-3 rounded-xl bg-primary text-white text-center">
              {t.nav.contact}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── Clean, professional B2B split layout ── */}
      <section id="accueil" className="relative pt-20 bg-white overflow-hidden">
        <AfricaBackdrop />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-stretch min-h-[88vh]">

          {/* LEFT: Content */}
          <div className="flex-1 flex flex-col justify-center py-16 lg:py-20 lg:pr-16 max-w-xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-8 bg-primary" />
              <span className="text-primary text-xs font-semibold uppercase tracking-[0.14em]">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-6"
            >
              {t.hero.headline}{" "}
              <span className="text-primary">{t.hero.headlineAccent}</span>
            </h1>

            {/* Subtext */}
            <p className="text-[#4B5163] text-base md:text-lg leading-relaxed mb-9">
              {t.hero.subtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0F2A90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] transition-colors text-sm shadow-lg shadow-primary/20"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-primary/25 text-primary font-medium px-6 py-3.5 rounded-xl hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] transition-colors text-sm"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-0 border-t border-gray-100 pt-8">
              {t.hero.stats.map((s, i) => (
                <div key={s.label} className={`flex flex-col flex-1 ${i < t.hero.stats.length - 1 ? "border-r border-gray-100 pr-5 mr-5" : ""}`}>
                  <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-ui)" }}>{s.value}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Africa map visual */}
          <div className="flex-1 relative self-stretch min-h-[380px] lg:min-h-0">
            <AfricaMapVisual t={t.hero.map} />
          </div>
        </div>
      </section>

      {/* ── POUR KUMPAX ── Section de confiance : présente l'entreprise avant les produits ── */}
      <section id="pour-kumpax" className="bg-background">
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-wider">
              {t.trust.badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight"
            >
              {t.trust.title}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              {t.trust.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.trust.points.map((point, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <Reveal
                  key={point.title}
                  delayMs={i * 150}
                  className="bg-card border border-border rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3
                    className="text-foreground font-semibold text-base mb-2"
                  >
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{point.tagline}</p>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ── NOTRE APPROCHE ── Timeline horizontale (desktop) / verticale (mobile) ── */}
      <section id="approche" className="bg-background">
        <Reveal className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-wider">
              {t.approach.badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight max-w-2xl mx-auto leading-tight"
            >
              {t.approach.title}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              {t.approach.intro}
            </p>
          </div>

          {/* Desktop (lg+) : timeline horizontale */}
          <div className="hidden lg:block relative">
            <div
              className="approach-line-h absolute top-7 left-[8.333%] right-[8.333%] h-0.5"
              style={{ background: "linear-gradient(to right, var(--primary), var(--turquoise))" }}
            />
            <div className="grid grid-cols-6">
              {t.approach.steps.map((step, i) => {
                const color = mixHex(APPROACH_GRADIENT_FROM, APPROACH_GRADIENT_TO, i / (t.approach.steps.length - 1));
                return (
                  <Reveal
                    key={step.title}
                    delayMs={i * 100}
                    className="relative z-10 flex flex-col items-center text-center px-3"
                  >
                    <div
                      className="w-14 h-14 rounded-full bg-card border-2 flex items-center justify-center font-bold text-lg mb-4 flex-shrink-0"
                      style={{ borderColor: color, color }}
                    >
                      {i + 1}
                    </div>
                    <div className="font-semibold text-foreground text-sm mb-1.5">{step.title}</div>
                    <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed">{step.description}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Mobile / tablette (< lg) : timeline verticale */}
          <div className="lg:hidden relative">
            <div
              className="approach-line-v absolute top-5 bottom-5"
              style={{ left: "19px", width: "2px", background: "linear-gradient(to bottom, var(--primary), var(--turquoise))" }}
            />
            <div className="space-y-8">
              {t.approach.steps.map((step, i) => {
                const color = mixHex(APPROACH_GRADIENT_FROM, APPROACH_GRADIENT_TO, i / (t.approach.steps.length - 1));
                return (
                  <Reveal key={step.title} delayMs={i * 100} className="relative z-10 flex items-start gap-5">
                    <div
                      className="w-10 h-10 rounded-full bg-card border-2 flex items-center justify-center font-bold flex-shrink-0"
                      style={{ borderColor: color, color }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-1.5">
                      <div className="font-semibold text-foreground text-base mb-1">{step.title}</div>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{step.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── SOLUTIONS ── */}
      <section id="solutions">
        <Reveal className="text-center pt-24 pb-16 bg-white px-6">
          <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-wider">
            {t.solutions.badge}
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight max-w-2xl mx-auto leading-tight"
          >
            {t.solutions.titlePrefix}{" "}
            <span className="text-primary">{t.solutions.titleAccent}</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {t.solutions.intro}
          </p>
        </Reveal>

        {products.map((product, i) => {
          const Icon = product.icon;
          const isReverse = i % 2 === 1;
          return (
            <Fragment key={product.id}>
            <div className={`py-20 ${i % 2 === 0 ? "bg-white" : "bg-background"}`}>
              <Reveal className={`max-w-7xl mx-auto px-6 lg:px-10 flex flex-col ${isReverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16`}>
                <div className="flex-1 min-w-0">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold mb-5"
                    style={{ background: `${product.color}13`, color: product.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {product.name}
                  </div>
                  <h3
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight"
                  >
                    {product.tagline}
                  </h3>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-7">{product.description}</p>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${product.color}15` }}>
                          <Check className="w-3 h-3" style={{ color: product.color }} />
                        </div>
                        <span className="text-gray-600 text-sm md:text-base">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-8">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t.solutions.useCaseLabel} · </span>
                    <span className="text-gray-500 text-sm">{product.useCase}</span>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-xl text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 active:scale-[0.98]"
                    style={{ background: product.color, boxShadow: `0 4px 20px ${product.color}30` }}
                  >
                    {t.solutions.ctaLabel}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0 w-full transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.01]">{mockUIs[i]}</div>
              </Reveal>
            </div>
            {i < products.length - 1 && (
              <SeamBanner style={SEAM_STYLES[i]} keywords={t.seams[i].keywords} />
            )}
            </Fragment>
          );
        })}
      </section>

      {/* ── DOMAINES D'EXPERTISE ── */}
      <section id="expertise" className="bg-white">
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-wider">
              {t.expertise.badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight"
            >
              {t.expertise.title}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              {t.expertise.intro}
            </p>
          </div>

          {/* Bloc 1 — Développement & langages */}
          <div className="mb-14">
            <h3
              className="text-lg md:text-xl font-bold text-foreground mb-6"
            >
              {t.expertise.devTitle}
            </h3>
            <div className="marquee-mask relative overflow-hidden">
              <div className="marquee-track flex w-max items-center gap-12">
                {[...DEV_SKILLS, ...DEV_SKILLS].map((skill, i) => {
                  const Icon = skill.Icon;
                  const isDuplicate = i >= DEV_SKILLS.length;
                  return (
                    <div
                      key={`${skill.name}-${i}`}
                      className={`flex flex-shrink-0 items-center gap-3 ${isDuplicate ? "marquee-duplicate" : ""}`}
                      aria-hidden={isDuplicate || undefined}
                    >
                      <Icon className="w-7 h-7" style={{ color: skill.color }} />
                      <span className="whitespace-nowrap text-sm font-medium text-foreground">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Blocs 2 & 3 — Science des données & IA / Collecte de données */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.expertise.domains.map((domain, i) => {
              const Icon = DOMAIN_ICONS[i];
              return (
                <Reveal
                  key={domain.title}
                  delayMs={i * 100}
                  className="bg-muted border border-border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3
                    className="text-foreground font-bold text-lg mb-2.5"
                  >
                    {domain.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{domain.description}</p>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>

      <SeamBanner style={SEAM_STYLES[3]} keywords={t.seams[3].keywords} heightPx={96} glueBottomColor="#080C1E" />

      {/* ── ODOO / SERVICES ── Fond noir, texte couleurs charte Odoo ── */}
      <section id="services" className="py-24 bg-foreground">
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2.5 bg-white/[0.06] border border-white/10 text-white/50 rounded-full px-5 py-2 mb-6 text-xs font-semibold uppercase tracking-wider">
              <div className="w-5 h-5 rounded flex items-center justify-center font-black text-white text-[7px] flex-shrink-0" style={{ background: "#714B67" }}>
                Odoo
              </div>
              {t.odoo.badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight"
            >
              {t.odoo.titlePrefix}{" "}
              <span style={{ color: "#875A7B" }}>{t.odoo.titleAccent}</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-white/45">
              {t.odoo.intro}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-14">
            {/* Services */}
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider mb-5 font-semibold text-white/30">
                {t.odoo.servicesLabel}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {t.odoo.services.map((label, i) => {
                  const Icon = ODOO_SERVICE_ICONS[i];
                  return (
                    <div
                      key={label}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex flex-col items-center gap-2 text-center cursor-default hover:bg-white/[0.07] transition-colors"
                    >
                      <Icon className="w-5 h-5" style={{ color: "#875A7B" }} />
                      <span className="text-xs font-medium" style={{ color: "#B07A9E" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
              {/* Odoo mark badge */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white text-[10px] leading-tight text-center" style={{ background: "#714B67" }}>
                  Odoo
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">{t.odoo.badgeTitle}</div>
                  <div className="text-sm leading-relaxed text-white/40">
                    {t.odoo.badgeDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider mb-5 font-semibold text-white/30">
                {t.odoo.modulesLabel}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {t.odoo.modules.map((name, i) => {
                  const Icon = ODOO_MODULE_ICONS[i];
                  return (
                    <div
                      key={name}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3.5 hover:bg-white/[0.07] transition-colors cursor-default"
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: "#875A7B" }} />
                      <div className="text-xs font-semibold" style={{ color: "#B07A9E" }}>{name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Process steps — horizontal, pleine largeur */}
          <div className="mt-14 pt-14 border-t border-white/[0.08]">
            <div className="text-[11px] uppercase tracking-wider mb-8 font-semibold text-white/30 text-center">
              {t.odoo.approachLabel}
            </div>
            <div className="relative">
              <div
                className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-px"
                style={{ background: "rgba(135,90,123,0.35)" }}
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {t.odoo.steps.map((step, i) => (
                  <Reveal key={step} delayMs={i * 100} className="relative z-10 flex flex-col items-center text-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-foreground border flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: "#875A7B" }}
                    >
                      <span className="text-xs font-bold" style={{ color: "#875A7B" }}>{i + 1}</span>
                    </div>
                    <span className="text-sm text-white/45 leading-snug">{step}</span>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── IMPACT / CHIFFRES CLÉS ── */}
      <section id="impact" className="bg-primary">
        <Reveal className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-wider">
              {t.impact.badge}
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight"
            >
              {t.impact.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6">
            {t.impact.stats.map((stat, i) => (
              <Reveal key={stat.label} delayMs={i * 80}>
                <AnimatedStat
                  icon={IMPACT_ICONS_VALUES[i].icon}
                  value={IMPACT_ICONS_VALUES[i].value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── TÉMOIGNAGES ── voir src/i18n/{fr,en}.ts ── */}
      <section id="temoignages" className="bg-white">
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-wider">
              {t.testimonials.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
              {t.testimonials.title}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              {t.testimonials.intro}
            </p>
          </div>

          <div className="relative">
            <div
              ref={testimonialsTrackRef}
              onScroll={updateTestimonialsScrollState}
              className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
            >
              {t.testimonials.items.map((item, i) => (
                <Reveal
                  key={i}
                  delayMs={Math.min(i, 5) * 120}
                  className="testimonial-card snap-start shrink-0 w-[85%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] bg-card border border-border rounded-2xl p-7 flex flex-col gap-5"
                  style={{ "--tilt": `${TESTIMONIAL_TILTS[i % TESTIMONIAL_TILTS.length]}deg` } as React.CSSProperties}
                >
                  <Quote className="w-8 h-8 text-primary/25 flex-shrink-0" />
                  <p className="text-foreground text-sm md:text-base leading-relaxed flex-1 whitespace-pre-line">
                    {item.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-foreground font-semibold text-sm">{item.author}</div>
                      <div className="text-muted-foreground text-xs">{item.role} · {item.company}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {t.testimonials.items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollTestimonials(-1)}
                  disabled={!canScrollTestimonialsPrev}
                  aria-label={t.testimonials.prevAriaLabel}
                  className="absolute top-1/2 left-1 lg:-left-5 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-foreground hover:bg-secondary hover:text-primary disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.96] transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTestimonials(1)}
                  disabled={!canScrollTestimonialsNext}
                  aria-label={t.testimonials.nextAriaLabel}
                  className="absolute top-1/2 right-1 lg:-right-5 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-foreground hover:bg-secondary hover:text-primary disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.96] transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT SECTION — "Parlons de votre projet" ── */}
      <section id="contact" className="py-24 bg-background">
        <Reveal className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* Left: Info */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-px w-6 bg-primary" />
                <span className="text-primary text-xs font-semibold uppercase tracking-[0.14em]">{t.contact.badge}</span>
              </div>
              <h2
                className="text-4xl font-bold text-foreground leading-tight mb-4"
              >
                {t.contact.title}
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
                {t.contact.intro}{" "}
                <span className="bg-turquoise/25 rounded px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                  {t.contact.introHighlight}
                </span>
              </p>

              <div className="space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">{t.contact.addressLabel}</div>
                  <div className="text-foreground font-medium text-sm">{t.contact.addressValue}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">{t.contact.phoneLabel}</div>
                  {/* TODO: remplacer par le vrai numéro de téléphone KumpaX (Sénégal) avant mise en production */}
                  <div className="text-foreground font-medium text-sm">{t.contact.phoneValue}</div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">{t.contact.addressLabel2}</div>
                  {/* TODO: remplacer par la vraie ville du bureau gambien avant mise en production */}
                  <div className="text-foreground font-medium text-sm">{t.contact.addressValue2}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">{t.contact.phoneLabel2}</div>
                  {/* TODO: remplacer par le vrai numéro de téléphone KumpaX (Gambie) avant mise en production */}
                  <div className="text-foreground font-medium text-sm">{t.contact.phoneValue2}</div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">{t.contact.emailLabel}</div>
                  <div className="text-primary font-medium text-sm">{t.contact.emailValue}</div>
                </div>
              </div>
            </div>

            {/* Right: Form card */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {t.contact.success.title}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      {t.contact.success.message}
                    </p>
                    <button
                      className="mt-6 text-sm text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => { setSubmitted(false); setSubmitError(null); setForm({ nom: "", entreprise: "", email: "", telephone: "", sujet: "", message: "", website: "" }); }}
                    >
                      {t.contact.success.again}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot anti-spam : invisible pour un humain (hors écran, pas
                        display:none pour rester "vu" par les bots qui l'ignoreraient
                        sinon), ignoré des lecteurs d'écran et du parcours clavier. Un
                        champ rempli ici fait échouer silencieusement l'envoi côté
                        client (handleSubmit) — rien n'est envoyé à web3forms. */}
                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] w-px h-px opacity-0"
                    />
                    {submitError && (
                      <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder={t.contact.form.namePlaceholder}
                          value={form.nom}
                          onChange={(e) => setForm({ ...form, nom: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-input-background"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder={t.contact.form.companyPlaceholder}
                          value={form.entreprise}
                          onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-input-background"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="email"
                        placeholder={t.contact.form.emailPlaceholder}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-input-background"
                      />
                      <input
                        type="tel"
                        placeholder={t.contact.form.phonePlaceholder}
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-input-background"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder={t.contact.form.subjectPlaceholder}
                      value={form.sujet}
                      onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-input-background"
                    />
                    <textarea
                      placeholder={t.contact.form.messagePlaceholder}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-input-background resize-none"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      aria-busy={sending}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-4 rounded-xl hover:bg-[#0F2A90] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-colors text-sm shadow-lg shadow-primary/20"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.contact.form.submitSending}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t.contact.form.submitIdle}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <Logo light />
              <p className="text-white/30 text-sm mt-4 leading-relaxed max-w-xs">
                {t.footer.tagline}
              </p>
              <div className="flex items-center gap-2.5 mt-6">
                <a
                  href="mailto:contact@kumpax.com"
                  className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
                  aria-label={t.aria.email}
                >
                  <Mail className="w-4 h-4 text-white/45" />
                </a>
                {/* TODO: remplacer par le vrai lien WhatsApp (wa.me/<numéro>) avant mise en production */}
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
                  aria-label={t.aria.whatsapp}
                >
                  <FaWhatsapp className="w-4 h-4 text-white/45" />
                </a>
                {/* TODO: remplacer par le vrai lien Instagram avant mise en production */}
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
                  aria-label={t.aria.instagram}
                >
                  <FaInstagram className="w-4 h-4 text-white/45" />
                </a>
                {/* TODO: remplacer par le vrai lien Facebook avant mise en production */}
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
                  aria-label={t.aria.facebook}
                >
                  <FaFacebook className="w-4 h-4 text-white/45" />
                </a>
              </div>
            </div>
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-5">{t.footer.productsLabel}</div>
              <ul className="space-y-3">
                {t.footer.products.map((p) => (
                  <li key={p}>
                    <a href="#solutions" className="text-white/35 text-sm hover:text-white/65 transition-colors">{p}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-5">{t.footer.servicesLabel}</div>
              <ul className="space-y-3">
                {t.footer.services.map((s) => (
                  <li key={s}>
                    <a href="#services" className="text-white/35 text-sm hover:text-white/65 transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-5">{t.footer.contactLabel}</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-white/35 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />{t.contact.emailValue}
                </li>
                {/* TODO: remplacer par le vrai numéro de téléphone KumpaX avant mise en production */}
                <li className="flex items-center gap-2.5 text-white/35 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />{t.contact.phoneValue}
                </li>
                <li className="flex items-center gap-2.5 text-white/35 text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" />{t.footer.site}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.07] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-xs">© {new Date().getFullYear()} KumpaX. {t.footer.copyright}</p>
            <div className="flex gap-6">
              {t.footer.legal.map((l) => (
                <a key={l} href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
