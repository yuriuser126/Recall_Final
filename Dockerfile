FROM openjdk:17-jdk-slim

WORKDIR /app

COPY gradlew .
COPY gradle gradle

# 실행 권한 부여
RUN chmod +x gradlew

COPY . .

# 빌드
RUN ./gradlew bootJar --no-daemon

# JAR 복사
RUN cp build/libs/*.jar app.jar

CMD ["java", "-jar", "app.jar"]