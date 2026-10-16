import { IndianRupee } from "lucide-react";
import type { RegistrationFee } from "@/types";

export function FeeTable({ fees }: { fees: RegistrationFee[] }) {
  if (!fees?.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200/80">
      <table className="w-full text-sm">
        <thead className="bg-brand-50 text-left text-xs uppercase tracking-wide text-brand-800">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Category</th>
            <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {fees.map((fee, i) => (
            <tr key={i} className="transition-colors hover:bg-paper-50">
              <td className="px-4 py-3 text-ink-700">
                {fee.category}
                {fee.notes && <span className="mt-0.5 block text-xs text-ink-400">{fee.notes}</span>}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-ink-900">
                <span className="inline-flex items-center gap-0.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {fee.amount.toLocaleString("en-IN")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
