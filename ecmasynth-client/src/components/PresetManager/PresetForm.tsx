import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { CreateSynthPresetDto, SynthPreset } from '../../types/synth.types';

const FormContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
  border-radius: 8px;
  color: #fff;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #ddd;
`;

const Input = styled.input`
  padding: 8px;
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

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

interface PresetFormProps {
  preset?: SynthPreset;
  onSuccess?: () => void;
  getPresetData: () => string;
}

const PresetForm: React.FC<PresetFormProps> = ({ preset, onSuccess, getPresetData }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateSynthPresetDto>({
    name: preset?.name || '',
    envelope: preset?.envelope || '',
    reverb: preset?.reverb || '',
    delay: preset?.delay || '',
    volume: preset?.volume || JSON.stringify({ level: -12 }),
    oscillator: preset?.oscillator || JSON.stringify({ count: 2, spread: 15 }),
    filter: preset?.filter || JSON.stringify({ frequency: 2000, rolloff: -24 }),
    gainLimiter: preset?.gainLimiter || JSON.stringify({ gain: 0.5, threshold: -12 }),
    deletionPassword: ''
  });

  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  const PasswordHelp = styled.div`
    font-size: 12px;
    color: #aaa;
    margin-top: 4px;
    line-height: 1.4;
  `;

  const InfoIcon = styled.span`
    cursor: help;
    margin-left: 6px;
    color: #888;
    &:hover {
      color: #aaa;
    }
  `;

  const createMutation = useMutation({
    mutationFn: (data: CreateSynthPresetDto) => {
      const presetData = {
        ...data,
        envelope: getPresetData()
      };
      return api.createPreset(presetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      onSuccess?.();
      setFormData({
        name: '',
        envelope: '',
        reverb: '',
        delay: '',
        volume: JSON.stringify({ level: -12 }),
        oscillator: JSON.stringify({ count: 2, spread: 15 }),
        filter: JSON.stringify({ frequency: 2000, rolloff: -24 }),
        gainLimiter: JSON.stringify({ gain: 0.5, threshold: -12 }),
        deletionPassword: ''
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: SynthPreset) => api.updatePreset(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      onSuccess?.();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preset) {
      updateMutation.mutate({ ...preset, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <FormContainer>
      <h2>{preset ? 'Edit Preset' : 'Create New Preset'}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        {!preset && (
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
              name="deletionPassword"
              value={formData.deletionPassword}
              onChange={handleChange}
              required={!preset}
              placeholder="Enter a password to protect your preset"
            />
            {showPasswordHelp && (
              <PasswordHelp>
                This password will be required when you want to delete this preset later.
                Make sure to remember it! This is the only way to delete your preset.
              </PasswordHelp>
            )}
          </FormGroup>
        )}
        <FormGroup>
          <Label htmlFor="envelope">Envelope</Label>
          <Input
            type="text"
            id="envelope"
            name="envelope"
            value={formData.envelope}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="reverb">Reverb</Label>
          <Input
            type="text"
            id="reverb"
            name="reverb"
            value={formData.reverb}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="delay">Delay</Label>
          <Input
            type="text"
            id="delay"
            name="delay"
            value={formData.delay}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {preset ? 'Update Preset' : 'Save Preset'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PresetForm; 