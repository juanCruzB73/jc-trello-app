import { sprintStore } from "../store/SprintStore";
import { taskStore } from "../store/TaskStore";
import { Itask } from "../types/pop-ups/sprints/ITask";

const API_URL = import.meta.env.VITE_SPRINTS_URL;

export const getTasksBySprint=async(idSprint:string)=>{  
    try{
        const response = await fetch(`${API_URL}/${idSprint}/tasks`);
        const data = await response.json();
        return taskStore.getState().setSprints(data.sprintTasks);
    }catch(error){
        console.error(error);
    }
};
export const addTask=async(taskIn:Itask)=>{  
    try{
        const sprint=sprintStore.getState().activeSprint;
        if(!sprint)return;
        const response = await fetch(`${API_URL}/${sprint?._id}/tasks`,{method:"POST",headers: { 'Content-Type': 'application/json' },body:JSON.stringify(taskIn)});
        const data = await response.json();
        sprint.tasks.push(data.newTask);
        sprintStore.getState().setUpdateSprint(sprint);
        sprintStore.getState().setActiveSprint(sprint);
        return;
    }catch(error){
        console.error(error);
    }
};
export const updateTask=async(taskIn:Itask)=>{  
    try{   
        const sprint=sprintStore.getState().activeSprint;
        if(!sprint)return;
        const response = await fetch(`${API_URL}/${sprint?._id}/tasks/${taskIn._id}`,{method:"PUT",headers: { 'Content-Type': 'application/json' },body:JSON.stringify(taskIn)});
        const data = await response.json();
        sprint.tasks=sprint.tasks.map((task: Itask)=>task._id === taskIn._id ? taskIn : task);
        sprintStore.getState().setUpdateSprint(sprint);
        sprintStore.getState().setActiveSprint(sprint);
    }catch(error){
        console.error(error);
    }
};
export const deleteTask=async(taskId:string)=>{  
    try{
        const sprint=sprintStore.getState().activeSprint;
        if(!sprint)return;
        const response = await fetch(`${API_URL}/${sprint?._id}/tasks/${taskId}`,{method:"DELETE",headers: { 'Content-Type': 'application/json' }});
        sprint.tasks = sprint.tasks.filter((task:Itask)=>task._id!==taskId);
        sprintStore.getState().setUpdateSprint(sprint);
        sprintStore.getState().setActiveSprint(sprint);
    }catch(error){
        console.error(error);
    }
};