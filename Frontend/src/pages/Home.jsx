  import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import CarCard from '../components/CarCard';
import { getVehiclesAPI, searchVehiclesAPI, purchaseVehicle } from '../services/api';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto no-scrollbar bg-surface-container-high border border-outline-variant rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-body-md hover:bg-primary/10 transition-colors ${value === opt ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter states
  const [filterMake, setFilterMake] = useState('All Makes');
  const [filterModel, setFilterModel] = useState('All Models');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [sortOption, setSortOption] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = q ? await searchVehiclesAPI({ q }) : await getVehiclesAPI();
        setVehicles(response.data);
      } catch (err) {
        setError('Failed to load vehicles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [q]);

  const handlePurchase = async (carId) => {
    try {
      await purchaseVehicle(carId);
      setVehicles(prev => prev.map(car => 
        car._id === carId ? { ...car, quantity: Math.max(0, car.quantity - 1) } : car
      ));
      setToast('Vehicle purchased successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Extract dynamic filter options
  const makes = ['All Makes', ...new Set(vehicles.map(v => v.make).filter(Boolean))];
  const models = ['All Models', ...new Set(vehicles.filter(v => filterMake === 'All Makes' || v.make === filterMake).map(v => v.model).filter(Boolean))];
  const categories = ['All Categories', ...new Set(vehicles.map(v => v.category).filter(Boolean))];

  // Apply filters
  const filteredVehicles = vehicles.filter(car => {
    if (filterMake !== 'All Makes' && car.make !== filterMake) return false;
    if (filterModel !== 'All Models' && car.model !== filterModel) return false;
    if (filterCategory !== 'All Categories' && car.category !== filterCategory) return false;
    if (minPrice && car.price < Number(minPrice)) return false;
    if (maxPrice && car.price > Number(maxPrice)) return false;
    return true;
  });

  // Apply sorting
  if (sortOption === 'price-asc') {
    filteredVehicles.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredVehicles.sort((a, b) => b.price - a.price);
  }

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-2 bg-surface-container-high border border-primary text-primary px-4 py-3 rounded-lg shadow-xl animate-bounce">
          <CheckCircle2 size={20} />
          <span className="font-label-md">{toast}</span>
        </div>
      )}
      {/* Filter & Search Section */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Cars Inventory</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-label-md text-label-md transition-colors ${showFilters ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
            >
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={`flex items-center justify-between gap-3 pl-4 pr-3 py-2 min-w-[160px] border rounded-lg font-label-md text-label-md transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${showSortMenu ? 'bg-surface-container-high border-primary text-on-surface' : 'border-outline-variant text-on-surface bg-transparent hover:bg-surface-container-high'}`}
              >
                <span>
                  {sortOption === 'price-asc' ? 'Price: Low to High' :
                   sortOption === 'price-desc' ? 'Price: High to Low' : 'Sort by'}
                </span>
                <ChevronDown size={16} className={`transition-transform text-on-surface ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>

              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSortMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant rounded-xl shadow-lg z-50 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => { setSortOption(''); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 font-label-md text-label-md hover:bg-primary/10 transition-colors ${sortOption === '' ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
                    >
                      Default (None)
                    </button>
                    <button 
                      onClick={() => { setSortOption('price-asc'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 font-label-md text-label-md hover:bg-primary/10 transition-colors border-t border-outline-variant/30 ${sortOption === 'price-asc' ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
                    >
                      Price: Low to High
                    </button>
                    <button 
                      onClick={() => { setSortOption('price-desc'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 font-label-md text-label-md hover:bg-primary/10 transition-colors border-t border-outline-variant/30 ${sortOption === 'price-desc' ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Make</label>
              <CustomSelect 
                value={filterMake}
                onChange={(val) => { setFilterMake(val); setFilterModel('All Models'); }}
                options={makes}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Model</label>
              <CustomSelect 
                value={filterModel}
                onChange={(val) => setFilterModel(val)}
                options={models}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Category</label>
              <CustomSelect 
                value={filterCategory}
                onChange={(val) => setFilterCategory(val)}
                options={categories}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Price Range</label>
              <div className="flex items-center gap-2">
                <input 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-body-md text-on-surface focus:outline-none focus:border-primary" 
                  placeholder="Min" 
                  type="number" 
                />
                <span className="text-outline">-</span>
                <input 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-body-md text-on-surface focus:outline-none focus:border-primary" 
                  placeholder="Max" 
                  type="number" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-container"></div>
        </div>
      ) : error ? (
        <div className="text-error text-center p-8 bg-surface-container rounded-xl border border-outline-variant">
          {error}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-on-surface-variant text-center p-8 bg-surface-container rounded-xl border border-outline-variant">
          No vehicles match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(car => (
            <CarCard key={car._id} car={car} onPurchase={handlePurchase} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
