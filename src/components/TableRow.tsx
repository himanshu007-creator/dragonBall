'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Character } from '@/types';

export interface TableRowProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}

// Helper function to format power values
const formatPower = (power: number): string => {
  if (power >= 1000000000) {
    return `${(power / 1000000000).toFixed(1)}B`;
  } else if (power >= 1000000) {
    return `${(power / 1000000).toFixed(1)}M`;
  } else if (power >= 1000) {
    return `${(power / 1000).toFixed(1)}K`;
  }
  
  return power.toLocaleString();
};

// Helper function to get location colors
const getLocationColor = (location: string): string => {
  const colors: Record<string, string> = {
    'Iwa': 'bg-gradient-to-r from-stone-400 to-stone-600 text-white',
    'Kumo': 'bg-gradient-to-r from-sky-400 to-sky-600 text-white',
    'Kiri': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
    'Suna': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    'Konoha': 'bg-gradient-to-r from-green-400 to-green-600 text-white',
  };
  return colors[location] || 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
};

// Helper function to get health colors
const getHealthColor = (health: string): string => {
  const colors: Record<string, string> = {
    'Healthy': 'bg-gradient-to-r from-green-400 to-green-600 text-white',
    'Injured': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    'Critical': 'bg-gradient-to-r from-red-400 to-red-600 text-white',
  };
  return colors[health] || 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
};

// Helper function to get location icons
const getLocationIcon = (location: string): string => {
  const icons: Record<string, string> = {
    'Iwa': '🏔️',
    'Kumo': '☁️',
    'Kiri': '🌊',
    'Suna': '🏜️',
    'Konoha': '🍃',
  };
  return icons[location] || '🏙️';
};

// Helper function to get health icons
const getHealthIcon = (health: string): string => {
  const icons: Record<string, string> = {
    'Healthy': '💚',
    'Injured': '💛',
    'Critical': '❤️',
  };
  return icons[health] || '❓';
};

export const TableRow: React.FC<TableRowProps> = React.memo(({
  character,
  isSelected,
  onSelect,
}) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }, [onSelect]);

  const rowVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.01,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.99 }
  };

  return (
    <>
      {/* Desktop View */}
      <motion.div
        className={`
          hidden md:flex items-center min-w-full border-b border-gray-200 transition-all duration-300 group cursor-pointer
          ${isSelected 
            ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300 shadow-lg' 
            : 'bg-white hover:bg-gradient-to-r hover:from-orange-25 hover:to-blue-25'
          }
        `}
        variants={rowVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="row"
        aria-selected={isSelected}
        aria-label={`Character row for ${character.name}, ${isSelected ? 'selected' : 'not selected'}`}
      >
        {/* Selection checkbox */}
        <div className="w-12 px-4 py-4 text-center flex-shrink-0" role="gridcell">
          <motion.input
            type="checkbox"
            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${character.name}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Character name */}
        <div className="flex-1 px-4 py-4 min-w-0" role="gridcell">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-bold text-sm">
                {character.name.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                {character.name}
              </p>
            </div>
          </div>
        </div>

        {/* Power level */}
        <div className="flex-1 px-4 py-4 text-center" role="gridcell">
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md inline-block"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.2 }}
          >
            ⚡ {formatPower(character.power)}
          </motion.div>
        </div>

        {/* Location */}
        <div className="flex-1 px-4 py-4 text-center" role="gridcell">
          <motion.span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md ${getLocationColor(character.location)}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {getLocationIcon(character.location)} {character.location}
          </motion.span>
        </div>

        {/* Health */}
        <div className="flex-1 px-4 py-4 text-center" role="gridcell">
          <motion.span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md ${getHealthColor(character.health)}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {getHealthIcon(character.health)} {character.health}
          </motion.span>
        </div>
      </motion.div>

      {/* Mobile View */}
      <motion.div
        className={`
          md:hidden border-b border-gray-200 transition-all duration-300 p-5 group cursor-pointer
          ${isSelected 
            ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300 shadow-lg' 
            : 'bg-white hover:bg-gradient-to-r hover:from-orange-25 hover:to-blue-25'
          }
        `}
        variants={rowVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="row"
        aria-selected={isSelected}
        aria-label={`Character ${character.name}, ${isSelected ? 'selected' : 'not selected'}`}
      >
        <div className="flex items-start space-x-4">
          {/* Selection checkbox */}
          <motion.input
            type="checkbox"
            className="mt-3 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer w-5 h-5"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${character.name}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          />

          {/* Character avatar */}
          <motion.div 
            className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white font-bold text-2xl">
              {character.name.charAt(0).toUpperCase()}
            </span>
          </motion.div>

          {/* Character details */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Name and Power Row */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors leading-tight">
                {character.name}
              </h3>
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                ⚡ {formatPower(character.power)}
              </motion.div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <motion.span 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${getLocationColor(character.location)}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {getLocationIcon(character.location)} {character.location}
              </motion.span>
              <motion.span 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${getHealthColor(character.health)}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {getHealthIcon(character.health)} {character.health}
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

TableRow.displayName = 'TableRow';