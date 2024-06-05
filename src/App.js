import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = useState(null); // State to hold the fetched data

  useEffect(() => {
    fetch(
      "http://api3-env.eba-u35ryfqx.us-east-1.elasticbeanstalk.com/api/Loai"
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array ensures useEffect only runs once after initial render

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Data from API:</h1>
        {data ? (
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item.tenLoai}</li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
