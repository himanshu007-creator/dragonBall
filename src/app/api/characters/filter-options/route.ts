import { NextResponse } from 'next/server';
import { Character } from '@/types';

// Cache for the loaded characters data
let charactersCache: Character[] | null = null;

async function loadCharacters(): Promise<Character[]> {
  if (charactersCache) {
    return charactersCache;
  }

  try {
    // In production, this would read from a database
    // For now, we'll read from the public JSON file
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'public', 'animeCharacters.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    charactersCache = JSON.parse(fileContent);
    
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
    const locations = Array.from(new Set(characters.map(char => char.location))).sort();
    const healthStates = Array.from(new Set(characters.map(char => char.health))).sort();
    const maxPower = Math.max(...characters.map(char => char.power));

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