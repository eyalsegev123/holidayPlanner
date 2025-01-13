import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "../styles/pages/PlanTrip.css";
import LoadingTrip from "../components/LoadingTrip";

// Form Input Options
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "NIS"];

const TRIP_GENRES = [
  "Sport activity", "Sport events", "Nightlife", "Restaurants", "Extreme",
  "Ski and winter sports", "Shopping", "Museums", "Culture", "Festivals",
  "Electric festivals", "Trance festivals", "Parties", "History", "Chill",
  "Markets", "Beaches", "Art", "Family roots", "Safair", "Trekking",
  "Climbing", "Yoga and Meditation", "Cruise", "Food tours", "Views",
  "Water parks", "Gambling and Casino", "Religious Trip", "Organized Trip",
  "Appointments and Conferences"
];

const TRAVELER_TYPES = [
  "Solo (man)", "Solo (woman)", "Couple", "Couples", "Family", "Families",
  "Friends (Women)", "Friends (Men)", "Friends (Men and Women)",
  "bachelorette party(Women)", "bachelorette party(Men)", "Retires", "Colleagues"
];

// Form Input Components
const FormInput = ({ label, id, isTextarea, ...props }) => (
  <div className="form-group">
    <label htmlFor={id}>
      {isTextarea ? (
        <textarea className="input textarea-input" id={id} {...props} />
      ) : (
        <input className="input" id={id} {...props} />
      )}
      <span>{label}</span>
    </label>
  </div>
);

const DestinationInput = ({ value, onChange }) => (
  <FormInput
    label="Destination"
    id="destination"
    type="text"
    placeholder="Enter your destination"
    value={value}
    onChange={(e) => onChange('destination', e.target.value)}
    required
  />
);

const DateInput = ({ id, label, value, onChange }) => (
  <FormInput
    label={label}
    id={id}
    type="date"
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    required
  />
);

const NumberInput = ({ id, label, placeholder, value, onChange }) => (
  <FormInput
    label={label}
    id={id}
    type="number"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    required
  />
);

