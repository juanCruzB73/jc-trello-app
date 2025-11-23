import styles from './backlockCard.module.css';
import { BsBoxes } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { HiPencil } from "react-icons/hi2";
import { FaRegTrashAlt } from "react-icons/fa";
import { popUpStore } from '../../../store/PopUpsStore';
import React, { FC, useState } from 'react';
import { Itask } from '../../../types/pop-ups/sprints/ITask';
import { backlogStore } from '../../../store/BacklogStore';
import { deleteBacklog } from '../../../http/backlog';
import { sprintStore } from '../../../store/SprintStore';
import { ISprint } from '../../../types/pop-ups/sprints/ISprint';
import Swal from 'sweetalert2';
import { addTask } from '../../../http/tasks';
import { getSprintById } from '../../../http/sprints';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { RxDragHandleDots2 } from 'react-icons/rx';

interface IBacklogCard{
  backlog:Itask
}

export const BacklogCard:FC<IBacklogCard> = ({backlog}) => {

  const [sentTo,setSendTo]=useState(false);
  const [selectOption,setSelectOption]=useState("");

  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const setActiveBacklogs = backlogStore((state) => (state.setActiveBacklogTasks));
  const sprints = sprintStore((state) => (state.sprints));
  const setActiveSprint = sprintStore((state) => (state.setActiveSprint));

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };

  const handleDelete = async (id: string) => {
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
        await deleteBacklog(id);
        Swal.fire('Deleted!', 'The backlog Task has been removed.', 'success');
      }
    });
  };

const handleMoveBacklog = async (sprintId: string) => {
  try {
    const sprint = await getSprintById(sprintId);
    
    if (!sprint) {
      throw new Error("Sprint not found: " + sprintId);
    }
    setActiveSprint(sprint);
    
    await addTask(backlog);

    await deleteBacklog(backlog._id!);
  } catch (error) {
    console.error("Error moving backlog:", error);
  }
};

  const handleSelectOption=async(event:React.ChangeEvent<HTMLSelectElement>)=>{
    const value=event.target.value;
    if (value=="") return
    setSelectOption(value);
    await handleMoveBacklog(value)    
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: backlog._id!,
  });

  const style = {
      transform: CSS.Transform.toString(transform),
      transition,
  };

  return (
    <div className={styles.backlogCardMainContainer} ref={setNodeRef}
        style={style}
        {...attributes}>
      <div className={styles.backlogCardTitles}>
      <h3>{backlog.title}</h3>
      <p>{backlog.description?backlog.description:"No description given."}</p>
      </div>
      <div className={styles.backlogCardMainContainerButtons}>
        <select name="selectOption" value={selectOption} onChange={handleSelectOption}  className={sentTo?styles.backlockCardSelect:styles.backlockCardSelectNotShow}>
          <option value="">Select Sprint</option>
            {
              sprints.map((sprint:ISprint)=>(
                <option key={sprint._id} value={sprint._id}>{sprint.title}</option>
              ))
            }
          </select>
          <div className={styles.backlogCardEditButtons}>
            <button type='button' className={styles.backlogCardSendToButton} onClick={()=>setSendTo(!sentTo)}>{!sentTo?"Sent to...":"Cancel"} <BsBoxes /></button>
            <button type='button' className={styles.backlogCardIconButtons} style={{color:"white"}} onClick={()=>{setActiveBacklogs(backlog);handleTogglePopUp("seebacklog")}} ><IoEye /></button>
            <button type='button' className={styles.backlogCardIconButtons} onClick={()=>{handleTogglePopUp("createeditbacklog");setActiveBacklogs(backlog)}} style={{color:"white"}}><HiPencil /></button>
            <button type='button' className={styles.backlogCardIconButtons} style={{color:"rgba(233, 11, 11, 0.747) "}} onClick={()=>{backlog._id&&handleDelete(backlog._id)}}><FaRegTrashAlt /></button>
            <h3 {...listeners} style={{cursor:"pointer"}}><RxDragHandleDots2 /></h3>
        </div>
      </div>
    </div>
  )
}
