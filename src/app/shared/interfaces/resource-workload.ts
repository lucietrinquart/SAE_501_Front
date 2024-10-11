import { ResourceList } from "./resources";
import { Semester } from "./semester";

export interface ResourceWorkload {
    id: number;
    id_resource: ResourceList[];
    id_semester: Semester[];
    vol_cm?: Float32Array;
    vol_td?: Float32Array;
    vol_tp?: Float32Array;
}
