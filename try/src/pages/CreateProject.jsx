import React, { useState } from 'react';
import { FilePlus, X } from 'lucide-react';
import './CreateProject.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectStatus: 'In Progress',
    budget: '',
    equetyPercentage: '',
    revenueSharePercentage: '',
    deadline: '',
    location: '',
    category: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Cloud Infrastructure',
    'DevOps',
    'Other'
  ];

  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
    "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
    "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
    "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.equetyPercentage) newErrors.equetyPercentage = 'Equity percentage is required';
    if (!formData.revenueSharePercentage) newErrors.revenueSharePercentage = 'Revenue share percentage is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('projectStatus', formData.projectStatus);
      data.append('budget', formData.budget);
      data.append('equetyPercentage', formData.equetyPercentage);
      data.append('revenueSharePercentage', formData.revenueSharePercentage);
      data.append('deadline', formData.deadline);
      data.append('location', formData.location);
      data.append('category', formData.category);
      if (formData.image) {
        data.append('picture', formData.image);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`http://localhost:9000/proj/create/${token}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/projects');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: error.response?.data?.error || 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-project-container">
      <div className="create-project-header">
        <div className="header-content">
          <FilePlus size={24} />
          <h1>Create New Project</h1>
        </div>
      </div>

      {submitSuccess && <div className="success-message">Project created successfully! Redirecting...</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="create-project-form-container">
        <form onSubmit={handleSubmit} className="create-project-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Project Title <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category <span className="required">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget <span className="required">*</span></label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter project budget"
                className={errors.budget ? 'error' : ''}
              />
              {errors.budget && <div className="error-message">{errors.budget}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="equetyPercentage">Equity Percentage <span className="required">*</span></label>
              <input
                type="number"
                id="equetyPercentage"
                name="equetyPercentage"
                value={formData.equetyPercentage}
                onChange={handleChange}
                placeholder="Enter equity percentage"
                className={errors.equetyPercentage ? 'error' : ''}
              />
              {errors.equetyPercentage && <div className="error-message">{errors.equetyPercentage}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="revenueSharePercentage">Revenue Share Percentage <span className="required">*</span></label>
              <input
                type="number"
                id="revenueSharePercentage"
                name="revenueSharePercentage"
                value={formData.revenueSharePercentage}
                onChange={handleChange}
                placeholder="Enter revenue share percentage"
                className={errors.revenueSharePercentage ? 'error' : ''}
              />
              {errors.revenueSharePercentage && <div className="error-message">{errors.revenueSharePercentage}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Deadline <span className="required">*</span></label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={errors.deadline ? 'error' : ''}
              />
              {errors.deadline && <div className="error-message">{errors.deadline}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location <span className="required">*</span></label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
              >
                <option value="">Select location</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya} value={wilaya}>{wilaya}</option>
                ))}
              </select>
              {errors.location && <div className="error-message">{errors.location}</div>}
            </div>

            <div className="form-group full-width">
              <label>Project Description <span className="required">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                className={errors.description ? 'error' : ''}
                rows="4"
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            <div className="form-group full-width">
              <label>Project Image</label>
              <div
                className={`image-upload-container ${dragActive ? 'drag-active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {formData.image ? (
                  <div className="image-preview">
                    <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                    <button type="button" className="remove-image" onClick={removeImage}>
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image" className="upload-placeholder">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files[0])}
                      className="file-input"
                      style={{ display: 'none' }}
                    />
                    <span>Click to upload or drag and drop</span>
                    <span className="file-type">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
