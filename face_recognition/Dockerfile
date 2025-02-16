# face_recognition/Dockerfile
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 요구 사항 파일 복사
COPY requirements.txt .

RUN pip install --upgrade pip
# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 5000

# 애플리케이션 실행 명령
CMD ["python", "app.py"]