/**
 * constants.ts
 * 
 * This module defines the constants used in the Synthesizer component,
 * including musical note definitions and their visual properties.
 */

/**
 * Represents a musical note and its visual properties on the keyboard
 */
export interface Note {
    /** The note name and octave (e.g., 'C4', 'F#4') */
    readonly note: string;
    /** Whether the note is a black key */
    readonly isBlack: boolean;
    /** Horizontal offset in pixels for black keys (measured from the left edge) */
    readonly offset?: number;
}

/**
 * Array of notes representing one octave on the piano keyboard (C4 to B4)
 * Each note includes:
 * - The note name with octave
 * - Whether it's a black key
 * - For black keys, the horizontal offset for proper positioning
 */
export const NOTES: readonly Note[] = [
    { note: 'C4', isBlack: false },
    { note: 'C#4', isBlack: true, offset: 318 },
    { note: 'D4', isBlack: false },
    { note: 'D#4', isBlack: true, offset: 418 },
    { note: 'E4', isBlack: false },
    { note: 'F4', isBlack: false },
    { note: 'F#4', isBlack: true, offset: 621 },
    { note: 'G4', isBlack: false },
    { note: 'G#4', isBlack: true, offset: 725 },
    { note: 'A4', isBlack: false },
    { note: 'A#4', isBlack: true, offset: 825 },
    { note: 'B4', isBlack: false },
] as const; 