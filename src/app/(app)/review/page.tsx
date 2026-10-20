"use client";

import { rpc } from "@/lib/supabase";
import { useRpcData } from "@/lib/use-rpc-data";
import { AUDIENCE_TEXT, fmtTime } from "@/lib/format";
import type { ReviewRow } from "@/lib/types";
import { ErrorCard, PageHead, Skel } from "@/components/visuals";

export default function ReviewPage() {
  const { data: rows, error, updated, reload } = useRpcData<ReviewRow[]>(() => rpc("get_review_queue"), "review");
  if (error) return <ErrorCard message={error} onRetry={reload} />;
  if (!rows) {
    return (
      <div aria-busy="true">
        <span className="sr-only" role="status">Loading</span>
        <Skel w={220} h={30} />
        <div className="panel mt">{[0, 1, 2].map((i) => <Skel key={i} h={44} style={{ marginBottom: 10 }} />)}</div>
      </div>
    );
  }

  return (
    <>
      <PageHead title="Review queue" info="review.about" sub="Answers that failed validation. They are kept, not counted, until fixed."
        updated={updated} onRefresh={reload} fmt={fmtTime} />
      <section className="panel">
        {rows.length ? (
          <div className="table-box">
            <table>
              <thead>
                <tr><th>Received</th><th>Form</th><th>Language</th><th>Company code entered</th><th>Reason</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.response_id}>
                    <td>{new Date(r.submitted_at).toLocaleString("en-GB")}</td>
                    <td>{AUDIENCE_TEXT[r.audience] || r.audience}</td>
                    <td>{r.language || ""}</td>
                    <td><strong>{r.company_code_entered || "(empty)"}</strong></td>
                    <td>
                      <span className="chip chip-bad">{r.reason_code}</span>
                      <div className="small muted" style={{ marginTop: 4 }}>{r.reason}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="state">
            <h2>Nothing to review</h2>
            <p className="muted">All answers passed validation.</p>
          </div>
        )}
      </section>
    </>
  );
}
