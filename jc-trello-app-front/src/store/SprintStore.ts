import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ISprint } from "../types/pop-ups/sprints/ISprint";

interface ISprintStore {
  sprints: ISprint[];
  activeSprint: ISprint|null;
  setActiveSprint:(activeSprint:ISprint|null)=>void;
  setSprints:(SprintArray:ISprint[])=>void;
  setAddNewSprint:(newSprint:ISprint)=>void;
  setUpdateSprint:(newSprint:ISprint)=>void;
  setDeleteSprint:(sprintId:string)=>void;
}

export const sprintStore  = create<ISprintStore>()(
  devtools(
    (set) => ({
      sprints: [],
      activeSprint: null,
      setActiveSprint: (activeSprintIn)=>set(()=>({activeSprint: activeSprintIn})),
      setSprints: (sprintsIn)=>set(()=>({sprints:sprintsIn})),
      setAddNewSprint:(sprintsIn)=>set(((state)=>({sprints:[...state.sprints,sprintsIn]}))),
      setUpdateSprint:(sprintsIn)=>set((state)=>{
        const sprintArr=state.sprints.map((sprint:ISprint)=>sprint._id===sprintsIn._id?sprintsIn:sprint);
        return {sprints:sprintArr};
      }),
      setDeleteSprint:(sprintId)=>set((state)=>{
        const sprintArr=state.sprints.filter((sprint:ISprint)=>sprint._id!==sprintId);
        return {sprints:sprintArr};
      })
    }),
    { name: "sprintStore" }
  )
);

