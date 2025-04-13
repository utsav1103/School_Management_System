import {BrowserRouter, Route, Routes} from 'react-router-dom'
import School from './school/School.jsx'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            {/*School Routes*/}
          <Route path='school' element={<School/>}>

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
