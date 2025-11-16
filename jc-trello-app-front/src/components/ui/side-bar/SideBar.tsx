import { FC, useEffect } from 'react';
import styles from './sideBar.module.css';
import { FaPlus } from "react-icons/fa";
import { SideBarCard } from '../side-bar-card/SideBarCard';
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { popUpStore } from '../../../store/PopUpsStore';
import {sprintStore } from '../../../store/SprintStore';
import { getSprints } from '../../../http/sprints';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';


interface ISideBar{
  sidebarStatus:boolean;
}

export const SideBar:FC<ISideBar> = ({sidebarStatus}) => {

  const navigate=useNavigate();

  const sprints = sprintStore((state) => (state.sprints));
  const setActiveSprint = sprintStore((state) => (state.setActiveSprint)); 
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const setSprints = sprintStore((state) => state.setSprints);

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };

  useEffect(()=>{
    const callSprints=async()=>{
      await getSprints();
    }
    callSprints();
  },[]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sprints.findIndex((s) => s._id === active.id);
      const newIndex = sprints.findIndex((s) => s._id === over.id);

      const newOrder = [...sprints];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);

      setSprints(newOrder);
      // Optionally: call backend PATCH /sprints/order with newOrder.map(s => s._id)
    }
  };


  return (
     <DndContext onDragEnd={handleDragEnd}>
    <div className={sidebarStatus? styles.sideBarMainContainer:styles.sideBarMainContainerNotShow}>
      <div className={styles.sideBarContainer}>
      <button onClick={()=>{navigate('/backlogs')}}>Backlogs <FaBookOpen style={{marginLeft:"10px"}}/></button>
        <div className={styles.sideBarTitle}>
          <h2>Your sprints</h2>
          <h3 onClick={() => {handleTogglePopUp("createeditsprint");setActiveSprint(null)}}><FaPlus /></h3>
        </div>
        <div className={styles.divider}></div>
        <SortableContext
            items={sprints.map((s) => s._id!)}
            strategy={verticalListSortingStrategy}
          >
        <div className={styles.sideBarListContent}>
          {
            sprints.map(sprint=>(
              <SideBarCard key={sprint._id}  sprint={sprint}/>
            ))
          }
        </div>
        </SortableContext>
      </div>
    </div>
  </DndContext>
  )
}