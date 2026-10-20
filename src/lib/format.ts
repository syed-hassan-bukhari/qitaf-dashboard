import type { ActionRow, Role } from "./types";

// One neutral blue-teal scale: the shade only reflects the value (darker = higher). No good/bad colours.
const SHADE_LIGHT = [169, 214, 229];
const SHADE_DEEP = [22, 78, 112];
const shadeAt = (s: number) => {
  const t = Math.min(Math.max((s - 1) / 4, 0), 1);
  const [r, g, b] = SHADE_LIGHT.map((c, i) => Math.round(c + (SHADE_DEEP[i] - c) * t));
  return { t, bg: `rgb(${r}, ${g}, ${b})` };
};

export const scoreColor = (s: number) => shadeAt(s).bg;

// [background, text] for a tile or heatmap cell. Text flips to light on the darker shades.
export const tileColors = (s: number): [string, string] => {
  const { t, bg } = shadeAt(s);
  return [bg, t > 0.45 ? "#F2FAFC" : "#0B2A38"];
};

// The confidentiality threshold comes from the database per survey round; 10 only if it is missing.
export const DEFAULT_MIN_RESPONSES = 10;
export const minResponses = (v: number | null | undefined) =>
  typeof v === "number" && v > 0 ? v : DEFAULT_MIN_RESPONSES;
export const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const isOverdue = (a: ActionRow) =>
  a.status !== "Closed" && !!a.due_date && new Date(a.due_date) < new Date();

export const CODE_TEXT: Record<string, string> = {
  SOME_LESS: "Somewhat less time", MUCH_LESS: "Much less time", NO_CHANGE: "No change",
  SOME_MORE: "Somewhat more time", MUCH_MORE: "Much more time", NOT_APPLICABLE: "Not applicable",
  ONBOARDING: "Onboarding", ALLOCATION: "Points allocation", REDEMPTION: "Redemption issues",
  REPORT: "Reporting", INVOICING: "Invoicing", SUPPORT: "Support", OTHER: "Other", NONE: "None",
  EXPANDING: "Already expanding", PLANNED: "Expansion planned", POSSIBLE: "Possible, not planned",
  DONT_KNOW: "Does not know", FILE: "File-based process", PAYROLL: "Payroll system",
  NO_SUPPORT: "No support needed", NOT_DECIDER: "Not involved in decision",
  TOO_EARLY: "Too early to say", NO_REPORTS: "No reports available",
  DUP: "Duplicate allocations", MISMATCH: "Records do not match",
};

export const BARRIER_TEXT: Record<string, string> = {
  MERCHANT: "Merchant issue", TERMS: "Terms unclear", TECH: "Technical problem", SAVE: "Saving points",
};

export const AUDIENCE_TEXT: Record<string, string> = { A: "Employee", B: "HR", C: "Finance", D: "IT" };

export const ITEM_COLS: [string, string][] = [
  ["A07", "Appreciated"], ["A09", "Reward exp."], ["A06", "Usefulness"],
  ["A05", "Merchants"], ["A03", "Ease"], ["A01", "Clarity"],
];

export const NAV: Record<Role, { href: string; label: string }[]> = {
  ADMIN: [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/company", label: "Company results" },
    { href: "/stc", label: "STC view" },
    { href: "/review", label: "Review queue" },
  ],
  COMPANY_HR: [{ href: "/company", label: "Our results" }],
  STC: [{ href: "/stc", label: "Program overview" }],
};

export const homeFor = (role: Role) => NAV[role][0].href;
