export interface User {
    id: number;
    email?: string;
    password?: string;
    username: string;
    role: string;
    max_hour_vol?: Float32Array; // Changé de Float32Array à number
}