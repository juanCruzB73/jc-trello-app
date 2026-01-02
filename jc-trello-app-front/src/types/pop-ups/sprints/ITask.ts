export interface ITask{
    _id?: string,
    title: string,
    description: string,
    deadLine:string,
    state: string,
    isCreate?:boolean;
}