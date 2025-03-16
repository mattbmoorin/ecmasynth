import React, { useState } from 'react';
import styled from 'styled-components';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: #2a2a2a;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  color: white;
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0 16px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6a6a6a;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'danger' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: ${props => props.variant === 'danger' ? '#aa3333' : '#4a4a4a'};
  color: white;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#cc4444' : '#5a5a5a'};
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  margin-bottom: 16px;
`;

interface DeletePresetDialogProps {
  presetName: string;
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
}

const DeletePresetDialog: React.FC<DeletePresetDialogProps> = ({
  presetName,
  onConfirm,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the deletion password');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preset');
      setIsDeleting(false);
    }
  };

  return (
    <DialogOverlay onClick={onCancel}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <Title>Delete "{presetName}"</Title>
          <p>Enter the deletion password to remove this preset:</p>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter deletion password"
            autoFocus
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonGroup>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Preset'}
            </Button>
          </ButtonGroup>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
};

export default DeletePresetDialog; 