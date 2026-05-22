import { forwardRef } from 'react';
import './Card.css';

/**
 * CARD — forwardRef pour mesure DOM (ligne de connexion)
 */
const Card = forwardRef(({ data, state, onClick }, ref) => {
  const { nom, image, type } = data;
  const isNature = type === 'nature';

  return (
    <div
      ref={ref}
      className={`stk-card ${isNature ? 'is-nature' : 'is-application'} state-${state}`}
      onClick={() => state !== 'matched' && onClick()}
    >
      <div className="stk-card-header">
        <span className="stk-logo">STK</span>
      </div>

      <div className="stk-card-image-container">
        <img src={image} alt={nom} className="stk-card-image" />
        <div className="stk-card-overlay" />
      </div>

      <div className="stk-card-footer">
        <h3 className="stk-card-title">{nom}</h3>
        <div className="stk-card-badge">
          {isNature ? 'NATURE' : 'APPLICATION HUMAINE'}
        </div>
        <div className="stk-card-corner" />
      </div>

      {state === 'matched' && <div className="stk-card-matched-overlay" />}
    </div>
  );
});

Card.displayName = 'Card';
export default Card;