FROM ghcr.io/graalvm/graalvm-ce:latest AS build
COPY . /usr/src/app
RUN gu install native-image
WORKDIR /usr/src/app
RUN ./gradlew -b /usr/src/app/build.gradle clean build -Dquarkus.package.type=native

## Stage 2 : create the docker final image
FROM registry.access.redhat.com/ubi8/ubi-minimal
WORKDIR /work/
COPY --from=build /usr/src/app/build/*-runner /work/application
RUN chmod 775 /work
EXPOSE 8080
EXPOSE 8443
CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]
