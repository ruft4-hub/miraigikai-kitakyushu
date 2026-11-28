import { describe, expect, it } from "vitest";
import { billCreateSchema, billUpdateSchema } from "./index";

const baseInput = {
  name: "テスト議案",
  status: "preparing",
  status_note: null,
  is_featured: false,
  is_review_completed: false,
};

describe("提出院の入力チェック", () => {
  it("新規作成時にNULLを許容する", () => {
    const result = billCreateSchema.parse({
      ...baseInput,
      originating_house: null,
    });
    expect(result.originating_house).toBeNull();
  });

  it("更新時にNULLを許容する", () => {
    const result = billUpdateSchema.parse({
      ...baseInput,
      originating_house: null,
    });
    expect(result.originating_house).toBeNull();
  });

  it.each(["HR", "HC"])("既存の提出院 %s を許容する", (house) => {
    expect(
      billCreateSchema.safeParse({
        ...baseInput,
        originating_house: house,
      }).success
    ).toBe(true);
  });

  it("不正な提出院を拒否する", () => {
    expect(
      billCreateSchema.safeParse({
        ...baseInput,
        originating_house: "invalid",
      }).success
    ).toBe(false);
  });

  it("部分更新ではNULLと未指定を区別する", () => {
    const schema = billUpdateSchema.partial();
    expect(schema.parse({ originating_house: null })).toEqual({
      originating_house: null,
    });
    expect(schema.parse({})).toEqual({});
  });
});
