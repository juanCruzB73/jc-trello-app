import { useEffect, useState } from 'react';
import { popUpStore } from '../../../store/PopUpsStore';
import { sprintStore } from '../../../store/SprintStore';
import { taskStore } from '../../../store/TaskStore';
import { Itask } from '../../../types/pop-ups/sprints/ITask';
import { SideBar } from '../../ui/side-bar/SideBar';
import { TaskCard } from '../../ui/task-card/TaskCard';
import styles from './taskScreen.module.css';
import { getTasksBySprint, updateTask } from '../../../http/tasks';
import { useSearchParams } from 'react-router-dom';
import { getSprintById } from '../../../http/sprints';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { ISprint } from '../../../types/pop-ups/sprints/ISprint';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DroppableBoard } from './DroppableBoard';

export const TaskScreen = () => {
  const popUps = popUpStore((state) => (state.popUps));
  const activeSprint = sprintStore((s) => s.activeSprint) as ISprint;
  const setUpdateSprint = sprintStore((state) => (state.setUpdateSprint));
  const setActiveSprint = sprintStore((state) => (state.setActiveSprint));
  const setChangePopUpStatus = popUpStore((state) => (state.setChangePopUpStatus));
  const tasks = taskStore((state) => (state.tasks));
  const setActiveTask = taskStore((state) => (state.setActiveTask));
  const [todoTasks, setTodoTasks] = useState<Itask[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Itask[]>([]);
  const [completedTasks, setCompletedTask] = useState<Itask[]>([]);
  const [activeId, setActiveId] = useState(null);

  const [searchParams] = useSearchParams();
  const sprintId = searchParams.get("sprintid")

  const handleTogglePopUp = (popUpName: string) => {
    setChangePopUpStatus(popUpName);
  };

  useEffect(() => {
    if (sprintId) {
      console.log("firing 1");
      getSprintById(sprintId);
    }
  }, [sprintId]);

  useEffect(() => {
    if (activeSprint && activeSprint._id) {
      console.log("firing 2");
      getTasksBySprint(activeSprint._id);
    }
  }, [activeSprint]);

  useEffect(() => {
    console.log("firing 3");
    const todo = tasks.filter(t => t.state === "todo");
    const inProgress = tasks.filter(t => t.state === "inprogress");
    const completed = tasks.filter(t => t.state === "completed");

    setTodoTasks(todo);
    setInProgressTasks(inProgress);
    setCompletedTask(completed);
  }, [tasks, activeSprint]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dropped on a board or on another task
    let newState = null;
    if (overId === "todo" || overId === "inprogress" || overId === "completed") {
      newState = overId;
    } else {
      // Dropped on another task, find which board it belongs to
      const targetTask = tasks.find(t => t._id === overId);
      if (targetTask) {
        newState = targetTask.state;
      }
    }

    if (!newState) return;

    const movedTask = tasks.find(t => t._id === activeId);
    if (!movedTask || movedTask.state === newState) return;

    const updatedTask = { ...movedTask, state: newState };
    const newTasks = tasks.map(t =>
      t._id === activeId ? updatedTask : t
    );

    // Update backend
    updateTask(updatedTask);

    const updatedSprint = { ...activeSprint, tasks: newTasks };
    setUpdateSprint(updatedSprint);
    setActiveSprint(updatedSprint);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.taskScreenMainContainer}>
        <div className={styles.taskScreenContentMainContainer}>
          <SideBar sidebarStatus={popUps[0].popUpState} />
          <div className={styles.taskScreenContent}>
            <div className={styles.taskScreenTitle}>
              <h2>{activeSprint ? activeSprint?.title : "No sprint selected"}</h2>
            </div>
            <h2 className={!activeSprint ? styles.taskScreenNoActiveSprint : styles.taskScreenActiveSprint}>
              Select a sprint to display the tasks
            </h2>
            <div className={styles.sprintDescriptionContainer}>
              <p>{activeSprint?.description ? activeSprint?.description : "No description given."}</p>
            </div>
            <div className={styles.taskScreenBoardsBackground}>

              <SortableContext id="todo" items={todoTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                <DroppableBoard id="todo" title="TO-DO" styles={styles}>
                  {todoTasks.map((task: Itask) => (
                    <TaskCard task={task} key={task._id} />
                  ))}
                </DroppableBoard>
              </SortableContext>

              <SortableContext id="inprogress" items={inProgressTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                <DroppableBoard id="inprogress" title="IN PROGRESS" styles={styles}>
                  {inProgressTasks.map((task: Itask) => (
                    <TaskCard task={task} key={task._id} />
                  ))}
                </DroppableBoard>
              </SortableContext>

              <SortableContext id="completed" items={completedTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                <DroppableBoard id="completed" title="COMPLETED" styles={styles}>
                  {completedTasks.map((task: Itask) => (
                    <TaskCard task={task} key={task._id} />
                  ))}
                </DroppableBoard>
              </SortableContext>

            </div>
            <DragOverlay>
              {activeId ? (
                (() => {
                  const task = tasks.find((t) => t._id === activeId);
                  return task ? <TaskCard task={task} isOverlay /> : null;
                })()
              ) : null}
            </DragOverlay>
            <div className={styles.createTaskButtonContainer}>
              <button onClick={() => { setActiveTask(null); handleTogglePopUp("createedittask") }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};
