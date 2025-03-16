import React, { useEffect, useState, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { SynthParams, defaultSynthParams } from '../../types/synth.types';
import { SynthesizerContainer } from './styles';
import Keyboard from './Keyboard';
import Controls from './Controls';

interface SynthesizerProps {
  /** Callback function triggered when synth parameters change */
  onParamsChange?: (params: SynthParams) => void;
  /** Initial parameters for the synthesizer */
  initialParams?: SynthParams;
}

// Custom synth voice with per-note effects
class VoiceWithEffects extends Tone.Synth {
  private delay: Tone.FeedbackDelay;
  private reverb: Tone.Reverb;
  private voiceChannel: Tone.Channel;
  private limiter: Tone.Limiter;
  private filter: Tone.Filter;
  private gain: Tone.Gain;

  constructor(options?: Partial<Tone.SynthOptions>) {
    super({
      ...options,
      oscillator: {
        type: 'fatsawtooth8',
        count: 2,
        spread: 15
      },
      volume: 5 
    });

    // Create effects chain
    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      rolloff: -24
    });

    this.gain = new Tone.Gain(0.5);

    this.delay = new Tone.FeedbackDelay({
      delayTime: defaultSynthParams.delay.delayTime,
      feedback: defaultSynthParams.delay.feedback * 0.7,
      wet: defaultSynthParams.delay.wet * 0.7,
      maxDelay: 1
    });

    this.reverb = new Tone.Reverb({
      decay: defaultSynthParams.reverb.decay,
      preDelay: defaultSynthParams.reverb.preDelay,
      wet: defaultSynthParams.reverb.wet * 0.7
    });

    this.limiter = new Tone.Limiter({
      threshold: -12
    });

    this.voiceChannel = new Tone.Channel({
      volume: defaultSynthParams.volume.level
    });

    // Disconnect the default output
    this.disconnect();

    // Connect the oscillator to the filter through the gain
    this.connect(this.gain);
    this.gain.connect(this.filter);
    
    // Chain the effects together
    this.filter.chain(
      this.delay,
      this.reverb,
      this.limiter,
      this.voiceChannel,
      Tone.Destination
    );
  }

  // Update effect parameters for this voice
  updateEffects(params: SynthParams) {
    const wetScale = 0.7;
    
    this.delay.set({
      delayTime: params.delay.delayTime,
      feedback: params.delay.feedback * wetScale,
      wet: params.delay.wet * wetScale
    });

    this.reverb.set({
      decay: params.reverb.decay,
      preDelay: params.reverb.preDelay,
      wet: params.reverb.wet * wetScale
    });

    this.filter.frequency.value = 2000 + (params.envelope.attack * 2000);
  }

  // Update volume for this voice
  updateVolume(value: number) {
    const scaledValue = Math.min(value, 0);
    this.voiceChannel.volume.value = scaledValue;
  }

  // Clean up voice resources
  dispose(): this {
    this.disconnect();
    this.gain.dispose();
    this.filter.dispose();
    this.delay.dispose();
    this.reverb.dispose();
    this.limiter.dispose();
    this.voiceChannel.dispose();
    super.dispose();
    return this;
  }
}

/**
 * Main Synthesizer component that orchestrates the audio synthesis and UI.
 * 
 * @param onParamsChange - Optional callback for parameter changes
 * @param initialParams - Optional initial parameters (defaults to defaultSynthParams)
 */
const Synthesizer: React.FC<SynthesizerProps> = ({
  onParamsChange,
  initialParams = defaultSynthParams
}) => {
  // Ref for the PolySynth with custom voices
  const synthRef = useRef<Tone.PolySynth<VoiceWithEffects> | null>(null);
  const paramsRef = useRef(initialParams);
  
  // Track active notes and their parameters
  const activeNotesRef = useRef<Map<string, SynthParams>>(new Map());

  // State for synth parameters and UI
  const [params, setParams] = useState<SynthParams>(initialParams);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize the audio processing chain
   */
  useEffect(() => {
    // Set master volume
    Tone.Destination.volume.value = -6;

    // Create PolySynth with custom voices
    const newSynth = new Tone.PolySynth(VoiceWithEffects).set({
      envelope: params.envelope,
      volume: -6
    });
    
    synthRef.current = newSynth;
    setIsInitialized(true);

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      setIsInitialized(false);
    };
  }, []);

  /**
   * Update parameters when initialParams changes
   */
  useEffect(() => {
    paramsRef.current = initialParams;
    setParams(initialParams);

    // Update all voices with new parameters
    if (synthRef.current && isInitialized) {
      const voices = (synthRef.current as any)._voices as VoiceWithEffects[];
      voices.forEach(voice => {
        voice.updateEffects(initialParams);
        voice.updateVolume(initialParams.volume.level);
      });
      
      // Update envelope for future notes
      synthRef.current.set({ envelope: initialParams.envelope });
    }
  }, [initialParams, isInitialized]);

  /**
   * Handle note start with current parameter snapshot
   */
  const handleNoteStart = useCallback((note: string) => {
    if (!synthRef.current || !isInitialized) return;

    // Store current parameters for this note
    activeNotesRef.current.set(note, { ...paramsRef.current });

    // Start the note
    Tone.start();
    synthRef.current.triggerAttack(note);

    // Get the active voice for this note
    const freq = Tone.Frequency(note).toFrequency();
    const voice = (synthRef.current as any)._voices.find((v: VoiceWithEffects) => 
      v.frequency && Math.abs(Number(v.frequency.value) - freq) < 0.1
    );

    // Update the voice's effects if found
    if (voice) {
      voice.updateEffects(paramsRef.current);
    }

    setPressedKeys(prev => new Set(Array.from(prev).concat([note])));
  }, [isInitialized]);

  /**
   * Handle note end
   */
  const handleNoteEnd = useCallback((note: string) => {
    if (!synthRef.current || !isInitialized) return;

    synthRef.current.triggerRelease(note);
    
    // Remove note from active notes after release
    setTimeout(() => {
      activeNotesRef.current.delete(note);
    }, 100); // Small delay to ensure release is processed

    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, [isInitialized]);

  /**
   * Update parameters with debouncing
   */
  const updateParams = useCallback((
    category: keyof SynthParams,
    parameter: string,
    value: number
  ) => {
    setParams(prev => {
      const newParams = {
        ...prev,
        [category]: {
          ...prev[category],
          [parameter]: value
        }
      };
      paramsRef.current = newParams;

      // Update envelope for future notes
      if (category === 'envelope' && synthRef.current) {
        synthRef.current.set({ envelope: newParams.envelope });
      }

      // Update volume for all voices
      if (category === 'volume' && synthRef.current) {
        const voices = (synthRef.current as any)._voices as VoiceWithEffects[];
        voices.forEach(voice => {
          voice.updateVolume(value);
        });
      }

      return newParams;
    });
  }, []);

  return (
    <SynthesizerContainer>
      <Keyboard
        pressedKeys={pressedKeys}
        onNoteStart={handleNoteStart}
        onNoteEnd={handleNoteEnd}
      />
      <Controls 
        params={params} 
        onParamChange={updateParams}
      />
    </SynthesizerContainer>
  );
};

export default Synthesizer; 