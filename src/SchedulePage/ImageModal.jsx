import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-65%, -50%)',
  width: '100%',
  maxWidth: 700
};

const PannelModal = ({ open, handleClose, image }) => {
if(image != null)  {return (
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
            {
              open ?
              <img src={image}  style={{width: '120%'}}/> :
              null
            }
          </Box>
        </Fade>
      </Modal>
    </div>
  )};
}

export default PannelModal;