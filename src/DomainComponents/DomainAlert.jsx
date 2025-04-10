import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {useEffect, useState} from "react";

export function DomainAlert({type, message}) {
    const [alert, setAlert] = useState("");
    useEffect(() => {
        switch (type) {
            case "success":
                setAlert("bg-green-200 text-green-800");
                break;
            case "error":
                setAlert("bg-red-200 text-red-800");
                break;
            default:
                setAlert("bg-yellow-200 text-yellow-800");
        }
    }, [type])

    return (
        <Alert className={alert}>
            <AlertTitle>{type}</AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    )
}
