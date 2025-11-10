import { Itask } from "../types/pop-ups/sprints/ITask";
import { backlogStore } from "../store/BacklogStore";

const API_URL = import.meta.env.VITE_BACKLOG_URL;

export const getBacklogs=async()=>{  
    try{   
        const response = await fetch(API_URL);
        const data = await response.json();
        return backlogStore.getState().setBacklogTasks(data.backlog[0].tasks);
    }catch(error){
        console.error(error);
    }
};

export const addBacklog=async(backlogIn:Itask)=>{  
    try{   
        const response = await fetch(API_URL,{method:'POST',headers: { 'Content-Type': 'application/json' },body:JSON.stringify(backlogIn)});
        const data = await response.json();
        return backlogStore.getState().setAddNewBacklogTasks(data.newTask);
    }catch(error){
        console.error(error);
    }
};

export const updateBacklog=async(backlogIn:Itask)=>{  
    try{
        const responseBacklogId = await fetch(API_URL);
        const dataBacklogId = await responseBacklogId.json();
        const response = await fetch(`${API_URL}/${dataBacklogId.backlog[0].id}/tasks/${backlogIn._id}`,{method:'PUT',headers: { 'Content-Type': 'application/json' },body:JSON.stringify(backlogIn)});
        const data = await response.json();
        return backlogStore.getState().setUpdateBacklogTasks(data.newTask);
    }catch(error){
        console.error(error);
    }
};

export const deleteBacklog=async(backlogId:string)=>{  
    try{   
        const responseBacklogId = await fetch(API_URL);
        const dataBacklogId = await responseBacklogId.json();
        const response = await fetch(`${API_URL}/${dataBacklogId.backlog[0].id}/tasks/${backlogId}`,{method:'DELETE'});
        return backlogStore.getState().setDeleteBacklogTasks(backlogId);
        }catch(error){
        console.error(error);
    }
};