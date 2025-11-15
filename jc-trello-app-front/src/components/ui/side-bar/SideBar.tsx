import { FC, useEffect } from 'react';
import styles from './sideBar.module.css';
import { FaPlus } from "react-icons/fa";
import { SideBarCard } from '../side-bar-card/SideBarCard';
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { popUpStore } from '../../../store/PopUpsStore';
import {sprintStore } from '../../../store/SprintStore';
import { getSprints } from '../../../http/sprints';


interface ISideBar{
  sidebarStatus:boolean;
}

export const SideBar:FC<ISideBar> = ({sidebarStatus}) => {

  const navigate=useNavigate();

  const sprints = sprintStore((state) => (state.sprints));
  const setActiveSprint = sprintStore((state) => (state.setActiveSprint)); 
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };

  useEffect(()=>{
    const callSprints=async()=>{
      await getSprints();
    }
    callSprints();
  },[])

  return (
    <div className={sidebarStatus? styles.sideBarMainContainer:styles.sideBarMainContainerNotShow}>
      <div className={styles.sideBarContainer}>
      <button onClick={()=>{navigate('/backlogs')}}>Backlogs <FaBookOpen style={{marginLeft:"10px"}}/></button>
        <div className={styles.sideBarTitle}>
          <h2>Your sprints</h2>
          <h3 onClick={() => {handleTogglePopUp("createeditsprint");setActiveSprint(null)}}><FaPlus /></h3>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.sideBarListContent}>
          {
            sprints.map(sprint=>(
              <SideBarCard key={sprint._id}  sprint={sprint}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}