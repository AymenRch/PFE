import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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
  }, []);

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
      setInstructions('Face detected! Verifying your identity...');
      return detections[0].descriptor;
    } else {
      setInstructions('No face detected. Please look directly at the camera.');
      return null;
    }
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/proj/one/${id}`);

      console.log('Project response:', response.data); // Debug log

      if (response.status === 200) {
        // Check if response.data is an array and get the first item
        const projectData = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('Project data:', projectData); // Debug log
        setProject(projectData);
        
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:9000/proj/owner/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (userResponse.status === 200) {
          console.log('User response:', userResponse.data); // Debug log
          setUser(userResponse.data);
        }
      } else {
        throw new Error('Failed to fetch project');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error.response?.data?.error || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleMakeOffer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to make an offer');
      return;
    }

    setIsVerifying(true);
    setMessage('');
    setInstructions('Please look at the camera for face verification...');

    await startWebcam();

    // Wait for video and models to settle before capturing
    setTimeout(async () => {
      const capturedDescriptor = await captureFaceDescriptor();

      // Small delay to show feedback
      setTimeout(async () => {
        if (!capturedDescriptor) {
          setMessage('Please capture your face before proceeding.');
          setIsVerifying(false);
          stopWebcam();
          return;
        }

        try {
          // Fetch stored face descriptor for logged user
          const identityResponse = await axios.get(`http://localhost:9000/auth/identity/${token}`);
          const identityData = identityResponse.data[0];
          const descriptorArray = JSON.parse(identityData.faceDescriptor);
          const storedDescriptor = new Float32Array(descriptorArray);

          // Compute euclidean distance to verify face
          const distance = faceapi.euclideanDistance(capturedDescriptor, storedDescriptor);
          const threshold = 0.6; // Typical threshold for face recognition

          if (distance > threshold) {
            setMessage('Face verification failed. You are not authorized to make this offer.');
            setIsVerifying(false);
            stopWebcam();
            return;
          }

          // If face verification passes, proceed with making the offer
          const cardRes = await axios.get(`http://localhost:9000/auth/checkCard/${token}`);
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
            setMessage('Offer made successfully!');
            navigate('/dashboard');
          } else {
            setMessage('Failed to make offer');
          }

        } catch (error) {
          if (error.response?.status === 404) {
            setMessage('Please add a card to make an offer');
            navigate('/payment');
          } else {
            console.error('Error making offer:', error);
            setMessage('Failed to make offer.');
          }
        } finally {
          setIsVerifying(false);
          stopWebcam();
          setInstructions('');
        }
      }, 2000);
    }, 1000);
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchProject();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-details-flex-container">
      <div className="project-details-image-col">
        <img 
          src={project.picture ? `http://localhost:9000${project.picture}` : 'https://via.placeholder.com/600x400'} 
          alt={project.title} 
          className="project-details-image-large" 
        />
      </div>
      <div className="project-details-info-col">
        {user && (
          <Link to={token ? `/user/${user.id}` : `/owner/${user.id}`} className="project-details-user-profile">
            <img 
              src={user.ProfilePicture ? `http://localhost:9000/${user.ProfilePicture}` : 'https://via.placeholder.com/50x50'} 
              alt={user.name} 
              className="project-details-user-avatar" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/50x50';
              }}
            />
            <div>
              <div className="project-details-user-name">{user.name}</div>
              <div className="project-details-user-username">{user.email}</div>
            </div>
          </Link>
        )}
        
        <h1 className="project-details-title">{project.title}</h1>
        <div className="project-details-meta">
          <span>{project.location}</span> | 
          <span>${project.fundingGoal}</span> | 
          <span>{project.equetyPercentage}% equity</span>
        </div>
        <p className="project-details-description">{project.description}</p>
        <div className="project-details-extra">
          <span><strong>Type:</strong> {project.type}</span>
          <span><strong>Status:</strong> {project.projectStatus}</span>
          <span>
           <strong>Duration:</strong>{' '}
           to {project.duration ? new Date(project.duration).toLocaleDateString() : ''} 
          </span>
          <span><strong>Revenue Share:</strong> {project.revenueSharePercentage}%</span>
        </div>
        <button 
          className="make-offer-btn" 
          onClick={handleMakeOffer}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Accept The Terms'}
        </button>
        <Link className='counter' to={`/conter/${id}`}>Make a Counter Offer</Link>

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

        {isVerifying && (
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

export default ProjectDetails; 