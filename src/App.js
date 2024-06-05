import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = useState(null); // State to hold the fetched data
  const [error, setError] = useState(null); // State to hold any error that occurs during fetching

  useEffect(() => {
    fetch(process.env.REACT_APP_API + "/api/loai")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setData(data); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message); // Update the error state
      });
  }, []); // Empty dependency array ensures useEffect only runs once after initial render

  return (
    <>
      <meta
        http-equiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      ></meta>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Data from ffAPI: {process.env.REACT_APP_API}</h1>
          {error ? (
            <p>Error: {error}</p>
          ) : data ? (
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
    </>
  );
}

export default App;
