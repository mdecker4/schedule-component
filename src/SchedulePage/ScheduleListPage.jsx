import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { convertMilitaryTime, sortByTimes } from '../util';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Tooltip } from '@mui/material';
import PanelCard from './PanelCard';


const ScheduleListPage = ({ schedule, days, selectedDay, setDay }) => {
  const [groupedSchedule, setGroupedSchedule] = useState([]);
  const [times, setTimes] = useState([]);
  const [error, setError] = useState(null);

  const textShadowStyle = '-1px -1px 0 #ffffffff, 1px -1px 0 #ffffffff, -1px 1px 0 #ffffffff, 1px 1px 0 #ffffffff'

  const dayButtonStyle = {
    width: '20%', 
    height: '50px', 
    minWidth: '80px',
    marginTop: '.8em',
    color: 'black',
    margin: 0,
  }

  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        groupScheduleByTime(schedule)
        if(days)
        {}
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAndParseCSV();
  }, [schedule]);

  const groupScheduleByTime = (schedule) => {
    const grouped = Object.groupBy(schedule, (panel) => panel.startTime)
    setGroupedSchedule(grouped);
    const times = sortByTimes(Object.keys(grouped));
    times.pop();
    setTimes(times)
  }

  const changeDay = (newDay) => {
    setDay(newDay);
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{width: '100%'}}>   
        <>
          {days.map((day) => {
              return <Button onClick={() => changeDay(day)} style={{...dayButtonStyle, backgroundColor: day === selectedDay ? "#5CE1E6" : "#FFDE59"}}>
                  <div className='LGF' style={{ fontSize: '1.35em' }} >{day}</div>
              </Button>
          })}
        </>
        {
            times.map(time => 
              groupedSchedule[time] != null && groupedSchedule[time].filter(x => x.scheduleDay === selectedDay).length > 0 ?
                <div>
                    <div style={{ marginBottom: '.5em', backgroundColor: `${times.indexOf(time)%2 === 0 ? '#4d2881ff' : '#8305ab'}`, borderRadius: '10px', float: 'left', width: '100%'}}>
                        <div style={{float: 'left',  width: '50%'}}>
                            <div className='LGF' style={{float: 'left', fontSize: '1.75em', marginLeft: '.5em', textShadow: textShadowStyle }}>
                                {convertMilitaryTime(time)}
                            </div>
                        </div>
                    {
                        groupedSchedule[time].filter(x => x.scheduleDay === selectedDay).map(panel => {
                            return( 
                              <PanelCard panel={panel} />
                            )
                        })
                    }
                    </div>
                </div> : null
            )
        }       
    </div>
  );
};

export default ScheduleListPage;