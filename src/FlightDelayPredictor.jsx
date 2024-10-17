import React, { useState, useEffect } from 'react';

const FlightDelayPredictor = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    carrier: '',
    origin: '',
    destination: '',
    num_flights: '',
    weather_delays: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    setCarriers(['YV', 'YX', 'ZW', '9E', 'AA', 'AS', 'B6', 'DL', 'F9', 'G4', 'HA', 'NK', 'OH', 'OO', 'UA', 'WN']);
    setAirports(['ATL', 'AUS', 'BNA', 'BOS', 'BWI', 'CLT', 'DCA', 'DEN', 'DFW', 'DTW', 'EWR', 'FLL', 'IAD', 'IAH', 'JFK', 'LAS', 'LAX', 'LGA', 'MCO', 'MDW', 'MIA', 'MSP', 'ORD', 'PHL', 'PHX', 'SAN', 'SEA', 'SFO', 'SLC', 'TPA']);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-16 bg-white p-12 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 font-sans">
            Houosing Market Predictor
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600 font-serif">
            Uncover potential delays with our predictive analysis
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="carrier" className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
              <select
                id="carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select an airline</option>
                {carriers.map((carrier) => (
                  <option key={carrier} value={carrier}>{carrier}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin Airport</label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select origin airport</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination Airport</label>
              <select
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select destination airport</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="num_flights" className="block text-sm font-medium text-gray-700 mb-1">Number of Flights</label>
              <input
                type="number"
                id="num_flights"
                name="num_flights"
                value={formData.num_flights}
                onChange={handleInputChange}
                required
                min="1"
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter number of flights"
              />
            </div>
            <div>
              <label htmlFor="weather_delays" className="block text-sm font-medium text-gray-700 mb-1">Weather-related Delays</label>
              <input
                type="number"
                id="weather_delays"
                name="weather_delays"
                value={formData.weather_delays}
                onChange={handleInputChange}
                required
                min="0"
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter weather delays"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-red-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Analyzing...' : 'Predict Delay'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Encountered
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {prediction && (
          <div className="rounded-md bg-green-50 p-6 mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  Prediction Results
                </h3>
                <div className="mt-4 text-sm text-green-700 space-y-2">
                  <p><span className="font-semibold">Regression Prediction:</span> <span className="text-lg font-bold">{prediction.regression_prediction.toFixed(2)} minutes</span></p>
                  <p className="text-xs italic">This estimate is based on various factors including weather conditions, carrier, and flight history.</p>

                  <p><span className="font-semibold">Classification Prediction:</span> <span className="text-lg font-bold">{prediction.classification_prediction}</span></p>
                  <p className="text-xs italic">This categorizes the delay into predefined groups (e.g., No Delay, Short Delay, Long Delay).</p>

                  <p><span className="font-semibold">Gradient Boosting Prediction:</span> <span className="text-lg font-bold">{prediction.gradient_boosting_prediction.toFixed(2)} minutes</span></p>
                  <p className="text-xs italic">An alternative delay estimate using a different model for comparison.</p>

                  <p><span className="font-semibold">Cluster:</span> <span className="text-lg font-bold">{prediction.cluster}</span></p>
                  <p className="text-xs italic">Your flight belongs to this cluster of similar flights, helping identify delay patterns.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDelayPredictor;