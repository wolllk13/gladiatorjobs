import { useState } from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

export interface FilterOptions {
  minPrice: number | null;
  maxPrice: number | null;
  minExperience: number | null;
  hasPortfolio: boolean;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'experience';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  activeFiltersCount: number;
}

const AdvancedFilters = ({ filters, onFiltersChange, activeFiltersCount }: AdvancedFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      minPrice: null,
      maxPrice: null,
      minExperience: null,
      hasPortfolio: false,
      sortBy: 'newest',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="glass border-border/50 hover:border-primary/50 relative"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="glass border-border/50 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="gradient-text text-2xl">Advanced Filters</SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect professional
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value: any) =>
                setLocalFilters({ ...localFilters, sortBy: value })
              }
            >
              <SelectTrigger id="sortBy" className="glass border-border/50">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="glass border-border/50">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label>Hourly Rate ($)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                  Min
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={localFilters.minPrice ?? ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="glass border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                  Max
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  placeholder="500"
                  value={localFilters.maxPrice ?? ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="glass border-border/50"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Filter professionals by their hourly rate range
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <Label htmlFor="minExperience">
              Minimum Experience: {localFilters.minExperience ?? 0} years
            </Label>
            <Slider
              id="minExperience"
              min={0}
              max={20}
              step={1}
              value={[localFilters.minExperience ?? 0]}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  minExperience: value[0] === 0 ? null : value[0],
                })
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Show only professionals with at least this many years of experience
            </p>
          </div>

          {/* Has Portfolio */}
          <div className="flex items-center justify-between space-x-2 py-4 border-t border-border/50">
            <div className="space-y-0.5">
              <Label htmlFor="hasPortfolio" className="text-base">
                Has Portfolio
              </Label>
              <p className="text-xs text-muted-foreground">
                Show only professionals with portfolio items
              </p>
            </div>
            <Switch
              id="hasPortfolio"
              checked={localFilters.hasPortfolio}
              onCheckedChange={(checked) =>
                setLocalFilters({ ...localFilters, hasPortfolio: checked })
              }
            />
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="glass border-border/50 w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground w-full sm:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
