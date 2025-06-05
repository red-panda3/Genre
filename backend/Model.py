from flask import Flask, request, jsonify
from transformers import pipeline
import librosa
from flask_cors import CORS
import numpy as np
app = Flask(__name__)
CORS(app)
pipe = pipeline("audio-classification", model="dima806/music_genres_classification")

@app.route('/')
def home():
    return "Hello"

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    y, sr = librosa.load(file.stream, sr=None)
    file_array = np.array(y)
    result = pipe(file_array)
    max_label = max(result, key=lambda x: x['score'])
    return jsonify(max_label['label'])

if __name__ == '__main__':
    app.run(debug=True)

