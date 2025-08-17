import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotFound from './NotFound.jsx'
import MapPage from './MapPage/MapPage.jsx'
import { HashRouter, Route, Routes, Link } from 'react-router-dom'  
import ScheduleListPage from './ScheduleList/ScheduleListPage.jsx'

const baseURL = '/schedule-component';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Link style={{marginRight: '15px'}} to="/schedule">Schedule</Link>
      <Link style={{marginRight: '15px'}} to="/map">Map</Link>
      <Link style={{marginRight: '15px'}} to="/schedule-list">Schedule List</Link>
      <Routes>
        <Route path= "/schedule" element= {<App/>} />
        <Route path= "/map" element= {<MapPage url='https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=480788257&single=true&output=csv' />}/>
        <Route path= "/schedule-list" element= {<ScheduleListPage url='https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=945819308&single=true&output=csv' />}/>
        <Route index element= {<div>Hello</div>}/>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
