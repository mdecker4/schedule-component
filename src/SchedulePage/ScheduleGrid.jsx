import React, { useEffect, useState } from 'react';
import PanelModal from './PanelModal';
import Button from '@mui/material/Button';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { convertMilitaryTime } from '../util';
import { Tooltip } from '@mui/material';

const ScheduleGrid = ({ scheduleText, days, selectedDay, setDay }) => {
  const [scheduleMap, setScheduleMap] = useState({});
  const [scheduleMapByDay, setScheduleMapByDay] = useState({})
  const [timeSlots, setTimeSlots] = useState([]);
  const [modalOpen, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(['Error', 'Error']);
  const columns = ['Main Events','A', 'B', 'C', 'D', 'Workshop', 'Maid Cafe'];
  const slotDuration = 30; // minutes

  const panelEntryStyle = {
    width: '100%', 
    height: '100%', 
    color: 'black',
    margin: 0,
  }

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
        const schedule = groupAndBuildSchedule(scheduleText);
        setScheduleMapByDay(schedule);
        setScheduleMap(schedule.filter(x => x.day === selectedDay)[0].timeSlots.schedule);
        setTimeSlots(schedule.filter(x => x.day === selectedDay)[0].timeSlots.slots);
    };

    fetchAndParseCSV();
  }, [scheduleText]);

  const groupAndBuildSchedule = (rows) => {
    const schedule = [];

    const groupedByDays = Object.groupBy(rows, (row) => row.scheduleDay)

    for(let i = 0; i < days.length; i++){

      const daySchedule = groupedByDays[days[i]];
      const dayGroup = {day: days[i], timeSlots: buildSchedule(groupedByDays[days[i]])}
      schedule.push(dayGroup);
    }
    return schedule;
  };

  const buildSchedule = (rows) => {
    const schedule = {};
    const slotSet = new Set();

    let earliestMinutes = Infinity;
    let latestMinutes = -Infinity;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const startTime = row.startTime?.trim(); // e.g. "13:00"
      const duration = parseInt(row.duration, 10); // duration in minutes
      const columnType = row.location?.trim();
      const fullSpan = row.spanAll == 1;


      if (!startTime || isNaN(duration)) continue;//|| !columns.includes(columnType)

      const slotCount = Math.ceil(duration / slotDuration);
      const timeSlots = generateTimeSlots(startTime, slotCount, slotDuration);

      const startMinutes = timeToMinutes(timeSlots[0]);
      const endMinutes = timeToMinutes(timeSlots[timeSlots.length - 1]) + slotDuration;

      earliestMinutes = Math.min(earliestMinutes, startMinutes);
      latestMinutes = Math.max(latestMinutes, endMinutes);

      // First slot gets the content and rowspan
      if (!schedule[timeSlots[0]]) schedule[timeSlots[0]] = {};
      schedule[timeSlots[0]][columnType] = {
        content: row, // Show event title from index 0
        span: slotCount,
      };

      // Mark following slots as skipped
      for (let j = 1; j < slotCount; j++) {
        const time = timeSlots[j];
        if (!schedule[time]) schedule[time] = {};
        schedule[time][columnType] = { skip: true };
      }

      if (fullSpan) {
        if (!schedule[startTime]) schedule[startTime] = {};
        const slotCount = Math.ceil(parseInt(row.duration, 10) / slotDuration);
        const timeSlots = generateTimeSlots(startTime, slotCount, slotDuration);
      
        timeSlots.forEach((slot, i) => {
          if (!schedule[slot]) schedule[slot] = {};
          columns.forEach(col => {
            if (i === 0) {
              schedule[slot][col] = {
                fullWidth: true,
                span: slotCount,
                content: row
              };
            } else {
              schedule[slot][col] = { skip: true };
            }
          });
        });
    }}
    const fullSlots = [];
        for (let t = earliestMinutes; t <= latestMinutes; t += slotDuration) {
        fullSlots.push(minutesToTime(t));
        }
        return { schedule, slots: fullSlots };
    }

  const generateTimeSlots = (start, count, duration) => {
    const slots = [];
    let [h, m] = start.split(':').map(Number);
    for (let i = 0; i < count; i++) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += duration;
      h += Math.floor(m / 60);
      m = m % 60;
    }
    return slots;
  };

  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (total) => {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const toggleModal = (cell = null) => {
    setModal(!modalOpen);
    if(!!cell)
    {
        setModalContent({
                ...cell
            });
    }
  }

  const changeDay = (newDay) => {
    setDay(newDay);
    setScheduleMap(scheduleMapByDay.filter(x => x.day === newDay)[0].timeSlots.schedule);
    setTimeSlots(scheduleMapByDay.filter(x => x.day === newDay)[0].timeSlots.slots);
  }


  return (
    <div style={{width: '100%'}}>   
      <>
        {days.map((day) => {
            return <Button onClick={() => changeDay(day)} style={{...dayButtonStyle, backgroundColor: day === selectedDay ? "#5CE1E6" : "#FFDE59"}}>
                <div className='LGF' style={{ fontSize: '1.2em' }} >{day}</div>
            </Button>
        })}
      </>
      <PanelModal handleClose={toggleModal} open={modalOpen && !!modalContent} panel={modalContent}></PanelModal>
      <table border="1" cellPadding="2" style={{ borderCollapse: 'collapse', width: '100%', height: '100%', backgroundColor: 'white'}}>
        <thead>
          <tr>
            <th style={{width: '30px'}}>Time</th>
            {columns.map(col => (
              <th style={{width: '200px'}} key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time} style={{height: '100px', maxHeight: '100px'}}>
              <td><strong>{convertMilitaryTime(time)}</strong></td>
              {columns.map((col, colIndex) => {
                const cell = scheduleMap[time]?.[col];
                if (cell?.fullWidth && colIndex != 0 &&  colIndex != 6) return null;
                if (cell?.fullWidth && colIndex == 6) return <td/>;
                if (cell?.content) {
                  return (
                    <td style={{maxHeight: '100px'}} key={col} rowSpan={cell.span} colSpan={cell.fullWidth && colIndex === 0 ? columns.length - 1 : null}>
                      {
                        <>
                            <Button onClick={() => toggleModal(cell.content)} style={{...panelEntryStyle, backgroundColor: cell.content.displayColor, lineHeight: '1.2em'}}>
                              {cell.content.ribbon ? 
                              <div style={{ position: 'absolute', top: 2, right: 2}}>
                                <Tooltip title="Chance to earn a Ribbon">
                                  <BookmarkIcon/>
                                </Tooltip>
                              </div> : 
                              null}
                              <div className='LGF' style={{ fontSize: '1.2em' }} >
                                  {cell.content.panelName}
                              </div>
                            </Button>
                        </>
                      }
                    </td>
                  );
                }                
                if (cell?.skip) return;
                return <td key={col}></td>;
              })}
              <td><strong>{convertMilitaryTime(time)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ScheduleGrid;


















