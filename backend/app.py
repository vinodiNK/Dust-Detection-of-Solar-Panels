from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)

# Load CNN model
model = tf.keras.models.load_model("Dust Detection.h5")

IMG_SIZE = 224  # Must match training
IMG_HEIGHT = model.input_shape[1]
IMG_WIDTH = model.input_shape[2]

def preprocess_image(image):
     image = image.convert("RGB")     # ensure 3 channels
     image = image.resize((IMG_WIDTH, IMG_HEIGHT))
     image = np.array(image, dtype=np.float32) / 255.0
     image = np.expand_dims(image, axis=0)
     return image

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Image not found"}), 400

    image_file = request.files["image"]
    image = Image.open(image_file)

    processed = preprocess_image(image)
    prediction = model.predict(processed)

    result = "Clean Panel" if prediction[0][0] < 0.5 else "Dusty Panel"

    return jsonify({
        "result": result,
        "confidence": float(prediction[0][0])
    })

if __name__ == "__main__":
    app.run(debug=True)
