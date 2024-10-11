import { ResourceList } from "./resources";
import { Semester } from "./semester";
import { User } from "./user";

export interface UserWorkload {
    id: number;
    user_id: number;
    resource_id: number;
    semester_id: Semester[];
    vol_cm?: Float32Array;
    vol_td?: Float32Array;
    vol_tp?: Float32Array;
}
