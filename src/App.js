// MyCarousel.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { MdOutlineCloudUpload,MdPause, MdPlayArrow } from "react-icons/md";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import back from './nvision (1).png';
import back1 from './product.png';
import back2 from './defect iden.png';
import back3 from './defects cat.png';
import back4 from './pricing.png';
import adv1 from "./images/features-1.png";
import adv2 from "./images/features-2.png";
import adv4 from "./images/features-6.png";
import adv3 from "./images/feature-8.png";
import icon1 from "./images/step1.gif";
import icon2 from "./images/step2.gif";
import icon3 from "./images/step3.gif";
import log1 from "./images/sample1.jpg";
import log2 from "./images/sample2.jpg";
import log3 from "./images/sample3.jpg";
import log4 from "./images/sample4.jpg";
import log5 from "./images/sample4.jpg";
import log6 from "./images/sample6.jpg";
import gif1 from "./images/gif1.gif"
import gif2 from "./images/gif2.gif"
import gif3 from "./images/gif3.gif"
import gif4 from "./images/gif4.gif"
import gif5 from "./images/gif5.gif"

const MAX_FILE_SIZE_MB = 200;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const sampleImages = [
  {
    url: log1,
    type: 'image/jpeg',
    size: 100000,
    alt: 'image1',
  },
  {
    url: log2,
    type: 'image/png',
    size: 150000,
    alt: 'image2',
  },
  {
    url: log3,
    type: 'image/jpeg',
    size: 180000,
    alt: 'image3',
  },
  {
    url: log4,
    type: 'image/jpeg',
    size: 120000,
    alt: 'image4',
  }, {
    url: log5,
    type: 'image/jpeg',
    size: 180000,
    alt: 'image3',
  },
  {
    url: log6,
    type: 'image/jpeg',
    size: 120000,
    alt: 'image4',
  },{
    url: log5,
    type: 'image/jpeg',
    size: 180000,
    alt: 'image3',
  },
  {
    url: log6,
    type: 'image/jpeg',
    size: 120000,
    alt: 'image4',
  },
];

const MyCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    { imageUrl: back, caption: 'Introducing Nvision AI' },
    { imageUrl: back1, caption: '' },
    { imageUrl: back2, caption: '' },
    { imageUrl: back3, caption: '' },
    { imageUrl: back4, caption: '' }
  ];

  return (
    <div className="carousel-outer">
    <Slider {...settings}>
      {slides.map((slide, index) => (
        <div key={index} className="carousel-slide">
          <div className="carousel-image-container">
            <img src={slide.imageUrl} alt={`Slide ${index + 1}`} />
          </div>
          <div className="carousel-caption">
            <p>{slide.caption}</p>
          </div>
        </div>
      ))}
    </Slider>
  </div>
  );
};

