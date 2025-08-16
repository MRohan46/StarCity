// components/CoinCard.jsx
import React from 'react';

const CoinCard = ({ img, bonusTag, coins, oldCoins, bonus, price, onClick }) => {
  return (
    <div className="card">
      <div className="bonus-tag">{bonusTag}</div>
      <img src={img} className="card-img" alt="coin pack" />
      <div className="details">
        <div className="coins">
          {coins} <br />
          <small>{oldCoins}</small>
        </div>
        <div className="bonus">{bonus}</div>
        <div className="price">
            <button onClick={onClick} style={{ all: 'unset', cursor: 'pointer' }}>{price}</button>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
