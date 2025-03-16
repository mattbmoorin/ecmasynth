import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { SynthPreset } from '../../types/synth.types';
import DeletePresetDialog from './DeletePresetDialog';

const PresetListContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
  border-radius: 8px;
  color: #fff;
`;

const PresetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: #3a3a3a;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #4a4a4a;
  }
`;

const Button = styled.button`
  background: #5a5a5a;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background: #6a6a6a;
  }
`;

interface PresetListProps {
  onLoadPreset: (presetData: string) => void;
}

const PresetList: React.FC<PresetListProps> = ({ onLoadPreset }) => {
  const queryClient = useQueryClient();
  const [presetToDelete, setPresetToDelete] = useState<SynthPreset | null>(null);

  const { data: presets, isLoading } = useQuery({
    queryKey: ['presets'],
    queryFn: api.getPresets
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) => api.deletePreset(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      setPresetToDelete(null);
    }
  });

  const handleDeleteClick = (preset: SynthPreset) => {
    setPresetToDelete(preset);
  };

  const handleDeleteConfirm = async (password: string) => {
    if (!presetToDelete) return;
    await deleteMutation.mutateAsync({ id: presetToDelete.id, password });
  };

  if (isLoading) {
    return <div>Loading presets...</div>;
  }

  return (
    <PresetListContainer>
      <h2>Synth Presets</h2>
      {presets?.map((preset: SynthPreset) => (
        <PresetItem key={preset.id}>
          <div>
            <h3>{preset.name}</h3>
            <small>Created: {new Date(preset.createdAt).toLocaleDateString()}</small>
          </div>
          <div>
            <Button onClick={() => onLoadPreset(preset.envelope)}>
              Load
            </Button>
            <Button 
              onClick={() => handleDeleteClick(preset)}
              style={{ background: '#aa3333' }}
            >
              Delete
            </Button>
          </div>
        </PresetItem>
      ))}

      {presetToDelete && (
        <DeletePresetDialog
          presetName={presetToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPresetToDelete(null)}
        />
      )}
    </PresetListContainer>
  );
};

export default PresetList; 