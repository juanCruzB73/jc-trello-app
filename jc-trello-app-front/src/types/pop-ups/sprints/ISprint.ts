import { Itask } from "./ITask";

export interface ISprint{
    _id?:string;
    title:string;
    description?:string;
    beginLine:string;
    deadLine:string;
    tasks:Itask[];
}