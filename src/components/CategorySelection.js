import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CategorySelectionContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-color);
`;

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const CategoryItem = styled(motion.div)`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background-color: ${props => props.selected ? props.color : 'var(--card-background)'};
  color: ${props => props.selected ? 'white' : props.color};
  border: 2px solid ${props => props.color};
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StartButton = styled(motion.button)`
  display: block;
  margin: 2rem auto 0;
  padding: 0.8rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SelectAllContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const SelectAllButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const CategorySelection = ({ categories, topicColors, onStart }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    // Set the available categories from props
    if (categories && categories.length > 0) {
      setAvailableCategories(categories);
    }
  }, [categories]);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const selectAllCategories = () => {
    setSelectedCategories([...availableCategories]);
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleStart = () => {
    if (selectedCategories.length > 0) {
      onStart(selectedCategories);
    }
  };

  const getCategoryColor = (category) => {
    return topicColors[category] || '#7f8c8d'; // Default gray if color not found
  };

  return (
    <CategorySelectionContainer>
      <Title>Select Categories to Study</Title>
      
      <SelectAllContainer>
        {selectedCategories.length < availableCategories.length ? (
          <SelectAllButton onClick={selectAllCategories}>Select All</SelectAllButton>
        ) : (
          <SelectAllButton onClick={deselectAllCategories}>Deselect All</SelectAllButton>
        )}
      </SelectAllContainer>
      
      <CategoriesList as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
        {availableCategories.map(category => (
          <CategoryItem 
            key={category}
            variants={itemVariants}
            color={getCategoryColor(category)}
            selected={selectedCategories.includes(category)}
            onClick={() => toggleCategory(category)}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </CategoryItem>
        ))}
      </CategoriesList>
      
      <StartButton 
        disabled={selectedCategories.length === 0}
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        Start Learning
      </StartButton>
    </CategorySelectionContainer>
  );
};

export default CategorySelection;