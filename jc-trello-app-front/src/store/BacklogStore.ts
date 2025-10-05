import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Itask } from "../types/pop-ups/sprints/ITask";

interface IBacklogStore {
  backlogTasks: Itask[];
  activeBacklogTasks: Itask|null;
  setActiveBacklogTasks:(activeSprint:Itask|null)=>void;
  setBacklogTasks:(SprintArray:Itask[])=>void;
  setAddNewBacklogTasks:(newSprint:Itask)=>void;
  setUpdateBacklogTasks:(newSprint:Itask)=>void;
  setDeleteBacklogTasks:(sprintId:string)=>void;
}

export const backlogStore  = create<IBacklogStore>()(
  devtools(
    (set) => ({
      backlogTasks: [],
      activeBacklogTasks: null,
      setActiveBacklogTasks: (activeBacklogTasksIn)=>set(()=>({activeBacklogTasks: activeBacklogTasksIn})),
      setBacklogTasks: (backlogIn)=>set(()=>({backlogTasks:backlogIn})),
      setAddNewBacklogTasks:(backlogIn)=>set(((state)=>({backlogTasks:[...state.backlogTasks,backlogIn]}))),
      setUpdateBacklogTasks:(backlogIn)=>set((state)=>{
        const backlogArr=state.backlogTasks.map((backlog:Itask)=>backlog._id===backlogIn._id?backlogIn:backlog);
        return {backlogTasks:backlogArr};
      }),
      setDeleteBacklogTasks:(backlogIn)=>set((state)=>{
        const sprintArr=state.backlogTasks.filter((sprint:Itask)=>sprint._id!==backlogIn);
        return {backlogTasks:sprintArr};
      })
    }),
    { name: "backlogStore" }
  )
);

