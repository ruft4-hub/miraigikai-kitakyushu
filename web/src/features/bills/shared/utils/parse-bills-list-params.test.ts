import { describe, expect, it } from "vitest";
import {
  type BillsListParams,
  buildBillsListQuery,
  parseBillsListParams,
} from "./parse-bills-list-params";

const defaults: BillsListParams = {
  query: "",
  status: "all",
  tagId: null,
  sort: "new",
  interviewOnly: false,
};

describe("parseBillsListParams", () => {
  it.each([
    "enacted",
    "rejected",
  ])("旧ステータス %s を議決済みに変換する", (status) => {
    expect(parseBillsListParams({ status }).status).toBe("decided");
  });

  it("何も無ければ既定に倒す", () => {
    expect(parseBillsListParams({})).toEqual(defaults);
  });

  it("すべてのパラメータを読む", () => {
    expect(
      parseBillsListParams({
        q: "ガソリン",
        status: "decided",
        tag: "zeikin",
        sort: "old",
        interview: "1",
      })
    ).toEqual({
      query: "ガソリン",
      status: "decided",
      tagId: "zeikin",
      sort: "old",
      interviewOnly: false,
    });
  });

  // URL 直打ちでページを壊せないようにする。
  it("不正なステータスと並び順は既定に倒す", () => {
    const parsed = parseBillsListParams({
      status: "introduced",
      sort: "popular",
    });
    expect(parsed.status).toBe("all");
    expect(parsed.sort).toBe("new");
  });

  it("配列で来たら先頭を採る", () => {
    expect(
      parseBillsListParams({ q: ["a", "b"], status: ["decided", "all"] })
    ).toMatchObject({ query: "a", status: "decided" });
  });

  it("前後の空白を落とす", () => {
    expect(parseBillsListParams({ q: "  ガソリン  " }).query).toBe("ガソリン");
  });

  it("空文字のタグは「すべて」扱いにする", () => {
    expect(parseBillsListParams({ tag: "   " }).tagId).toBeNull();
  });

  it("interview の指定は無視する", () => {
    expect(parseBillsListParams({ interview: "1" }).interviewOnly).toBe(false);
    expect(parseBillsListParams({ interview: "true" }).interviewOnly).toBe(
      false
    );
    expect(parseBillsListParams({ interview: "0" }).interviewOnly).toBe(false);
  });
});

describe("buildBillsListQuery", () => {
  it("既定だけならクエリを付けない", () => {
    expect(buildBillsListQuery(defaults, {})).toBe("");
  });

  it("既定値はURLに出さない", () => {
    expect(buildBillsListQuery(defaults, { status: "all", sort: "new" })).toBe(
      ""
    );
  });

  it("差し替えた値だけ載せる", () => {
    expect(buildBillsListQuery(defaults, { status: "decided" })).toBe(
      "?status=decided"
    );
  });

  it("他の絞り込みを保ったまま1つだけ差し替える", () => {
    const current: BillsListParams = {
      ...defaults,
      query: "税",
      tagId: "zeikin",
    };

    expect(buildBillsListQuery(current, { status: "decided" })).toBe(
      "?q=%E7%A8%8E&status=decided&tag=zeikin"
    );
  });

  it("インタビュー絞り込みはURLに載せない", () => {
    expect(buildBillsListQuery(defaults, { interviewOnly: true })).toBe("");
  });

  it("タグを外せる", () => {
    const current: BillsListParams = { ...defaults, tagId: "zeikin" };
    expect(buildBillsListQuery(current, { tagId: null })).toBe("");
  });

  it("parse と往復して同じ状態に戻る", () => {
    const current: BillsListParams = {
      query: "ガソリン",
      status: "decided",
      tagId: "zeikin",
      sort: "old",
      interviewOnly: false,
    };
    const queryString = buildBillsListQuery(current, {});
    const parsed = Object.fromEntries(
      new URLSearchParams(queryString.slice(1))
    );

    expect(parseBillsListParams(parsed)).toEqual(current);
  });
});

describe("無効化した並び替え条件", () => {
  it("voices を指定しても既定の並び順に戻す", () => {
    expect(parseBillsListParams({ sort: "voices" }).sort).toBe("new");
  });

  it("voices をURLに載せない", () => {
    expect(buildBillsListQuery(defaults, { sort: "voices" })).toBe("");
  });
});
