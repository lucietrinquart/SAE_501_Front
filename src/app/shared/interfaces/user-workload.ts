import {User} from "./user";

export interface UserWorkload {
    id: number;
    id_ressource: string;
    id_semester: string;
    vol_cm?: Float32Array;
    vol_td?: Float32Array;
    vol_tp?: Float32Array;
}
