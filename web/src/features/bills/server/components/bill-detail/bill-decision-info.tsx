interface BillDecisionInfoProps {
  decisionResult: string | null;
  decisionDate: string | null;
}

export function BillDecisionInfo({
  decisionResult,
  decisionDate,
}: BillDecisionInfoProps) {
  if (!decisionResult && !decisionDate) return null;

  return (
    <div className="mt-4 rounded-lg border bg-white p-4">
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-mirai-text-secondary">議決結果</dt>
          <dd className="font-bold">{decisionResult ?? "情報未登録"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-mirai-text-secondary">議決日</dt>
          <dd>
            {decisionDate
              ? new Intl.DateTimeFormat("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "Asia/Tokyo",
                }).format(new Date(decisionDate))
              : "情報未登録"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
