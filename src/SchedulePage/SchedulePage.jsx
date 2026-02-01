import { useEffect, useState } from 'react'
import ScheduleGrid from './ScheduleGrid'
import ScheduleListPage from './ScheduleListPage';
import { fetchAndParseScheduleData } from '../api/api';
import { ToggleButton, CircularProgress } from '@mui/material'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { getCurrentDay } from '../util';


function SchedulePage() {

  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0MDB_extrUaVDxI2ZcPUFiUTQ1-9FpUw8uQksVP6N0z1Nhm7352tv_Yr75KEAmRqvEqfRyb6qCqTe/pub?gid=1278625778&single=true&output=csv'  //production

  const [schedule, setSchedule] = useState([]);
  const [listMode, setSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setDay] = useState('Friday');
  
  const days = ['Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const parsed = await fetchAndParseScheduleData(url);
        setSchedule(parsed);
        const today = getCurrentDay();
        if(days.includes(today))
        {
          setDay(today);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseCSV();
  }, [url]);

  const toggleView = () => {
    setSelected(!listMode);
  }


  return (
    <>
      <ToggleButton onChange={() => toggleView()} style={{color: 'yellow', float: 'left'}} size={'large'}>
        {
          listMode ? <CalendarViewMonthIcon style={{fontSize: '50px'}}/> :
          <CalendarViewDayIcon style={{fontSize: '50px'}}/>
        }
      </ToggleButton>
        {
          loading ?
            <CircularProgress style={{float: 'left', marginLeft: '40%'}}/> :
            listMode ?
              <ScheduleListPage schedule={schedule} days={days} selectedDay={selectedDay} setDay={setDay} /> :
              <ScheduleGrid scheduleText={schedule} days={days} selectedDay={selectedDay} setDay={setDay} />
        }
    </>
  )
}

export default SchedulePage