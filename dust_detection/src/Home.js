import React, { useState } from 'react';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Home() {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [downloadURL, setDownloadURL] = useState(null);

	function handleFileChange(e) {
		setError(null);
		const f = e.target.files && e.target.files[0];
		if (!f) return;
		if (!f.type.startsWith('image/')) {
			setError('Please select an image file');
			return;
		}
		setFile(f);
		setPreview(URL.createObjectURL(f));
		setProgress(0);
		setDownloadURL(null);
	}

	function handleUpload() {
		setError(null);
		if (!file) {
			setError('No file selected');
			return;
		}
		const filename = `${Date.now()}_${file.name}`;
		const storageRef = ref(storage, `images/${filename}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				setProgress(pct);
			},
			(err) => {
				setError(err.message || 'Upload failed');
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					setDownloadURL(url);
				}).catch((err) => setError(err.message || 'Failed to get download URL'));
			}
		);
	}

	return (
		<div style={{ padding: 16, maxWidth: 640 }}>
			<h2>Upload Image</h2>
			<input type="file" accept="image/*" onChange={handleFileChange} />

			{preview && (
				<div style={{ marginTop: 12 }}>
					<img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 300 }} />
				</div>
			)}

			<div style={{ marginTop: 12 }}>
				<button onClick={handleUpload} disabled={!file}>
					Upload
				</button>
			</div>

			{progress > 0 && (
				<div style={{ marginTop: 8 }}>Progress: {progress}%</div>
			)}

			{error && (
				<div style={{ color: 'red', marginTop: 8 }}>{error}</div>
			)}

			{downloadURL && (
				<div style={{ marginTop: 12 }}>
					<strong>Uploaded URL:</strong>
					<div>
						<a href={downloadURL} target="_blank" rel="noreferrer">{downloadURL}</a>
					</div>
				</div>
			)}
		</div>
	);
}
