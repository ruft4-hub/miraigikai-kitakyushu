import { Container } from "@/components/layouts/container";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { BillDetailClient } from "../../../client/components/bill-detail/bill-detail-client";
import { BillDisclaimer } from "../../../client/components/bill-detail/bill-disclaimer";
import { BillStatusProgress } from "../../../client/components/bill-detail/bill-status-progress";
import type { BillWithContent } from "../../../shared/types";
import { BillShareButtons } from "../share/bill-share-buttons";
import { BillContent } from "./bill-content";
import { BillDetailHeader } from "./bill-detail-header";

interface BillDetailLayoutProps {
  bill: BillWithContent;
  currentDifficulty: DifficultyLevelEnum;
}

export async function BillDetailLayout({
  bill,
  currentDifficulty,
}: BillDetailLayoutProps) {
  return (
    <div className="container mx-auto pb-8 max-w-4xl">
      {/*
        テキスト選択機能とチャット連携の実装パターン:
        - BillContentはServer Componentのまま保持（SSRによる高速な初期レンダリング）
        - BillDetailClientでクライアントサイド機能（テキスト選択、チャット連携）を提供
        - このパターンによりSSRを保持しつつインタラクティブ機能を実装
      */}
      <BillDetailClient
        bill={bill}
        currentDifficulty={currentDifficulty}
        hasInterviewConfig={false}
      >
        <BillDetailHeader
          bill={bill}
          hasInterviewConfig={false}
          opinionCount={0}
          topicCount={0}
        />
        <Container>
          <p className="mt-4 text-sm text-mirai-text-secondary">
            現在は開発中のため、掲載議案は国会のサンプルデータです。北九州市議会の実際の議案ではありません。
          </p>
          {/* 議案ステータス進捗 */}
          <div className="my-8">
            <BillStatusProgress
              status={bill.status}
              statusNote={bill.status_note}
            />
          </div>

          <BillContent bill={bill} />
        </Container>
      </BillDetailClient>

      <Container>
        {/* シェアボタン */}
        <div className="my-8">
          <BillShareButtons bill={bill} />
        </div>

        {/* データの出典と免責事項 */}
        <div className="my-8">
          <BillDisclaimer />
        </div>
      </Container>
    </div>
  );
}
