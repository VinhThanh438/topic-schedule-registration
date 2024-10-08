export interface IModCreate {
    mod_name: string;
}

export interface IModScheduling {
    date: string;
    type: string;
    mod_id: string;
}

export interface IModSchedules {
    mod_schedule_id: string;
    mod_id: string;
}

export interface IModConfirm {
    schedule_room_id: string;
    mod_schedule_id: string;
}

export interface IModCanceled {
    mod_schedule_id: string;
    schedule_room_id: string;
    user_id: string;
}

export interface IModScheduleCanceled {
    mod_schedule_id: string;
}
