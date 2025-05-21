FROM openjdk:17-jdk-slim

WORKDIR /app

# Node.js 설치 및 wkhtmltopdf 설치
RUN apt-get update && apt-get install -y curl wkhtmltopdf \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

COPY . .

RUN ls -l gradlew

RUN chmod +x gradlew

RUN ls -l gradlew

RUN ./gradlew bootJar --no-daemon

RUN cp build/libs/*.jar app.jar

CMD ["java", "-jar", "app.jar"]