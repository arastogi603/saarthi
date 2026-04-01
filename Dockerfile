# --- NEURAL BUILD STAGE ---
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the JAR file
RUN mvn clean package -DskipTests

# --- PRODUCTION RUNTIME STAGE ---
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/SkillSync-0.0.1-SNAPSHOT.jar app.jar

# Render assigns a dynamic port via the $PORT environment variable.
# We pass this directly to Spring Boot via a System Property.
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
