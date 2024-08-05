import { IModCreate } from "./mod.interface";
import Mod from "./Mod.model";

export class ModService {
    static async create(req: IModCreate): Promise<void> {
        try {
            await Mod.create(new Mod({
                mod_name: req.mod_name
            }))
        } catch (error) {
            throw new Error(error.message)
        }
    }
}