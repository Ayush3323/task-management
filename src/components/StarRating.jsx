import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import './StarRating.css';

const StarRating = ({ count = 5, rating = 0, onRatingChange, isReadOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (isReadOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (isReadOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (isReadOnly || !onRatingChange) return;
    onRatingChange(index);
  };

  return (
    <div className={`star-rating ${isReadOnly ? 'read-only' : ''}`} onMouseLeave={handleMouseLeave}>
      {[...Array(count)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FiStar
            key={ratingValue}
            className={`star ${ratingValue <= (hoverRating || rating) ? 'filled' : ''}`}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onClick={() => handleClick(ratingValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

