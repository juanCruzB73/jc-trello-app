import { IUser } from "../../auth/IUser";
import { ITask } from "./ITask";

export interface IBacklogs {
    id: string;
    user: IUser;
    tasks: ITask[];
}