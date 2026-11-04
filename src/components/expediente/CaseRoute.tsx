"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaseGate } from "@/components/expediente/CaseGate";
import { CASE_DAY, isCaseOpenToday } from "@/data/caso002";

/** /caso-002: antes del 18 solo enseña cuánto falta; ese día, el caso. */
export function CaseRoute() {
  const router = useRouter();
  const [state, setState] = useState<{ open: boolean; days: number } | null>(null);
  useEffect(() => {
    const t = setTimeout(
      () => setState({ open: isCaseOpenToday(), days: Math.ceil((CASE_DAY.getTime() - Date.now()) / 86_400_000) }),
      0,
    );
    return () => clearTimeout(t);
  }, []);

  if (!state) return null;
  if (state.open) return <CaseGate onDone={() => router.push("/")} />;

  return (
    <div className="case">
      <section className="case-screen case-intro">
        <h1 className="case-huge">
          Caso
          <br />
          002
        </h1>
        <div className="case-intro-foot">
          <p className="case-lead">
            El expediente se abre el 18 de noviembre a las 00:00.{" "}
            {state.days === 1 ? "Falta 1 día." : `Faltan ${state.days} días.`}
          </p>
          <Link className="btn-solid case-btn" href="/">
            Volver
          </Link>
        </div>
      </section>
    </div>
  );
}
