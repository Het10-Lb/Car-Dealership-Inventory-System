import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CarCard from '../components/CarCard';
import { getVehiclesAPI, purchaseVehicle } from '../services/api';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Home() {
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

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getVehiclesAPI();
        setVehicles(response.data);
      } catch (err) {
        setError('Failed to load vehicles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

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
        <div className="flex justify-between items-end">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Cars Inventory</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
            <span>Sort by</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Make</label>
            <select 
              value={filterMake}
              onChange={(e) => { setFilterMake(e.target.value); setFilterModel('All Models'); }}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none appearance-none"
            >
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Model</label>
            <select 
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none appearance-none"
            >
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Category</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none appearance-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Price Range</label>
            <div className="flex items-center gap-2">
              <input 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-label-md text-on-surface focus:outline-none focus:border-primary" 
                placeholder="Min" 
                type="number" 
              />
              <span className="text-outline">-</span>
              <input 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-label-md text-on-surface focus:outline-none focus:border-primary" 
                placeholder="Max" 
                type="number" 
              />
            </div>
          </div>
        </div>
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
