// src/modules/receipts/LayawaySection.tsx
import React from "react";
import type { Installment } from "@payvue/shared/types/sale";

interface LayawaySectionProps {
  installments: Installment[];
}

const formatCurrency = (v: number = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v);

export default function LayawaySection({ installments }: LayawaySectionProps) {
  return (
    <div className="mt-3 border-t border-dashed pt-1">
      <div className="font-bold mb-1 text-[11px]">Layaway Payments:</div>
      {installments.map((p, i) => (
        <div key={i} className="flex justify-between text-[11px]">
          <span>
            {p.method?.toUpperCase?.() ?? "METHOD"} —{" "}
            {p.paidAt
              ? new Date(p.paidAt).toLocaleDateString("en-US")
              : "—"}
          </span>
          <span>{formatCurrency(p.amount ?? 0)}</span>
        </div>
      ))}
    </div>
  );
}
