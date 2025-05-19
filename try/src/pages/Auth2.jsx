import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './auth2.css';
import * as faceapi from 'face-api.js';

const Auth2 = () => {
  const { token } = useParams();

  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load face-api models once on mount
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          videoRef.current.style.display = 'block';
        }
      })
      .catch((err) => {
        console.error('Webcam error:', err);
      });
  };

  const captureFaceDescriptor = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const canvas = canvasRef.current;
    faceapi.matchDimensions(canvas, videoRef.current);
    const resizedDetections = faceapi.resizeResults(detections, {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    });

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (detections.length > 0) {
      setFaceDescriptor(detections[0].descriptor);
      setInstructions('Face detected! Submitting your data...');
    } else {
      setInstructions('No face detected. Please look directly at the camera.');
    }

    // Continue scanning every 100ms
    setTimeout(captureFaceDescriptor, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInstructions('Please look at the camera for face detection...');
    setMessage('');
    setFaceDescriptor(null);

    startWebcam();

    setTimeout(async () => {
      await captureFaceDescriptor();

      setTimeout(async () => {
        if (!faceDescriptor) {
          setMessage('Please capture your face before submitting.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        if (profilePic) formData.append('ProfilePicture', profilePic);
        formData.append('bio', bio);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('faceDescriptor', JSON.stringify(Array.from(faceDescriptor)));

        try {
          const response = await axios.post(
            `http://localhost:9000/auth/register/${token}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          setMessage('Profile completed successfully!');
        } catch (error) {
          setMessage(error.response?.data?.message || 'Error submitting profile');
          console.error('Error details:', error);
        } finally {
          setLoading(false);
        }
      }, 2000); // Wait for face descriptor
    }, 1000); // Initial wait for webcam to start
  };

  return (
    <div className="auth2-container">
      <div className="form-box">
        <h2 className="form-title">Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="form-group profile-pic-group">
            <label>Profile Picture</label>
            <label htmlFor="profilePic" className="profile-pic-label">
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)}
                  alt="Preview"
                  className="profile-preview"
                />
              ) : (
                <PlusCircle size={64} className="plus-icon" />
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              placeholder="Tell us about yourself..."
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <video ref={videoRef} width="100%" height="auto" style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

          <button type="submit" className="submit-btn" disabled={loading}>
            Submit
          </button>
        </form>

        {loading && (<div
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
      backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
      color: message.includes('Error') ? '#c62828' : '#2e7d32',
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

export default Auth2;
