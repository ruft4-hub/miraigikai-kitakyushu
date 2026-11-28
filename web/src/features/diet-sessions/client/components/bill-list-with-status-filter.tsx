"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompactBillCard } from "@/features/bills/client/components/bill-list/compact-bill-card";
import type { BillWithContent } from "@/features/bills/shared/types";
import {
  BILL_STATUS_GROUP_LABELS,
  BILL_STATUS_GROUPS,
  type BillStatusGroup,
  countByStatusGroup,
  filterByStatusGroup,
} from "@/features/bills/shared/utils/bill-status-group";
import { routes } from "@/lib/routes";

type Props = {
  bills: BillWithContent[];
};

export function BillListWithStatusFilter({ bills }: Props) {
  const [activeFilter, setActiveFilter] = useState<BillStatusGroup>("all");

  const counts = countByStatusGroup(bills);
  const filteredBills = filterByStatusGroup(bills, activeFilter);

  const filters = BILL_STATUS_GROUPS.map((key) => ({
    key,
    label: BILL_STATUS_GROUP_LABELS[key],
    count: counts[key],
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* フィルターボタン */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant="ghost"
            onClick={() => setActiveFilter(filter.key)}
            className={`h-[29px] px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              activeFilter === filter.key
                ? "bg-mirai-gradient text-black hover:bg-mirai-gradient"
                : "bg-mirai-surface-grouped text-mirai-text-muted hover:bg-mirai-surface-muted"
            }`}
          >
            {filter.label} {filter.count}
          </Button>
        ))}
      </div>

      {/* 議案リスト */}
      {filteredBills.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">
          該当する議案がありません
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredBills.map((bill) => (
            <Link key={bill.id} href={routes.billDetail(bill.id) as Route}>
              <CompactBillCard bill={bill} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
