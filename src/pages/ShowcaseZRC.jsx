import { useState, useEffect } from "react";
import UTILS from "../utils/Utils";
import JsonViewer from "../components/JsonViewer";

export default function ShowcaseZRC() {
    const [jsonPlaceHolderUsers, setJsonPlaceHolderUsers] = useState([]);
    const [crmUsers, setCrmUsers] = useState([]);
    const [result, setResult] = useState({});

    useEffect(() => {
        ZDK.Client.showLoader({ template: "vertical-bar", message: "Running ZRC methods..." });
        UTILS.testZRCMethods()
            .then((result) => {
                setResult(result);
                const crmUsers = result?.crmApiCalls?.usersRes?.data?.users || [];
                setCrmUsers(crmUsers);
                const jsonPlaceHolderUsers = result?.extAndConnCalls?.jsonPlaceHolderUsersRes?.data || [];
                setJsonPlaceHolderUsers(jsonPlaceHolderUsers);
            })
            .catch((error) => {
                console.error("Error executing ZDK methods:", error);
            })
            .finally(() => {
                ZDK.Client.hideLoader();
            });

        return () => {
            // Cleanup if needed
            ZDK.Client.hideLoader();
        };
    }, []);

    return (
        <div>
            <div>
                <h4>Some ZRC Responses</h4>
                <JsonViewer data={result} />
            </div>
            <h3>Crm Users</h3>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {crmUsers.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Jsonplaceholder Users</h3>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Website</th>
                    </tr>
                </thead>
                <tbody>
                    {jsonPlaceHolderUsers.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.website}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
