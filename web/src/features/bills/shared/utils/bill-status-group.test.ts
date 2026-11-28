import { describe, expect, it } from "vitest";
import type { BillStatusEnum } from "../types";
import {
  countByStatusGroup,
  filterByStatusGroup,
  isBillStatusGroup,
  toBillStatusGroup,
} from "./bill-status-group";

const bill = (status: BillStatusEnum) => ({ status });

describe("toBillStatusGroup", () => {
  it.each([
    ["preparing", "waiting"],
    ["introduced", "waiting"],
    ["in_originating_house", "deliberating"],
    ["in_receiving_house", "deliberating"],
    ["deliberating", "deliberating"],
    ["enacted", "decided"],
    ["rejected", "decided"],
    ["decided", "decided"],
  ] as const)("%s を %s に分類する", (status, group) => {
    expect(toBillStatusGroup(status)).toBe(group);
  });
});

describe("isBillStatusGroup", () => {
  it.each([
    "all",
    "waiting",
    "deliberating",
    "decided",
  ])("%s を許容する", (group) => {
    expect(isBillStatusGroup(group)).toBe(true);
  });

  it.each([
    "introduced",
    "enacted",
    "rejected",
    undefined,
    null,
    3,
  ])("%s を新しいグループとしては許容しない", (value) => {
    expect(isBillStatusGroup(value)).toBe(false);
  });
});

describe("countByStatusGroup", () => {
  it("全8種類のステータスを正しく集計する", () => {
    const bills = [
      bill("preparing"),
      bill("introduced"),
      bill("in_originating_house"),
      bill("in_receiving_house"),
      bill("deliberating"),
      bill("enacted"),
      bill("rejected"),
      bill("decided"),
    ];

    expect(countByStatusGroup(bills)).toEqual({
      all: 8,
      waiting: 2,
      deliberating: 3,
      decided: 3,
    });
  });

  it("空なら全て0", () => {
    expect(countByStatusGroup([])).toEqual({
      all: 0,
      waiting: 0,
      deliberating: 0,
      decided: 0,
    });
  });
});

describe("filterByStatusGroup", () => {
  const bills = [
    bill("in_originating_house"),
    bill("deliberating"),
    bill("enacted"),
    bill("rejected"),
    bill("decided"),
    bill("preparing"),
  ];

  it("all は素通しする", () => {
    expect(filterByStatusGroup(bills, "all")).toEqual(bills);
  });

  it("議決済みの議案をまとめて取得する", () => {
    expect(filterByStatusGroup(bills, "decided")).toEqual([
      bill("enacted"),
      bill("rejected"),
      bill("decided"),
    ]);
  });

  it("審議中の議案をまとめて取得する", () => {
    expect(filterByStatusGroup(bills, "deliberating")).toEqual([
      bill("in_originating_house"),
      bill("deliberating"),
    ]);
  });

  it("該当が無ければ空", () => {
    expect(filterByStatusGroup([bill("preparing")], "decided")).toEqual([]);
  });

  it("元の配列を壊さない", () => {
    const input = [bill("enacted")];
    filterByStatusGroup(input, "all").push(bill("rejected"));
    expect(input).toHaveLength(1);
  });
});
