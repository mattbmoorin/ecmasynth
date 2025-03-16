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
        decay: { min: 0, max: 10, step: 0.1 },
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
} as const;

/**
 * Default synthesizer parameters
 * These values provide a balanced starting point for the synthesizer
 */
export const defaultSynthParams: Readonly<SynthParams> = {
    envelope: {
        attack: 0.1,   // 100ms attack
        decay: 0.2,    // 200ms decay
        sustain: 0.5,  // 50% sustain level
        release: 0.5   // 500ms release
    },
    reverb: {
        wet: 0.3,      // 30% wet mix
        decay: 1.5,    // 1.5s decay time
        preDelay: 0.01 // 10ms pre-delay
    },
    delay: {
        wet: 0.3,      // 30% wet mix
        delayTime: 0.25, // 250ms delay time
        feedback: 0.3    // 30% feedback
    },
    volume: {
        level: 0    // 0dB volume level
    }
} as const; 