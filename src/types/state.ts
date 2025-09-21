export interface FilterState {
  location: string[];
  health: string[];
  name: string;
  power: number;
}

export interface SortState {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}

export interface SelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export interface APIParams {
  page: number;
  limit: number;
  location?: string;
  health?: string;
  name?: string;
  power?: number;
}

export interface APIResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}
