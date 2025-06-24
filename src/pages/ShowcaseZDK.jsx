import { useEffect, useState } from 'react';
import UTILS from '../utils/Utils';
import JsonViewer from '../components/JsonViewer';

export default function ShowcaseZDK() {
  const [result, setResult] = useState({});

  useEffect(()=>{
    // Call your ZDK methods here
    UTILS.testZDKMethods()
      .then((result) => {
        setResult(result);
        ZDK.Client.showMessage("ZDK methods executed successfully!");
      })
      .catch((error) => {
        console.error("Error executing ZDK methods:", error);
        ZDK.Client.showAlert("Error executing ZDK methods: " + error.message);
      });

    return () => {
      // Cleanup if needed
    };
  }, [])

  return (
    <>
      <h3>Showcase ZDK</h3>
      <JsonViewer data={result} />
    </>
  );
}
