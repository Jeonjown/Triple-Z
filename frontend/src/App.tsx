import { useState } from "react";
import "./App.css";

function App() {
  const fetchData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setData(data.message);
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  const [data, setData] = useState();

  return (
    <>
      <button onClick={fetchData}>press me</button>
      <div>{data}</div>
    </>
  );
}

export default App;
