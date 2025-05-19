import React, { useState } from 'react';
import './payment.css';
import FlipCard from '../components/Flipcard';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const [card, setCard] = useState({
    number: '',
    expirationDate: '',
    cvv: '',
    type: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCard(prev => ({
      ...prev,
      [id === 'expiry-date' ? 'expirationDate' : id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add a card');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:9000/auth/card/${token}`,
        {
          number: card.number,
          expirationDate: card.expirationDate,
          type: card.type
        },
        
      );

      if (res.status === 201) {
        alert('Card added successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Error adding card. Please try again.');
    }
  };

  return (
    <div className="payment">
      <div className="flipcard-section">
        <FlipCard />
      </div>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label htmlFor="number">Card Number</label>
        <input
          type="number"
          id="number"
          placeholder="1234 5678 9012 3456"
          onChange={handleChange}
          required
        />
        <label htmlFor="expiry-date">Expiry Date</label>
        <input
          type="date"
          id="expiry-date"
          onChange={handleChange}
          required
        />
        <label htmlFor="cvv">CVV</label>
        <input
          type="number"
          id="cvv"
          placeholder="123"
          onChange={handleChange}
          required
        />
        <label htmlFor="type">Card Type</label>
        <select id="type" onChange={handleChange} required>
          <option value="">Select Card Type</option>
          <option value="visa">Visa</option>
          <option value="mastercard">MasterCard</option>
          <option value="amex">American Express</option>
          <option value="discover">Discover</option>
          <option value="eddahabia">Eddahabia</option>
        </select>
        <button type="submit">Add Card</button>
        <Link to="/dashboard" className="cancel">Skip This Part</Link>
      </form>
    </div>
  );
};

export default Payment;
