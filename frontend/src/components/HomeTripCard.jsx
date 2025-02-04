import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomeTripCard = ({ trip }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    
    // Predefined trip details
    const predefinedTripDetails = {
      destination: trip.destination,
      startDate: new Date().toISOString().split('T')[0], // Today
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Week from today
      tripLength: "7",
      budget: "Dynamic",
      currency: "USD",
      tripGenres: trip.tripGenres,
      travelers: trip.travelers,
      additionalNotes: "None additional notes"
    };

    try {
      const response = await axios.post(
        'http://localhost:5001/api/openAiRoutes/planTrip',
        predefinedTripDetails
      );

      if (response.status === 200) { //Need to handle this
        navigate("/Recommendation", {
          state: { 
            tripRecommendation: response.data ,
            fromPlanTrip: true,
          }
        });
      }
      
    } catch (error) {
      console.error('Error planning trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-trip-card" onClick={handleClick}>
      <img src={trip.image} alt={trip.destination} />
      <div className="card-content">
        <h3>{trip.destination}</h3>
        <p>{trip.description}</p>
        {loading && <p className="loading-text">Planning your trip...</p>}
      </div>
    </div>
  );
};

export default HomeTripCard;
