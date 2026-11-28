-- 地方議会向けの審議ステータスを追加する
-- 既存の国会向けステータスは互換性のため維持する

ALTER TYPE public.bill_status_enum
  ADD VALUE IF NOT EXISTS 'deliberating';

ALTER TYPE public.bill_status_enum
  ADD VALUE IF NOT EXISTS 'decided';
