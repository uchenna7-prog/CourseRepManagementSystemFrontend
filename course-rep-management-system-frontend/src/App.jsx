import {Routes,Route} from 'react-router-dom';
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Activities from './pages/Activities/Activities.jsx';
import ActivityRecords from './pages/ActivityRecord/ActivityRecords.jsx';
import Coursemates from './pages/Coursemates/Coursemates.jsx';

function App(){
  return (
    <Routes>
      <Route path ='/' element={<Login/>}/>
      <Route path ='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/activities' element={<Activities/>}/>
      <Route path='/activityRecords' element={<ActivityRecords/>}/>
      <Route path='/coursemates' element={<Coursemates/>}/>
    </Routes>

  )
};

export default App;