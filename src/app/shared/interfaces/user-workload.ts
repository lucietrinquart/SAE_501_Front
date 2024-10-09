import {ResourceList} from "./resources";
import {Semester} from "./semester";
import {User} from "./user";

export interface UserWorkload {
    id: number;
    id_user: User[];
    id_ressource: ResourceList[];
    id_semester: Semester[];
    vol_cm?: Float32Array;
    vol_td?: Float32Array;
    vol_tp?: Float32Array;
}
