# Solar Panel Dust Detection - Setup Guide

## Overview
This system uses a CNN (Convolutional Neural Network) model to detect dust on solar panels. Users upload images through the React frontend, which are stored in Firebase, and then sent to the Flask backend for analysis.

## Backend Setup

### 1. Install Dependencies
Navigate to the backend directory and install required packages:

```bash
cd backend
pip install -r requirements.txt
```

**Dependencies:**
- Flask 2.3.3 - Web framework
- Flask-CORS 4.0.0 - Enable cross-origin requests
- TensorFlow 2.13.0 - Deep learning framework
- NumPy 1.24.3 - Numerical computing
- Pillow 10.0.0 - Image processing
- requests 2.31.0 - HTTP library

### 2. Model File
Ensure your CNN model file exists in the backend directory:
```
backend/
├── Dust Detection.h5    ← Your trained CNN model
├── app.py
├── requirements.txt
└── venv/
```

### 3. Run Backend Server
Start the Flask server on localhost:5000:

```bash
python app.py
```

You should see:
```
Running on http://127.0.0.1:5000
```

## Frontend Setup

### 1. Install Dependencies
Navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 2. Configure Backend URL
In `frontend/src/Home.js`, the backend API is configured at:
```javascript
const BACKEND_API = 'http://localhost:5000';
```

**If your backend is on a different host/port, update this line accordingly.**

### 3. Start React Dev Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## Backend API Endpoints

### 1. Health Check
**GET** `/health`

Check if the backend and model are ready.

**Response:**
```json
{
  "status": "ok",
  "model": "loaded"
}
```

### 2. Predict from File Upload
**POST** `/predict`

Analyze an image uploaded directly as a file.

**Request:**
- Form data with key `image` containing the image file

**Response:**
```json
{
  "result": "Clean Panel",
  "confidence": 0.23,
  "dustiness_percentage": 23.0,
  "is_dusty": false
}
```

### 3. Predict from Image URL (Recommended)
**POST** `/predict-url`

Analyze an image from a URL (e.g., Firebase Storage).

**Request Body:**
```json
{
  "image_url": "https://firebase-storage-url/image.jpg"
}
```

**Response:**
```json
{
  "result": "Dusty Panel",
  "confidence": 0.78,
  "dustiness_percentage": 78.0,
  "is_dusty": true,
  "image_url": "https://firebase-storage-url/image.jpg"
}
```

## How It Works

### 1. User Upload
1. User selects an image from their device
2. Image preview is displayed
3. User clicks "Upload & Analyze"

### 2. Image Upload to Firebase
1. Image is uploaded to Firebase Storage
2. Download URL is generated
3. Progress bar shows upload status

### 3. CNN Analysis
1. Download URL is sent to backend `/predict-url` endpoint
2. Backend downloads image from Firebase
3. Image is preprocessed (resized to 224x224, normalized)
4. CNN model makes prediction
5. Results are returned to frontend

### 4. Display Results
Results show:
- **Status Badge**: "Clean Panel" (green) or "Dusty Panel" (red)
- **Classification**: The model's decision
- **Dustiness Level**: Percentage of dust detected (0-100%)
- **Confidence**: Model's confidence in the prediction
- **Visual Progress Bar**: Graphical representation of dustiness

## Model Threshold

The model uses a **0.5 confidence threshold** for classification:
- **< 0.5** → Clean Panel
- **≥ 0.5** → Dusty Panel

To adjust this threshold, edit in `backend/app.py`:
```python
result = "Dusty Panel" if confidence > 0.5 else "Clean Panel"
```

## Troubleshooting

### Backend Connection Error
If you see: "Failed to analyze image. Make sure backend is running on localhost:5000"

**Solution:**
1. Ensure Flask server is running: `python app.py`
2. Check backend URL in Home.js matches your server
3. Enable CORS (already configured in app.py)

### Model Loading Error
If backend fails to start with model error:

**Solution:**
1. Verify "Dust Detection.h5" exists in backend directory
2. Ensure TensorFlow is properly installed
3. Check file isn't corrupted

### Image Download Error
If analysis fails with "Failed to download image":

**Solution:**
1. Check Firebase Storage URL is correct and accessible
2. Verify image file exists in Firebase
3. Check internet connection

## Image Preprocessing

The model expects images preprocessed as follows:
```python
- Resize: 224x224 pixels
- Channels: RGB (3 channels)
- Normalization: Divide by 255.0 (0-1 range)
- Batch dimension: Added (1, 224, 224, 3)
```

This is handled automatically by the backend.

## Performance Notes

- **Image Upload Time**: Depends on file size and internet speed
- **Analysis Time**: Typically 1-3 seconds per image
- **Model Size**: ~50-100 MB (depends on your trained model)
- **GPU Support**: If CUDA is available, TensorFlow will use GPU for faster analysis

## Testing

### Test Endpoint
You can test the backend using curl:

```bash
# Health check
curl http://localhost:5000/health

# Test with image URL
curl -X POST http://localhost:5000/predict-url \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://your-image-url.jpg"}'
```

## Environment Variables (Optional)

You can set these variables before running the app:

```bash
# Backend
export FLASK_ENV=production
export FLASK_DEBUG=0

# Frontend
export REACT_APP_BACKEND_API=http://your-backend-url:5000
```

Then update Home.js to use: `process.env.REACT_APP_BACKEND_API`

## Deployment

### Backend Deployment (Production)
Replace `debug=True` with production server:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment (Production)
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

## Support

For issues or questions:
1. Check console logs (browser F12 for frontend, terminal for backend)
2. Verify all dependencies are installed
3. Check file paths are correct
4. Ensure model file is not corrupted
