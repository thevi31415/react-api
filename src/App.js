import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "./logo.svg"; // Adjust the import path as necessary
import "./App.css"; // Adjust the import path as necessary
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// Tạo theme với màu sắc tươi sáng
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#ffeb3b",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h6: {
      fontWeight: "bold",
      color: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: "10px 0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});
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
    <ThemeProvider theme={theme}>
      <Container
        style={{
          padding: "20px",
          backgroundColor: theme.palette.background.default,
          borderRadius: "8px",
        }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6">
              Data from API: {process.env.REACT_APP_API}
            </Typography>
          </Toolbar>
        </AppBar>
        <header className="App-header" style={{ marginTop: "20px" }}>
          {error ? (
            <Alert severity="error">Error: {error}</Alert>
          ) : data ? (
            <>
              <List>
                {data.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="secondary"
                          onClick={() => deleteItem(item.maLoai)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          color="primary"
                          onClick={() =>
                            updateItem(
                              item.maLoai,
                              prompt("New name:", item.tenLoai)
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={`${item.maLoai} - ${item.tenLoai}`}
                    />
                  </ListItem>
                ))}
              </List>
              <TextField
                label="New item"
                variant="outlined"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={addItem}>
                Add Item
              </Button>
            </>
          ) : (
            <CircularProgress color="primary" />
          )}
        </header>
      </Container>
    </ThemeProvider>
  );
}

export default App;
