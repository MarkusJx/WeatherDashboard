import IAuth from "../api/IAuth";

const {isJwtExpired} = require('jwt-check-expiration');

/**
 * A login/logout change listener
 */
export type ChangeListener = (signedIn: boolean) => void;

/**
 * A class for managing login and logout operations
 */
export default class Credentials {
    /**
     * The json web token session storage key
     * @private
     */
    private static readonly JWT_TOKEN: string = "jwt_token";

    /**
     * The signed in session storage key
     * @private
     */
    private static readonly SIGNED_IN: string = "signed_in";

    /**
     * The change listeners
     * @private
     */
    private static readonly changeListeners: ChangeListener[] = [];

    /**
     * Check if a user is signed in
     *
     * @return true if a user is signed in
     */
    public static async isSignedIn(): Promise<boolean> {
        await this.refreshToken();
        return this.getToken() !== null &&
            !isJwtExpired(this.getToken() as string) &&
            Credentials.getSignedIn() === true;
    }

    /**
     * Sign in a user
     *
     * @param token the jwt auth token
     */
    public static signIn(token: string): void {
        sessionStorage.setItem(Credentials.JWT_TOKEN, token);
        Credentials.setSignedIn(true);
        Credentials.callChangeListeners(true);
    }

    /**
     * Sign out the currently logged in user.
     * Deletes the jwt token from the session storage
     * and sets signed_in in the session storage to false.
     * Additionally, sends a request to the server to delete
     * the session cookies
     *
     * @param sendRequest whether to send a request to delete the session cookies
     */
    public static async signOut(sendRequest: boolean = true): Promise<void> {
        sessionStorage.removeItem(Credentials.JWT_TOKEN);
        Credentials.setSignedIn(false);
        Credentials.callChangeListeners(false);
        if (sendRequest) {
            await IAuth.getInstance().signOut();
        }
    }

    /**
     * Get the jwt sign-in token
     *
     * @return the token or null if it isn't set
     */
    public static getToken(): string | null {
        return sessionStorage.getItem(Credentials.JWT_TOKEN);
    }

    /**
     * Listen for a log in change
     *
     * @param listener the change listener
     */
    public static listenLogInChange(listener: ChangeListener): void {
        Credentials.changeListeners.push(listener);
    }

    /**
     * Unlisten for the login/logout event
     *
     * @param listener the listener to remove
     */
    public static unlistenLogInChange(listener: ChangeListener): void {
        Credentials.changeListeners.splice(Credentials.changeListeners.indexOf(listener), 1);
    }

    /**
     * Refresh the jwt authentication token
     */
    public static async refreshToken(): Promise<void> {
        if ((this.getToken() == null || isJwtExpired(this.getToken()!)) && Credentials.getSignedIn() !== false) {
            try {
                const token = await IAuth.getInstance().refreshToken();
                return Credentials.signIn(token);
            } catch (ignored) {
                return Credentials.signOut(false);
            }
        }
    }

    /**
     * Call the login/logout change listeners
     *
     * @param signedIn whether a user was signed in
     * @private
     */
    private static callChangeListeners(signedIn: boolean): void {
        Credentials.changeListeners.forEach((listener: ChangeListener) => {
            listener(signedIn);
        });
    }

    /**
     * Set whether a user is signed in in the session storage
     *
     * @param value whether a user is signed in
     * @private
     */
    private static setSignedIn(value: boolean): void {
        sessionStorage.setItem(Credentials.SIGNED_IN, JSON.stringify(value));
    }

    /**
     * Get if a user is signed in
     *
     * @return true if a user is signed in, false if not,
     * null if the value doesn't exist in the session storage
     * @private
     */
    private static getSignedIn(): boolean | null {
        const data = sessionStorage.getItem(Credentials.SIGNED_IN);
        if (data != null) {
            return JSON.parse(data) as boolean;
        } else {
            return null;
        }
    }
}