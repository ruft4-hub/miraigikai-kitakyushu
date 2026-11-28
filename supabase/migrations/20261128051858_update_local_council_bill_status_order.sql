-- 地方議会向けステータスの並び順を追加する
-- 既存ステータスの並び順は維持する

ALTER TABLE public.bills
  ALTER COLUMN status_order
  SET EXPRESSION AS (
    CASE status
      WHEN 'enacted'::public.bill_status_enum THEN 0
      WHEN 'decided'::public.bill_status_enum THEN 0
      WHEN 'rejected'::public.bill_status_enum THEN 1
      WHEN 'in_receiving_house'::public.bill_status_enum THEN 2
      WHEN 'in_originating_house'::public.bill_status_enum THEN 3
      WHEN 'deliberating'::public.bill_status_enum THEN 3
      WHEN 'introduced'::public.bill_status_enum THEN 4
      WHEN 'preparing'::public.bill_status_enum THEN 5
      ELSE NULL
    END
  );
