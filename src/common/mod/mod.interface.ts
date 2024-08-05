export interface IModCreate {
    mod_name: string;
}

export interface IModScheduling {
    mod_id: string,
    available_time: {
        time: Date
    } []
}