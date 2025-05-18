import { createContext, useContext } from "react";
import { Notifications } from "@mantine/notifications";

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
  const showNotification = ({ message, title, color = "green", autoClose = 3000 }) => {
    Notifications.show({
      title,
      message,
      color,
      autoClose,
    });
  }

  return (
    <FlashContext.Provider value={{ showNotification }}>
      {children}
    </FlashContext.Provider>
  );
}

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
};
