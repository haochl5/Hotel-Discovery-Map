import { useState, useEffect } from 'react';
import ClusteredHotelMap from './components/HotelDiscoveryMap.tsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="text-center text-white">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Seattle Hotels</h2>
          <p className="text-lg opacity-90">Preparing your hotel discovery experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ClusteredHotelMap />
    </div>
  );
}

export default App;