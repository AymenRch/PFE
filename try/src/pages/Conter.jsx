import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { useParams , useNavigate } from 'react-router-dom'

const Conter = () => {

const { id } = useParams()
const navigate = useNavigate()
 const token = localStorage.getItem('token');

const [offer,setOffer] = useState({

})

useEffect(()=>{
    if(!token) {
      alert('Please login to make a conter offer');
      navigate('/auth');
    }
})

const handleChange = (e) => {
  const { id, value } = e.target;
  setOffer(prev => ({
    ...prev,
    [id]: value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
   try {
    const cardRes = await axios.get(`http://localhost:9000/auth/checkCard/${token}`);

    // Si la carte existe, on tente de faire une offre
    const offerRes = await axios.post(
      `http://localhost:9000/request/make/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (offerRes.status === 201) {
      alert('Offer made successfully');
      navigate('/dashboard');
    } else {
      alert('Failed to make offer');
    }

  } catch (error) {
    // Axios place la réponse dans error.response
    if (error.response?.status === 404) {
      alert('Please add a card to make an offer');
      navigate('/payment');
    } else {
      console.error('Error making offer:', error);
      alert('Failed to make offer.');
    }
  }
}


  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="offer">Offer</label>
            <input type="text" id="offer" value={offer.offer} onChange={handleChange} />
            </div>
            <button type="submit">Send Offer</button>
        </form>
    </div>
  )
}

export default Conter