export interface AuthUserDTO {
    email: string;
    password: string;
    keepSignedIn: boolean;
}

export interface UserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface SensorDTO {
    name: string;
    location: string;
}

export interface FullSensorDTO extends SensorDTO {
    id: number;
    uuid: string;
}

export interface AuthSensorDTO {
    sensorId: number;
    expiration: number | null;
}

export interface SensorDataDTO {
    sensorId: number;
    timestamp: number;
    temperature: number;
    humidity: number;
}

export interface ErrorDTO {
    errorCode: number;
    message: string;
}