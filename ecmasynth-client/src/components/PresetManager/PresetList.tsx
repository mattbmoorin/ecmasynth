import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { SynthPreset } from '../../types/synth.types';
import { Button } from '../common/styles';

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

interface PresetListProps {
  onLoadPreset: (preset: SynthPreset) => void;
}

const PresetList: React.FC<PresetListProps> = ({ onLoadPreset }) => {
  const queryClient = useQueryClient();

  const { data: presets, isLoading } = useQuery({
    queryKey: ['presets'],
    queryFn: api.getPresets
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deletePreset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    }
  });

  const handleDeleteClick = (id: number) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading presets...</div>;
  }

  return (
    <PresetListContainer>
      <h2>Synth Presets</h2>
      {presets?.map((preset) => (
        <PresetItem key={preset.id}>
          <div>
            <h3>{preset.name}</h3>
            <small>Created: {new Date(preset.createdAt).toLocaleDateString()}</small>
          </div>
          <div>
            <Button onClick={() => onLoadPreset(preset)}>Load</Button>
            <Button 
              variant="danger"
              onClick={() => handleDeleteClick(preset.id)}
            >
              Delete
            </Button>
          </div>
        </PresetItem>
      ))}
    </PresetListContainer>
  );
};

export default PresetList; 