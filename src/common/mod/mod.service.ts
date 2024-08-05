import { IModCreate, IModScheduling } from './mod.interface';
import Mod, { IMod } from './Mod.model';

export class ModService {
    static async create(req: IModCreate): Promise<void> {
        try {
            await Mod.create(
                new Mod({
                    mod_name: req.mod_name,
                }),
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async modScheduling(req: IModScheduling): Promise<IModScheduling> {
        try {
            // const modData = await Mod.findById(req.mod_id)
            // const newData = req.available_time

            // newData.forEach(time => {
            //     modData.available_time.push(time)
            // });

            // await modData.save()

            return req
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
