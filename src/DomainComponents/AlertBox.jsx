import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { ALERT_CONTEXT } from "@/context/contexts";

function AlertBox() {
  const { isAlertOpen, closeAlert, confirmHandler } = useContext(ALERT_CONTEXT);

  useEffect(() => {
    if (isAlertOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isAlertOpen]);

  function handleConfirmation() {
    confirmHandler.onConfirm();
    closeAlert();
  }

  if (!isAlertOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[-2px] z-40 flex justify-center items-center">
      <Card className={"w-md"}>
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently remove your data
            from our servers.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className={"flex justify-end"}>
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeAlert}>
              Cancel
            </Button>
            <Button onClick={handleConfirmation}>Confirm</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export function AlertButton({ onConfirm, styles, children }) {
  const { openAlert, setConfirmHandler } = useContext(ALERT_CONTEXT);

  return (
    <button
      onClick={() => {
        openAlert();
        setConfirmHandler({ onConfirm });
      }}
      style={styles}
    >
      {children}
    </button>
  );
}

export default AlertBox;
