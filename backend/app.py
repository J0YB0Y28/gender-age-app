from flask import Flask, request, jsonify
from detector import detect_gender_and_age
import numpy as np
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permet au frontend React de faire des requêtes

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    gender, age = detect_gender_and_age(img)
    return jsonify({"gender": gender, "age": age})

if __name__ == "__main__":
    app.run(debug=True)
