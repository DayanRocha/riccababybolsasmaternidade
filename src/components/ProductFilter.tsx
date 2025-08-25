import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
}

interface FilterState {
  search: string;
  selectedCategories: string[];
}

const ProductFilter = ({ onFilterChange, categories }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCategories: []
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', selectedCategories: [] });
  };

  const hasActiveFilters = filters.search || filters.selectedCategories.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 border-gray-200 focus:border-rose-gold-500 focus:ring-rose-gold-500"
          />
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border-gray-200 hover:border-rose-gold-500 hover:text-rose-gold-600"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {filters.selectedCategories.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filters.selectedCategories.length}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <X className="w-4 h-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.selectedCategories.includes(category.id)
                    ? 'bg-rose-gold-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            
            {filters.search && (
              <Badge variant="outline" className="flex items-center gap-1">
                Busca: "{filters.search}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {filters.selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <Badge key={categoryId} variant="outline" className="flex items-center gap-1">
                  {category.name}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;