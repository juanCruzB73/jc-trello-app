import styles from './sideBarCar.module.css';
import { FaLayerGroup } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa";
import { HiPencil } from "react-icons/hi2";
import { FaRegTrashAlt } from "react-icons/fa";
import { FC, useState } from 'react';
import { ISprint } from '../../../types/pop-ups/sprints/ISprint';
import { popUpStore } from '../../../store/PopUpsStore';
import { sprintStore } from '../../../store/SprintStore';
import { deleteSprint } from '../../../http/sprints';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


interface ISideBarCard{
    sprint:ISprint;
}

export const SideBarCard:FC<ISideBarCard> = ({sprint}) => {

    const [seeMore,setSeeMore]=useState(false);

    const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
    const setActiveSprint  = sprintStore((state) => (state.setActiveSprint ));
    const activeSprint  = sprintStore((state) => (state.activeSprint ));
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
              sprint._id && await deleteSprint(sprint._id);
              Swal.fire('Deleted!', 'The backlog Task has been removed.', 'success');
            }
          });
    }

    const navigate=useNavigate();
    
    return (
      <div className={styles.sideBarCardMainContainer}>
        
        <div className={`${activeSprint == sprint ? styles["sideBarActiveButton"]:styles["sideBarButtons"]}`} >
            <h3><FaLayerGroup/></h3>
            <h4 style={{cursor: "pointer"}} onClick={()=>{setActiveSprint(sprint);navigate(`/tasks?sprintid=${sprint._id}`)}}>{sprint.title}</h4>
            <h3 onClick={()=>setSeeMore(!seeMore)}><FaArrowDown style={{cursor: "pointer"}}/></h3>
        </div>
        <div className={seeMore?styles.sideBarCardSeeMore:styles.sideBarCardhideMore}>
            <div className={styles.sideBarCardDateInfo}>
                <span>Start: {sprint.beginLine}</span>
                <span>Final: {sprint.deadLine}</span>
            </div>
            <div className={styles.sideBarSeeMoreButtons}>
                <HiPencil style={{cursor:"pointer"}} onClick={()=>{setActiveSprint(sprint);handleTogglePopUp("createeditsprint")}}/>
                <FaRegTrashAlt onClick={()=>{setActiveSprint(sprint);handleDelete()}} style={{color:"rgba(233, 11, 11, 0.747)",cursor:"pointer"}}/>
            </div>
        </div>
      </div>
    )
}
