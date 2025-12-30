import axios from "axios";
import { useState } from "react";
import "./Home.css";

const BACKEND_API = "http://localhost:5000"; // Flask backend URL

export default function Home() {
  const [file, setFile] = useState(null); // selected file
  const [preview, setPreview] = useState(null); // image preview
  const [result, setResult] = useState(null); // prediction result
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(null); // error state

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

  // Upload and get prediction
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

      const response = await axios.post(`${BACKEND_API}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
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

      {/* Prediction Result */}
      {result && (
        <div className="result">
          <h3>Result: {result.result}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          <p>Dustiness Percentage: {result.dustiness_percentage}%</p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
