from flask import Flask, request, jsonify
from deepface import DeepFace
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/compare', methods=['POST'])
def compare_faces():
    if 'img1' not in request.files or 'img2' not in request.files:
        return jsonify({'error': 'Missing files'}), 400

    img1 = request.files['img1']
    img2 = request.files['img2']

    path1 = os.path.join(UPLOAD_FOLDER, 'img1.jpg')
    path2 = os.path.join(UPLOAD_FOLDER, 'img2.jpg')
    img1.save(path1)
    img2.save(path2)

    try:
        result = DeepFace.verify(path1, path2, enforce_detection=False)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
