export default class Util {
    public static toJson<T = any>(r: Response): Promise<T> {
        if (r.ok) {
            return r.json();
        } else {
            throw new Error("The response is not ok");
        }
    }

    public static getUtcOffset(): number {
        const cur = new Date();
        let jan = new Date(cur.getFullYear(), 0, 1);
        let jul = new Date(cur.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
}