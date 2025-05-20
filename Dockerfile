FROM openjdk:17-jdk-slim

WORKDIR /app

COPY gradlew .
COPY gradle gradle
RUN chmod +x gradlew

COPY . .

RUN ./gradlew bootJar --no-daemon

RUN cp build/libs/*.jar app.jar

CMD ["java", "-jar", "app.jar"]