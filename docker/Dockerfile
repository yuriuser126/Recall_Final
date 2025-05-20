# Dockerfile

FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌드된 JAR 파일을 이미지로 복사 (경로가 맞는지 꼭 확인!)
COPY build/libs/boot_bigdata_project-0.0.1-SNAPSHOT.jar app.jar

# 컨테이너 시작 시 실행 명령
CMD ["java", "-jar", "app.jar"]