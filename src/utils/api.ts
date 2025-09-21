import { Character, APIParams, APIResponse } from '@/types';
import { APIError } from './errorHandling';

export const queryKeys = {
  characters: (params: APIParams) => ['characters', params] as const,
  filterOptions: () => ['filter-options'] as const,
} as const;

export async function fetchCharacters(
  params: APIParams
): Promise<APIResponse<Character>> {
  try {
    // Build query string
    const searchParams = new URLSearchParams();
    searchParams.set('page', params.page.toString());
    searchParams.set('limit', params.limit.toString());
    
    if (params.name) {
      searchParams.set('name', params.name);
    }
    if (params.location) {
      searchParams.set('location', params.location);
    }
    if (params.health) {
      searchParams.set('health', params.health);
    }
    if (params.power !== undefined) {
      searchParams.set('power', params.power.toString());
    }

    const url = `/api/characters?${searchParams.toString()}`;
    console.log('🔄 Fetching characters from API:', url);
    
    const response = await fetch(url);
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new APIError(
        `Failed to fetch characters: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    
    const data = await response.json();
    console.log('✅ Characters fetched successfully:', data.meta);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (error instanceof APIError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(
        'Network error: Please check your internet connection'
      );
    }

    throw new APIError(
      'An unexpected error occurred while fetching characters'
    );
  }
}

export async function fetchFilterOptions() {
  try {
    console.log('🔄 Fetching filter options from API');
    const response = await fetch('/api/characters/filter-options');
    console.log('📡 Filter options response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new APIError(
        `Failed to fetch filter options: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    
    const data = await response.json();
    console.log('✅ Filter options fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Filter options API Error:', error);
    
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      'An unexpected error occurred while fetching filter options'
    );
  }
}