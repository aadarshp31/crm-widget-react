import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ShowcaseZRC from './pages/ShowcaseZRC';
import ShowcaseZDK from './pages/ShowcaseZDK';
import ShowcaseZOHOCRM from './pages/ShowcaseZOHOCRM';

export default function App() {

    useEffect(() => {
      ZOHO.embeddedApp.on("PageLoad", async function (data) {
          ZDK.Client.showMessage("Widget loaded, context: " + JSON.stringify(data));
      });

      ZOHO.embeddedApp.init().then(() => {
          // console.log("Init called from App.jsx");
      });

    }, []);

    return (
        <div>
            <h2>React Demo</h2>
            <nav>
                <Link to="/">Home</Link> | <Link to={"/zrc"}>Showcase ZRC</Link> | <Link to={"/zdk"}>Showcase ZDK</Link> | <Link to={"/zohocrm"}>Showcase ZOHO.CRM</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/zrc" element={<ShowcaseZRC />} />
                <Route path="/zdk" element={<ShowcaseZDK />} />
                <Route path="/zohocrm" element={<ShowcaseZOHOCRM />} />
            </Routes>
        </div>
    );
}
