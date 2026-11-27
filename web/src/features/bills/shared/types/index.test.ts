import { describe, expect, it } from "vitest";

import { getBillStatusLabel } from "./index";

describe("getBillStatusLabel", () => {
  it("returns '議案提出前' for preparing", () => {
    expect(getBillStatusLabel("preparing")).toBe("議案提出前");
  });

  it("returns '議案提出済み' for introduced", () => {
    expect(getBillStatusLabel("introduced")).toBe("議案提出済み");
  });

  it("returns '可決' for enacted", () => {
    expect(getBillStatusLabel("enacted")).toBe("可決");
  });

  it("returns '否決' for rejected", () => {
    expect(getBillStatusLabel("rejected")).toBe("否決");
  });

  describe("in_originating_house", () => {
    it("returns '審議中' when originatingHouse is HR", () => {
      expect(getBillStatusLabel("in_originating_house", "HR")).toBe("審議中");
    });

    it("returns '審議中' when originatingHouse is HC", () => {
      expect(getBillStatusLabel("in_originating_house", "HC")).toBe("審議中");
    });

    it("returns '審議中' when originatingHouse is undefined", () => {
      expect(getBillStatusLabel("in_originating_house")).toBe("審議中");
    });

    it("returns '審議中' when originatingHouse is null", () => {
      expect(getBillStatusLabel("in_originating_house", null)).toBe("審議中");
    });
  });

  describe("in_receiving_house", () => {
    it("returns '審議中' when originatingHouse is HR", () => {
      expect(getBillStatusLabel("in_receiving_house", "HR")).toBe("審議中");
    });

    it("returns '審議中' when originatingHouse is HC", () => {
      expect(getBillStatusLabel("in_receiving_house", "HC")).toBe("審議中");
    });

    it("returns '審議中' when originatingHouse is undefined", () => {
      expect(getBillStatusLabel("in_receiving_house")).toBe("審議中");
    });

    it("returns '審議中' when originatingHouse is null", () => {
      expect(getBillStatusLabel("in_receiving_house", null)).toBe("審議中");
    });
  });

  it("returns the status string as-is for unknown status", () => {
    // biome-ignore lint/suspicious/noExplicitAny: テスト用に未知のステータスを渡す
    expect(getBillStatusLabel("unknown_status" as any)).toBe("unknown_status");
  });
});
