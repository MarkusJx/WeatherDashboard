FROM quay.io/quarkus/centos-quarkus-maven:21.0.0-java11 AS build
COPY src /usr/src/app/src
COPY build.gradle /usr/src/app
COPY settings.gradle /usr/src/app
COPY gradle.properties /usr/src/app
COPY web /usr/src/app
USER root
RUN chown -R quarkus /usr/src/app
USER quarkus
RUN gradle -b /usr/src/app/build.gradle clean build -Dquarkus.package.type=native

## Stage 2 : create the docker final image
FROM registry.access.redhat.com/ubi8/ubi-minimal
WORKDIR /work/
COPY --from=build /usr/src/app/build/*-runner /work/application
RUN chmod 775 /work
EXPOSE 8080
CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]