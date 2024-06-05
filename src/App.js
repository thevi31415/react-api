import React, { useState, useEffect } from "react";
import logo from "./logo.svg"; // Adjust the import path as necessary
import "./App.css"; // Adjust the import path as necessary

function App() {
  const [data, setData] = useState(null); // State to hold the fetched data
  const [error, setError] = useState(null); // State to hold any error that occurs during fetching
  const [newItem, setNewItem] = useState(""); // State to hold new item input

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
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
  };

  const addItem = () => {
    fetch(process.env.REACT_APP_API + "/api/loai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maLoai: 3, tenLoai: newItem }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item");
        }
        return response.json();
      })
      .then((newItem) => {
        setData([...data, newItem]); // Update the state with the new item
        setNewItem(""); // Clear the input
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        setError(error.message); // Update the error state
      });
  };

  const deleteItem = (id) => {
    fetch(`${process.env.REACT_APP_API}/api/loai/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        setData(data.filter((item) => item.maLoai !== id)); // Remove the item from the state
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setError(error.message); // Update the error state
      });
  };

  const updateItem = (id, newTenLoai) => {
    fetch(`${process.env.REACT_APP_API}/api/loai/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maLoai: id, tenLoai: newTenLoai }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update item");
        }
        return response.json();
      })
      .then((updatedItem) => {
        setData(data.map((item) => (item.id === id ? updatedItem : item))); // Update the item in the state
      })
      .then(() => {
        fetchData(); // Reload data after updating
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        setError(error.message); // Update the error state
      });
  };

  return (
    <>
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      ></meta>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Data from API: {process.env.REACT_APP_API}</h1>
          {error ? (
            <p>Error: {error}</p>
          ) : data ? (
            <>
              <ul>
                {data.map((item) => (
                  <li key={item.id}>
                    {item.maLoai} - {item.tenLoai}
                    <button onClick={() => deleteItem(item.maLoai)}>
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        updateItem(
                          item.maLoai,
                          prompt("New name:", item.tenLoai)
                        )
                      }
                    >
                      Update
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="New item"
              />
              <button onClick={addItem}>Add Item</button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </header>
      </div>
    </>
  );
}

export default App;
