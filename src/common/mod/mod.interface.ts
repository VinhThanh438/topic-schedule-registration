export interface IModCreate {
    mod_name: string;
}

export interface IModScheduling {
    date: Date;
    type: string;
    mod_id: string;
    available_time: {
        time: Date;
    }[];
}

export interface IModConfirm {
    room_id: string;
}
