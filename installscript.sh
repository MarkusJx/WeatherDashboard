#!/bin/bash

question() {
    while true; do
        read -p "$1" yn
        if [ -z "$yn" ]; then
            yn="$2"
        fi

        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Error: Invalid input.";;
        esac
    done
}

commandExists() {
    if command -v "$1" &> /dev/null
    then
        return 0;
    else
        return 1;
    fi
}

checkRoot() {
    if [ "$EUID" -ne 0 ]; then
        echo "Please run as root"
        exit 1
    fi
}

checkExit() {
    if [ $? -ne 0 ]; then
        echo "$1, exiting"
        exit 1
    fi
}

runApt() {
    if commandExists 'apt-get' ; then
        apt-get $@
        if [ $? -ne 0 ]; then
            echo "apt-get failed. Cannot continue."
            exit 1
        fi
    else
        echo "apt-get wasn't found. Can't continue."
        exit 1
    fi
}

installSoftware() {
    runApt 'install -y' $@
}

softwareUpdated=false
updateSoftware() {
    if [ $softwareUpdated = false ]; then
        echo "Running apt-get update..."
        runApt 'update'
        softwareUpdated=true
    fi
}

isArmv7=false
checkArch() {
    if [ "$(uname -m)" = 'armv7l' ]; then
        echo 'Running on 32 bit arm machine'
        isArmv7=true
    fi
}

checkInstalledSoftware() {
    updateSoftware
    if question 'Upgrade software? [Y/n]: ' 'Y'; then
        runApt 'upgrade -y'
    fi

    installSoftware 'openssl' 'curl'

    if commandExists 'docker' ; then
        echo "docker is already installed";
    else
        echo "docker isn't installed, running the install script..."
        curl -fsSL https://get.docker.com | bash
        checkExit 'The docker install script failed'
    fi

    if commandExists 'docker-compose' ; then
        echo 'docker-compose is already installed';
    else
        echo 'Installing docker-compose...'
        softwareUpdated=false
        updateSoftware
        installSoftware 'python3' 'python3-pip'
        python3 -m pip install docker-compose

        checkExit 'The docker-compose installation failed'
    fi
}

createDirectory() {
    dirName="weather_dashboard"
    if [ -d "$dirName" ]; then
        echo "The directory 'weather_dashboard' already exists"
        if question 'Delete the directory? [Y/n]: ' 'y'; then
            echo "Deleting directory $dirName..."
            rm -rf $dirName || exit 1
        else
            while true; do
                read -p "Please enter a new directory name: " dirName
                if [ -z "$dirName" ] || [ -d "$dirName" ]; then
                    echo "Invalid input."
                else
                    break;
                fi
            done
        fi
    fi

    echo "Creating directory '$dirName'..."
    mkdir "$dirName" || exit 1
    cd "$dirName" || exit 1
}

createJwtCertificates() {
    echo "Generating JSON web token certificates..."
    openssl req -newkey rsa:2048 -new -nodes -keyout jwtPrivateKey.pem -out csr.pem
    checkExit 'The key generation operation failed'
    openssl rsa -in jwtPrivateKey.pem -pubout > jwtPublicKey.pem
    checkExit 'The key signing operation failed'
    echo "Done generating certificates."
}


