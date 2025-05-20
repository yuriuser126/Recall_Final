FROM openjdk:17-jdk-slim

WORKDIR /app

COPY . .

RUN ls -l gradlew

RUN chmod +x gradlew

RUN ls -l gradlew

RUN ./gradlew bootJar --no-daemon

RUN cp build/libs/*.jar app.jar

CMD ["java", "-jar", "app.jar"]