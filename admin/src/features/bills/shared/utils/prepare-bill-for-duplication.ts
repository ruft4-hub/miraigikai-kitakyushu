import type { Bill, BillInsert } from "../types";

/**
 * 議案データから複製用のinsertデータを生成する
 * ID・タイムスタンプを除去し、名前に「(複製)」を付与、ステータスをdraftに設定
 */
export function prepareBillForDuplication(originalBill: Bill): BillInsert {
  const {
    id: _,
    created_at: __,
    updated_at: ___,
    status_order: ____,
    slug: _____,
    publish_status_order: ______,
    ...billWithoutId
  } = originalBill;

  return {
    ...billWithoutId,
    slug: null,
    name: `${originalBill.name} (複製)`,
    publish_status: "draft",
    is_review_completed: false,
    bill_number: null,
    proposer: null,
    decision_date: null,
    decision_result: null,
    source_url: null,
    result_source_url: null,
    is_sample: true,
  };
}

/**
 * 議案コンテンツ配列から複製用のデータを生成する
 * IDを除去し、新しいbill_idを設定
 */
export function prepareBillContentsForDuplication<
  T extends { id: string; bill_id: string },
>(
  contents: T[],
  newBillId: string
): (Omit<T, "id" | "bill_id"> & { bill_id: string })[] {
  return contents.map((content) => {
    const { id: _, bill_id: __, ...contentData } = content;
    return {
      ...contentData,
      bill_id: newBillId,
    };
  });
}
