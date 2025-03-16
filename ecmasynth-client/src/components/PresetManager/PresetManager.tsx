/**
 * PresetManager.tsx
 * 
 * This component manages the saving, loading, and deletion of synthesizer presets.
 * It provides a user interface for preset management and handles the communication
 * with the backend API through React Query.
 * 
 * Features:
 * - List of saved presets with creation dates
 * - Save current synthesizer settings as a new preset
 * - Load existing presets
 * - Delete unwanted presets
 * - Error handling for API operations and JSON parsing
 * - Optimistic updates for better UX
 */

import React, { useState, useCallback, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { SynthPreset, SynthParams, CreateSynthPresetDto } from '../../types/synth.types';
import Modal from '../common/Modal';
import DeletePresetDialog from './DeletePresetDialog';
import { Button, Input } from '../common/styles';

// Theme constants
const THEME = {
  colors: {
    background: {
      primary: '#2a2a2a',
      secondary: '#3a3a3a',
      hover: '#4a4a4a'
    },
    text: {
      primary: '#ffffff'
    }
  },
  spacing: {
    small: '8px',
    medium: '10px',
    large: '15px',
    xlarge: '20px'
  },
  borderRadius: '4px'
} as const;

// Styled components with theme-based values
const Container = styled.div`
  padding: ${THEME.spacing.xlarge};
  background: ${THEME.colors.background.primary};
  border-radius: ${THEME.borderRadius};
  color: ${THEME.colors.text.primary};
  margin-bottom: ${THEME.spacing.xlarge};
`;

const PresetList = styled.div`
  display: grid;
  gap: ${THEME.spacing.medium};
  margin-top: ${THEME.spacing.large};
`;

const PresetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.spacing.medium};
  background: ${THEME.colors.background.secondary};
  border-radius: ${THEME.borderRadius};

  &:hover {
    background: ${THEME.colors.background.hover};
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${THEME.spacing.medium};
  margin-top: ${THEME.spacing.xlarge};
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: ${THEME.spacing.small};
  font-size: 14px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  position: relative;
`;

const InfoIcon = styled.span`
  cursor: help;
  color: #666;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #444;
  margin-left: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: #555;
    color: #fff;
  }
`;

const PasswordHelp = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 0.25rem;
  padding: 8px 12px;
  background: #333;
  border-radius: 4px;
  border: 1px solid #444;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  white-space: normal;
  max-width: 300px;
  line-height: 1.4;
`;

interface PresetManagerProps {
  /** Current synthesizer parameters */
  currentParams: SynthParams;
  /** Callback function when a preset is loaded */
  onLoadPreset: (params: SynthParams) => void;
}

/**
 * PresetManager component for managing synthesizer presets
 * 
 * @param currentParams - Current synthesizer parameters
 * @param onLoadPreset - Callback function when a preset is loaded
 */
