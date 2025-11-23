import { useEffect } from 'react';
import { backlogStore } from '../../../store/BacklogStore';
import { popUpStore } from '../../../store/PopUpsStore';
import { Itask } from '../../../types/pop-ups/sprints/ITask';
import { BacklogCard } from '../../ui/backlog-card/BacklogCard';
import { SideBar } from '../../ui/side-bar/SideBar';
import styles from './backlogScreen.module.css';
import { getBacklogs } from '../../../http/backlog';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext,rectSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from '../../ui/task-card/TaskCard';

export const BackogsScreen = () => {
  const popUps = popUpStore((state)=>(state.popUps));
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const backlogs = backlogStore((state)=>(state.backlogTasks));
  const setBacklogTasks = backlogStore((state)=>(state.setBacklogTasks));
  const setActiveBacklogs = backlogStore((state)=>(state.setActiveBacklogTasks));

  useEffect(()=>{
    const displayBacklogs=async()=>{
      await getBacklogs();
    }
    displayBacklogs();
  },[]);

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName); 
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = backlogs.findIndex((s) => s._id === active.id);
      const newIndex = backlogs.findIndex((s) => s._id === over.id);

      const newOrder = [...backlogs];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);

      setBacklogTasks(newOrder);
      // todo: call backend sprints with newOrder.map(s => s._id)
    }
  };
    
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.springScreenMainContainer}>
        <div className={styles.springScreenContentContainer}>
          <SideBar sidebarStatus={popUps[0].popUpState} />
          <div className={styles.springScreenTaskContainer}>
            <div className={styles.springScreenTaskContainerTitles}>
              <div style={{marginRight:"2rem"}}>
                <h2>Backlogs</h2>
                <h4>Tasks in backlog</h4>
              </div>

            </div>
            <div className={styles.springScreenListTaskContainer}>
              <SortableContext
                          items={backlogs.map((s) => s._id!)}
                          strategy={rectSortingStrategy}
                        >
                <div className={styles.springScreenListTask}>
                  {backlogs.map((task:Itask)=>(
                    <TaskCard key={task._id} task={task}/>
                    ))}
                  <div className={styles.createTaskButtonContainer}>
                    <button type='button' onClick={()=>{handleTogglePopUp("createeditbacklog");setActiveBacklogs(null)}}>+</button>
                  </div>
                </div>
            </SortableContext>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}
