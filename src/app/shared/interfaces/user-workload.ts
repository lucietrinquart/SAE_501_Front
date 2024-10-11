import { ResourceList } from "./resources";
import { Semester } from "./semester";
import { User } from "./user";

export interface UserWorkload {
    id: number;
    user_id: number; // Changé de User[] à number
    resource_id: number; // Changé de ResourceList[] à number
    semester_id: number; // Changé de Semester[] à number
    vol_cm?: number; // Changé de Float32Array à number
    vol_td?: number; // Changé de Float32Array à number
    vol_tp?: number; // Changé de Float32Array à number
}