function App() {
  const videoUrl = 'https://nvisionai-video.s3.amazonaws.com/final+video+poc-1.mp4'
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const handlePauseResume = () => {
    const videoElement = document.getElementById('main-video');

    if (videoElement) {
      if (videoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }

      setVideoPlaying(!videoPlaying);
    }
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiImage, setApiImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("product");
  const [isDragging, setIsDragging] = useState(false);
  const [typingAnimation, setTypingAnimation] = useState(false);
  const [activeButton, setActiveButton] = useState("product");
  const [uploadStatus, setUploadStatus] = useState('Upload an image');


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
      setSelectedImage(file);
      setApiImage(null);
    } else {
      alert('Please choose a valid image file (jpg, jpeg, or png) under 200MB.');
    }
  };

  const validateFile = (file) => {
    if (!file) {
      return false;
    }
    const isFileTypeValid = ALLOWED_FILE_TYPES.includes(file.type);
    const isFileSizeValid = file.size / (1024 * 1024) <= MAX_FILE_SIZE_MB;

    return isFileTypeValid && isFileSizeValid;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (validateFile(file)) {
      setSelectedImage(file);
    } else {
      alert('Please choose a valid image file (jpg, jpeg, or png) under 200MB.');
    }
  };



  const baseUrl = "https://gtjjto77a3swmj2c5zvpxv2moq0uhdtu.lambda-url.ap-south-1.on.aws";

  const handleFetchImage = async () => {
    try {
      if (!selectedImage) {
        setError('Please select an image.');
        return;
      }

      setLoading(true);
      setError(null);
      setUploadStatus('Uploading an image...');
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await axios.post(`${baseUrl}/upload-image`, formData);

      if (response.data.message === 'Upload relevant car image') {
        setApiImage(null);
        setUploadStatus('Please upload a relevant car image.');
        alert('Please upload a relevant car image.');
      } else {

        const { classification_result, detection_plot_url, labels_with_confidence } = response.data;

        const uploadedImageDetails = {
          id: 1,
          url: URL.createObjectURL(selectedImage),
          alt: 'Uploaded Image',
          description: 'Image uploaded successfully',
        };

        const outputImageDetails = {
          id: 2,
          url: `${baseUrl}${detection_plot_url}?timestamp=${new Date().getTime()}`,
          alt: 'AI Result',
          description: classification_result,
          labelsWithConfidence: labels_with_confidence,
        };

        setApiImage([uploadedImageDetails, outputImageDetails]);
        setUploadStatus('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      console.error('Error Details:', error.response);
      setError('Error uploading image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setApiImage(null);
    setError(null);
    setUploadStatus('Upload an image');
  };




  useEffect(() => {
    if (apiImage && apiImage.length > 1) {
      setTypingAnimation(true);

      setTimeout(() => {
        document.getElementById('result-container').scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 1000);
    }

    return () => {
      document.body.classList.remove('typing-animation-active');
    };
  }, [apiImage]);



  return (
      
    <div className="App">
      <div className='carou'>
      <MyCarousel /></div>
      <p className='description'>A Tool for <span className='description1'>Automatic Identification of Products and Defects using Computer Vision </span> to enhance process efficiency and productivity.</p>
      
      <div className="video-container">
        <video
          id="main-video"
          src={videoUrl}
          type="video/mp4"
          className='videos'
          
          controls={false} 
          onClick={handlePauseResume} 
        />
        <div className="video-controls" >
          {videoPlaying ? (
            <MdPause onClick={handlePauseResume} className='control-icon1' />
          ) : (
            <MdPlayArrow onClick={handlePauseResume} className='control-icon1' />
          )}
        </div>
      </div>
      <div className='advantages-container'>
        <h2>What Nvision AI offers?</h2>
        <div className='adv'>
          <div className='adv1'>
            <div className='adv-img'>
              <img src={adv1} alt="adv" className='adv-images' />
            </div>
            <h3 >Product Name</h3>
            <p className='paragraph'>Automatic identification of the product using Computer Vision.</p>

          </div>
          <div className='adv1'>
            <div className='adv-img'>
              <img src={adv2} alt="adv" className='adv-images' />
            </div>
            <h3 >Defect Identification</h3>
            <p className='paragraph'>Efficiently identifies defects found across products.</p>
          </div>
          <div className='adv1'>
            <div className='adv-img'>
              <img src={adv4} alt="adv" className='adv-images' />
            </div>
            <h3 >Defect Categorization</h3>
            <p className='paragraph'>Efficiently Categorizes defects found across products.</p>
          </div>
          <div className='adv1'>
            <div className='adv-img'>
              <img src={adv3} alt="adv" className='adv-images' />
            </div>
            <h3 >Price Estimation</h3>
            <p className='paragraph'>Estimates the costs for the defects detected in the product.</p>
          </div>
        </div>
      </div>


      <div className="container">
      <header className="header"> 
        <h1>Resolutions for challenges which could be  ENCOUNTERED!</h1>
        
      </header>
     
      <p className='overcome'>Overcome all these challenges with our AI software solution.</p>
      <div className="feature1">
  <img src={gif5} alt="Product Recognition" className="feature-image" />
  <div className="feature-text">
    <h2>Seamless Inventory Management</h2>
    <p>Utilize our AI to transform your inventory management, effortlessly recognizing and organizing products by name with precision and speed.</p>
  </div>
</div>


<div className="feature">
  <img src={gif4} alt="Defect Detection" className="feature-image" />
  <div className="feature-text">
    <h2>Comprehensive Defect Detection</h2>
    <p>Our AI excels at spotting defects, from scratches and dents to serious safety hazards like tire flats and broken lamps, ensuring unparalleled quality assurance.</p>
  </div>
</div>




<div className="feature1">
  <img src={gif3} alt="Defect Sorting" className="feature-image" />
  <div className="feature-text">
    <h2>Intelligent Defect Sorting</h2>
    <p>With advanced categorization, our AI system prioritizes repairs and streamlines manufacturing by identifying and classifying defects in real-time.</p>
  </div>
</div>


<div className="feature">
  <img src={gif2} alt="Cost Analysis" className="feature-image" />
  <div className="feature-text">
    <h2>Automated Cost Analysis</h2>
    <p>Reduce the financial impacts of product recalls and repairs with our AI's automated cost estimation for identified defects.</p>
  </div>
</div>


<div className="feature1">
  <img src={gif1} alt="Rapid Response" className="feature-image" />
  <div className="feature-text">
    <h2>Accelerated Operational Efficiency</h2>
    <p>Drive operational efficiency with AI that delivers rapid analysis and results, reducing downtime and propelling your business forward.</p>
  </div>
</div>

    </div>


      <div className='test-heading-container'>
      <h2 className='test-heading'>Let Nvision AI accelerate your business growth</h2>
      <p>Get to know the information at your fingertips using our powerful AI in just 3 steps</p>
      <div className='steps'>
        <div className='step'>
          <div className='image-icon'>
          <img src={icon1} alt="step-icon" className='step-icon'/></div>
          <h3>Upload the image</h3>
          <p>Upload the image of your damaged car or vehicle</p>
        </div>
        <div className='step'>
        <div className='image-icon'>
          <img src={icon2} alt="step-icon" className='step-icon'/></div>
          <h3>Run the Nvision AI check</h3>
          <p>Run the powerful and specialised Nvision AI Check </p>
        </div>
        <div className='step'>
        <div className='image-icon'>
          <img src={icon3} alt="step-icon" className='step-icon'/></div>
          <h3>Know the problems</h3>
          <p>Get the information at your fingertips in seconds.</p>
        </div>
      </div>
      </div>

     
      <div className='demo-container'>
      <div className='test-heading-container1'>
      <h2  className='video-head'>Experience Nvision AI</h2>
      </div>
      <div className='app'>
      
      
      
      <h3>{uploadStatus}</h3>
      <div className='image-upload-container'>
        <div
          className={`upload-container ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragEnd}
          onDrop={handleDrop}
        >
        <div className='drop-zone'>
          <div className='upload-icon'>
          <MdOutlineCloudUpload />
          </div>
          <div className='drop-container'>
            <p className='pa'>{selectedImage ? selectedImage.name : 'Drag and drop image here '}</p>
            <p className='paragraph'>{selectedImage ? "" : 'Limit 200mb per file. JPG,PNG,JPEG'}</p>
          </div>
        </div>
      </div>
      <label className='browse-button'>
            Browse
          <input type="file" className='input' onChange={handleImageUpload} style={{ display: 'none' }} />
      </label>
       </div>
      
       <button onClick={handleFetchImage} disabled={loading}>
          {loading ? (
            <span>
              Processing... <div className="spinner" />
            </span>
          ) : (
            'Upload and Run'
          )}
        </button>
        <button onClick={handleClear}>Clear</button>  {loading && <div class="loader">
    <span class="loader-text">loading</span>
      <span class="load"></span>
  </div>}
        <div id="result-container" className={`result-container ${typingAnimation ? 'typing-animation' : ''}`}>
      {!apiImage && (
  <div className='result-container1 ' >
    <h3>Explore Our Featured Samples</h3>
    <hr className='hr-line'/>
    <div className='sample-image'>
      {sampleImages.map((sample, index) => (
        <div
          className='sample1'
          key={index} onClick={() => handleImageUpload(new File([{}], sample.name, { type: sample.type, size: sample.size }))}
          
        >
          <img src={sample.url} alt={sample.alt} className='sample' />
        </div>
      ))}
    </div>
  </div>
)}

        {apiImage && apiImage.length > 1 && (
          <div className='output-container'>
            
            <div className='output-buttons'>
        <button
          className={activeButton === "product" ? 'active' : ''}
          onClick={() => {
            setSelectedTab("product");
            setActiveButton("product");
          }}
        >
          Product Name
        </button>
        <button
          className={activeButton === "imageDetection" ? 'active' : ''}
          onClick={() => {
            setSelectedTab("imageDetection");
            setActiveButton("imageDetection");
          }}
        >
          Defects Identification
        </button>
        <button
          className={activeButton === "defectDetection" ? 'active' : ''}
          onClick={() => {
            setSelectedTab("defectDetection");
            setActiveButton("defectDetection");
          }}
        >
          Defects categorization
        </button>
        <button
          className={activeButton === "priceestimation" ? 'active' : ''}
          onClick={() => {
            setSelectedTab("priceestimation");
            setActiveButton("priceestimation");
          }}
        >
          Price Estimation
        </button>
      </div>
            <hr className='hr-line'/>
            <div >
              <div className='output-content'>
              {selectedTab === "product" && (
                <><div className='result'><div className='result-out'>
                  {apiImage && apiImage.length > 0 && (
              <img src={apiImage[0].url} alt={apiImage[0].alt} className="result-image" />
          )}</div><div className="vertical-line"></div><hr className='hr-line1'/><div className='result-out'>
                  <p className={`result-description ${typingAnimation ? 'typing-animation' : ''}`}>
                    {apiImage[1].description}
                  </p></div></div>
                </>
              )}</div>

              {selectedTab === "imageDetection" && (
                <><div className='result'><div className='result-out'>
                  {apiImage && apiImage.length > 0 && (
              <img src={apiImage[0].url} alt={apiImage[0].alt} className="result-image" />
          )}</div><div className="vertical-line"></div><hr className='hr-line1'/><div className='result-out'>
                  <img src={apiImage[1].url} alt={apiImage[1].alt} className="result-image" /></div></div>
                </>
              )}
              {selectedTab === "defectDetection" && (
  <><div className='result'><div className='result-out'>
    <img src={apiImage[1].url} alt={apiImage[1].alt} className="result-image" /></div><div className="vertical-line"></div><hr className='hr-line1'/><div className='result-out1'>
    {apiImage[1].labelsWithConfidence && apiImage[1].labelsWithConfidence.length > 0 ? (
      
      <ul className='labels'>
        
        {apiImage[1].labelsWithConfidence.map((label, index) => (
          <li key={index} className='label'>{label.charAt(0).toUpperCase() + label.slice(1)}</li>
        ))}
      </ul>
    ) : (
      <p className='result-description'>No defects found</p>
    )}</div></div>
  </>
)} {selectedTab === "priceestimation" && (
  <>
    <div className='result'><div className='result-out'>
    <img src={apiImage[1].url} alt={apiImage[1].alt} className="result-image" /></div><div className="vertical-line"></div><hr className='hr-line1'/><div className='result-out1'>
    {apiImage[1].labelsWithConfidence && apiImage[1].labelsWithConfidence.length > 0 ? (
      
      <ul className='labels'>
        
        {apiImage[1].labelsWithConfidence.map((label, index) => (
          <li key={index} className='label'>{label.charAt(0).toUpperCase() + label.slice(1)}</li>
        ))}
      </ul>
    ) : (
      <p className='result-description'>No defects found</p>
    )}</div>
    </div>
  </>
)}
            </div>
          </div>
        )}
</div></div> 
        
        
  {error && <p style={{ color: 'red' }}>{error}</p>}
      
</div>
    </div>
  );
}

export default App;
