# backend/Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app

# wait-for-it.sh 스크립트 복사 및 실행 권한 부여
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# gradlew 파일에 실행 권한 부여
RUN chmod +x gradlew

# Gradle 빌드
# RUN ./gradlew build --no-daemon

# 임시로 테스트 안해도 되도록 -> 지금 디비 안되어있어서
RUN ./gradlew build -x test --no-daemon
# JAR 파일 복사
COPY build/libs/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# JAR 파일이 올바르게 복사되었는지 확인
RUN ls -l /app

# wait-for-it.sh를 사용하여 데이터베이스가 준비될 때까지 대기
ENTRYPOINT ["/usr/local/bin/wait-for-it.sh", "db:3306", "--", "java", "-jar", "/app/app.jar"]