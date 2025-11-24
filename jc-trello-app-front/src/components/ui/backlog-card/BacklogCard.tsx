import styles from './backlockCard.module.css';
import { BsBoxes } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { HiPencil } from "react-icons/hi2";
import { FaRegTrashAlt } from "react-icons/fa";
import React, { FC, useState } from 'react';
import { Itask } from '../../../types/pop-ups/sprints/ITask';

import { ISprint } from '../../../types/pop-ups/sprints/ISprint';
import Swal from 'sweetalert2';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { RxDragHandleDots2 } from 'react-icons/rx';

interface IBacklogCard{
  backlog:Itask
}

export const BacklogCard:FC<IBacklogCard> = ({backlog}) => {



  

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
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
        
          <div className={styles.backlogCardEditButtons}>
            <button type='button' className={styles.backlogCardSendToButton} onClick={()=>setSendTo(!sentTo)}>{!sentTo?"Sent to...":"Cancel"} <BsBoxes /></button>
            <button type='button' className={styles.backlogCardIconButtons} style={{color:"white"}} onClick={} ><IoEye /></button>
            <button type='button' className={styles.backlogCardIconButtons} onClick={()=>{handleTogglePopUp("createeditbacklog");setActiveBacklogs(backlog)}} style={{color:"white"}}><HiPencil /></button>
            <button type='button' className={styles.backlogCardIconButtons} style={{color:"rgba(233, 11, 11, 0.747) "}} onClick={()=>{backlog._id&&handleDelete(backlog._id)}}><FaRegTrashAlt /></button>
            <h3 {...listeners} style={{cursor:"pointer"}}><RxDragHandleDots2 /></h3>
        </div>
      </div>
    </div>
  )
}
