import React, { useState, useEffect } from 'react';

const HousingPricePredictor = () => {
  const [formData, setFormData] = useState({
    Suburb: '',
    Rooms: '',
    Type: '',
    Propertycount: '',
    Distance: '',
    Regionname: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setPropertyTypes(['h', 'u', 't']);
    setRegions(['Northern Metropolitan', 'Western Metropolitan', 'Southern Metropolitan', 'Eastern Metropolitan', 'South-Eastern Metropolitan', 'Eastern Victoria', 'Northern Victoria', 'Western Victoria']);
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Rooms: parseInt(formData.Rooms),
          Propertycount: parseInt(formData.Propertycount),
          Distance: parseFloat(formData.Distance),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data);
      setActiveStep(1);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Property Details",
      content: (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-x-16 gap-y-12">
            <div className="col-span-2">
              <input
                type="text"
                id="Suburb"
                name="Suburb"
                value={formData.Suburb}
                onChange={handleInputChange}
                required
                placeholder="Suburb"
                className="w-full border-b-2 border-gray-200 p-4 text-xl focus:border-black outline-none transition-colors bg-transparent"
              />
            </div>

            <div className="space-y-12">
              <div>
                <input
                  type="number"
                  id="Rooms"
                  name="Rooms"
                  value={formData.Rooms}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="Number of Rooms"
                  className="w-full border-b-2 border-gray-200 p-4 text-xl focus:border-black outline-none transition-colors bg-transparent"
                />
              </div>
              <div>
                <input
                  type="number"
                  id="Distance"
                  name="Distance"
                  value={formData.Distance}
                  onChange={handleInputChange}
                  required
                  step="0.1"
                  min="0"
                  placeholder="Distance from CBD (km)"
                  className="w-full border-b-2 border-gray-200 p-4 text-xl focus:border-black outline-none transition-colors bg-transparent"
                />
              </div>
              <div>
                <select
                  id="Type"
                  name="Type"
                  value={formData.Type}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b-2 border-gray-200 p-4 text-xl focus:border-black outline-none transition-colors bg-transparent"
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'h' ? 'House' : type === 'u' ? 'Unit' : 'Townhouse'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <input
                  type="number"
                  id="Propertycount"
                  name="Propertycount"
                  value={formData.Propertycount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="Properties in Area"
                  className="w-full border-b-2 border-gray-200 p-4 text-xl focus:border-black outline-none transition-colors bg-transparent"
                />
              </div>
              <div>
                <select
                  id="Regionname"
                  name="Regionname"
                  value={formData.Regionname}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b-2 border-gray-200 p-4 text-xl focus:border-black outline-none transition-colors bg-transparent"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-12 w-full bg-black text-white p-6 text-xl font-light hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : 'Calculate Property Value'}
          </button>
        </form>
      ),
    },
    {
      title: "Results",
      content: prediction && (
        <div className="space-y-12">
          <div className="grid grid-cols-2 gap-12">
            <div className="col-span-2 p-8 bg-gray-50">
              <div className="text-4xl font-light">
                {prediction.Linear_Regression_Price_Prediction}
              </div>
              <div className="mt-2 text-sm text-gray-500">Primary Estimate</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-light">
                {prediction.Random_Forest_Price_Prediction}
              </div>
              <div className="text-sm text-gray-500">Random Forest Prediction</div>
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-light">
                Cluster {prediction.K_Means_Cluster}
              </div>
              <div className="text-sm text-gray-500">Property Group</div>
            </div>

            <div className="col-span-2">
              <div className="text-xl font-light">
                Price Category: {prediction.KNN_Price_Category}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveStep(0)}
            className="w-full border-2 border-black p-4 text-xl hover:bg-black hover:text-white transition-colors"
          >
            New Prediction
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="space-y-24">
          <div>
            <h1 className="text-6xl font-light">Property Value Calculator</h1>
            <p className="mt-4 text-gray-500 text-xl">Melbourne Housing Market Analysis</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="transition-all duration-500">
            {steps[activeStep].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingPricePredictor;