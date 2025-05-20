FROM openjdk:17-jdk-slim

WORKDIR /app

# gradlew, 소스코드 모두 복사
COPY . .

RUN chmod +x ./gradlew

# 컨테이너 내에서 빌드 실행
RUN ./gradlew build --no-daemon

# 빌드된 JAR 파일을 app.jar로 복사
RUN cp build/libs/boot_bigdata_project-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar"]