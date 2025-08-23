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

  const textShadowStyle = '-1px -1px 0 #ffffffff, 1px -1px 0 #ffffffff, -1px 1px 0 #ffffffff, 1px 1px 0 #ffffffff'

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
                    <div style={{ marginBottom: '.5em', backgroundColor: `${times.indexOf(time)%2 === 0 ? '#380879' : '#8305ab'}`, borderRadius: '10px', float: 'left', width: '100%'}}>
                        <div style={{float: 'left',  width: '50%'}}>
                            <div className='LGF' style={{float: 'left', fontSize: '1.75em', marginLeft: '.5em', textShadow: textShadowStyle }}>
                                {convertMilitaryTime(time)}
                            </div>
                        </div>
                    {
                        groupedSchedule[time].map(panel => {
                            return(
                                <Paper elevation={3} style={{float: 'left', width: '90%', marginBottom: '3%', marginLeft: '1%', padding: '1em', backgroundColor: `${panel.displayColor}`, borderRadius: '10px'}}>
                                    <div className='LGF' style={{float: 'left', fontSize: '1.5em', textShadow: textShadowStyle}}>
                                        {panel.panelName}
                                    </div>
                                    <div className='LGF' style={{float: 'right', fontSize: '1.5em'}}>
                                        Panel Room: {panel.location}
                                    </div>
                                    <Paper style={{float: 'left', width: '95%', backgroundColor:'white', borderRadius: '10px'}}>
                                        {panel.description}
                                    </Paper>
                                    <div style={{float: 'left', fontSize: '.75em'}}>
                                        <b>Duration:</b> {panel.duration} minutes
                                    </div>
                                    <div style={{float: 'right', fontSize: '.75em'}}>
                                        <b>Age rating:</b> {panel.ageRating}
                                    </div>
                                </Paper>
                            )
                        })
                    }
                    </div>
                </div>
            )
        }       
    </div>
  );
};

export default ScheduleListPage;