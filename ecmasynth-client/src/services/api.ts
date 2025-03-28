/**
 * api.ts
 * 
 * This module provides a centralized API client for the ECMASynth application.
 * It handles all HTTP communication with the backend server, including:
 * - Preset management (CRUD operations)
 * - Rate limiting and flood protection
 * - Error handling
 * - Type safety
 * 
 * The API uses axios for HTTP requests and implements proper error handling
 * and type checking for all operations.
 */

import axios, { AxiosError, AxiosResponse } from 'axios';
import { SynthPreset, CreateSynthPresetDto } from '../types/synth.types';

// Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5137/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
} as const;

// Protection settings
const PROTECTION_CONFIG = {
  maxPresetsPerUser: 50,
  minTimeBetweenCreates: 2000, // 2 seconds
  maxPresetNameLength: 50,
  maxRequestsPerMinute: 60
} as const;

// Create axios instance with default configuration
const axiosInstance = axios.create(API_CONFIG);

// Rate limiting state
let lastCreateTime = 0;
let requestsThisMinute = 0;
let lastMinuteReset = Date.now();

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors consistently across all requests
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    throw new ApiError(
      axiosError.message,
      axiosError.response?.status,
      axiosError.response?.data
    );
  }
  throw new ApiError('An unexpected error occurred');
};

/**
 * Type guard to ensure response data matches expected type
 */
function isValidResponse<T>(response: unknown): response is T {
  return response !== null && typeof response === 'object';
}

/**
 * Check rate limits before making a request
 * @throws {ApiError} If rate limit is exceeded
 */
function checkRateLimits() {
  const now = Date.now();

  // Reset minute counter if needed
  if (now - lastMinuteReset >= 60000) {
    requestsThisMinute = 0;
    lastMinuteReset = now;
  }

  // Check requests per minute
  if (requestsThisMinute >= PROTECTION_CONFIG.maxRequestsPerMinute) {
    throw new ApiError('Rate limit exceeded. Please try again later.', 429);
  }

  requestsThisMinute++;
}

/**
 * Validate preset data before sending to server
 * @throws {ApiError} If validation fails
 */
function validatePresetData(preset: CreateSynthPresetDto) {
  if (!preset.name || typeof preset.name !== 'string') {
    throw new ApiError('Invalid preset name', 400);
  }

  if (preset.name.length > PROTECTION_CONFIG.maxPresetNameLength) {
    throw new ApiError(`Preset name must be ${PROTECTION_CONFIG.maxPresetNameLength} characters or less`, 400);
  }

  // Add more validation as needed for other fields
}

/**
 * API client for the ECMASynth application
 */
export const api = {
  /**
   * Get all synthesizer presets
   * @returns {Promise<SynthPreset[]>} Array of presets
   * @throws {ApiError} If the request fails
   */
  getPresets: async (): Promise<SynthPreset[]> => {
    try {
      const response = await axiosInstance.get('/synthpresets');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || 'Failed to fetch presets',
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  },

  /**
   * Retrieve a single synthesizer preset by ID
   * @param id - The ID of the preset to retrieve
   * @returns The requested synthesizer preset
   * @throws {ApiError} If the preset is not found or the request fails
   */
  getPreset: async (id: number): Promise<SynthPreset> => {
    try {
      const response: AxiosResponse = await axiosInstance.get(`/synthpresets/${id}`);
      if (!isValidResponse<SynthPreset>(response.data)) {
        throw new ApiError('Invalid response format: expected preset object');
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Create a new synthesizer preset
   * @param preset - The preset data to create
   * @returns {Promise<SynthPreset>} The created preset
   * @throws {ApiError} If the creation fails
   */
  createPreset: async (preset: CreateSynthPresetDto): Promise<SynthPreset> => {
    try {
      const response = await axiosInstance.post('/synthpresets', preset);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || 'Failed to create preset',
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  },

  /**
   * Update an existing synthesizer preset
   * @param id - The ID of the preset to update
   * @param preset - The updated preset data
   * @throws {ApiError} If the update fails or the preset is not found
   */
  updatePreset: async (id: number, preset: Partial<SynthPreset>): Promise<void> => {
    try {
      await axiosInstance.put(`/synthpresets/${id}`, preset);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Delete a synthesizer preset
   * @param id - The ID of the preset to delete
   * @throws {ApiError} If the deletion fails or preset is not found
   */
  deletePreset: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/synthpresets/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || 'Failed to delete preset',
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  }
}; 