generateConfig() {
    readString() {
        while true; do
            read -p "$1" res
            if [ -n "$res" ] || [ -n "$2" ]; then
                if [ -z "$res" ]; then
                    res="$2"
                fi
                echo "$res"
                break
            fi
        done
    }

    mariadbUser="weather"
    mariadbPassword="weather"
    dbAddress="jdbc:mariadb://mariadb:3306/weather"
    if question 'Create mariadb docker container? [Y/n]: ' 'Y'; then
        mariadbDocker=true
        read -p "Enter a mariadb user name [weather]: " mariadbUser
        if [ -z "$mariadbUser" ]; then
            mariadbUser="weather"
        fi

        read -p "Enter a mariadb database name [weather]: " mariadbDatabase
        if [ -z "$mariadbDatabase" ]; then
            mariadbDatabase="weather"
        fi

        echo -n "Enter a mariadb password [weather]: "
        read -s mariadbPassword
        if [ -z "$mariadbPassword" ]; then
            mariadbPassword="weather"
        fi
        echo ""

        echo -n "Enter a mariadb root password [Password]: "
        read -s mariadbRootPassword
        if [ -z "$mariadbRootPassword" ]; then
            mariadbRootPassword="Password"
        fi
        echo ""

        read -p "Enter a docker database volume name [mariadb-weather-data]: " dbVolume
        if [ -z "$dbVolume" ]; then
            dbVolume="mariadb-weather-data"
        fi
    else
        mariadbDocker=false
        dbAddress=$(readString 'Enter the database address: ')
        mariadbUser=$(readString 'Enter the connection user name: ')
        while true; do
            echo -n "Enter the connection password: "
            read -s mariadbPassword
            echo ""
            if [ -z "$mariadbPassword" ]; then
                echo "Error: Invalid input."
            else
                break
            fi
        done
    fi

    if [ $isArmv7 = true ]; then
        imageName="ghcr.io/markusjx/weather_dashboard/jvm:latest"
    else
        if question 'Use the native image? [Y/n]: ' 'y'; then
            imageName="ghcr.io/markusjx/weather_dashboard/native:latest"
        else
            imageName="ghcr.io/markusjx/weather_dashboard/jvm:latest"
        fi
    fi

    write() {
        printf "%s\n" "$1" >> docker-compose.yml
        checkExit 'A write operation failed'
    }

    write "version: '3.6'"
    write 'services:'

    if [ $mariadbDocker = true ]; then
        write '  mariadb:'
        if [ $isArmv7 = true ]; then
            write '    image: jsurf/rpi-mariadb:latest'
        else
            write '    image: mariadb:latest'
        fi

        write '    container_name: mariadb_weather'
        write '    hostname: sqlserver'
        write '    environment:'
        write "      MYSQL_USER: $mariadbUser"
        write "      MYSQL_PASSWORD: $mariadbPassword"
        write "      MYSQL_ROOT_PASSWORD: $mariadbRootPassword"
        write "      MYSQL_DATABASE: $mariadbDatabase"
        write "    healthcheck:"
        write '      test: mysqladmin ping -h 127.0.0.1 -u $$MYSQL_USER --password=$$MYSQL_PASSWORD'
        write '      interval: 2s'
        write '      timeout: 20s'
        write '      retries: 10'
        write '    volumes:'
        write "      - $dbVolume:/var/lib/mysql"
        write ""
    fi

    write '  webserver:'
    write "    image: $imageName"
    write '    depends_on:'
    write '      mariadb:'
    write '        condition: service_healthy'
    write '    ports:'
    write '      - "80:8080"'
    write '      - "443:8443"'
    write '    volumes:'
    write '      # Environment file'
    write '      - "./.env:/work/.env"'
    write '      # JWT RSA keys'
    write '      - "./jwtPublicKey.pem:/work/jwtPublicKey.pem"'
    write '      - "./jwtPrivateKey.pem:/work/jwtPrivateKey.pem"'

    {
      printf "QUARKUS_DATASOURCE_JDBC_URL=%s\n" "$dbAddress"
      printf "QUARKUS_DATASOURCE_USERNAME=%s\n" "$mariadbUser"
      printf "QUARKUS_DATASOURCE_PASSWORD=%s\n" "$mariadbPassword"
    } >> .env
    checkExit 'A write operation failed'

    if question 'Enable ssl support? [y/N]: ' 'n'; then
        sslFile=$(readString 'Enter the certificate file name [ssl.crt]: ' 'ssl.crt')
        sslKeyFile=$(readString 'Enter the certificate key file name [ssl.key]: ' 'ssl.key')

        {
          printf "QUARKUS_HTTP_SSL_CERTIFICATE_FILE=%s\n" "$sslFile"
          printf "QUARKUS_HTTP_SSL_CERTIFICATE_KEY_FILE=%s\n" "$sslKeyFile"
        } >> .env
        checkExit 'A write operation failed'

        write '      # Key files for ssl support'
        write "      - \"./$sslFile:/work/$sslFile\""
        write "      - \"./$sslKeyFile:/work/$sslKeyFile\""
    fi

    write ''
    write '# Store the database permanently'
    write 'volumes:'
    write "  $dbVolume:"
    echo "Done generating 'docker-compose.yml' and '.env'."
}

startContainer() {
    if question 'Start the docker containers? [Y/n]: ' 'y'; then
        echo "Starting the docker containers..."
        docker-compose up
        retries=0
        while [ $? -eq 1 ] && [ $retries -lt 10 ]; then
            echo "'docker-compose up' failed"
            if question 'Retry? [Y/n]: ' 'y'; then
                ((retries=retries+1))
                docker-compose up
            else
                exit 1
            fi
        done

        if [ $retries -ge 10 ]; then
            echo "Max amount of retries reached, this shouldn't be happening, exiting"
            exit 1
        fi
    fi
}

checkRoot
checkArch
checkInstalledSoftware
createDirectory
createJwtCertificates
generateConfig
startContainer