import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxWidth: 700
};

const PannelModal = ({ open, handleClose, panel }) => {
if(panel != null)  {return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div id="transition-modal-title" className='LGF' style={{ fontSize: '1.5em' }}>
              {panel.panelName}
            </div>
            <Typography id="transition-modal-description" sx={{ mt: 2 }} style={{marginBottom: '1em'}}>
              {panel.description}
            </Typography>
            <Typography id="transition-modal-runner" style={{float: "left", fontSize: '.75em'}}>
                {`Panel Runner: ${panel.panelRunner}`}
            </Typography>
            <Typography id="transition-modal-age-rating" style={{float: "right", fontSize: '.75em'}}>
                {`Age Rating: ${panel.ageRating}`}
            </Typography>
            <br/>
            <Typography id="transition-modal-runner" style={{float: "left", fontSize: '.5em'}}>
                {`${panel.catagory === '' ? 'Attendee' : panel.catagory} Panel`}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  )};
}

export default PannelModal;