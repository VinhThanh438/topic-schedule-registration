export interface IUserCreate {
    user_name: string;
}

export interface IUserScheduled {
    mod_id: string;
    user_id: string;
    mod_schedule_id: string;
}

export interface IUserEvent {
    user_id: string;
}

export interface IUserCanceled {
    topic_schedule_id: string;
}
