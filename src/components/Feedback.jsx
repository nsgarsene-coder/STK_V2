// src/components/Feedback.jsx
import { useEffect, useState } from 'react';
import './Feedback.css';

const Feedback = ({ startPos, endPos, onComplete }) => {
  //  On commence directement à "true" pour éviter l'erreur
  const [visible, setVisible] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!startPos || !endPos || !visible) return null;

  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div 
      className="stk-match-line"
      style={{
        width: `${distance}px`,
        left: `${startPos.x}px`,
        top: `${startPos.y}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div className="line-glow"></div>
    </div>
  );
};

export default Feedback;
