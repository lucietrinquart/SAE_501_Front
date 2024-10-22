export interface ResourceWithUsers {
    id: number;
    name: string;
    users: {
      id: number;
      username: string;
      workload: {
        vol_cm: number;
        vol_td: number;
        vol_tp: number;
      }
    }[];
}
