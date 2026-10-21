import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { ConditionOptionRow } from "./ConditionOptionRow";

jest.mock("@expo/vector-icons", () => ({ Ionicons: () => null }));

describe("ConditionOptionRow", () => {
  it("announces the selected radio option and its description", async () => {
    await render(
      <ConditionOptionRow
        value="below"
        selected
        title="Below target price"
        subtitle="Alert when price goes below"
        variant="below"
        onSelect={jest.fn()}
      />,
    );

    expect(screen.getByRole("radio", { name: "Below target price" }).props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByText("Alert when price goes below")).toBeTruthy();
  });

  it("reports the value when the radio option is pressed", async () => {
    const onSelect = jest.fn();
    await render(
      <ConditionOptionRow
        value="below"
        selected={false}
        title="Below target price"
        subtitle="Alert when price goes below"
        variant="below"
        onSelect={onSelect}
      />,
    );

    await fireEvent.press(screen.getByRole("radio", { name: "Below target price" }));
    expect(onSelect).toHaveBeenCalledWith("below");
  });
});
