import { NextResponse } from 'next/server';
import { Character } from '@/types';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Cache for the loaded characters data
let charactersCache: Character[] | null = null;

async function loadCharacters(): Promise<Character[]> {
  if (charactersCache) {
    return charactersCache;
  }

  try {
    const dataUrl = process.env.CHARACTERS_DATA_URL;
    
    if (dataUrl) {
      // Production: fetch from hosted URL
      console.log('🌐 Fetching characters from URL:', dataUrl);
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch from URL: ${response.statusText}`);
      }
      const data = await response.json();
      charactersCache = data;
    } else {
      // Development: read from local file system
      console.log('📁 Reading characters from local file system');
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'public', 'animeCharacters.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      charactersCache = JSON.parse(fileContent);
    }
    
    console.log('✅ Characters loaded successfully:', charactersCache?.length, 'items');
    return charactersCache!;
  } catch (error) {
    console.error('Error loading characters:', error);
    throw new Error('Failed to load characters data');
  }
}

export async function GET() {
  try {
    const characters = await loadCharacters();

    // Extract unique values for filters
    const locations = Array.from(
      new Set(characters.map((char) => char.location))
    ).sort();
    const healthStates = Array.from(
      new Set(characters.map((char) => char.health))
    ).sort();
    const maxPower = Math.max(...characters.map((char) => char.power));

    const response = {
      locations,
      healthStates,
      maxPower,
    };

    console.log('🔧 API /api/characters/filter-options:', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
