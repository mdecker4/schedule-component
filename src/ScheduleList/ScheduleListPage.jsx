import React, { useEffect, useState } from 'react';
import PannelModal from '../PannelModal';
import Button from '@mui/material/Button';
import { Paper, Typography } from '@mui/material';
import { emptyPanel, fetchAndParseScheduleData } from '../api/api';
import { convertMilitaryTime } from '../util';

const ScheduleListPage = ({ url }) => {
  const [schedule, setSchedule] = useState([]);
  const [groupedSchedule, setGroupedSchedule] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModal] = useState(false);
  const [modalContent, setModalContent] = useState();


  const panelEntryStyle = {
    width: '100%', 
    height: '100%', 
    color: 'black',
    margin: 0,
  }


  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const parsed = await fetchAndParseScheduleData(url);
        setSchedule(parsed);
        groupScheduleByTime(parsed)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseCSV();
  }, [url]);

  const toggleModal = (panel = null) => {
    setModal(!modalOpen);
    if(!!panel)
    {
        setModalContent(panel);
    }
  }

  const groupScheduleByTime = (schedule) => {
        const grouped = Object.groupBy(schedule, (panel) => panel.startTime)
        setGroupedSchedule(grouped);
        const times = Object.keys(grouped).sort();
        times.pop();
        setTimes(times)
  }

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{width: '100%'}}>   
      <h2>Schedule</h2>
      <PannelModal handleClose={toggleModal} open={modalOpen && !!modalContent} panel={modalContent}></PannelModal>
        {
            times.map(time => 
                <div>
                    <Paper elevation={3} style={{padding: '1em', margin: '.25em', backgroundColor: 'lightgrey', float: 'left', width: '95%'}}>
                        <div style={{float: 'left',  width: '50%'}}>
                            <div style={{float: 'left', fontSize: '1.5em'}}>
                                {convertMilitaryTime(time)}
                            </div>
                        </div>
                    {
                        groupedSchedule[time].map(panel => {
                            return(
                                <Paper elevation={3} style={{float: 'left', width: '95%', margin: '.25em', padding: '1em', backgroundColor: `${panel.displayColor}`, borderRadius: '10px'}}>
                                    <div style={{float: 'left', fontSize: '1.5em'}}>
                                        {panel.panelName}
                                    </div>
                                    <div style={{float: 'right', fontSize: '1.5em'}}>
                                        Panel Room: {panel.location}
                                    </div>
                                    <Paper style={{float: 'left', width: '100%', backgroundColor:'white', borderRadius: '10px'}}>
                                        {panel.description}
                                    </Paper>
                                    <div style={{float: 'left', fontSize: '.75em'}}>
                                        Duration: {panel.duration} minutes
                                    </div>
                                    <div style={{float: 'right', fontSize: '.75em'}}>
                                        Age rating: {panel.ageRating}
                                    </div>
                                </Paper>
                            )
                        })
                    }
                    </Paper>
                </div>
            )
        }       
    </div>
  );
};

export default ScheduleListPage;