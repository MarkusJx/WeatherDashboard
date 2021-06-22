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