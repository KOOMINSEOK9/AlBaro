# backend/Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app

# Gradle Wrapper 및 소스 코드 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Gradle 빌드
RUN ./gradlew build --no-daemon

# JAR 파일 복사
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]