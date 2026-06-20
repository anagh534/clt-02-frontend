import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-body p-4 p-sm-5 text-center">
              <div className={`d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-4 ${isDestructive ? 'bg-danger bg-opacity-10 text-danger' : 'bg-primary bg-opacity-10 text-primary'}`}>
                <AlertCircle size={32} />
              </div>
              <h4 className="fw-bold mb-3">{title}</h4>
              <p className="text-secondary mb-4">{message}</p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                <button type="button" className="btn btn-light px-4 py-2 fw-medium flex-sm-fill" onClick={onCancel}>
                  Cancel
                </button>
                <button type="button" className={`btn px-4 py-2 fw-medium flex-sm-fill ${isDestructive ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
    </>
  );
};

export default ConfirmModal;
