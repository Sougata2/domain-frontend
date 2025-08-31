import { useState } from "react";
import { ALERT_CONTEXT } from "../contexts";

function AlertProvider({ children }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [confirmHandler, setConfirmHandler] = useState(null);
  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  return (
    <ALERT_CONTEXT.Provider
      value={{
        isAlertOpen,
        openAlert,
        closeAlert,
        confirmHandler,
        setConfirmHandler,
      }}
    >
      {children}
    </ALERT_CONTEXT.Provider>
  );
}

export default AlertProvider;
