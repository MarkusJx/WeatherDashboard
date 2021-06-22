import IAuth from "./IAuth";
import {AuthUserDTO, UserDTO} from "./DataTransferObjects";
import Config from "../util/Config";

/**
 * The authentication strategies for the api version 1
 */
export default class AuthV1 implements IAuth {
    /**
     * Get the text from a fetch request
     *
     * @param r the response data
     * @return the text from the response
     * @private
     */
    private static getText(r: Response): Promise<string> {
        if (r.ok) {
            return r.text();
        } else {
            throw new Error(r.statusText);
        }
    }

    public loginUser(data: AuthUserDTO): Promise<string> {
        return fetch(`${Config.SERVER_URL}/api/v1/auth/authUser`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({'Content-Type': 'application/json'})
        }).then(AuthV1.getText);
    }

    public registerUser(data: UserDTO): Promise<void> {
        return fetch(`${Config.SERVER_URL}/api/v1/auth/registerUser`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({'content-type': 'application/json'})
        }).then(r => {
            if (!r.ok) {
                throw new Error(r.statusText);
            }
        });
    }

    public refreshToken(): Promise<string> {
        return fetch(`${Config.SERVER_URL}/api/v1/auth/refreshTokens`, {
            method: 'GET'
        }).then(AuthV1.getText);
    }

    public signOut(): Promise<void> {
        return fetch(`${Config.SERVER_URL}/api/v1/auth/logout`, {
            method: 'GET'
        }).catch().then();
    }
}