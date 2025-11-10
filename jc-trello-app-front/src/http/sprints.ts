import { ISprint } from "../types/pop-ups/sprints/ISprint";
import { sprintStore } from "../store/SprintStore";

const API_URL = import.meta.env.VITE_SPRINTS_URL;

export const getSprints=async()=>{  
    try{   
        const response = await fetch(API_URL);
        const data = await response.json();
        return sprintStore.getState().setSprints(data.sprints);
    }catch(error){
        console.error(error);
    }
};
export const getSprintById = async (id: string): Promise<ISprint | undefined> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      console.error("Failed to fetch sprint:", response.status);
      return undefined;
    }

    const data = await response.json();

    // If backend returns { sprint: { ... } }
    if (data.sprint) return data.sprint;

    // If backend returns the sprint directly
    return data;
  } catch (error) {
    console.error("Error fetching sprint by ID:", error);
    return undefined;
  }
};
export const addSprint=async(sprintIn:ISprint)=>{
    try{    
        const response = await fetch(API_URL,{method:'POST',headers: { 'Content-Type': 'application/json' },body:JSON.stringify(sprintIn)});
        let data = await response.json();
        return sprintStore.getState().setAddNewSprint(data.sprint);
    }catch(error){
        console.error(error);
    }
};
export const updateSprint=async(sprintIn:ISprint)=>{
    try{    
        const response = await fetch(`${API_URL}/${sprintIn._id}`,{method:'PUT',headers: { 'Content-Type': 'application/json' },body:JSON.stringify(sprintIn)});
        const data = await response.json();
        return sprintStore.getState().setUpdateSprint(data.sprint);
    }catch(error){
        console.error(error);
    }
};
export const deleteSprint=async(sprintId:string)=>{
    try{    
        const response = await fetch(`${API_URL}/${sprintId}`,{method:'DELETE',headers: { 'Content-Type': 'application/json' }});
        const data = await response.json();
        if(sprintStore.getState().activeSprint?._id == sprintId) sprintStore.getState().setActiveSprint(null);
        return sprintStore.getState().setDeleteSprint(sprintId);
    }catch(error){
        console.error(error);
    }
};