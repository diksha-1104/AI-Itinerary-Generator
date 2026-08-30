import React, { useState, useEffect } from 'react';

const Spinner = ({ destination }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    `Analyzing travel options for ${destination}...`,
    'Optimizing the schedule for your selected budget tier...',
    'Finding top-rated local food places and hidden gems...',
    'Structuring day-by-day morning, afternoon, and evening activities...',
    'Calculating accurate cost estimates and budget breakdowns...',
    'Writing customized local safety and travel tips...',
    'Finalizing your personalized dream itinerary...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <h3 className="spinner-message">Generating Your Itinerary</h3>
      <p className="spinner-submessage">{messages[messageIndex]}</p>
    </div>
  );
};

export default Spinner;
