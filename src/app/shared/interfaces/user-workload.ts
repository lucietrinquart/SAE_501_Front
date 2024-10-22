import { ResourceList } from "./resources";
import { Semester } from "./semester";
import { User } from "./user";

export interface UserWorkload {
    id: number;
    user_id: number;
    resource_id: number;
    semester_id: number;
    vol_cm: number;
    vol_td: number;
    vol_tp: number;
  }

