/**
 * synth.types.ts
 * 
 * This module defines the core type definitions for the ECMASynth application.
 * It includes interfaces for:
 * - Synthesizer parameters (envelope, reverb, delay)
 * - Preset management
 * - Default parameter values
 * 
 * All numeric values are normalized between 0 and 1 unless otherwise specified.
 */

/**
 * Represents a saved synthesizer preset in the database
 */

export interface VolumeParams {
    /** Volume level */
    level: number;
}

export interface SynthPreset {
    /** Unique identifier for the preset */
    readonly id: number;
    /** User-defined name for the preset */
    name: string;
    /** Serialized envelope parameters */
    envelope: string;
    /** Serialized reverb parameters */
    reverb: string;
    /** Serialized delay parameters */
    delay: string;
    /** Serialized volume parameters */
    volume: string;
    /** Serialized oscillator parameters */
    oscillator: string;
    /** Serialized filter parameters */
    filter: string;
    /** Serialized gain and limiter parameters */
    gainLimiter: string;
    /** ISO timestamp of creation */
    readonly createdAt: string;
    /** ISO timestamp of last update */
    readonly updatedAt: string;
    /** Hashed deletion password */
    readonly deletionHash: string;
}

/**
 * Data transfer object for creating a new preset
 * Omits auto-generated fields from SynthPreset
 */
export type CreateSynthPresetDto = Omit<SynthPreset, 'id' | 'createdAt' | 'updatedAt' | 'deletionHash'> & {
    /** Password for preset deletion */
    deletionPassword: string;
};

/**
 * Data transfer object for deleting a preset
 */
export interface DeletePresetDto {
    /** ID of the preset to delete */
    id: number;
    /** Password required for deletion */
    password: string;
}

/**
 * ADSR envelope parameters for amplitude shaping
 */
export interface EnvelopeParams {
    /** Time in seconds for the sound to reach full volume (0-2) */
    attack: number;
    /** Time in seconds for the sound to reach sustain level (0-2) */
    decay: number;
    /** Level at which the sound is held (0-1) */
    sustain: number;
    /** Time in seconds for the sound to fade to silence (0-2) */
    release: number;
}

/**
 * Reverb effect parameters
 */
export interface ReverbParams {
    /** Mix between dry and wet signal (0-1) */
    wet: number;
    /** Length of the reverb tail in seconds (0-10) */
    decay: number;
    /** Delay before reverb starts in seconds (0-0.1) */
    preDelay: number;
}

/**
 * Delay effect parameters
 */
export interface DelayParams {
    /** Mix between dry and wet signal (0-1) */
    wet: number;
    /** Time between delay repeats in seconds (0-1) */
    delayTime: number;
    /** Amount of signal fed back into delay (0-0.9) */
    feedback: number;
}

/**
 * Oscillator parameters
 */
export interface OscillatorParams {
    /** Number of oscillator voices (1-8) */
    count: number;
    /** Detune spread between voices in cents (0-100) */
    spread: number;
}

/**
 * Filter parameters
 */
export interface FilterParams {
    /** Filter cutoff frequency in Hz (20-20000) */
    frequency: number;
    /** Filter rolloff in dB/oct (-12, -24, -48, -96) */
    rolloff: number;
}

/**
 * Gain and limiter parameters
 */
export interface GainLimiterParams {
    /** Gain level (0-1) */
    gain: number;
    /** Limiter threshold in dB (-60-0) */
    threshold: number;
}

/**
 * Complete set of synthesizer parameters
 */
export interface SynthParams {
    /** Envelope generator parameters */
    envelope: EnvelopeParams;
    /** Reverb effect parameters */
    reverb: ReverbParams;
    /** Delay effect parameters */
    delay: DelayParams;
    /** Volume parameters */
    volume: VolumeParams;
    /** Oscillator parameters */
    oscillator: OscillatorParams;
    /** Filter parameters */
    filter: FilterParams;
    /** Gain and limiter parameters */
    gainLimiter: GainLimiterParams;
}

/**
 * Parameter ranges for validation and UI controls
 */
export const PARAM_RANGES = {
    envelope: {
        attack: { min: 0, max: 2, step: 0.01 },
        decay: { min: 0, max: 2, step: 0.01 },
        sustain: { min: 0, max: 1, step: 0.01 },
        release: { min: 0, max: 2, step: 0.01 }
    },
    reverb: {
        wet: { min: 0, max: 1, step: 0.01 },
        decay: { min: 0.01, max: 10, step: 0.1 },
        preDelay: { min: 0, max: 0.1, step: 0.001 }
    },
    delay: {
        wet: { min: 0, max: 1, step: 0.01 },
        delayTime: { min: 0, max: 1, step: 0.01 },
        feedback: { min: 0, max: 0.9, step: 0.01 }
    },
    volume: {
        level: { min: -60, max: 0, step: 0.01 }
    },
    oscillator: {
        count: { min: 1, max: 8, step: 1 },
        spread: { min: 0, max: 100, step: 1 }
    },
    filter: {
        frequency: { min: 20, max: 20000, step: 1 },
        rolloff: { min: -96, max: -12, step: 12 }
    },
    gainLimiter: {
        gain: { min: 0, max: 1, step: 0.01 },
        threshold: { min: -60, max: 0, step: 1 }
    }
} as const;

/**
 * Default synthesizer parameters
 */
export const defaultSynthParams: Readonly<SynthParams> = {
    envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5
    },
    reverb: {
        wet: 0.3,
        decay: 1.5,
        preDelay: 0.01
    },
    delay: {
        wet: 0.3,
        delayTime: 0.25,
        feedback: 0.3
    },
    volume: {
        level: 0
    },
    oscillator: {
        count: 2,
        spread: 15
    },
    filter: {
        frequency: 2000,
        rolloff: -24
    },
    gainLimiter: {
        gain: 0.5,
        threshold: -12
    }
} as const; 