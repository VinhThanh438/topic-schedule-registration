export interface IAuth {
    name: string;
    password: string;
    role: string;
}

export interface IAuthEvent {
    id: string;
    ip: string;
    refreshToken: string;
}
