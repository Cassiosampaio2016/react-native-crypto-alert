import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { PriceAlert } from "@context/AlertProvider/useAlertProvider";
import { AlertCard } from "./AlertCard";

jest.mock("@expo/vector-icons", () => ({ Ionicons: () => null }));

const alert: PriceAlert = {
  id: "alert-1",
  cryptocurrency: "Bitcoin",
  symbol: "BTC",
  targetPrice: 70000,
  condition: "above",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("AlertCard", () => {
  it("renders the cryptocurrency, condition and formatted target price", async () => {
    await render(<AlertCard alert={alert} onDelete={jest.fn()} />);

    expect(screen.getByText("Bitcoin")).toBeTruthy();
    expect(screen.getByText("above")).toBeTruthy();
    expect(screen.getByText("$70,000.00")).toBeTruthy();
  });

  it("deletes the alert identified by its id when Delete alert is pressed", async () => {
    const onDelete = jest.fn();
    await render(<AlertCard alert={alert} onDelete={onDelete} />);

    await fireEvent.press(screen.getByRole("button", { name: "Delete alert" }));
    expect(onDelete).toHaveBeenCalledWith("alert-1");
  });
});
