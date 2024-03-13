import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiImages, setApiImages] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleFetchImages = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await axios.post('http://127.0.0.1:8000/upload-image', formData, {
        responseType: 'arraybuffer', // specify response type as arraybuffer
      });

      // Create a Blob from the binary data
      const blob = new Blob([response.data], { type: 'image/jpeg' }); // adjust type accordingly

      // Create a data URL from the Blob
      const imageUrl = URL.createObjectURL(blob);

      // Assuming the response includes other image details
      const imageDetails = {
        id: apiImages.length + 1,
        url: imageUrl,
        alt: 'Image Alt Text',
        description: 'Image Description',
      };

      setApiImages([...apiImages, imageDetails]);
    } catch (error) {
      console.error('Error fetching images:', error);
      console.error('Error Details:', error.response);
    }
  };

  return (
    <div className='bg-container'>
      <h1 className='head'>Product and Defect Detection Using AI</h1>
      <div className="app">
        <h1>Product and Defect Detection Using AI</h1>
        <div className='container'>
          <input type="file" className='input' onChange={handleImageUpload} />
          <button onClick={handleFetchImages}>Upload</button>
        </div>
        <div className='cont'>
          <div>
            <h2>Images from Backend</h2>
            <div className="api-images">
              {apiImages.map((image) => (
                <div key={image.id}>
                  <img src={image.url} alt={image.alt} />
                  <p>{image.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
