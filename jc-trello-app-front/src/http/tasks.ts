import { sprintStore } from "../store/SprintStore";
import { taskStore } from "../store/TaskStore";
import { ISprint } from "../types/pop-ups/sprints/ISprint";
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
    console.log(taskIn);
    
    try{   
        const sprint=sprintStore.getState().activeSprint;
        if(!sprint)return;
        const response = await fetch(`${API_URL}/${sprint?._id}/tasks/${taskIn._id}`,{method:"PUT",headers: { 'Content-Type': 'application/json' },body:JSON.stringify(taskIn)});
        const data = await response.json();
        console.log(data);
        //const newSprint:ISprint={
        //    ...sprint,
        //    tasks: sprint.tasks.map((task:Itask)=>{
        //        task._id === data.newTask._id ? data.newTask : task
        //    })
        //};
        //console.log(newSprint);
        
        const newSprint:ISprint={...sprint,tasks:sprint.tasks.map((task: Itask)=>task._id === taskIn._id ? taskIn : task)};
        sprintStore.getState().setUpdateSprint(newSprint);
        sprintStore.getState().setActiveSprint(newSprint);
    }catch(error){
        console.error(error);
    }
};
export const deleteTask=async(taskId:string)=>{  
    try{
        const sprint=sprintStore.getState().activeSprint;
        if(!sprint)return;
        const response = await fetch(`${API_URL}/${sprint?._id}/tasks/${taskId}`,{method:"DELETE",headers: { 'Content-Type': 'application/json' }});
        if(!response.ok)return;
        const newSprint = {...sprint,taks:sprint.tasks.filter((task:Itask)=>task._id!==taskId)}
        sprintStore.getState().setUpdateSprint(newSprint);
        sprintStore.getState().setActiveSprint(newSprint);
    }catch(error){
        console.error(error);
    }
};