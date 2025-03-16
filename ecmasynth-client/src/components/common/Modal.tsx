import React, { ReactNode } from 'react';
import styled from 'styled-components';

// The modal backdrop - a semi-transparent layer that covers the entire screen
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// The modal container - the white box that contains the content
const ModalContainer = styled.div`
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

// Props interface for type safety
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

// The Modal component itself
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle clicks on the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer>
        <ModalHeader>
          <h2>{title}</h2>
        </ModalHeader>
        {children}
      </ModalContainer>
    </Backdrop>
  );
};

const ModalHeader = styled.div`
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #fff;
  }
`;

export default Modal; 