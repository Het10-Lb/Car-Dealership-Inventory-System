import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CarCard from '../components/CarCard';
import { getVehiclesAPI } from '../services/api';
import { ChevronDown } from 'lucide-react';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <DashboardLayout>
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
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none appearance-none">
              <option>All Makes</option>
              <option>Audi</option>
              <option>BMW</option>
              <option>Lamborghini</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Model</label>
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none appearance-none">
              <option>All Models</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Category</label>
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none appearance-none">
              <option>All Categories</option>
              <option>Sport</option>
              <option>Luxury</option>
              <option>SUV</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Price Range</label>
            <div className="flex items-center gap-2">
              <input className="w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-label-md text-on-surface focus:outline-none focus:border-primary" placeholder="Min" type="text" />
              <span className="text-outline">-</span>
              <input className="w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-label-md text-on-surface focus:outline-none focus:border-primary" placeholder="Max" type="text" />
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
      ) : vehicles.length === 0 ? (
        <div className="text-on-surface-variant text-center p-8 bg-surface-container rounded-xl border border-outline-variant">
          No vehicles available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
