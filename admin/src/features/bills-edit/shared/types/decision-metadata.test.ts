import { describe, expect, it } from "vitest";
import { billCreateSchema, billUpdateSchema } from "./index";

const schema = billCreateSchema.pick({
  decision_result: true,
  decision_date: true,
});

describe("decision_result", () => {
  it.each(["可決", "否決", "認定", "同意"])("%s を許容する", (result) => {
    expect(schema.safeParse({ decision_result: result }).success).toBe(true);
  });

  it("前後の空白を除去する", () => {
    expect(schema.parse({ decision_result: " 認定 " }).decision_result).toBe(
      "認定"
    );
  });

  it.each([
    "",
    "   ",
    "あ".repeat(201),
  ])("不正な議決結果を拒否する", (result) => {
    expect(schema.safeParse({ decision_result: result }).success).toBe(false);
  });

  it("null を許容する", () => {
    expect(schema.safeParse({ decision_result: null }).success).toBe(true);
  });
});

describe("decision_date", () => {
  it.each(["2026-10-01", "2028-02-29"])("%s を許容する", (date) => {
    expect(schema.safeParse({ decision_date: date }).success).toBe(true);
  });

  it.each([
    "2026-02-30",
    "2026-02-29",
    "2026-13-01",
    "2026/10/01",
    "0000-01-01",
    "",
  ])("%s を拒否する", (date) => {
    expect(schema.safeParse({ decision_date: date }).success).toBe(false);
  });

  it("null を許容する", () => {
    expect(schema.safeParse({ decision_date: null }).success).toBe(true);
  });
});

describe("decision metadata compatibility", () => {
  it("項目の省略を許容する", () => {
    expect(schema.parse({})).toEqual({});
  });

  it("更新時に null で値を消去できる形式を許容する", () => {
    expect(
      billUpdateSchema.partial().parse({
        decision_result: null,
        decision_date: null,
      })
    ).toEqual({
      decision_result: null,
      decision_date: null,
    });
  });
});
