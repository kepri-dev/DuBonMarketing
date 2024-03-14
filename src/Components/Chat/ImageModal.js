const ImageModal = ({ imageUrl, onClose }) => {

  return (
    <div className="modalBackground" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged pic" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageModal;
