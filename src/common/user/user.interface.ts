export interface IUserCreate {
    user_name: string;
}

export interface IUserScheduling {
    mod_id: string;
    user_id: string;
    mod_schedule_id: string;
}

export interface IUserEvent {
    user_id: string;
}
