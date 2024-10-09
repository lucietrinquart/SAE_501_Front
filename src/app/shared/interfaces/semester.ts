import {SemesterType} from "./semester-type";

export interface Semester {
    id: number;
    number: number;
    type_id?: SemesterType[];
    name?: string;
    nb_td?: number;
    nb_tp?: number;

}
