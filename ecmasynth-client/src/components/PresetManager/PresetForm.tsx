import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { 
  CreateSynthPresetDto, 
  SynthPreset, 
  OscillatorParams,
  FilterParams,
  GainLimiterParams,
  PARAM_RANGES 
} from '../../types/synth.types';

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

const RangeInput = styled.input`
  width: 100%;
  margin: 8px 0;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #4a4a4a;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
`;

const ValueDisplay = styled.span`
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  color: #aaa;
`;

interface PresetFormProps {
  preset?: SynthPreset;
  onSuccess?: () => void;
  getPresetData: () => string;
  onParamChange?: (params: Partial<{
    oscillator: OscillatorParams;
    filter: FilterParams;
    gainLimiter: GainLimiterParams;
  }>) => void;
}

const PresetForm: React.FC<PresetFormProps> = ({ 
  preset, 
  onSuccess, 
  getPresetData,
  onParamChange 
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateSynthPresetDto>({
    name: preset?.name || '',
    envelope: preset?.envelope || '',
    reverb: preset?.reverb || '',
    delay: preset?.delay || '',
    volume: preset?.volume || JSON.stringify({ level: -12 }),
    oscillator: preset?.oscillator || JSON.stringify({ count: 2, spread: 15 }),
    filter: preset?.filter || JSON.stringify({ frequency: 2000, rolloff: -24 }),
    gainLimiter: preset?.gainLimiter || JSON.stringify({ gain: 0.5, threshold: -12 })
  });

  const [oscillatorParams, setOscillatorParams] = useState<OscillatorParams>(
    JSON.parse(formData.oscillator)
  );
  const [filterParams, setFilterParams] = useState<FilterParams>(
    JSON.parse(formData.filter)
  );
  const [gainLimiterParams, setGainLimiterParams] = useState<GainLimiterParams>(
    JSON.parse(formData.gainLimiter)
  );

  useEffect(() => {
    // Update form data when params change
    setFormData(prev => ({
      ...prev,
      oscillator: JSON.stringify(oscillatorParams),
      filter: JSON.stringify(filterParams),
      gainLimiter: JSON.stringify(gainLimiterParams)
    }));

    // Notify parent component of parameter changes
    onParamChange?.({
      oscillator: oscillatorParams,
      filter: filterParams,
      gainLimiter: gainLimiterParams
    });
  }, [oscillatorParams, filterParams, gainLimiterParams, onParamChange]);

  const createMutation = useMutation({
    mutationFn: (data: CreateSynthPresetDto) => {
      const currentParams = JSON.parse(getPresetData());
      const presetData = {
        ...data,
        envelope: JSON.stringify(currentParams.envelope),
        reverb: JSON.stringify(currentParams.reverb),
        delay: JSON.stringify(currentParams.delay),
        volume: JSON.stringify(currentParams.volume),
        oscillator: JSON.stringify(currentParams.oscillator),
        filter: JSON.stringify(currentParams.filter),
        gainLimiter: JSON.stringify(currentParams.gainLimiter)
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
        gainLimiter: JSON.stringify({ gain: 0.5, threshold: -12 })
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

  const handleParamChange = (
    section: 'oscillator' | 'filter' | 'gainLimiter',
    param: string,
    value: number
  ) => {
    switch (section) {
      case 'oscillator':
        setOscillatorParams(prev => ({ ...prev, [param]: value }));
        break;
      case 'filter':
        if (param === 'rolloff') {
          // Ensure rolloff is one of: -12, -24, -48, -96
          const validRolloffs = [-12, -24, -48, -96];
          const closestRolloff = validRolloffs.reduce((prev, curr) => 
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
          );
          setFilterParams(prev => ({ ...prev, rolloff: closestRolloff }));
        } else {
          setFilterParams(prev => ({ ...prev, [param]: value }));
        }
        break;
      case 'gainLimiter':
        setGainLimiterParams(prev => ({ ...prev, [param]: value }));
        break;
    }
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
        <FormGroup>
          <Label>Oscillator Settings</Label>
          <ControlRow>
            <Label htmlFor="osc-count">Count:</Label>
            <RangeInput
              type="range"
              id="osc-count"
              min={PARAM_RANGES.oscillator.count.min}
              max={PARAM_RANGES.oscillator.count.max}
              step={PARAM_RANGES.oscillator.count.step}
              value={oscillatorParams.count}
              onChange={(e) => handleParamChange('oscillator', 'count', parseInt(e.target.value))}
            />
            <ValueDisplay>{oscillatorParams.count}</ValueDisplay>
          </ControlRow>
          <ControlRow>
            <Label htmlFor="osc-spread">Spread:</Label>
            <RangeInput
              type="range"
              id="osc-spread"
              min={PARAM_RANGES.oscillator.spread.min}
              max={PARAM_RANGES.oscillator.spread.max}
              step={PARAM_RANGES.oscillator.spread.step}
              value={oscillatorParams.spread}
              onChange={(e) => handleParamChange('oscillator', 'spread', parseInt(e.target.value))}
            />
            <ValueDisplay>{oscillatorParams.spread}¢</ValueDisplay>
          </ControlRow>
        </FormGroup>
        <FormGroup>
          <Label>Filter Settings</Label>
          <ControlRow>
            <Label htmlFor="filter-freq">Frequency:</Label>
            <RangeInput
              type="range"
              id="filter-freq"
              min={PARAM_RANGES.filter.frequency.min}
              max={PARAM_RANGES.filter.frequency.max}
              step={PARAM_RANGES.filter.frequency.step}
              value={filterParams.frequency}
              onChange={(e) => handleParamChange('filter', 'frequency', parseFloat(e.target.value))}
            />
            <ValueDisplay>{filterParams.frequency}Hz</ValueDisplay>
          </ControlRow>
          <ControlRow>
            <Label htmlFor="filter-rolloff">Rolloff:</Label>
            <RangeInput
              type="range"
              id="filter-rolloff"
              min={PARAM_RANGES.filter.rolloff.min}
              max={PARAM_RANGES.filter.rolloff.max}
              step={PARAM_RANGES.filter.rolloff.step}
              value={filterParams.rolloff}
              onChange={(e) => handleParamChange('filter', 'rolloff', parseFloat(e.target.value))}
            />
            <ValueDisplay>{filterParams.rolloff}dB/oct</ValueDisplay>
          </ControlRow>
        </FormGroup>
        <FormGroup>
          <Label>Gain & Limiter Settings</Label>
          <ControlRow>
            <Label htmlFor="gain">Gain:</Label>
            <RangeInput
              type="range"
              id="gain"
              min={PARAM_RANGES.gainLimiter.gain.min}
              max={PARAM_RANGES.gainLimiter.gain.max}
              step={PARAM_RANGES.gainLimiter.gain.step}
              value={gainLimiterParams.gain}
              onChange={(e) => handleParamChange('gainLimiter', 'gain', parseFloat(e.target.value))}
            />
            <ValueDisplay>{(gainLimiterParams.gain * 100).toFixed(0)}%</ValueDisplay>
          </ControlRow>
          <ControlRow>
            <Label htmlFor="threshold">Threshold:</Label>
            <RangeInput
              type="range"
              id="threshold"
              min={PARAM_RANGES.gainLimiter.threshold.min}
              max={PARAM_RANGES.gainLimiter.threshold.max}
              step={PARAM_RANGES.gainLimiter.threshold.step}
              value={gainLimiterParams.threshold}
              onChange={(e) => handleParamChange('gainLimiter', 'threshold', parseFloat(e.target.value))}
            />
            <ValueDisplay>{gainLimiterParams.threshold}dB</ValueDisplay>
          </ControlRow>
        </FormGroup>
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