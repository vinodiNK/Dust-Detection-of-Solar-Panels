from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load CNN model
try:
    model = tf.keras.models.load_model("Dust Detection.h5")
    logger.info("CNN model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None

IMG_SIZE = 224  # Must match training
IMG_HEIGHT = model.input_shape[1] if model else 224
IMG_WIDTH = model.input_shape[2] if model else 224

def preprocess_image(image):
    """Convert and resize image for model prediction"""
    try:
        image = image.convert("RGB")  # ensure 3 channels
        image = image.resize((IMG_WIDTH, IMG_HEIGHT))
        image = np.array(image, dtype=np.float32) / 255.0
        image = np.expand_dims(image, axis=0)
        return image
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not loaded"
    return jsonify({
        "status": "ok",
        "model": model_status
    }), 200

@app.route("/predict", methods=["POST"])
def predict():
    """Predict if solar panel is clean or dusty from uploaded file"""
    try:
        if "image" not in request.files:
            return jsonify({"error": "Image not found in request"}), 400

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        image_file = request.files["image"]
        if image_file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        image = Image.open(image_file)
        processed = preprocess_image(image)
        prediction = model.predict(processed, verbose=0)

        # Determine result based on prediction threshold
        confidence = float(prediction[0][0])
        result = "Dusty Panel" if confidence > 0.5 else "Clean Panel"
        dustiness_percentage = round(confidence * 100, 2)

        return jsonify({
            "result": result,
            "confidence": confidence,
            "dustiness_percentage": dustiness_percentage,
            "is_dusty": confidence > 0.5
        }), 200

    except Exception as e:
        logger.error(f"Error in predict endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/predict-url", methods=["POST"])
def predict_url():
    """Predict if solar panel is clean or dusty from image URL (Firebase Storage)"""
    try:
        data = request.get_json()
        
        if not data or "image_url" not in data:
            return jsonify({"error": "image_url not provided"}), 400

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        image_url = data["image_url"]

        # Download image from URL
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
        except requests.exceptions.RequestException as e:
            logger.error(f"Error downloading image from URL: {e}")
            return jsonify({"error": f"Failed to download image: {str(e)}"}), 400

        # Preprocess and predict
        processed = preprocess_image(image)
        prediction = model.predict(processed, verbose=0)

        # Determine result based on prediction threshold
        confidence = float(prediction[0][0])
        result = "Dusty Panel" if confidence > 0.5 else "Clean Panel"
        dustiness_percentage = round(confidence * 100, 2)

        return jsonify({
            "result": result,
            "confidence": confidence,
            "dustiness_percentage": dustiness_percentage,
            "is_dusty": confidence > 0.5,
            "image_url": image_url
        }), 200

    except Exception as e:
        logger.error(f"Error in predict_url endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
