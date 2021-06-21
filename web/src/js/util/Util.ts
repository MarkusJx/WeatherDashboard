export default class Util {
    public static toJson<T = any>(r: Response): Promise<T> {
        if (r.ok) {
            return r.json();
        } else {
            throw new Error("The response is not ok");
        }
    }
}