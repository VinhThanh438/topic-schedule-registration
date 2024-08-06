export interface IUserCreate {
    user_name: string;
}

export interface IUserScheduling {
    mod_id: string
    user_id: string,
    time_id: string
}

export interface IUserEvent {
    user_id: string
}
