-- 地方議会の議案登録に対応する
-- 既存の提出院データは維持する

alter table public.bills
  alter column originating_house drop not null;

comment on column public.bills.originating_house is
  '国会の提出院。地方議会の議案ではNULLを許容する。';
