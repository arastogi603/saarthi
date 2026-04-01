# --- NEURAL BUILD STAGE ---
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the JAR file
RUN mvn clean package -DskipTests

# --- PRODUCTION RUNTIME STAGE ---
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/SkillSync-0.0.1-SNAPSHOT.jar app.jar

# Render usually listens on 8080 by default for Spring Boot
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
