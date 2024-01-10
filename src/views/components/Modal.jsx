import "../../assets/styles/modal.css";
export default function Modal({ handleOverlayClick, closeModal, children }) {
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-wrapper relative bg-gray-100">
        <i
          className="material-icons text-md w-4 mr-2 text-red-600 absolute right-2"
          onClick={closeModal}
        >
          close_icon
        </i>
        {children}
      </div>
    </div>
  );
}
