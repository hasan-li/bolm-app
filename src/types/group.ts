import {User} from "./auth";

export interface Group {
    id: string;
    name: string;
}

export interface GroupDetail extends Group {
    members: User[];
}