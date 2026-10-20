"use client";

import { BARRIER_TEXT, CODE_TEXT, scoreColor, tileColors } from "@/lib/format";
import type { CompanyDashboard, OrgItem } from "@/lib/types";
import {
  ActionsList, AnimatedNumber, Blocks, FlashPanel, FunnelChart, Kpi, OrgChip, Ring, ScoreDots, StateCard,
} from "./visuals";
import { Tip } from "./tip";

const isScoreTile = (i: OrgItem) => i.score !== null && String(i.value ?? "").startsWith("SCORE_");
const orgText = (i: OrgItem) => (i.value ?? "").split(", ").map((c) => CODE_TEXT[c] || c).join(", ");

export function CompanyView({ d }: { d: CompanyDashboard }) {
  const k = d.kpi;
  const f = d.funnel;
  // Items arrive sorted best -> worst with hidden last, so the lowest visible one is the last visible one.
  const lowest = [...d.items].reverse().find((i) => i.score !== null);
  const redeemedAll = f && f.received ? Math.round((f.succeeded / f.received) * 100) : null;
  const tiles = d.org.items.filter(isScoreTile);
  const others = d.org.items.filter((i) => !isScoreTile(i));

  return (
    <>
      {d.status !== "REPORTABLE" || !f ? (
        <StateCard title={d.status === "NO_RESPONSES" ? "No employee answers yet" : "Results are hidden to protect privacy"}>
          <p className="muted">
            {d.status === "NO_RESPONSES"
              ? "No employee answers yet. Results will appear once at least 10 employees have answered."
              : `${k.responded} employees have answered. Results appear at 10 answers, so no individual can be identified.`}
          </p>
          <div className="progress" role="progressbar" aria-label="Answers toward the 10 needed"
            aria-valuemin={0} aria-valuemax={10} aria-valuenow={Math.min(k.responded, 10)}>
            <i style={{ width: `${Math.min(k.responded / 10, 1) * 100}%` }} />
          </div>
          <p className="small muted" style={{ marginTop: 8 }}>{k.responded} of 10 answers needed</p>
        </StateCard>
      ) : (
        <>
          <section className="grid-row">
            <FlashPanel className="grow-2 hero" watch={k.csat}>
              {k.csat !== null ? <Ring pct={k.csat} /> : null}
              <div>
                <div className="kpi-label">Employees satisfied</div>
                <div style={{ marginTop: 8 }}>{k.csat_favorable} of {k.csat_n} rated their overall experience 4 or 5</div>
              </div>
            </FlashPanel>
            <Kpi
              label="Response rate"
              value={k.response_rate !== null ? <AnimatedNumber value={k.response_rate} suffix="%" /> : "—"}
              watch={k.response_rate}
              note={k.response_rate !== null ? `${k.responded} of ${k.invited} invited` : `${k.responded} answers; invited count not confirmed`}
            >
              {k.response_rate !== null ? <Blocks pct={k.response_rate} /> : null}
            </Kpi>
            <Kpi
              label="Redeemed successfully"
              value={redeemedAll !== null ? <AnimatedNumber value={redeemedAll} suffix="%" /> : "—"}
              watch={redeemedAll}
              note={`${f.succeeded} of ${f.received} who received points`}
            >
              {f.success_among_tried != null ? (
                <div className="small" style={{ color: "var(--accent)", marginTop: 12, fontWeight: 600 }}>
                  {f.success_among_tried}% of those who tried
                </div>
              ) : null}
            </Kpi>
            {lowest && lowest.score !== null ? (
              <Kpi label="Lowest score" value={<AnimatedNumber value={lowest.score} decimals={1} />} watch={lowest.score}
                note={lowest.label} color={scoreColor(lowest.score)} />
            ) : null}
          </section>

          <section className="grid-row mt">
            <div className="panel grow-3">
              <h2>Experience scores</h2>
              <p className="section-sub">Average from 1 to 5. The dashed line marks 4.0.</p>
              <ScoreDots items={d.items} />
            </div>
            <div className="panel grow-2">
              <h2>Redemption journey</h2>
              <p className="section-sub">What employees told us, not verified STC transactions.</p>
              <FunnelChart f={f} />
              <div className="note">
                {Array.isArray(d.barriers)
                  ? "Main reasons for not redeeming: " + d.barriers.map((b) => `${BARRIER_TEXT[b.reason] || b.reason} (${b.count})`).join(", ")
                  : `Reasons for not redeeming are hidden: ${d.barriers ? d.barriers.n : 0} answers, under 10.`}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="panel mt">
        <div className="page-head" style={{ marginBottom: 14 }}>
          <h2>HR and IT assessment</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span className="small muted">HR</span><OrgChip status={d.org.hr_status} />
            <span className="small muted">IT</span><OrgChip status={d.org.it_status} />
            <span className="small muted">Finance</span><OrgChip status={d.org.finance_status} />
          </div>
        </div>
        {tiles.length ? (
          <div className="tiles">
            {tiles.map((t) => {
              const [bg, fg] = tileColors(t.score as number);
              return (
                <Tip key={t.code} className="tile" style={{ background: bg, color: fg }}
                  text={`${t.group} assessment, ${t.label}: ${t.score} out of 5`}>
                  <div className="t-label">{t.group}: {t.label}</div>
                  <div className="t-val">{t.score} / 5</div>
                </Tip>
              );
            })}
          </div>
        ) : <p className="muted">No HR or IT assessment submitted yet.</p>}
        {others.length ? (
          <div className="note">
            {others.map((o) => (
              <div key={o.code}>{o.group}, {o.label}: <strong>{orgText(o)}</strong></div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="panel mt">
        <h2>Actions</h2>
        <p className="section-sub">What we agreed to do next.</p>
        <ActionsList list={d.actions} />
      </section>
      <p className="footer-note">
        Survey answers, not verified STC transactions. Employee results appear only with 10 or more answers per question.
        Trends appear after the second survey wave.
      </p>
    </>
  );
}
