import Modal from "../ui/Modal.jsx";
export default function Lightbox({ src, onClose }) {
  return (
    <Modal open={!!src} onClose={onClose}>
      <img src={src} alt="" className="max-h-[90vh] object-contain" />
    </Modal>
  );
}
