import { useEffect, useState } from 'react'
import ScheduleGrid from './ScheduleGrid'
import ScheduleListPage from './ScheduleListPage';
import { fetchAndParseScheduleData } from '../api/api';
import { ToggleButton } from '@mui/material'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

function SchedulePage() {

  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=945819308&single=true&output=csv'
  
  const [schedule, setSchedule] = useState([]);
  const [listMode, setSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const parsed = await fetchAndParseScheduleData(url);
        setSchedule(parsed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseCSV();
  }, [url]);

  const toggleView = () => {
    console.log('Toggle start: ' + listMode);
    setSelected(!listMode);
    console.log('Toggle end: ' + listMode);
  }


  return (
    <>
      <ToggleButton onChange={() => toggleView()} style={{color: 'yellow'}} size={'large'}>
        {
          listMode ? <CalendarViewMonthIcon style={{fontSize: '50px'}}/> :
          <CalendarViewDayIcon style={{fontSize: '50px'}}/>
        }
      </ToggleButton>
      {
        listMode ?
        <ScheduleListPage schedule={schedule} /> :
        <ScheduleGrid scheduleText={schedule} />
      }
    </>
  )
}

export default SchedulePage