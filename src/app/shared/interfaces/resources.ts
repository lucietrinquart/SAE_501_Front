export interface ResourceList {
    id: number;
    name: string;
    semester_id: number;  // Changé de Semester[] à number
    description?: string;
    resource_type_id: number;
    ref_teacher_id?: number;
    course?: string;
    vol_nat: number;
    vol_nat_tp: number;
    vol_e?: number;
    vol_ne?: number;
}