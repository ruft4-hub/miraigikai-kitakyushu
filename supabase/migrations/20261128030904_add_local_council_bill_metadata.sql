-- 地方議会向けの議案情報を追加する

alter table public.bills
  add column bill_number text,
  add column proposer text,
  add column decision_date date,
  add column decision_result text,
  add column source_url text,
  add column result_source_url text,
  add column is_sample boolean not null default true;

comment on column public.bills.bill_number is '公式の議案番号';
comment on column public.bills.proposer is '議案の提出者';
comment on column public.bills.decision_date is '議決日';
comment on column public.bills.decision_result is '議決結果';
comment on column public.bills.source_url is '提出議案の公式資料URL';
comment on column public.bills.result_source_url is '議決結果の公式資料URL';
comment on column public.bills.is_sample is 'サンプルデータかどうか';
