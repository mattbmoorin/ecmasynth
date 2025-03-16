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
import { SynthParams } from '../../types/synth.types';
import { ControlsContainer, ControlGroup, ControlLabel, Slider } from './styles';

interface ControlsProps {
  /** Current synthesizer parameters */
  params: SynthParams;
  /** Callback function for parameter changes */
  onParamChange: (category: keyof SynthParams, parameter: string, value: number) => void;
}

interface ParamRange {
  min: number;
  max: number;
  step: number;
}

type CategoryRanges = {
  [K: string]: ParamRange;
};

type ParamRanges = {
  [K in keyof SynthParams]: CategoryRanges;
};

/**
 * Parameter range configurations for different control types
 */
const PARAM_RANGES: ParamRanges = {
  envelope: {
    attack: { min: 0, max: 2, step: 0.01 },
    decay: { min: 0, max: 2, step: 0.01 },
    sustain: { min: 0, max: 1, step: 0.01 },
    release: { min: 0, max: 2, step: 0.01 }
  },
  reverb: {
    wet: { min: 0, max: 1, step: 0.01 },
    decay: { min: 0, max: 10, step: 0.01 },
    preDelay: { min: 0, max: 0.1, step: 0.001 }
  },
  delay: {
    wet: { min: 0, max: 1, step: 0.01 },
    delayTime: { min: 0, max: 1, step: 0.01 },
    feedback: { min: 0, max: 0.9, step: 0.01 }
  },
  volume: {
    level: { min: -60, max: 0, step: 0.01 }
  }
};

/**
 * Control group titles with proper capitalization
 */
const GROUP_TITLES = {
  envelope: 'Envelope',
  reverb: 'Reverb',
  delay: 'Delay',
  volume: 'Volume'
} as const;

/**
 * Parameter display names for better UI presentation
 */
const PARAM_DISPLAY_NAMES = {
  attack: 'Attack',
  decay: 'Decay',
  sustain: 'Sustain',
  release: 'Release',
  wet: 'Mix',
  delayTime: 'Time',
  feedback: 'Feedback',
  preDelay: 'Pre-delay'
} as const;

/**
 * Controls component for the synthesizer parameters
 * 
 * @param params - Current synthesizer parameters
 * @param onParamChange - Callback function for parameter changes
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
    category: keyof SynthParams,
    parameter: string,
    value: number
  ) => {
    const ranges = PARAM_RANGES[category][parameter];
    const displayName = PARAM_DISPLAY_NAMES[parameter as keyof typeof PARAM_DISPLAY_NAMES] || parameter;

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
  const renderControlGroup = useCallback((category: keyof SynthParams) => {
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
    ['envelope', 'reverb', 'delay', 'volume'] as const, 
    []
  );

  return (
    <ControlsContainer>
      {categories.map(category => renderControlGroup(category))}
    </ControlsContainer>
  );
};

export default Controls; 