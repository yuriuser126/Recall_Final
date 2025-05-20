FROM openjdk:17
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build --stacktrace
CMD ["java", "-jar", "build/libs/boot_bigdata_project-0.0.1-SNAPSHOT.jar"]