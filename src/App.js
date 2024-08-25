import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  const backendURL = "https://bajaj-backend-hmcs.onrender.com/bfhl";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);
    setSelectedOptions([]);

    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
    } catch (err) {
      setError("Invalid JSON format");
      return;
    }

    if (!parsedData.data || !Array.isArray(parsedData.data)) {
      setError('JSON must contain a "data" array');
      return;
    }

    try {
      const res = await axios.post(backendURL, parsedData);
      setResponse(res.data);
    } catch (err) {
      setError("Error communicating with the backend");
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const { alphabets, numbers, highest_lowercase_alphabet } = response;

    return (
      <div className="filtered-response">
        {selectedOptions.includes("Alphabets") && (
          <p>
            <strong>Alphabets:</strong> {alphabets.join(",")}
          </p>
        )}
        {selectedOptions.includes("Numbers") && (
          <p>
            <strong>Numbers:</strong> {numbers.join(",")}
          </p>
        )}
        {selectedOptions.includes("Highest lowercase alphabet") && (
          <p>
            <strong>Highest lowercase alphabet:</strong>{" "}
            {highest_lowercase_alphabet.join(",")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <center>
        <h1>21BDS0123</h1>
      </center>
      <form onSubmit={handleSubmit}>
        <label className="input-label">API Input</label>
        <textarea
          className="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter the JSON Input"
          rows="3"
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {response && (
        <div className="filter-container">
          <label className="filter-label">Multi Filter</label>
          <div className="multi-select">
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                checked={selectedOptions.includes("Alphabets")}
                onChange={handleCheckboxChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="Numbers"
                checked={selectedOptions.includes("Numbers")}
                onChange={handleCheckboxChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="Highest lowercase alphabet"
                checked={selectedOptions.includes("Highest lowercase alphabet")}
                onChange={handleCheckboxChange}
              />
              Highest lowercase alphabet
            </label>
          </div>
          <br></br>
          <label className="filter-label">Filtered Responses</label>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
