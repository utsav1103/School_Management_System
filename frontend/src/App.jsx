import {BrowserRouter, Route, Routes} from 'react-router-dom'
import School from './school/School.jsx'
import './App.css'
import Attendance from './school/components/attendance/Attendance.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            {/*School Routes*/}
          <Route path='school' element={<School/>}>
          <Route path='attendance' element={<Attendance/>}/>

          </Route>

            {/*Student Routes*/}
          <Route>

          </Route>

            {/*TEacher Routes*/}
          <Route>

          </Route>

            {/*Clients Routes*/}
          <Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
