"use client";

import { rpc } from "@/lib/supabase";
import { useRpcData } from "@/lib/use-rpc-data";
import { fmtTime } from "@/lib/format";
import type { StcOverview } from "@/lib/types";
import { InfoButton } from "@/components/info-button";
import {
  ActionsList, AnimatedNumber, Blocks, ErrorCard, FlashPanel, FunnelChart, H2, Kpi, PageHead, PageSkeleton, Ring, ScoreDots, StateCard,
} from "@/components/visuals";

export default function StcPage() {
  const { data: d, error, updated, reload } = useRpcData<StcOverview>(() => rpc("get_stc_overview"), "stc");
  if (error) return <ErrorCard message={error} onRetry={reload} />;
  if (!d) return <PageSkeleton />;

  const head = (
    <PageHead title="Program overview" info="stc.about" sub="Combined results across participating companies. Pilot data is excluded."
      updated={updated} onRefresh={reload} fmt={fmtTime} />
  );

  if (d.status !== "REPORTABLE") {
    return (
      <>
        {head}
        <StateCard title="Combined results are hidden">
          <p className="muted">{d.reason}. {d.participating} companies are taking part with {d.responses} valid responses so far.</p>
        </StateCard>
      </>
    );
  }

  const f = d.funnel;
  const redeemed = f.received ? Math.round((f.succeeded / f.received) * 100) : null;

  return (
    <>
      {head}
      <section className="grid-row">
        <FlashPanel className="grow-2 hero" watch={d.csat}>
          <Ring pct={d.csat} />
          <div>
            <div className="kpi-label">Employees satisfied<InfoButton id="company.satisfied" /></div>
            <div style={{ marginTop: 8 }}>Across {d.csat_n} employees in {d.reportable_companies} companies</div>
          </div>
        </FlashPanel>
        <Kpi label="Participating companies" info="stc.about" value={<AnimatedNumber value={d.participating} />} watch={d.participating}
          note={`${d.reportable_companies} companies with results available`} />
        <Kpi label="Response rate" info="stc.rate" value={d.response_rate !== null ? <AnimatedNumber value={d.response_rate} suffix="%" /> : "—"}
          watch={d.response_rate} note="Companies with a confirmed invited count">
          {d.response_rate !== null ? <Blocks pct={d.response_rate} /> : null}
        </Kpi>
        <Kpi label="Redeemed successfully" info="company.redeemed" value={redeemed !== null ? <AnimatedNumber value={redeemed} suffix="%" /> : "—"}
          watch={redeemed} note={`${f.succeeded} of ${f.received} who received points`} />
      </section>

      <section className="grid-row mt">
        <div className="panel grow-3">
          <H2 info="company.scores">Experience scores</H2>
          <p className="section-sub">Average from 1 (lowest) to 5 (highest).</p>
          <ScoreDots items={d.items} />
        </div>
        <div className="panel grow-2">
          <H2 info="company.journey">Redemption journey</H2>
          <p className="section-sub">Self-reported, not verified STC transactions.</p>
          <FunnelChart f={f} />
        </div>
      </section>

      <section className="panel mt">
        <H2 info="company.actions">Joint actions with STC</H2>
        <p className="section-sub">Agreed follow-up between Asalah and STC.</p>
        <ActionsList list={d.actions} />
      </section>
      <p className="footer-note">
        Survey answers, not verified STC transactions. Combined results appear only when at least 3 companies each have
        the minimum number of valid responses for their survey round. No company names are shown.
      </p>
    </>
  );
}
