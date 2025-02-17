from flask import Flask, request, jsonify
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import base64
from PIL import Image
import io
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # CORS 활성화

# 모델 로드
mtcnn = MTCNN(keep_all=True, device='cpu')  # MTCNN 모델 초기화 - CPU 버전으로 설치
resnet = InceptionResnetV1(pretrained='vggface2').eval().to('cpu')  # InceptionResnetV1 모델 초기화

@app.route('/')
def home():
    return jsonify({"message": "Face Recognition API Server is running!"})

@app.route('/api/python/face-recognition/recognize', methods=['POST']) 
def recognize():
    data = request.json
    print(data)  # 수신한 데이터 출력
    
    try:
        data = request.json
        image_data = data['image']
        image_data = image_data.split(",")[1]  # base64 데이터 추출
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))

        # 이미지를 RGB로 변환
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print("Image received and decoded")  # 디버그 로그

        # 얼굴 검출 및 정렬
        aligned = mtcnn(image)
        if aligned is not None:
            print("Face detected")  # 디버그 로그
            # 얼굴 인식
            embeddings = resnet(aligned.to('cpu'))  # CPU로 변경
            print("Face embedding created")  # 디버그 로그
            
            return jsonify({"message": "Face recognized successfully!"})
        else:
            return jsonify({"error": "No face detected in the image."}), 400

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

# def send_embedding_to_backend(user_id, embedding):
#     url = "http://i12b105.p.ssafy.io/:5000/api/saveEmbedding"  # 백엔드 API URL
#     response = requests.post(url, json={"userId": user_id, "embedding": embedding.tolist()})
#     print(response.text)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context=('/etc/letsencrypt/live/i12b105.p.ssafy.io/fullchain.pem', '/etc/letsencrypt/live/i12b105.p.ssafy.io/privkey.pem'))