// @ts-ignore
const { isJwtExpired } = require('jwt-check-expiration');

export default class Credentials {
    private static readonly JWT_TOKEN: string = "jwt_token";

    public static isSignedIn(): boolean {
        return this.getToken() !== null && !isJwtExpired(this.getToken() as string);
    }

    public static signIn(token: string): void {
        sessionStorage.setItem(Credentials.JWT_TOKEN, token);
    }

    public static getToken(): string | null {
        return sessionStorage.getItem(Credentials.JWT_TOKEN);
    }
}