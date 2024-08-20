interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, handleClose, children }) => {
  return (
    <>
      { 
        isOpen ?
        <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: 1000,
              // background: 'rgba(255,255,255,0.25)',
              background: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '5px 10px',
                background: 'darkgrey',
                border: '5px solid violet',
                borderRadius: '15px',
              }}
            >
              <div 
                style={{ cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-end' }}
                onClick={() => handleClose()}
              >
                X
              </div>
              {children}
            </div>
        </div>
        : null
      }
    </>
  );
}

export { Modal };
