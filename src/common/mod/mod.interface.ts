export interface IModCreate {
    mod_name: string;
}

export interface IModScheduling {
    date: string;
    type: string;
    mod_id: string;
}

export interface IModConfirm {
    schedule_room_id: string;
}
