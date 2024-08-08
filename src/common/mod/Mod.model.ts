import { Schema, model, Document } from 'mongoose';
import { ModStatus } from './mod-status';

interface IModResponse {
    mod_id: string;
    mod_name: string;
    status: string;
}

// morning (M): 8 - 11
// afternoon (A): 14 - 17
// evening (E): 19 - 22
// 7 types: M, A, E, MA, ME, AE, ALL
// Input values: {
//  mod_id:
//  time :
//  type: (M, A, E, MA, ME, AE, ALL)
//}
export interface IMod extends Document {
    _id: Schema.Types.ObjectId;
    mod_name: string;
    status: string; // online, busy, offline

    transform(): IModResponse;
}

const ModSchema: Schema<IMod> = new Schema({
    mod_name: { type: String, require: true },
    status: { type: String, require: true, default: ModStatus.ONLINE },
});

ModSchema.method({
    transform(): IModResponse {
        const transformed: IModResponse = {
            mod_id: this._id.toHexString(),
            mod_name: this.mod_name,
            status: this.status,
        };
        return transformed;
    },
});

export default model<IMod>('Mod', ModSchema);
