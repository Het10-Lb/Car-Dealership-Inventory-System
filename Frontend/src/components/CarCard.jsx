import { Heart, Disc, Settings2, Star } from 'lucide-react';

export default function CarCard({ car, onPurchase }) {
  const isSoldOut = car.quantity === 0;

  return (
    <div 
      data-testid="car-card"
      className={`bg-surface-container border border-outline-variant rounded-xl overflow-hidden flex flex-col transition-all duration-300 group ${isSoldOut ? 'opacity-80 filter grayscale-[0.3]' : 'card-glow'}`}
    >
      <div className="relative h-48 bg-surface-container-low overflow-hidden">
        {isSoldOut && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-on-surface text-[10px] font-bold uppercase rounded-full border border-outline-variant">
              Sold Out
            </span>
          </div>
        )}
        
        {/* {!isSoldOut && (
          <button className="absolute top-4 right-4 z-10 text-on-surface-variant hover:text-primary transition-colors">
            <Heart size={20} />
          </button>
        )} */}

        <img 
          className={`w-full h-full object-cover ${!isSoldOut ? 'transform group-hover:scale-105 transition-transform duration-500' : ''}`}
          src={car.imageUrl || "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"} 
          alt={`${car.year} ${car.make} ${car.model}`}
        />
      </div>

      <div className="p-5 flex-grow space-y-4">
        <div>
          <h3 className="font-headline-md text-[18px] text-on-surface">{car.year} {car.make} {car.model}</h3>
          
          <div className="flex items-center gap-4 mt-2 text-on-surface-variant opacity-70">
            <div className="flex items-center gap-1">
              <Disc size={16} />
              <span className="font-label-sm text-label-sm">{car.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings2 size={16} />
              <span className="font-label-sm text-label-sm">Automatic</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className={`flex items-center gap-1 ${isSoldOut ? 'text-on-surface-variant' : 'text-primary'}`}>
            <Star size={16} className={!isSoldOut ? "fill-primary" : "fill-on-surface-variant"} />
            <span className="font-label-md text-label-md font-bold text-on-surface">4.8</span>
          </div>
          <span className={`font-headline-md text-[18px] ${isSoldOut ? 'text-on-surface-variant' : 'text-primary'}`}>
            ₹{car.price?.toLocaleString()}
          </span>
        </div>

        <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
          {isSoldOut ? (
            <span className="font-label-sm text-label-sm text-error">Out of Stock</span>
          ) : (
            <span className="font-label-sm text-label-sm text-on-surface-variant">Qty: {car.quantity} available</span>
          )}
          
          <button 
            disabled={isSoldOut}
            onClick={() => onPurchase(car._id)}
            className={`px-6 py-2 font-label-md text-label-md font-bold rounded-lg transition-all ${
              isSoldOut 
                ? 'bg-outline-variant text-on-surface-variant/50 cursor-not-allowed' 
                : 'bg-primary-container text-white hover:opacity-90 active:scale-95'
            }`}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

