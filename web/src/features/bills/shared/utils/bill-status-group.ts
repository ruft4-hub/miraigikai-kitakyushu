import type { BillStatusEnum } from "../types";

/** 地方議会向けの審議ステータス分類 */
export const BILL_STATUS_GROUPS = [
  "all",
  "waiting",
  "deliberating",
  "decided",
] as const;

export type BillStatusGroup = (typeof BILL_STATUS_GROUPS)[number];

export const BILL_STATUS_GROUP_LABELS: Record<BillStatusGroup, string> = {
  all: "すべて",
  waiting: "審議前",
  deliberating: "審議中",
  decided: "議決済み",
};

/** 既存の国会向けステータスにも対応する */
export function toBillStatusGroup(
  status: BillStatusEnum
): Exclude<BillStatusGroup, "all"> {
  switch (status) {
    case "deliberating":
    case "in_originating_house":
    case "in_receiving_house":
      return "deliberating";
    case "decided":
    case "enacted":
    case "rejected":
      return "decided";
    case "preparing":
    case "introduced":
      return "waiting";
  }
}

/** URLなどから受け取った値を検証する */
export function isBillStatusGroup(value: unknown): value is BillStatusGroup {
  return (
    typeof value === "string" &&
    (BILL_STATUS_GROUPS as readonly string[]).includes(value)
  );
}

/** グループごとの件数を集計する */
export function countByStatusGroup(
  bills: readonly { status: BillStatusEnum }[]
): Record<BillStatusGroup, number> {
  const counts: Record<BillStatusGroup, number> = {
    all: bills.length,
    waiting: 0,
    deliberating: 0,
    decided: 0,
  };

  for (const bill of bills) {
    counts[toBillStatusGroup(bill.status)] += 1;
  }

  return counts;
}

/** 指定されたグループで議案を絞り込む */
export function filterByStatusGroup<T extends { status: BillStatusEnum }>(
  bills: readonly T[],
  group: BillStatusGroup
): T[] {
  if (group === "all") return [...bills];

  return bills.filter((bill) => toBillStatusGroup(bill.status) === group);
}
