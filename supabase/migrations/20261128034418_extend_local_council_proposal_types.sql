-- 地方議会向けの提出区分を追加する
-- 既存の提出区分は互換性のため維持する

alter type public.bill_proposal_type
  add value 'mayor';

alter type public.bill_proposal_type
  add value 'committee';
