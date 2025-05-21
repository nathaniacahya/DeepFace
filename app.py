from flask import Flask, request, jsonify, render_template, send_from_directory
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
        # Use DeepFace to verify the faces
        result = DeepFace.verify(path1, path2, enforce_detection=False)
        
        # Log the result for debugging
        print("DeepFace Result:", result)
        
        # Ensure keys in result are converted to strings for JSON
        cleaned_result = {
            'verified': bool(result.get('verified')),
            'distance': float(result.get('distance', 0)),
            'threshold': float(result.get('threshold', 0)),
            'model': str(result.get('model', 'VGG-Face'))
        }
        
        return jsonify(cleaned_result)
    except Exception as e:
        print("Error in face comparison:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
