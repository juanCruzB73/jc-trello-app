import { Navigate, Route, Routes } from "react-router-dom"
import { BackogsScreen } from "../components/screen/backlog-screen/BackogsScreen"
import { TaskScreen } from "../components/screen/task-screen/TaskScreen"
import { sprintStore } from "../store/SprintStore";

export const AppRouter = () => {
  const activeSprint = sprintStore((state) => (state.activeSprint));
  
  return (
    <Routes>
          <Route path="/*" element={<BackogsScreen/>}/>
          <Route path="/backlogs" element={<BackogsScreen/>}/>
          <Route path="/tasks" element={<TaskScreen/>}/>
    </Routes>
  )
}