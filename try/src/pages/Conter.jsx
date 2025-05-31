import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import './counter.css';

const Conter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Form states
  const [amount, setAmount] = useState('');
  const [model, setModel] = useState('select');
  const [equity, setEquity] = useState('');
  const [revenue, setRevenue] = useState('');
  const [duration, setDuration] = useState('');

  // UI states
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState('');

  // Refs for video and canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load face-api models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
      } catch (error) {
        console.error('Error loading face-api models:', error);
        setMessage('Failed to load face detection models. Please try again later.');
      }
    };

    loadModels();

    if (!token) {
      navigate('/auth');
    }

    // Cleanup on unmount: stop webcam if active
    return () => {
      stopWebcam();
    };
  }, [navigate, token]);

  // Start webcam stream
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current && videoRef.current instanceof HTMLVideoElement) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        videoRef.current.style.display = 'block';
      }
    } catch (err) {
      console.error('Webcam error:', err);
      setMessage('Unable to access webcam. Please allow camera permissions.');
    }
  };

  // Stop webcam stream
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current instanceof HTMLVideoElement) {
      const stream = videoRef.current.srcObject;
      if (stream && stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
      videoRef.current.style.display = 'none';
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Capture face descriptor from webcam stream
  const captureFaceDescriptor = async () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const detections = await faceapi
      .detectAllFaces(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const canvas = canvasRef.current;
    faceapi.matchDimensions(canvas, {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    });

    const resizedDetections = faceapi.resizeResults(detections, {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    });

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (detections.length > 0) {
      setInstructions('Face detected! Submitting your data...');
      return detections[0].descriptor;
    } else {
      setInstructions('No face detected. Please look directly at the camera.');
      return null;
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setInstructions('Please look at the camera for face detection...');

    await startWebcam();

    // Wait for video and models to settle before capturing
    setTimeout(async () => {
      const capturedDescriptor = await captureFaceDescriptor();

      // Small delay to show feedback
      setTimeout(async () => {
        if (!capturedDescriptor) {
          setMessage('Please capture your face before submitting.');
          setLoading(false);
          stopWebcam();
          return;
        }

        try {
          // Fetch stored face descriptor for logged user
          const identityResponse = await axios.get(`http://localhost:9000/auth/identity/${token}`);
          const identityData = identityResponse.data[0];
          console.log('identity.data:', identityResponse.data);
          console.log('Type of identity.data:', typeof identityResponse.data);
          console.log(amount)

          const descriptorArray = JSON.parse(identityData.faceDescriptor); // stored descriptor as JSON string
          const storedDescriptor = new Float32Array(descriptorArray);

          // Compute euclidean distance to verify face
          const distance = faceapi.euclideanDistance(capturedDescriptor, storedDescriptor);
          const threshold = 0.6; // Typical threshold for face recognition

          if (distance > threshold) {
            setMessage('Face verification failed. You are not authorized to submit this offer.');
            setLoading(false);
            stopWebcam();
            return;
          }

          // Prepare form data
          const formData = new FormData();
          formData.append('amount', amount);
          formData.append('model', model);
          formData.append('equity', equity);
          formData.append('revenue', revenue);
          formData.append('duration', duration);

          const data =[
            {
              amount,
              model,
              equity,
              revenue,
              duration,
            },
          ]

          // Post offer
          console.log('Posting data:', data);
          const response = await axios.post(
            `http://localhost:9000/request/counter/${id}`,
            {
              amount,
              model,
              equity,
              revenue,
              duration
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 201) {
            setMessage('Offer sent successfully!');
          } else {
            setMessage('Failed to send the offer.');
          }
        } catch (error) {
          setMessage(error.response?.data?.message || 'Error submitting offer');
          console.error('Error details:', error);
        } finally {
          setLoading(false);
          stopWebcam();
          setInstructions('');
        }
      }, 2000);
    }, 1000);
  };

  return (
    <div className="auth2-container">
      <div className="form-box" style={{ margin: '30px 0' }}>
        <h2 className="form-title">Make A Counter Offer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Investment Amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Investment Model</label>
            <select
              style={{ marginBottom: '15px', width: '100%' }}
              name="model"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            >
              <option value="select" disabled>
                Select Business Model
              </option>
              <option value="equity">partnership</option>
              <option value="Revenue Sharing">Revenue Sharing</option>
            </select>
          </div>

          { model === 'equity' && (<div className="form-group">
            <label>Equity Percentage</label>
            <input
              type="number"
              name="equity"
              placeholder="Equity Percentage..."
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
            />
          </div>)}

         { model === 'Revenue Sharing' && ( <div className="form-group">
            <label>Revenue Sharing Percentage</label>
            <input
              type="number"
              name="revenue"
              placeholder="Revenue Sharing Percentage..."
              value={revenue}
              style={{color: 'black'}}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>)}

          <div className="form-group">
            <label>Duration</label>
            <input
              type="date"
              name="duration"
              placeholder="Duration of Investment..."
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <video
            ref={videoRef}
            width="100%"
            height="auto"
            style={{ display: 'none' }}
            muted
          />
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {loading && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px 20px',
              backgroundColor: '#e3f2fd',
              color: '#0d47a1',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {instructions}
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px 20px',
              backgroundColor: message.includes('Error') || message.includes('failed') ? '#ffebee' : '#e8f5e9',
              color: message.includes('Error') || message.includes('failed') ? '#c62828' : '#2e7d32',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conter;
