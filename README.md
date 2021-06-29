![WeatherDashboard](https://socialify.git.ci/MarkusJx/WeatherDashboard/image?description=1&language=1&owner=1&theme=Light)

## Server setup (docker)
* Take a look at ``docker-compose.yml``
    * If you want to keep using the mariadb database, you may want to change the passwords
    * If you want to use native/compiled images instead of java images (``amd64``/``arm64`` only) change
        * ``image: ghcr.io/markusjx/weather_dashboard/jvm:latest`` to
        * ``image: ghcr.io/markusjx/weather_dashboard/native:latest``
* Create a new public/private key pair for signing json web tokens and place those files next to your ``docker-compose.yml``
```shell
openssl req -newkey rsa:2048 -new -nodes -keyout jwtPrivateKey.pem -out csr.pem
openssl rsa -in jwtPrivateKey.pem -pubout > jwtPublicKey.pem
```
* Edit ``.env.example`` to set your database password and username
* (Optional) Enable ssl support
    * Get a ssl certificate for ssl support
    * Place the certificate files next to your ``docker-compose.yml``
    * Uncomment and edit the following lines in ``docker-compose.yml``:
    ```shell
    #- "./ssl.crt:/work/ssl.crt"
    #- "./ssl.key:/work/ssl.key"
    ```
    * Uncomment and edit the following lines in ``.env`` (``.env.example``):
    ````env
    #QUARKUS_HTTP_SSL_CERTIFICATE_FILE=ssl.crt
    #QUARKUS_HTTP_SSL_CERTIFICATE_KEY_FILE=ssl.key  
    ````
* Start the docker container
```shell
docker-compose up
```
* The server is now available at ``http://0.0.0.0`` and ``https://0.0.0.0`` (if ssl is enabled)
