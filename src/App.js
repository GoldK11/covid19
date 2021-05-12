import "./App.css";
import Header from "./components/Header";
import Contents from "./components/Contents";
import { useState, useEffect, React } from "react";

function App() {
  const [url, setUrl] = useState(
    "https://api.covid19api.com/country/kr?from=2020-01-01T00:00:00Z&to=2020-12-31T00:00:00Z"
  );
  return (
    <div className="App">
      <Header />
      <Contents url={url} />
    </div>
  );
}

export default App;
