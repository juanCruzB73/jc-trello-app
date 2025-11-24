import styles from './taskCard.module.css';
import { IoEye } from "react-icons/io5";
import { HiPencil } from "react-icons/hi2";
import { FaRegTrashAlt } from "react-icons/fa";
import { Itask } from '../../../types/pop-ups/sprints/ITask';
import { FC, useState } from 'react';
import { taskStore } from '../../../store/TaskStore';
import { popUpStore } from '../../../store/PopUpsStore';
import { deleteTask, updateTask } from '../../../http/tasks';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import Swal from 'sweetalert2';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { BsBoxes } from 'react-icons/bs';
import { addBacklog } from '../../../http/backlog';
import { deleteBacklog } from '../../../http/backlog';
import { backlogStore } from '../../../store/BacklogStore';
import { sprintStore } from '../../../store/SprintStore';
import { addTask } from '../../../http/tasks';
import { getSprintById } from '../../../http/sprints';
import { ISprint } from '../../../types/pop-ups/sprints/ISprint';

interface ITaskCard {
  task: Itask;
  isOverlay?: boolean;
  screen:string;
}

export const TaskCard: FC<ITaskCard> = ({ task, isOverlay,screen }) => {
  
  const [sentTo,setSendTo]=useState(false);
  const [selectOption,setSelectOption]=useState("");
  
  const setActiveTask = taskStore((state) => (state.setActiveTask));
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const setActiveBacklogs = backlogStore((state) => (state.setActiveBacklogTasks));
  const sprints = sprintStore((state) => (state.sprints));
  const setActiveSprint = sprintStore((state) => (state.setActiveSprint));

  console.log(screen);
  
  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName);
  };

  const handleDelete = async () => {
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
        if (task._id && screen=="tasks") await deleteTask(task._id);
        if (task._id && screen=="backlog") await deleteBacklog(task._id);
        Swal.fire('Deleted!', 'The Task has been removed.', 'success');
      }
    });
  }

  const handleSelectOption=async(event:React.ChangeEvent<HTMLSelectElement>)=>{
      const value=event.target.value;
      if (value=="") return
      setSelectOption(value);
      await handleMoveBacklog(value)    
  };

  const handleMoveBacklog = async (sprintId: string) => {
    try {
      const sprint = await getSprintById(sprintId);
      
      if (!sprint) {
        throw new Error("Sprint not found: " + sprintId);
      }
      setActiveSprint(sprint);
      
      await addTask(task);
  
      await deleteBacklog(task._id!);
    } catch (error) {
      console.error("Error moving backlog:", error);
    }
  };

  const handleMoveToBacklog = async () => {
    await addBacklog({ title: task.title, description: task.description, state: task.state, deadLine: task.deadLine })
    if (task._id) await deleteTask(task._id)
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
  };

  return (
    <div ref={setNodeRef}
      style={style}
      {...attributes} className={styles.taskCardContainer}>
      <div className={styles.taskCardTitle}><h3>{task.title}</h3></div>
      <div className={styles.taskCardButtonsContainer}>
       {screen=="backlog" && 
        <>
          <select name="selectOption" value={selectOption} onChange={handleSelectOption}  className={sentTo?styles.backlockCardSelect:styles.backlockCardSelectNotShow}>
          <option value="">Select Sprint</option>
            {
              sprints.map((sprint:ISprint)=>(
                <option key={sprint._id} value={sprint._id}>{sprint.title}</option>
              ))
            }
          </select>
        </>
       }
        <div className={styles.taskCardButtonDiv}>
          <h3 {...listeners} {...attributes} style={{ cursor: 'grab', touchAction: 'none' }} title="Drag to move">
            <RxDragHandleDots2 />
          </h3>
          {
          screen=="tasks"&&<button style={{ color: "white", minWidth: "6vw" }} onClick={handleMoveToBacklog}><BsBoxes /> To Backlog</button>
          }
          <button style={{ color: "white" }} onClick={ screen=="tasks" ? () => { setActiveTask(task); handleTogglePopUp("seetask") }:()=>{setActiveBacklogs(task);handleTogglePopUp("seebacklog")}}><IoEye /></button>
          <button style={{ color: "white" }} onClick={screen=="tasks" ? () => { setActiveTask(task); handleTogglePopUp("createedittask")}:()=>{handleTogglePopUp("createeditbacklog");setActiveBacklogs(task)}}><HiPencil /></button>
          <button style={{ color: "rgba(233, 11, 11, 0.747) " }} onClick={() => handleDelete()}><FaRegTrashAlt />   </button>
        </div>
      </div>
    </div>
  )
}
