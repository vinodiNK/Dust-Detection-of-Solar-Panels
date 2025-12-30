import axios from "axios";
import { useState } from "react";
import "./Home.css";

const BACKEND_API = "http://localhost:5000"; // Flask backend URL

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  // Upload image and get prediction
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${BACKEND_API}/predict`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data);

      // ⚠️ ONLY show alert if dusty
      if (response.data.result.toLowerCase().includes("dust")) {
        alert("⚠️ WARNING: Dust detected on the solar panel!");
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2>Solar Panel Dust Detection</h2>

      {/* File Input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Image Preview */}
      {preview && (
        <div className="preview">
          <h4>Preview:</h4>
          <img src={preview} alt="preview" className="preview-image" />
        </div>
      )}

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Check Dustiness"}
      </button>

      {/* Result & Warning */}
      {result && (
        <div className="result">
          <h3>Result: {result.result}</h3>

          {result.result.toLowerCase().includes("dust") && (
            <p className="warning">
              ⚠️ Dust detected! Cleaning the solar panel is recommended.
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
