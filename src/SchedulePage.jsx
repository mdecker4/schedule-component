import React, { useEffect, useState } from 'react';
import PannelModal from './PannelModal';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { convertMilitaryTime } from './util';

const SchedulePage = ({ url }) => {
  const [scheduleMap, setScheduleMap] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(['Error', 'Error']);
  const columns = ['Main Events','A', 'B', 'C', 'Video Game'];
  const slotDuration = 30; // minutes

  const panelEntryStyle = {
    width: '100%', 
    height: '100%', 
    color: 'black',
    margin: 0,
  }

  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const text = await response.text();
        const parsed = parseCSV(text);
        const { schedule, slots } = buildSchedule(parsed);
        setScheduleMap(schedule);
        setTimeSlots(slots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseCSV();
  }, [url]);

  const parseCSV = (csvText) => {
    return csvText
      .trim()
      .split('\n')
      .map(row => row.split(','));
  };

  const buildSchedule = (rows) => {
    const schedule = {};
    const slotSet = new Set();

    let earliestMinutes = Infinity;
    let latestMinutes = -Infinity;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const startTime = row[3]?.trim(); // e.g. "13:00"
      const duration = parseInt(row[4], 10); // duration in minutes
      const columnType = row[5]?.trim();
      const fullSpan = row[8] == 1;

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
        const slotCount = Math.ceil(parseInt(row[4], 10) / slotDuration);
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
    }
  }

    // Generate full time slots from earliest to latest (every 30 min)
    const fullSlots = [];
    for (let t = earliestMinutes; t <= latestMinutes; t += slotDuration) {
      fullSlots.push(minutesToTime(t));
    }

    return { schedule, slots: fullSlots };
  };

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
                panelName: cell[0],
                description: cell[1],
                panelRunner: cell[2],
                startTime: cell[3],
                duration: cell[4],
                location: cell[5],
                ageRating: cell[6],
                displayColor: cell[7],
                spanAll: cell[8]
            });
    }
  }

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{width: '100%'}}>   
      <h2>Schedule</h2>
      <PannelModal handleClose={toggleModal} open={modalOpen && !!modalContent} panel={modalContent}></PannelModal>
      <table border="1" cellPadding="2" style={{ borderCollapse: 'collapse', width: '100%', height: '100%'}}>
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
                if (cell?.fullWidth && colIndex != 0) return null;
                if (cell?.content) {
                  return (
                    <td style={{maxHeight: '100px'}} key={col} rowSpan={cell.span} colSpan={cell.fullWidth && colIndex === 0 ? columns.length : null}>
                      {
                        <>
                            <Button onClick={() => toggleModal(cell.content)} style={{...panelEntryStyle, backgroundColor: cell.content[7]}}>
                                <Typography variant='h6' >
                                    {cell.content[0]}
                                </Typography>
                            </Button>
                        </>
                      }
                    </td>
                  );
                }                
                if (cell?.skip) return;
                return <td key={col}></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulePage;