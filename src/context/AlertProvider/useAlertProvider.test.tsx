import React from "react";
import { Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { AlertProvider } from "./AlertProvider";
import { useAlerts } from "./useAlertProvider";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

function AlertHookProbe() {
  const { alerts, addAlert, deleteAlert } = useAlerts();
  return (
    <View>
      <Text>{alerts.length}:{alerts[0]?.cryptocurrency ?? "empty"}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add Bitcoin alert"
        onPress={() => addAlert({ cryptocurrency: "Bitcoin", symbol: "BTC", targetPrice: 70000, condition: "above" })}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete first alert"
        onPress={() => alerts[0] && deleteAlert(alerts[0].id)}
      />
    </View>
  );
}

describe("alert provider hook", () => {
  beforeEach(() => jest.clearAllMocks());

  it("hydrates saved alerts and exposes them to its consumer", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([
      { id: "saved", cryptocurrency: "Ethereum", symbol: "ETH", targetPrice: 4000, condition: "below", createdAt: "2026-01-01" },
    ]));
    await render(<AlertProvider><AlertHookProbe /></AlertProvider>);

    await waitFor(() => expect(screen.getByText("1:Ethereum")).toBeTruthy());
  });

  it("adds and removes alerts while persisting updated state", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    await render(<AlertProvider><AlertHookProbe /></AlertProvider>);
    await waitFor(() => expect(screen.getByText("0:empty")).toBeTruthy());

    await fireEvent.press(screen.getByRole("button", { name: "Add Bitcoin alert" }));
    await waitFor(() => expect(screen.getByText("1:Bitcoin")).toBeTruthy());
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith("cryptoAlerts", expect.stringContaining("Bitcoin")));

    await fireEvent.press(screen.getByRole("button", { name: "Delete first alert" }));
    await waitFor(() => expect(screen.getByText("0:empty")).toBeTruthy());
  });

  it("keeps an empty in-memory list when stored data cannot be read", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error("storage unavailable"));
    await render(<AlertProvider><AlertHookProbe /></AlertProvider>);

    await waitFor(() => expect(screen.getByText("0:empty")).toBeTruthy());
  });
});
