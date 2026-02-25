import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotFound from './NotFound.jsx'
import MapPage from './MapPage/MapPage.jsx'
import { HashRouter, Route, Routes, Link } from 'react-router-dom'  
import ScheduleListPage from './SchedulePage/ScheduleListPage.jsx'
import SchedulePage from './SchedulePage/SchedulePage'

const baseURL = '/schedule-component';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      
      <Routes>
        <Route index element= {<App/>}></Route>
        <Route path= "/schedule" element= {<SchedulePage/>} />
        {/* <Route index element= {<div>Hello</div>}/> */}
      </Routes>
    </HashRouter>
  </StrictMode>,
)
