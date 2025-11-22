import styles from './taskCard.module.css';
import { IoEye } from "react-icons/io5";
import { HiPencil } from "react-icons/hi2";
import { FaRegTrashAlt } from "react-icons/fa";
import { Itask } from '../../../types/pop-ups/sprints/ITask';
import { FC, useState } from 'react';
import { taskStore } from '../../../store/TaskStore';
import { popUpStore } from '../../../store/PopUpsStore';
import { deleteTask, updateTask } from '../../../http/tasks';
import Swal from 'sweetalert2';
import { BsBoxes } from 'react-icons/bs';
import { backlogStore } from '../../../store/BacklogStore';
import { addBacklog, updateBacklog } from '../../../http/backlog';

interface ITaskCard{
  task:Itask
}

export const TaskCard:FC<ITaskCard> = ({task}) => {
    const setActiveTask = taskStore((state) => (state.setActiveTask));
    const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
    const backlogTasks = backlogStore((state) => (state.backlogTasks));
    const [selectOption,setSelectOption]=useState("");
    
  
    const handleTogglePopUp = (popUpName: string) => {
      setChangePopUpStatus(popUpName); 
    };
    const handleDelete=async()=>{
      Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
          }).then(async (result) => { 
            if (result.isConfirmed) {
              if(task._id) await deleteTask(task._id);
              Swal.fire('Deleted!', 'The Task has been removed.', 'success');
            }
          });
    }

    const handleSelectOption=async(event:React.ChangeEvent<HTMLSelectElement>)=>{
        const value=event.target.value;
        console.log(value);
        if (value=="") return
        setSelectOption(value);
        console.log(selectOption);
        await updateTask({...task,state:value});
    };

    const handleMoveToBacklog=async()=>{
        await addBacklog({title:task.title,description:task.description,state:task.state,deadLine:task.deadLine})
        if(task._id)await deleteTask(task._id)
    };

  return (
    <div className={styles.taskCardContainer}>
      <div className={styles.taskCardTitle}><h3>{task.title}</h3></div>
      <div className={styles.taskCardButtonsContainer}>
      <select name="selectOption" value={selectOption} onChange={handleSelectOption} className={styles.selectTaskCard}>
          <option value="">State</option>
          <option value="todo">TODO</option>
          <option value="inprogress">IN PROGRESS</option>
          <option value="completed">COMPLETED</option>
        </select>
        <div className={styles.taskCardButtonDiv}>
        <button style={{color:"white",minWidth:"6vw"}} onClick={handleMoveToBacklog}><BsBoxes /> To Backlog</button>
        <button style={{color:"white"}} onClick={()=>{setActiveTask(task);handleTogglePopUp("seetask")}}><IoEye /></button>
        <button style={{color:"white"}} onClick={()=>{setActiveTask(task);handleTogglePopUp("createedittask")}}><HiPencil /></button>
        <button style={{color:"rgba(233, 11, 11, 0.747) "}} onClick={()=>handleDelete()}><FaRegTrashAlt />   </button>
        </div>
      </div>
    </div>
  )
}
