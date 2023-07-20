import React, { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white p-4 shadow-lg z-10">
        {children}
      </div>
    </div>
  );
};

export default Modal;
