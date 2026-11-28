// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BillProposalTypeBadge } from "./bill-proposal-type-badge";

describe("BillProposalTypeBadge", () => {
  it("閣法は「閣法」をグリーンの枠で出す", () => {
    render(<BillProposalTypeBadge proposalType="cabinet" />);

    expect(screen.getByText("閣法")).toHaveClass(
      "border-primary",
      "text-primary-accent"
    );
  });

  it("議員提出は「議員提出」をグレーの枠で出す", () => {
    render(<BillProposalTypeBadge proposalType="member" />);

    expect(screen.getByText("議員提出")).toHaveClass(
      "border-mirai-border",
      "text-mirai-text-note"
    );
  });

  it("市長提出をグリーンの枠で出す", () => {
    render(<BillProposalTypeBadge proposalType="mayor" />);
    expect(screen.getByText("市長提出")).toHaveClass(
      "border-primary",
      "text-primary-accent"
    );
  });

  it("委員会提出をグレーの枠で出す", () => {
    render(<BillProposalTypeBadge proposalType="committee" />);
    expect(screen.getByText("委員会提出")).toHaveClass(
      "border-mirai-border",
      "text-mirai-text-note"
    );
  });

  it("種類が未設定なら何も表示しない", () => {
    const { container } = render(<BillProposalTypeBadge proposalType={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
