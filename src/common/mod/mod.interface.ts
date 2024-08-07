export interface IModCreate {
    mod_name: string;
}

export interface IModScheduling {
    date: string;
    type: string;
    mod_id: string;
}

export interface IModConfirm {
    room_id: string;
}
