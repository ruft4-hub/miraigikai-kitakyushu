import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBillById: vi.fn(),
  getStanceByBillId: vi.fn(),
  parseBreakingNewsImageInput: vi.fn(),
  loadBreakingNewsImageAssets: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("../loaders/get-bill-by-id", () => ({
  getBillById: mocks.getBillById,
}));

vi.mock("@/features/mirai-stance/server/loaders/get-stance-by-bill-id", () => ({
  getStanceByBillId: mocks.getStanceByBillId,
}));

vi.mock("../../shared/utils/breaking-news-image", () => ({
  parseBreakingNewsImageInput: mocks.parseBreakingNewsImageInput,
  toBreakingNewsStance: vi.fn(),
}));

vi.mock("../utils/render-breaking-news-image", () => ({
  loadBreakingNewsImageAssets: mocks.loadBreakingNewsImageAssets,
  renderBreakingNewsImage: vi.fn(),
}));

import { renderBillBreakingNewsImage } from "./render-bill-breaking-news-image";

const params = {
  billId: "test-bill",
  result: null,
  reachedStep: null,
  date: null,
  place: null,
  title: null,
  includeStance: true,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("速報画像の生成制限", () => {
  it("提出院がNULLなら画像生成を停止する", async () => {
    mocks.getBillById.mockResolvedValue({
      id: "test-bill",
      originating_house: null,
    });

    const result = await renderBillBreakingNewsImage(params);

    expect(result).toMatchObject({
      ok: false,
      reason: "invalid_input",
    });
    expect(mocks.getStanceByBillId).not.toHaveBeenCalled();
    expect(mocks.parseBreakingNewsImageInput).not.toHaveBeenCalled();
    expect(mocks.loadBreakingNewsImageAssets).not.toHaveBeenCalled();
  });

  it.each(["HR", "HC"])("提出院が%sなら入力検証へ進む", async (house) => {
    mocks.getBillById.mockResolvedValue({
      id: "test-bill",
      originating_house: house,
      proposal_type: null,
    });

    mocks.parseBreakingNewsImageInput.mockReturnValue({
      ok: false,
      error: "test",
    });

    await renderBillBreakingNewsImage({
      ...params,
      includeStance: false,
    });

    expect(mocks.parseBreakingNewsImageInput).toHaveBeenCalledWith(
      expect.objectContaining({ originatingHouse: house })
    );
  });
});
