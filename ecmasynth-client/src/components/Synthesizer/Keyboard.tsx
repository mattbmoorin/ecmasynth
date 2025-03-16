/**
 * Keyboard.tsx
 * 
 * This component renders an interactive piano keyboard interface for the synthesizer.
 * It handles both mouse and touch interactions, rendering white and black keys
 * in their correct positions based on a standard piano layout.
 * 
 * Features:
 * - Visual feedback for pressed keys
 * - Proper key positioning and sizing
 * - Mouse and touch event handling
 * - Efficient re-rendering using React.memo
 */

import React, { useCallback, useMemo } from 'react';
import { NOTES, Note } from './constants';
import { KeyboardContainer, WhiteKey, BlackKey } from './styles';

interface KeyboardProps {
  /** Set of currently pressed note names */
  pressedKeys: Set<string>;
  /** Callback when a note starts playing */
  onNoteStart: (note: string) => void;
  /** Callback when a note stops playing */
  onNoteEnd: (note: string) => void;
}

interface KeyProps {
  note: string;
  isPressed: boolean;
  offset?: number;
  onNoteStart: (note: string) => void;
  onNoteEnd: (note: string) => void;
}

/**
 * Individual white key component
 * Memoized to prevent unnecessary re-renders
 */
const WhiteKeyComponent: React.FC<KeyProps> = ({
  note,
  isPressed,
  onNoteStart,
  onNoteEnd
}) => {
  const handleMouseDown = useCallback(() => onNoteStart(note), [note, onNoteStart]);
  const handleMouseUp = useCallback(() => onNoteEnd(note), [note, onNoteEnd]);
  const handleMouseLeave = useCallback(() => onNoteEnd(note), [note, onNoteEnd]);

  return (
    <WhiteKey
      isPressed={isPressed}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    />
  );
};

/**
 * Individual black key component
 * Memoized to prevent unnecessary re-renders
 */
const BlackKeyComponent: React.FC<KeyProps> = ({
  note,
  isPressed,
  offset = 0,
  onNoteStart,
  onNoteEnd
}) => {
  const handleMouseDown = useCallback(() => onNoteStart(note), [note, onNoteStart]);
  const handleMouseUp = useCallback(() => onNoteEnd(note), [note, onNoteEnd]);
  const handleMouseLeave = useCallback(() => onNoteEnd(note), [note, onNoteEnd]);

  return (
    <BlackKey
      style={{ left: `${offset}px` }}
      isPressed={isPressed}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    />
  );
};

// Memoize the key components
const MemoizedWhiteKey = React.memo(WhiteKeyComponent);
const MemoizedBlackKey = React.memo(BlackKeyComponent);

/**
 * Main Keyboard component that renders the piano interface
 * 
 * @param pressedKeys - Set of currently pressed note names
 * @param onNoteStart - Callback when a note starts playing
 * @param onNoteEnd - Callback when a note stops playing
 */
const Keyboard: React.FC<KeyboardProps> = ({
  pressedKeys,
  onNoteStart,
  onNoteEnd
}) => {
  // Memoize the key groups to prevent unnecessary calculations
  const { whiteKeys, blackKeys } = useMemo(() => {
    // Define the accumulator type explicitly
    interface KeyAccumulator {
      whiteKeys: Note[];
      blackKeys: Note[];
    }

    return Array.from(NOTES).reduce<KeyAccumulator>(
      (acc, note) => {
        if (note.isBlack) {
          acc.blackKeys.push(note);
        } else {
          acc.whiteKeys.push(note);
        }
        return acc;
      },
      { whiteKeys: [], blackKeys: [] }
    );
  }, []);

  return (
    <KeyboardContainer>
      {/* Render white keys first as the base layer */}
      {whiteKeys.map((note) => (
        <MemoizedWhiteKey
          key={note.note}
          note={note.note}
          isPressed={pressedKeys.has(note.note)}
          onNoteStart={onNoteStart}
          onNoteEnd={onNoteEnd}
        />
      ))}
      
      {/* Render black keys on top */}
      {blackKeys.map((note) => (
        <MemoizedBlackKey
          key={note.note}
          note={note.note}
          isPressed={pressedKeys.has(note.note)}
          offset={note.offset}
          onNoteStart={onNoteStart}
          onNoteEnd={onNoteEnd}
        />
      ))}
    </KeyboardContainer>
  );
};

// Memoize the entire keyboard component
export default React.memo(Keyboard); 