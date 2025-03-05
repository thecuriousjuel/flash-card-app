import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ReaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const UploadBox = styled(motion.div)`
  width: 100%;
  border: 2px dashed #3498db;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: #f7fbfe;
  }
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
  color: #3498db;
`;

const UploadText = styled.p`
  font-size: 18px;
  color: #2c3e50;
  margin-top: 0;
`;

const Instruction = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const SampleButton = styled(motion.button)`
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    }
  },
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { 
    scale: 0.95 
  }
};

const JsonReader = ({ onFileLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onFileLoaded(data);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please ensure it is a valid JSON format.');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };
  
  const loadSampleData = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_PUBLIC_URL || '';
      const sampleUrl = baseUrl === '.' ? './sample-data.json' : `${baseUrl}/sample-data.json`;
      
      const response = await fetch(sampleUrl);
      if (!response.ok) {
        throw new Error(`Failed to load sample data. Status: ${response.status}`);
      }
      
      const data = await response.json();
      onFileLoaded(data);
    } catch (error) {
      console.error('Error loading sample data:', error);
      alert('Error loading sample data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ReaderContainer as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <UploadBox 
        whileHover={{ borderColor: '#2980b9', scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <HiddenInput type="file" accept=".json" onChange={handleFileChange} />
        <UploadIcon>📁</UploadIcon>
        <UploadText>Drag & drop a JSON file or click to browse</UploadText>
      </UploadBox>
      
      <Instruction>
        Upload a JSON file with your flashcards data or try our sample data.
      </Instruction>
      
      <SampleButton 
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={loadSampleData}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load Sample Data'}
      </SampleButton>
    </ReaderContainer>
  );
};

export default JsonReader;