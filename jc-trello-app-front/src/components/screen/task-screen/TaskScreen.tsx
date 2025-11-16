import { useEffect, useState } from 'react';
import { popUpStore } from '../../../store/PopUpsStore';
import { sprintStore } from '../../../store/SprintStore';
import { taskStore } from '../../../store/TaskStore';
import { Itask } from '../../../types/pop-ups/sprints/ITask';
import { NavBar } from '../../ui/nav-bar/NavBar';
import { SideBar } from '../../ui/side-bar/SideBar';
import { TaskCard } from '../../ui/task-card/TaskCard';
import styles from './taskScreen.module.css';
import { getTasksBySprint } from '../../../http/tasks';
import { useSearchParams } from 'react-router-dom';
import { getSprintById } from '../../../http/sprints';

export const TaskScreen = () => {
  const popUps = popUpStore((state)=>(state.popUps));
  const sprints = sprintStore((state) => (state.sprints));
  const activeSprint = sprintStore((state) => (state.activeSprint));
  const setActiveSprint = sprintStore((state) => (state.setActiveSprint));
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const tasks = taskStore((state) => (state.tasks));
  const setActiveTask = taskStore((state) => (state.setActiveTask));
  const [todoTasks,setTodoTasks]=useState<Itask[]>([]);
  const [inProgressTasks,setInProgressTasks]=useState<Itask[]>([]);
  const [completedTasks,setCompletedTask]=useState<Itask[]>([]);

  const [searchParams] = useSearchParams();
  const sprintId = searchParams.get("sprintid")

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };

  useEffect(() => {
  if (sprintId && !activeSprint) {
    getSprintById(sprintId);
  }
}, [sprintId]);

useEffect(() => {
  if (activeSprint && activeSprint._id) {
    getTasksBySprint(activeSprint._id);
  }
}, [activeSprint]);

useEffect(() => {
  const todo = tasks.filter(t => t.state === "todo");
  const inProgress = tasks.filter(t => t.state === "inprogress");
  const completed = tasks.filter(t => t.state === "completed");

  setTodoTasks(todo);
  setInProgressTasks(inProgress);
  setCompletedTask(completed);
}, [tasks]);

  return (
    <div className={styles.taskScreenMainContainer}>
      <NavBar/>
      <div className={styles.taskScreenContentMainContainer}>
        <SideBar sidebarStatus={popUps[0].popUpState} />
        <div className={styles.taskScreenContent}>
            <div className={styles.taskScreenTitle}>
              <h2>{activeSprint?activeSprint?.title:"No sprint selected"}</h2>
              {/*<form action="">
                {backlogTasks.map(task=>
                  <label key={task.title}>
                    <input type="checkbox" value={task.title}/>
                  </label>
                )}
              </form>*/}
            </div>
            <h2 className={ !activeSprint?styles.taskScreenNoActiveSprint:styles.taskScreenActiveSprint}>Select a sprint to display the tasks</h2>
            <div className={styles.sprintDescriptionContainer}>
                <p>{activeSprint?.description?activeSprint?.description:"No description given."}</p>
              </div>
            <div className={styles.taskScreenBoardsBackground}>
              <div className={styles.taskScreenBoard}>
                <h2>TO-DO</h2>
                <div className={styles.taskScreenCardContainer}>
                  {todoTasks.map((task:Itask)=><TaskCard task={task} key={task._id}/>)}
                </div>
              </div>
              <div className={styles.taskScreenBoard}> 
                <h2>IN PROGRESS</h2>
                <div className={styles.taskScreenCardContainer}>
                  {inProgressTasks.map((task:Itask)=><TaskCard task={task} key={task._id}/>)}
                </div>
              </div>
              <div className={styles.taskScreenBoard}>
                <h2>COMPLETED</h2>
                <div className={styles.taskScreenCardContainer}>
                  {completedTasks.map((task:Itask)=><TaskCard task={task} key={task._id}/>)}
                </div>
              </div>
            <div>
            </div>
            <div className={styles.createTaskButtonContainer}>
              <button onClick={()=>{setActiveTask(null);handleTogglePopUp("createedittask")}}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
