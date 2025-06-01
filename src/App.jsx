import React, { useState } from 'react';
import { steps } from './steps';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    organization: '',
    email: ''
  });
  const [images, setImages] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Replace with your deployed Apps Script Web App URL
  const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEBAPP_URL';

  const handleUserInfoChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (stepId, file) => {
    setImages(prev => ({
      ...prev,
      [stepId]: file
    }));
  };

  // Helper to convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Convert images to base64
      const imagesBase64 = await Promise.all(
        steps.map(async (step) => {
          const file = images[step.id];
          if (!file) return null;
          const base64 = await fileToBase64(file);
          return {
            stepId: step.id,
            stepLabel: step.label,
            filename: file.name,
            type: file.type,
            base64
          };
        })
      );
      // Filter out steps with no image
      const filteredImages = imagesBase64.filter(Boolean);

      const payload = {
        name: userInfo.name,
        organization: userInfo.organization,
        email: userInfo.email,
        images: filteredImages
      };

      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      console.log('Full response from Apps Script:', result);
      if (result.status === 'success') {
        alert(`Submission successful!\n\nDebug Info:\nName: ${result.received?.name}\nOrganization: ${result.received?.organization}\nEmail: ${result.received?.email}\nImages: ${result.received?.imageCount}\nFirst Image: ${result.received?.firstImageInfo?.filename || 'none'}`);
        setUserInfo({ name: '', organization: '', email: '' });
        setImages({});
      } else {
        alert('Submission failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Submission failed: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Website Test Form</h1>
      <form onSubmit={handleSubmit}>
        {/* User Info Fields */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleUserInfoChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Organization</label>
          <input
            type="text"
            name="organization"
            value={userInfo.organization}
            onChange={handleUserInfoChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>

        {/* Steps */}
        {steps.map(step => (
          <div key={step.id} className="mb-6">
            <label className="block font-semibold mb-2">
              {step.id}. {step.label}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleImageChange(step.id, e.target.files[0])}
              className="mb-2"
            />
            {images[step.id] && (
              <div>
                <img
                  src={URL.createObjectURL(images[step.id])}
                  alt={`Step ${step.id}`}
                  className="w-48 border rounded"
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default App; 