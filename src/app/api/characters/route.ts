import { NextRequest, NextResponse } from 'next/server';
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

function filterCharacters(characters: Character[], params: URLSearchParams): Character[] {
  let filtered = [...characters];

  // Apply name filter
  const name = params.get('name');
  if (name) {
    const nameFilter = name.toLowerCase();
    filtered = filtered.filter(char => 
      char.name.toLowerCase().includes(nameFilter)
    );
  }

  // Apply location filter
  const location = params.get('location');
  if (location) {
    const locations = location.split(',').map(l => l.trim());
    filtered = filtered.filter(char => 
      locations.includes(char.location)
    );
  }

  // Apply health filter
  const health = params.get('health');
  if (health) {
    const healthStates = health.split(',').map(h => h.trim());
    filtered = filtered.filter(char => 
      healthStates.includes(char.health)
    );
  }

  // Apply power filter (less than or equal to)
  const power = params.get('power');
  if (power) {
    const powerValue = parseInt(power);
    if (!isNaN(powerValue)) {
      filtered = filtered.filter(char => char.power <= powerValue);
    }
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Load and filter characters
    const allCharacters = await loadCharacters();
    const filteredCharacters = filterCharacters(allCharacters, searchParams);
    
    // Calculate pagination
    const totalItems = filteredCharacters.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredCharacters.slice(startIndex, endIndex);

    console.log('🔧 API /api/characters:', {
      page,
      limit,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      itemsReturned: items.length,
      filters: Object.fromEntries(searchParams.entries())
    });

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200));

    const response = {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
      links: {
        first: `/api/characters?page=1&limit=${limit}`,
        previous: page > 1 ? `/api/characters?page=${page - 1}&limit=${limit}` : '',
        next: page < totalPages ? `/api/characters?page=${page + 1}&limit=${limit}` : '',
        last: `/api/characters?page=${totalPages}&limit=${limit}`,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}