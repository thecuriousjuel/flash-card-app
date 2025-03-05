import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  transition: border-color 0.3s;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.primary ? '#3498db' : '#e1e1e1'};
  color: ${props => props.primary ? 'white' : '#2c3e50'};
`;

const CreateCardForm = ({ availableCategories, onAddCard, onCancel }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: availableCategories.length > 0 ? availableCategories[0] : '',
    newCategory: ''
  });
  
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const category = isAddingNewCategory ? formData.newCategory : formData.category;
    
    if (!formData.question || !formData.answer || !category) {
      alert('Please fill in all fields!');
      return;
    }
    
    const newCard = {
      question: formData.question,
      answer: formData.answer,
      topic: category
    };
    
    onAddCard(newCard, isAddingNewCategory ? formData.newCategory : null);
    
    // Reset form
    setFormData({
      question: '',
      answer: '',
      category: availableCategories.length > 0 ? availableCategories[0] : '',
      newCategory: ''
    });
  };
  
  const toggleCategoryInput = () => {
    setIsAddingNewCategory(!isAddingNewCategory);
  };
  
  return (
    <FormContainer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FormTitle>Create New Flash Card</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="question">Question</Label>
          <TextArea 
            id="question"
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            placeholder="Enter your question here..."
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="answer">Answer</Label>
          <TextArea 
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleInputChange}
            placeholder="Enter the answer here..."
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>{isAddingNewCategory ? 'New Category' : 'Category'}</Label>
          
          {isAddingNewCategory ? (
            <Input 
              name="newCategory"
              value={formData.newCategory}
              onChange={handleInputChange}
              placeholder="Enter new category name"
              required={isAddingNewCategory}
            />
          ) : (
            <Select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
              required={!isAddingNewCategory}
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          )}
          
          <motion.a 
            href="#" 
            onClick={toggleCategoryInput}
            style={{ 
              marginTop: '0.5rem',
              color: '#3498db',
              textDecoration: 'none',
              fontSize: '0.9rem',
              alignSelf: 'flex-start'
            }}
            whileHover={{ textDecoration: 'underline' }}
          >
            {isAddingNewCategory ? 'Select existing category' : 'Add new category'}
          </motion.a>
        </FormGroup>
        
        <ButtonGroup>
          <Button 
            type="button" 
            onClick={onCancel}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </Button>
          <Button 
            primary 
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Card
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default CreateCardForm;