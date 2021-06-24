import {ErrorDTO} from "../api/v1/DataTransferObjects";

export default class Util {
    public static async toJson<T = any>(r: Response): Promise<T> {
        if (r.ok) {
            return r.json();
        } else {
            let message: string = "The request failed";
            try {
                const error: ErrorDTO = JSON.parse(await r.text());
                message = error.message;
            } catch (ignored) {
            }
            throw new Error(message);
        }
    }

    public static getUtcOffset(): number {
        const cur = new Date();
        let jan = new Date(cur.getFullYear(), 0, 1);
        let jul = new Date(cur.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
}