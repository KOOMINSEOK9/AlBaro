# MySQL 8 이미지 기반
FROM mysql:8

# 로케일 패키지 설치
RUN apt-get update && apt-get install -y locales && \
    locale-gen ko_KR.UTF-8 && \
    update-locale LANG=ko_KR.UTF-8

# 환경 변수 설정
ENV LANG=ko_KR.UTF-8