const CurrencySelect = ({ value, onChange }) => (
  <div className="form-group">
    <label htmlFor="currency">
      <select
        className="input"
        id="currency"
        value={value}
        onChange={(e) => onChange('currency', e.target.value)}
        required
      >
        {CURRENCY_OPTIONS.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      <span>Currency</span>
    </label>
  </div>
);

const GenreDropdown = ({ genres, showDropdown, onToggle, onChange }) => (
  <div className="form-group">
    <label htmlFor="tripGenres">
      <div className="custom-dropdown">
        <span className="dropdown-label">Trip Genres</span>
        <button
          type="button"
          className="input dropdown-button"
          onClick={onToggle}
        >
          {genres.length === 0 ? "Select genres" : genres.join(", ")}
        </button>
        {showDropdown && (
          <div className="custom-dropdown-menu">
            {TRIP_GENRES.map((genre) => (
              <label key={genre} className="custom-dropdown-item">
                <input
                  type="checkbox"
                  checked={genres.includes(genre)}
                  onChange={() => onChange(genre)}
                />
                <span className="checkbox-label">{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </label>
  </div>
);

const TravelersDropdown = ({ value, showDropdown, onToggle, onChange }) => (
  <div className="form-group">
    <label htmlFor="travelers">
      <div className="custom-dropdown">
        <span className="dropdown-label">Travelers</span>
        <button
          type="button"
          className="input dropdown-button"
          onClick={onToggle}
        >
          {value || "Select travelers"}
        </button>
        {showDropdown && (
          <div className="custom-dropdown-menu">
            {TRAVELER_TYPES.map((traveler) => (
              <label key={traveler} className="custom-dropdown-item">
                <input
                  type="radio"
                  name="travelers"
                  checked={value === traveler}
                  onChange={() => onChange('travelers', traveler)}
                />
                <span className="radio-label">{traveler}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </label>
  </div>
);

const NotesTextarea = ({ value, onChange }) => (
  <FormInput
    label="Additional Notes"
    id="additionalNotes"
    isTextarea
    placeholder="Ages, preferred hotel locations, or any other important details..."
    value={value}
    onChange={(e) => onChange('additionalNotes', e.target.value)}
    rows="4"
    required
  />
);

const PlanTrip = () => {
  // Form Data States
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    tripLength: "",
    budget: "",
    currency: "USD",
    tripGenres: [],
    travelers: "",
    additionalNotes: ""
  });

  // UI States
  const [uiState, setUiState] = useState({
    loading: false,
    errorMessage: "",
    showGenreDropdown: false,
    showTravelersDropdown: false
  });

  const navigate = useNavigate();

  // Update form data helper
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update UI state helper
  const updateUiState = (field, value) => {
    setUiState(prev => ({ ...prev, [field]: value }));
  };

  // Toggle dropdowns
  const handleGenreDropdownToggle = () => {
    updateUiState('showGenreDropdown', !uiState.showGenreDropdown);
  };

  // Handle genre selection
  const handleGenreChange = (genre) => {
    const newGenres = formData.tripGenres.includes(genre)
      ? formData.tripGenres.filter(item => item !== genre)
      : [...formData.tripGenres, genre];
    updateFormData('tripGenres', newGenres);
  };

  // Form validation
  const validateForm = () => {
    const startDateParts = formData.startDate.split('/');
    const formattedStartDate = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`);
    const endDateParts = formData.endDate.split('/');
    const formattedEndDate = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (formData.tripGenres.length === 0) {
      return "Please select at least one genre for your trip.";
    }
    if (!formData.travelers) {
      return "Please select the type of travelers you are going to be.";
    }
    if (formattedEndDate < formattedStartDate) {
      return "The end-date must be later than the start-date.";
    }
    if (formattedStartDate < currentDate) {
      return "Start date must be in the future.";
    }
    if (formData.budget <= 0) {
      return "I believe you will need money for your trip.";
    }
    if (formData.tripLength <= 0) {
      return "Trip length must be positive";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUiState('loading', true);
    updateUiState('errorMessage', "");

    const validationError = validateForm();
    if (validationError) {
      updateUiState('errorMessage', validationError);
      updateUiState('loading', false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/openAiRoutes/planTrip`,
        formData
      );

      if (response.status === 200) {
        navigate("/Recommendation", {
          state: {
            tripRecommendation: response.data,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            tripGenres: formData.tripGenres.join(", "),
            tripLength: formData.tripLength,
            budget: formData.budget,
            fromPlanTrip: true,
          },
        });
      }
    } catch (err) {
      updateUiState('errorMessage', "An error occurred while submitting the trip details.");
    } finally {
      updateUiState('loading', false);
    }
  };

  return (
    <StyledWrapper>
      {uiState.loading ? (
        <LoadingTrip />
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Plan Your Trip</p>
          <p className="message">Use our tools to plan the perfect vacation for you!</p>
          
          <DestinationInput 
            value={formData.destination} 
            onChange={updateFormData} 
          />
          
          <DateInput 
            id="startDate"
            label="Start Date (Can be dynamic)"
            value={formData.startDate}
            onChange={updateFormData}
          />
          
          <DateInput 
            id="endDate"
            label="End Date (Can be dynamic)"
            value={formData.endDate}
            onChange={updateFormData}
          />
          
          <NumberInput 
            id="tripLength"
            label="Length of Trip (in days)"
            placeholder="Enter the length of your trip in days"
            value={formData.tripLength}
            onChange={updateFormData}
          />
          
          <NumberInput 
            id="budget"
            label="Budget (per person)"
            placeholder="Excluding flights !!!"
            value={formData.budget}
            onChange={updateFormData}
          />
          
          <CurrencySelect 
            value={formData.currency} 
            onChange={updateFormData} 
          />
          
          <GenreDropdown 
            genres={formData.tripGenres}
            showDropdown={uiState.showGenreDropdown}
            onToggle={handleGenreDropdownToggle}
            onChange={handleGenreChange}
          />
          
          <TravelersDropdown 
            value={formData.travelers}
            showDropdown={uiState.showTravelersDropdown}
            onToggle={() => updateUiState('showTravelersDropdown', !uiState.showTravelersDropdown)}
            onChange={updateFormData}
          />
          
          <NotesTextarea 
            value={formData.additionalNotes} 
            onChange={updateFormData} 
          />

          <button className="submit" type="submit">
            Plan Trip
          </button>
          {uiState.errorMessage && <p className="error">{uiState.errorMessage}</p>}
        </form>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full viewport height */
  background-color: transparent; /* Optional: background color for the page */

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 600px; /* Increased maximum width */
    width: 100%; /* Ensure the form takes full width up to the max-width */
    padding: 20px;
    border-radius: 20px;
    position: relative;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
  }

  .message {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .form-group {
    position: relative;
  }

  .form-group .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 5px 5px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form-group .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form-group .input:focus + span,
  .form-group .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    background-color: #00bfff;
    transition: background-color 0.3s ease;
  }

  .submit:hover {
    background-color: #00bfff96;
  }
  .form-group .input.notes-textarea {
  width: 100%; // Use a fixed width for testing
  max-width: 8000px;
}

  .custom-dropdown {
    position: relative;
    width: 100%;
  }

  .dropdown-button {
    width: 100%;
    text-align: left;
    background-color: #333;
    border: 1px solid rgba(105, 105, 105, 0.397);
    color: #fff;
    cursor: pointer;
    height: auto;
    padding: 10px 5px 5px 10px;
    min-height: 50px;
    white-space: normal;
    word-wrap: break-word;
  }

  .custom-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #333;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    margin-top: 5px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }

  .custom-dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #fff;

    &:hover {
      background-color: #444;
    }

    input[type="checkbox"],
    input[type="radio"] {
      margin-right: 8px;
    }

    .checkbox-label,
    .radio-label {
      flex: 1;
    }
  }

  /* Scrollbar styling for the dropdown menu */
  .custom-dropdown-menu::-webkit-scrollbar {
    width: 8px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-thumb {
    background: #00bfff;
    border-radius: 4px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: #00bfff96;
  }

  .dropdown-label {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.5);
  }

  .textarea-input {
    resize: none;
    min-height: 120px;
    padding-top: 25px !important;
    line-height: 1.5;
    font-family: inherit;
  }

  .textarea-input::placeholder {
    opacity: 0.7;
    font-size: 0.9em;
  }
`;

export default PlanTrip;
