export interface IAuth {
    name: string;
    password: string;
    role: string;
}

export interface IAuthEvent {
    _id: string;
    ip: string;
    refreshToken: string;
}
