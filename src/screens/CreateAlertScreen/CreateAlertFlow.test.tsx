import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import { PriceAlertsScreen } from "@screens/PriceAlertsScreen/PriceAlertsScreen";
import { CreateAlertScreen } from "./CreateAlertScreen";

let mockShowAlerts: (() => void) | undefined;
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn(() => mockShowAlerts?.()) },
}));
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@expo/vector-icons", () => ({ Ionicons: () => null }));
jest.mock("react-native/Libraries/Modal/Modal", () => ({
  __esModule: true,
  default: ({ visible, children }: { visible: boolean; children: React.ReactNode }) => visible ? children : null,
}));

function AlertCreationFlow() {
  const [showList, setShowList] = useState(false);
  mockShowAlerts = () => setShowList(true);
  return showList ? <PriceAlertsScreen /> : <CreateAlertScreen />;
}

describe("create alert flow", () => {
  it("saves a below-price Ethereum alert and shows it in the alerts list", async () => {
    mockShowAlerts = undefined;
    await render(<AlertProvider><AlertCreationFlow /></AlertProvider>);
    expect(screen.getByText("Create Alert")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Select cryptocurrency" }));
    await waitFor(() => expect(screen.getByText("Ethereum")).toBeTruthy());
    await fireEvent.press(screen.getByText("Ethereum"));
    await fireEvent.changeText(screen.getByLabelText("Target Price (USD)"), "4000");
    await fireEvent.press(screen.getByRole("radio", { name: "Below target price" }));
    await fireEvent.press(screen.getByRole("button", { name: "Save Alert" }));

    await waitFor(() => expect(screen.getByText("Price Alerts")).toBeTruthy());
    expect(screen.getByText("Ethereum")).toBeTruthy();
    expect(screen.getByText("below")).toBeTruthy();
    expect(screen.getByText("$4,000.00")).toBeTruthy();
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith("cryptoAlerts", expect.stringContaining("Ethereum")));
  });
});
