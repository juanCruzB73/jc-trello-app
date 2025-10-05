import './App.css'
import { CreateUpdateTask } from './components/ui/modals/create-update-task/CreateUpdateTask';
import { CreateUpdate } from './components/ui/modals/create-update-sprint/CreateUpdate';
import { AppRouter } from './routes/AppRouter';
import { popUpStore } from './store/PopUpsStore';
import { CreateUpdateBacklog } from './components/ui/modals/create-update-backlog/CreateUpdateBacklog';
import { SeeTask } from './components/ui/see-more/see-task/SeeTask';
import { SeeBacklog } from './components/ui/see-more/see-backlog/SeeBacklog';

export const App = ()=> {
  
  const popUps = popUpStore((state)=>(state.popUps));
  
  return (
    <>
      <AppRouter/>
      {popUps[1].popUpState&&<CreateUpdate modalStatus={popUps[1].popUpState} />}
      {popUps[2].popUpState&&<CreateUpdateTask modalStatus={popUps[2].popUpState}/>}
      {popUps[3].popUpState&&<CreateUpdateBacklog modalStatus={popUps[3].popUpState}/>}
      {popUps[4].popUpState&&<SeeTask modalStatus={popUps[4].popUpState}/>}
      {popUps[5].popUpState&&<SeeBacklog modalStatus={popUps[5].popUpState}/>}
    </>
  )
}