import {AuthSensorDTO, AuthUserDTO, UserDTO} from "./v1/DataTransferObjects";
import AuthV1 from "./v1/AuthV1";

/**
 * An abstract class for authentication
 */
export default abstract class IAuth {
    /**
     * The static instance
     * @private
     */
    private static readonly instance: IAuth = new AuthV1();

    /**
     * Get the static authentication instance
     *
     * @return the static instance
     */
    public static getInstance(): IAuth {
        return IAuth.instance;
    }

    /**
     * Log in a user
     *
     * @param data the authentication data
     * @return the jwt authentication token
     */
    public abstract loginUser(data: AuthUserDTO): Promise<string>;

    /**
     * Register a new user
     *
     * @param data the user registration data
     */
    public abstract registerUser(data: UserDTO): Promise<void>;

    /**
     * Refresh the jwt authentication token
     *
     * @return the refreshed authentication token
     */
    public abstract refreshToken(): Promise<string>;

    /**
     * Sign out the current user
     */
    public abstract signOut(): Promise<void>;

    /**
     * Authenticate a sensor
     *
     * @param data the sensor authentication data
     * @param token the jwt token for the current user
     * @return the generated jwt authentication token
     */
    public abstract authSensor(data: AuthSensorDTO, token: string): Promise<string>;
}