import type { BillStatusEnum } from "../types";

/** カード用の簡略化されたステータスラベルを取得 */
export function getCardStatusLabel(status: BillStatusEnum): string {
  switch (status) {
    case "introduced":
      return "議案提出済み";
    case "deliberating":
    case "in_originating_house":
    case "in_receiving_house":
      return "審議中";
    case "decided":
      return "議決済み";
    case "enacted":
      return "可決";
    case "rejected":
      return "否決";
    default:
      return "議案提出前";
  }
}

/** ステータスに対応するBadgeのvariantを取得 */
export function getStatusVariant(
  status: BillStatusEnum
): "light" | "default" | "dark" | "muted" {
  switch (status) {
    case "introduced":
    case "deliberating":
    case "in_originating_house":
    case "in_receiving_house":
      return "light";
    case "decided":
      return "muted";
    case "enacted":
      return "default";
    case "rejected":
      return "dark";
    default:
      return "muted";
  }
}