const PresetManager: React.FC<PresetManagerProps> = ({ currentParams, onLoadPreset }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<SynthPreset | null>(null);
  const [presetName, setPresetName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [formData, setFormData] = useState({ deletionPassword: '' });

  // Query for fetching presets
  const { data: presets = [], isLoading, isError } = useQuery<SynthPreset[]>({
    queryKey: ['presets'],
    queryFn: api.getPresets
  });

  // Mutation for creating presets
  const createMutation = useMutation<
    SynthPreset,
    Error,
    CreateSynthPresetDto,
    { previousPresets: SynthPreset[] }
  >({
    mutationFn: api.createPreset,
    onMutate: async (newPreset) => {
      await queryClient.cancelQueries({ queryKey: ['presets'] });
      const previousPresets = queryClient.getQueryData<SynthPreset[]>(['presets']) ?? [];

      // Note: This is just for optimistic UI updates, the actual hash will be generated server-side
      const tempPreset: SynthPreset = {
        id: Date.now(),
        ...newPreset,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletionHash: 'pending' // Temporary value, will be replaced by server response
      };

      queryClient.setQueryData<SynthPreset[]>(['presets'], (old = []) => [...old, tempPreset]);

      return { previousPresets };
    },
    onError: (_err, _newPreset, context) => {
      if (context) {
        queryClient.setQueryData(['presets'], context.previousPresets);
      }
      setError('Failed to save preset');
    },
    onSuccess: () => {
      setIsModalOpen(false);
      setPresetName('');
      setError(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    }
  });

  // Mutation for deleting presets
  const deleteMutation = useMutation<
    void,
    Error,
    { id: number; password: string },
    { previousPresets: SynthPreset[] }
  >({
    mutationFn: ({ id, password }) => api.deletePreset(id, password),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['presets'] });
      const previousPresets = queryClient.getQueryData<SynthPreset[]>(['presets']) ?? [];

      queryClient.setQueryData<SynthPreset[]>(['presets'], (old = []) =>
        old.filter(preset => preset.id !== id)
      );

      return { previousPresets };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(['presets'], context.previousPresets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      setPresetToDelete(null);
    }
  });

  /**
   * Handles saving a new preset
   * Validates input and creates a new preset with current parameters
   */
  const handleSavePreset = useCallback(() => {
    setError(null);
    if (!presetName.trim()) {
      setError('Please enter a preset name');
      return;
    }

    try {
      const presetData: CreateSynthPresetDto = {
        name: presetName.trim(),
        envelope: JSON.stringify(currentParams.envelope),
        reverb: JSON.stringify(currentParams.reverb),
        delay: JSON.stringify(currentParams.delay),
        volume: JSON.stringify(currentParams.volume),
        deletionPassword: formData.deletionPassword
      };

      createMutation.mutate(presetData);
    } catch (err) {
      setError('Failed to prepare preset data');
    }
  }, [presetName, currentParams, createMutation, formData.deletionPassword]);

  /**
   * Handles loading a preset
   * Parses the preset data and updates the synthesizer parameters
   */
  const handleLoadPreset = useCallback((preset: SynthPreset) => {
    try {
      const params: SynthParams = {
        envelope: JSON.parse(preset.envelope),
        reverb: JSON.parse(preset.reverb),
        delay: JSON.parse(preset.delay),
        volume: { level: -12 } // Default volume level when loading old presets
      };
      onLoadPreset(params);
      setError(null);
    } catch (err) {
      setError('Failed to load preset: Invalid preset data');
    }
  }, [onLoadPreset]);

  const handleDeleteClick = (preset: SynthPreset) => {
    setPresetToDelete(preset);
  };

  const handleDeleteConfirm = async (password: string) => {
    if (!presetToDelete) return;
    await deleteMutation.mutateAsync({ id: presetToDelete.id, password });
  };

  const handlePresetNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPresetName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, deletionPassword: e.target.value }));
  };

  if (isLoading) {
    return <Container>Loading presets...</Container>;
  }

  if (isError) {
    return <Container>
      <ErrorMessage>Failed to load presets. Please try again later.</ErrorMessage>
    </Container>;
  }

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Synth Presets</h2>
        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)}
          disabled={createMutation.isPending}
        >
          Save Current Settings
        </Button>
      </div>

      <PresetList>
        {presets.map((preset: SynthPreset) => (
          <PresetItem key={preset.id}>
            <div>
              <h3>{preset.name}</h3>
              <small>Created: {new Date(preset.createdAt).toLocaleDateString()}</small>
            </div>
            <div>
              <Button 
                onClick={() => handleLoadPreset(preset)}
                disabled={deleteMutation.isPending}
              >
                Load
              </Button>
              <Button 
                variant="danger"
                onClick={() => handleDeleteClick(preset)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </PresetItem>
        ))}
        {presets.length === 0 && (
          <div style={{ textAlign: 'center', padding: THEME.spacing.xlarge }}>
            No presets saved yet.
          </div>
        )}
      </PresetList>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPresetName('');
          setError(null);
        }}
        title="Save Preset"
      >
        <FormGroup>
          <Label htmlFor="presetName">Preset Name</Label>
          <Input
            type="text"
            id="presetName"
            value={presetName}
            onChange={handlePresetNameChange}
            placeholder="Enter a name for your preset"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="deletionPassword">
            Deletion Password
            <InfoIcon 
              onMouseEnter={() => setShowPasswordHelp(true)}
              onMouseLeave={() => setShowPasswordHelp(false)}
            >
              ⓘ
            </InfoIcon>
          </Label>
          <Input
            type="password"
            id="deletionPassword"
            value={formData.deletionPassword}
            onChange={handlePasswordChange}
            placeholder="Enter a password to protect your preset"
            required
          />
          {showPasswordHelp && (
            <PasswordHelp>
              This password will be required when you want to delete this preset later.
              Make sure to remember it! This is the only way to delete your preset.
            </PasswordHelp>
          )}
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ModalButtons>
          <Button onClick={() => {
            setIsModalOpen(false);
            setPresetName('');
            setError(null);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSavePreset}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Saving...' : 'Save Preset'}
          </Button>
        </ModalButtons>
      </Modal>

      {presetToDelete && (
        <DeletePresetDialog
          presetName={presetToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPresetToDelete(null)}
        />
      )}
    </Container>
  );
};

export default PresetManager; 