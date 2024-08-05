import { GenerateTime } from '@common/utils/generate-time';
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

    static async modScheduling(req: IModScheduling): Promise<IMod> {
        try {
            new GenerateTime(req.type, new Date(req.date))
            const gen = GenerateTime.generate()
            
            console.log(gen)
            const modData = await Mod.findById(req.mod_id)
            
            gen.forEach(time => {
                modData.available_time.push(time)
            });

            console.log(modData)
            
            await modData.save()
            
            return modData;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
