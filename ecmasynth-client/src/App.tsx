/**
 * App.tsx
 * 
 * The root component of the ECMASynth application.
 * This component orchestrates the main layout and state management
 * for the synthesizer and preset management system.
 * 
 * Features:
 * - Global state management for synthesizer parameters
 * - React Query integration for API calls
 * - Responsive layout with styled components
 * - Theme-consistent styling
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Synthesizer from './components/Synthesizer/Synthesizer';
import PresetManager from './components/PresetManager/PresetManager';
import { SynthParams, defaultSynthParams } from './types/synth.types';

// Theme constants for consistent styling
const THEME = {
  colors: {
    background: '#1a1a1a',
    primary: '#4CAF50',
    text: {
      primary: '#ffffff',
      secondary: '#888888'
    }
  },
  spacing: {
    small: '10px',
    medium: '20px',
    large: '40px'
  },
  maxWidth: '1200px'
} as const;

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 10000
    }
  }
});

// Styled components with theme-based values
const AppContainer = styled.div`
  min-height: 100vh;
  background: ${THEME.colors.background};
  color: ${THEME.colors.text.primary};
  padding: ${THEME.spacing.medium};
`;

const ContentWrapper = styled.div`
  max-width: ${THEME.maxWidth};
  margin: 0 auto;
`;

/**
 * Main application component
 * Manages the global state and layout of the application
 */
function App() {
  // State for the current synthesizer parameters
  const [currentParams, setCurrentParams] = useState<SynthParams>(defaultSynthParams);

  /**
   * Callback to update synthesizer parameters
   * Memoized to prevent unnecessary re-renders
   */
  const handleParamsChange = useCallback((params: SynthParams) => {
    setCurrentParams(params);
  }, []);

  /**
   * Callback to load a preset
   * Memoized to prevent unnecessary re-renders
   */
  const handleLoadPreset = useCallback((params: SynthParams) => {
    setCurrentParams(params);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContainer>
        <ContentWrapper>
          <Synthesizer
            initialParams={currentParams}
            onParamsChange={handleParamsChange}
          />
          
          <PresetManager
            currentParams={currentParams}
            onLoadPreset={handleLoadPreset}
          />
        </ContentWrapper>
      </AppContainer>
    </QueryClientProvider>
  );
}

export default App;
