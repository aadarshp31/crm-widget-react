import { useEffect, useState } from "react";
import UTILS from "../utils/Utils";
import JsonViewer from "../components/JsonViewer";

export default function ShowcaseZOHOCRM() {
    const [result, setresult] = useState({});

    useEffect(() => {
        UTILS.testZOHOCRMMethods()
            .then((res) => {
                setresult(res);
                ZDK.Client.showMessage("ZOHO.CRM methods executed successfully!");
            })
            .catch((error) => {
                console.error("Error executing ZOHO.CRM methods:", error);
                ZDK.Client.showAlert("Error executing ZOHO.CRM methods: " + error.message);
            });

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <>
            <h3>Showcase ZOHO.CRM methods</h3>
            <JsonViewer data={result} />
        </>
    );
}
