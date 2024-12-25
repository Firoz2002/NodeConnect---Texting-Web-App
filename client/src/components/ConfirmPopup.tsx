import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export interface ConfirmPopupProps {
    action: () => void;
    showConfirmPopup: boolean;
    setShowConfirmPopup: (value: boolean) => void;
}

const ConfirmPopup: FC<ConfirmPopupProps> = ({showConfirmPopup, setShowConfirmPopup, action}) => {

  const handleClose = () => setShowConfirmPopup(false);

  return (
    <>
      <Modal show={showConfirmPopup} onHide={handleClose} className='confirm-popup'>
        <Modal.Header closeButton>
          <Modal.Title>Delete chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this chat?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="danger" onClick={() => action()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmPopup;