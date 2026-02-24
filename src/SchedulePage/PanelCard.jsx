import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ImageModal from './ImageModal';
import {textShadowStyle} from '../util'


const PanelCard = ({ panel }) => { if(panel != null && panel.panelName != '')  {
    const [modalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modalOpen)
    }
    
    return (
    <>
    <ImageModal image={`./${panel.location}.png`} open={modalOpen} handleClose={toggleModal} />
    <Paper elevation={3} style={{float: 'left', width: '90%', marginBottom: '3%', marginLeft: '1%', padding: '1em', backgroundColor: `${panel.displayColor}`, borderRadius: '10px'}}>
        <div className={'LGF'} style={{float: 'left', fontSize: '1.5em', textShadow: textShadowStyle}}>
            {panel.panelName}
        </div>
        <Button 
            style={{float: 'right', fontSize: '1em', marginBottom: '.5em', backgroundColor: `${panel.displayColor == '#FFDE59' ? '#5CE1E6' : '#FFDE59'}`}}
            onClick={toggleModal}>
            <div className='LGF' style={{color: 'black'}}>
                {panel.location.length == 1 ? `Panel Room ${panel.location}` : panel.location}
            </div>
        </Button>
        <Paper style={{float: 'left', width: '95%', backgroundColor:'white', borderRadius: '10px'}}>
            {
                panel.imageOverride ? 
                <div> Hi </div> : 
                <>
                    <div style={{margin: '10px', float: 'unset'}}>
                        {panel.description.replaceAll('+|+', ',').split('+n+').map(line => (
                            <div>{line}</div>
                        ))}
                    </div>
                    <br/>
                    <b>Presented by: </b>{panel.panelRunner}
                </>
            }
        </Paper>
        <div style={{float: 'left', fontSize: '1em'}}>
            <b>Duration:</b> {panel.duration > 60 ? `${panel.duration/60} Hours` : `${panel.duration/60} Hour` } 
            <br/>
            <div style={{fontSize: '.75em', float: 'left'}}>
                {`${panel.catagory === '' ? 'Attendee' : panel.catagory} Panel`}
            </div>
        </div>
        <div style={{float: 'right', fontSize: '1em'}}>
            <b>Age rating:</b> {panel.ageRating}
            <br/>
            {panel.ribbon ? 
                <div style={{float: 'right', fontSize: '.75em'}}>
                Chance to earn a Ribbon <BookmarkIcon fontSize='.75em'/>
                </div> : 
                null
            }
        </div>                                   
    </Paper>
    </>
  );
}};

export default PanelCard;