#!/bin/bash

question() {
    while true; do
        read -p "$1 [Y/n]: " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Error: Invalid input.";;
        esac
    done
}

commandExists() {
    if command -v $1 &> /dev/null
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

runApt() {
    if commandExists 'apt-get' ; then
        apt-get $@
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
    if [ $(uname -m) = 'armv7l' ]; then
        echo 'Running on 32 bit arm machine'
        isArmv7=true
    fi
}

checkInstalledSoftware() {
    if commandExists 'docker' ; then
        echo "docker is already installed";
    else
        echo "docker isn't installed, running apt-get..."
        updateSoftware
        installSoftware 'docker'
    fi

    if commandExists 'docker-compose' ; then
        echo "docker-compoes is already installed"
    else
        echo "docker-compose isn't installed, running apt-get..."
        updateSoftware
        installSoftware 'docker-compose'
    fi

    if commandExists 'openssl' ; then
        echo "openssl is already installed"
    else
        echo "openssl isn't installed, running apt-get..."
        updateSoftware
        installSoftware 'openssl'
    fi
}

createDirectory() {
    dirName="weather_dashboard"
    if [ -d "$dirName" ]; then
        echo "The directory 'weather_dashboard' already exists"
        while true; do
            read -p "Please enter a new directory name: " dirName
            if [ -z "$dirName" ] || [ -d "$dirName" ]; then
                echo "Invalid input."
            else
                break;
            fi
        done
    fi

    echo "Creating directory '$dirName'..."
    mkdir $dirName
    cd $dirName
}

createJwtCertificates() {
    echo "Generating JSON web token certificates..."
    openssl req -newkey rsa:2048 -new -nodes -keyout jwtPrivateKey.pem -out csr.pem
    openssl rsa -in jwtPrivateKey.pem -pubout > jwtPublicKey.pem
    echo "Done generating certificates."
}


generateConfig() {
    readString() {
        while true; do
            read -p "$1" res
            if [ ! -z "$res" ] || [ ! -z "$2" ]; then
                if [ -z "$res" ]; then
                    res="$2"
                fi
                echo $res
                break
            fi
        done
    }

    mariadbUser="weather"
    mariadbPassword="weather"
    dbAddress="jdbc:mariadb://mariadb:3306/weather"
    if question 'Create mariadb docker container?'; then
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
        if question 'Use the native image?'; then
            imageName="ghcr.io/markusjx/weather_dashboard/native:latest"
        else
            imageName="ghcr.io/markusjx/weather_dashboard/jvm:latest"
        fi
    fi

    write() {
        printf "$1\n" >> docker-compose.yml
    }

    write "version: '3.6'"
    write 'services:'

    if [ $mariadbDocker = true ]; then
        write ' mariadb:'
        if [ $isArmv7 = true ]; then
            write '  image: jsurf/rpi-mariadb:latest'
        else
            write '  image: mariadb:latest'
        fi

        write '  container_name: mariadb_weather'
        write '  hostname: sqlserver'
        write '  environment:'
        write "   MYSQL_USER: $mariadbUser"
        write "   MYSQL_PASSWORD: $mariadbPassword"
        write "   MYSQL_ROOT_PASSWORD: $mariadbRootPassword"
        write "   MYSQL_DATABASE: $mariadbDatabase"
        write "  healthcheck:"
        write '   test: mysqladmin ping -h 127.0.0.1 -u $$MYSQL_USER --password=$$MYSQL_PASSWORD'
        write '   interval: 2s'
        write '   timeout: 20s'
        write '   retries: 10'
        write '  volumes:'
        write "   - $dbVolume:/var/lib/mysql"
        write ""
    fi

    write ' webserver:'
    write "  image: $imageName"
    write '  depends_on:'
    write '   mariadb:'
    write '    condition: service_healthy'
    write '  ports:'
    write '   - "80:8080"'
    write '   - "443:8443"'
    write '  volumes:'
    write '   # Environment file'
    write '   - "./.env:/work/.env"'
    write '   # JWT RSA keys'
    write '   - "./jwtPublicKey.pem:/work/jwtPublicKey.pem"'
    write '   - "./jwtPrivateKey.pem:/work/jwtPrivateKey.pem"'

    printf "QUARKUS_DATASOURCE_JDBC_URL=$dbAddress\n" >> .env
    printf "QUARKUS_DATASOURCE_USERNAME=$mariadbUser\n" >> .env
    printf "QUARKUS_DATASOURCE_PASSWORD=$mariadbPassword\n" >> .env

    if question 'Enable ssl support?'; then
        sslFile=$(readString 'Enter the certificate file name [ssl.crt]: ' 'ssl.crt')
        sslKeyFile=$(readString 'Enter the certificate key file name [ssl.key]: ' 'ssl.key')

        printf "QUARKUS_HTTP_SSL_CERTIFICATE_FILE=$sslFile\n" >> .env
        printf "QUARKUS_HTTP_SSL_CERTIFICATE_KEY_FILE=$sslKeyFile\n" >> .env

        write '   # Key files for ssl support'
        write "   - \"./$sslFile:/work/$sslFile\""
        write "   - \"./$sslKeyFile:/work/$sslKeyFile\""
    fi

    write ''
    write '# Store the database permanently'
    write ' volumes:'
    write "  $dbVolume:"
    echo "Done generting 'docker-compose.yml' and '.env'."
}

startContainer() {
    if question 'Start the docker containers?'; then
        echo "Starting the docker containers..."
        docker-compose up
    fi
}

checkRoot
checkArch
checkInstalledSoftware
createDirectory
createJwtCertificates
generateConfig
startContainer