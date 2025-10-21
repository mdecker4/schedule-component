import './App.css'
import './SchedulePage/ScheduleGrid'
import { Link } from 'react-router-dom'  

function App() {

  return (
    <>
      <Link style={{marginRight: '15px'}} to="/schedule">Schedule</Link>
      <Link style={{marginRight: '15px'}} to="/map">Map</Link>
    </>
  )
}

export default App