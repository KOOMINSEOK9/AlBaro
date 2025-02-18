from flask import Flask, request, jsonify
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import base64
from PIL import Image
import io
from flask_cors import CORS
import requests

app = Flask(__name__)

# PEM 키 파일 경로
PEM_KEY_PATH = '/etc/letsencrypt/live/i12b105.p.ssafy.io/privkey.pem'
CERT_PATH = '/etc/letsencrypt/live/i12b105.p.ssafy.io/fullchain.pem'

CORS(app)

# 모델 로드
mtcnn = MTCNN(keep_all=True, device='cpu')  # MTCNN 모델 초기화 - CPU 사용
resnet = InceptionResnetV1(pretrained='vggface2').eval().to('cpu')  # 얼굴 임베딩 모델

DEBUG_MODE = True  # 디버깅 로그 출력 여부 설정

@app.route('/')
def home():
    return jsonify({"message": "Face Recognition API Server is running!"})

@app.route('/flask/face-recognition/recognize', methods=['POST']) 
def recognize():
    try:
        data = request.json
        if DEBUG_MODE:
            print("Received data:", data)  # 디버깅 로그

        # 요청 데이터에서 이미지 추출
        image_data = data.get('image')
        if not image_data:
            return jsonify({"error": "No image data provided."}), 400

        image_data = image_data.split(",")[1]  # base64 데이터 추출
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))

        if image.mode != 'RGB':
            image = image.convert('RGB')

        aligned = mtcnn(image)
        if aligned is not None and len(aligned) > 0:
            if DEBUG_MODE:
                print("Face detected")

            embeddings = resnet(aligned.to('cpu'))  # 얼굴 임베딩 생성
            if DEBUG_MODE:
                print("Face embedding created")

            # send_embedding_to_backend(user_id, embeddings)  # 백엔드로 전송

            return jsonify({"message": "Face recognized successfully!"})
        else:
            return jsonify({"error": "No face detected in the image."}), 400

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

# def send_embedding_to_backend(user_id, embedding):
#     url = "http://i12b105.p.ssafy.io/api/saveEmbedding"  # 올바른 백엔드 URL 확인
#     response = requests.post(url, json={"userId": user_id, "embedding": embedding.tolist()})
#     print(response.text)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000 , ssl_context=(CERT_PATH, PEM_KEY_PATH))  # SSL 제거, Nginx에서 SSL 처리