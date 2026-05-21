import './Modal.css';

const Modal = ({ isOpen, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="stk-modal-overlay">
      <div className="stk-modal-container">
        <div className="stk-modal-header">
          <h2 className="stk-modal-title">{title}</h2>
        </div>
        <div className="stk-modal-body">
          {children}
        </div>
        {footer && <div className="stk-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
