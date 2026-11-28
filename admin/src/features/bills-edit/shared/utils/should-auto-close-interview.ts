import type { BillUpdateInput } from "../types";

/**
 * 法案のステータス変更時に、関連する公開中インタビューを自動クローズすべきかを判定する。
 * 国会の法案成立 (enacted) と地方議会の議決済み (decided) を対象とする。
 */
export function shouldAutoCloseInterviewOnBillStatus(
  status: BillUpdateInput["status"]
): boolean {
  return status === "enacted" || status === "decided";
}
