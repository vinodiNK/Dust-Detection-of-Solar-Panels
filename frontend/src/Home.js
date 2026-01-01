import { signOut } from 'firebase/auth';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import solarLogo from "./assets/solar-logo.png";
import { auth } from './firebase';
import './Home.css';

export default function Home() {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState('');
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const addInputRef = useRef(null);

	function handleFileChange(e) {
		setError('');
		const f = e.target.files && e.target.files[0];
		if (!f) return;
		setFile(f);
		setPreview(URL.createObjectURL(f));
	}

	async function handleAnalyze(e) {
		e.preventDefault();
		setError('');
		setResult(null);

		if (!file) {
			setError('Please choose an image first');
			return;
		}

		setLoading(true);
		try {
			const fd = new FormData();
			fd.append('image', file);

			const resp = await fetch('http://localhost:5000/predict', {
				method: 'POST',
				body: fd,
			});

			const data = await resp.json();
			if (!resp.ok) throw new Error(data.error || 'Prediction failed');

			setResult(data);
		} catch (err) {
			setError(err.message || 'Request failed');
		} finally {
			setLoading(false);
		}
	}

	function handleAddNewImage() {
		// reset state then open file picker for a new image
		setFile(null);
		setPreview('');
		setResult(null);
		setError('');
		if (addInputRef.current) addInputRef.current.click();
	}

  function getStatusMessage(resultText) {
  if (resultText.toLowerCase().includes("dusty")) {
    return {
      type: "warning",
      message:
        "⚠️ Warning: Dust detected on the solar panel. Cleaning is recommended to improve efficiency.",
    };
  }

  return {
    type: "good",
    message:
      "✅ Good News: The solar panel is clean and operating at optimal efficiency.",
  };
}


	function handleLogout() {
		signOut(auth)
			.then(() => navigate('/'))
			.catch((err) => setError(err.message || 'Sign out failed'));
	}

	return (
		<div className="home-page">
			<header className="home-header">
  <div className="header-left">
    <img src={solarLogo} alt="Solar Logo" className="logo" />
    <div className="title-text">
      <h1>Solar Panel Dust Detection System</h1>
      <p>AI-based image analysis for dust detection</p>
    </div>
  </div>

  <button className="logout-btn" onClick={handleLogout}>
    Sign Out
  </button>
</header>

			<main className="home-main">
				<div className="card">
					<form onSubmit={handleAnalyze}>
						<label className="upload-box">
							<input type="file" accept="image/*" onChange={handleFileChange} hidden />
							📤 Upload Solar Panel Image
						</label>

						{/* hidden input used to trigger file picker when adding new image */}
						<input ref={addInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />

						{preview && (
							<div className="preview">
								<img src={preview} alt="preview" />
							</div>
						)}

						{error && <div className="alert error">{error}</div>}

						<button type="submit" className="analyze-btn" disabled={loading}>
							{loading ? 'Analyzing...' : 'Analyze Image'}
						</button>

						{result && (
							<button type="button" className="analyze-btn" onClick={handleAddNewImage} style={{ marginTop: 8 }}>
								Clear Image
							</button>
						)}
					</form>

					{loading && <div className="loader">🔍 AI is analyzing the image...</div>}

					{/* ✅ RESULT + MESSAGE */}
          {result && (() => {
            const status = getStatusMessage(result.result);

							return (
								<div
									className={`result-box ${
										status.type === 'good' ? 'clean' : 'dusty'
									}`}
							>
								<h2>{result.result}</h2>
								<p className="small">Dustiness: {result.dustiness_percentage}%</p>

								<div
									className={`status-message ${
										status.type === 'good' ? 'good-msg' : 'warning-msg'
									}`}
								>
									{status.message}
								</div>
							</div>
						);
          })()}
        </div>
      </main>


			<footer className="home-footer">
				Powered by AI & Machine Learning 🌱⚡
			</footer>
		</div>
	);
}
