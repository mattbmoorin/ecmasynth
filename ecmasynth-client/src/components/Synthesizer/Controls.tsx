/**
 * Controls.tsx
 * 
 * This component provides the user interface for controlling the synthesizer's parameters.
 * It renders four groups of sliders for adjusting:
 * 1. Envelope (ADSR) parameters
 * 2. Reverb effects
 * 3. Delay effects
 * 4. Volume
 * 
 */

import React, { useCallback, useMemo } from 'react';
import { SynthParams, PARAM_RANGES } from '../../types/synth.types';
import { ControlsContainer, ControlGroup, ControlLabel, Slider } from './styles';

interface ControlsProps {
  /** Current synthesizer parameters */
  params: SynthParams;
  /** Callback function for parameter changes */
  onParamChange: (category: keyof SynthParams, parameter: string, value: number) => void;
}

type ParamRange = {
  min: number;
  max: number;
  step: number;
};

type CategoryKey = keyof typeof PARAM_RANGES;
type ParamKey<T extends CategoryKey> = keyof typeof PARAM_RANGES[T];

/**
 * Control group titles with proper capitalization
 */
const GROUP_TITLES = {
  oscillator: 'Oscillator',
  filter: 'Filter',
  envelope: 'Envelope',
  gainLimiter: 'Output',
  reverb: 'Reverb',
  delay: 'Delay',
  volume: 'Master'
} as const;

/**
 * Parameter display names for better UI presentation
 */
const PARAM_DISPLAY_NAMES = {
  // Oscillator parameters
  count: 'Unison',
  spread: 'Detune',
  
  // Filter parameters
  frequency: 'Cutoff',
  rolloff: 'Slope',
  
  // Envelope parameters
  attack: 'Attack',
  decay: 'Decay',
  sustain: 'Sustain',
  release: 'Release',
  
  // Effect parameters
  wet: 'Mix',
  delayTime: 'Time',
  feedback: 'Feedback',
  preDelay: 'Pre-delay',
  
  // Output parameters
  gain: 'Drive',
  threshold: 'Limit',
  
  // Volume parameter
  level: 'Level'
} as const;

/**
 * Controls component for the synthesizer parameters
 */
const Controls: React.FC<ControlsProps> = ({ params, onParamChange }) => {
  /**
   * Memoized handler for parameter changes
   */
  const handleParamChange = useCallback((
    category: keyof SynthParams,
    parameter: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onParamChange(category, parameter, parseFloat(event.target.value));
  }, [onParamChange]);

  /**
   * Renders a single parameter control
   */
  const renderControl = useCallback((
    category: CategoryKey,
    parameter: string,
    value: number
  ) => {
    const ranges = PARAM_RANGES[category][parameter as ParamKey<typeof category>] as ParamRange;
    const displayName = (PARAM_DISPLAY_NAMES as Record<string, string>)[parameter] || parameter;

    return (
      <div key={`${category}-${parameter}`}>
        <ControlLabel>{displayName}</ControlLabel>
        <Slider
          type="range"
          min={ranges.min.toString()}
          max={ranges.max.toString()}
          step={ranges.step.toString()}
          value={value}
          onChange={(e) => handleParamChange(category, parameter, e)}
        />
        <small style={{ color: '#888' }}>{value.toFixed(2)}</small>
      </div>
    );
  }, [handleParamChange]);

  /**
   * Renders a group of controls for a specific category
   */
  const renderControlGroup = useCallback((category: CategoryKey) => {
    const categoryParams = params[category];
    const title = GROUP_TITLES[category];

    return (
      <ControlGroup key={category}>
        <h3 style={{ color: '#fff', marginBottom: '15px' }}>{title}</h3>
        {Object.entries(categoryParams).map(([param, value]) => 
          renderControl(category, param, value)
        )}
      </ControlGroup>
    );
  }, [params, renderControl]);

  // Memoize the categories to prevent unnecessary re-renders
  const categories = useMemo(() => 
    ['oscillator', 'filter', 'envelope', 'gainLimiter', 'reverb', 'delay', 'volume'] as const, 
    []
  );

  return (
    <ControlsContainer>
      {categories.map(category => renderControlGroup(category))}
    </ControlsContainer>
  );
};

export default Controls; 