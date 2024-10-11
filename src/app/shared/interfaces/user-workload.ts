import { User } from './user';
import { Semester } from './semester';
import { ResourceList } from './resources';

export interface UserWorkload {
  id: number;
  id_user: User[];
  id_ressource: ResourceList[];
  id_semester: Semester[];
  vol_cm?: number;
  vol_td?: number;
  vol_tp?: number;
}