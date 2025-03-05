import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FlashCard from './FlashCard';

const DeckContainer = styled.div`
  width: 100%;
  max-width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const TopToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const CategoryIndicator = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${props => props.color || '#7f8c8d'};
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CardNavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 2rem 0 1rem;
  
  @media (max-width: 768px) {
    margin: 1.5rem 0 0.75rem;
  }
`;

const NavigationButton = styled(motion.button)`
  background-color: ${props => props.topicColor ? props.topicColor : 'var(--card-background)'};
  color: ${props => props.topicColor ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 3px 10px var(--shadow-color);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ProgressDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--subtitle-color);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--toggle-bg);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 6px;
    margin-bottom: 1.5rem;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.topicColor || 'var(--button-primary)'};
  width: ${props => props.progress}%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ActionButton = styled(motion.button)`
  background-color: ${props => props.secondary ? 
    'var(--card-background)' : 
    (props.topicColor || 'var(--button-primary)')};
  color: ${props => props.secondary ? 
    (props.topicColor || 'var(--button-primary)') : 
    'white'};
  border: ${props => props.secondary ? 
    `1px solid ${props.topicColor || 'var(--button-primary)'}` : 
    'none'};
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px var(--shadow-color);
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const RefreshIcon = styled.span`
  display: inline-block;
`;

// Animation variants
const buttonVariants = {
  hover: { 
    scale: 1.1,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { 
    scale: 0.95 
  }
};

const FlashCardDeck = ({ cards, topicColors, onRefresh, onShowCategories, onCreateCard }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('#7f8c8d');
  const [categoryProgress, setCategoryProgress] = useState({ current: 0, total: 0 });
  
  useEffect(() => {
    if (cards.length > 0) {
      const currentCard = cards[currentCardIndex];
      setCurrentCategory(currentCard.topic);
      
      // Get all cards that belong to the same category as the current card
      const sameCategory = cards.filter(card => card.topic === currentCard.topic);
      
      // Find current card's position within its category
      const categoryIndex = sameCategory.findIndex(card => card.id === currentCard.id);
      
      setCategoryProgress({
        current: categoryIndex + 1,
        total: sameCategory.length
      });
      
      // Set the color based on the topic
      setCategoryColor(getTopicColor(currentCard.topic));
    }
  }, [cards, currentCardIndex]);
  
  const getTopicColor = (topic) => {
    const colors = {
      'React': '#61dafb',
      'JavaScript': '#f7df1e',
      'CSS': '#264de4',
      'HTML': '#e34c26',
      'General': '#2c3e50'
    };
    
    if (colors[topic]) {
      return colors[topic];
    }
    
    // Simple hash for consistent color if not in predefined list
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
      hash = topic.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
  };
  
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  
  const handleRefresh = () => {
    // Reset to first card
    setCurrentCardIndex(0);
    // Request new cards from parent, but only for the current category
    onRefresh(currentCategory);
  };
  
  // Navigate to the next card in the current category
  const handleNextInCategory = () => {
    // Find all cards in the current category
    const currentCard = cards[currentCardIndex];
    const categoryCards = cards.filter(card => card.topic === currentCard.topic);
    const currentInCategory = categoryCards.findIndex(card => card.id === currentCard.id);
    
    if (currentInCategory < categoryCards.length - 1) {
      // Find the next card in this category
      const nextCard = categoryCards[currentInCategory + 1];
      const nextCardIndex = cards.findIndex(card => card.id === nextCard.id);
      setCurrentCardIndex(nextCardIndex);
    } else {
      // We're at the last card in this category, find the first card of the next category
      const categories = [...new Set(cards.map(card => card.topic))];
      const currentCategoryIndex = categories.indexOf(currentCard.topic);
      
      if (currentCategoryIndex < categories.length - 1) {
        // There is a next category
        const nextCategory = categories[currentCategoryIndex + 1];
        const firstCardOfNextCategory = cards.findIndex(card => card.topic === nextCategory);
        setCurrentCardIndex(firstCardOfNextCategory);
      }
    }
  };
  
  // Navigate to the previous card in the current category
  const handlePrevInCategory = () => {
    // Find all cards in the current category
    const currentCard = cards[currentCardIndex];
    const categoryCards = cards.filter(card => card.topic === currentCard.topic);
    const currentInCategory = categoryCards.findIndex(card => card.id === currentCard.id);
    
    if (currentInCategory > 0) {
      // Find the previous card in this category
      const prevCard = categoryCards[currentInCategory - 1];
      const prevCardIndex = cards.findIndex(card => card.id === prevCard.id);
      setCurrentCardIndex(prevCardIndex);
    } else {
      // We're at the first card in this category, find the last card of the previous category
      const categories = [...new Set(cards.map(card => card.topic))];
      const currentCategoryIndex = categories.indexOf(currentCard.topic);
      
      if (currentCategoryIndex > 0) {
        // There is a previous category
        const prevCategory = categories[currentCategoryIndex - 1];
        const categoryCardsOfPrevious = cards.filter(card => card.topic === prevCategory);
        const lastCardOfPrevCategory = cards.findIndex(card => 
          card.id === categoryCardsOfPrevious[categoryCardsOfPrevious.length - 1].id
        );
        setCurrentCardIndex(lastCardOfPrevCategory);
      }
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentCardIndex + 1) / cards.length) * 100;
  
  // Get the current card's topic color
  const currentTopicColor = cards.length > 0 && topicColors ? 
    topicColors[cards[currentCardIndex].topic] : null;
  
  return (
    <DeckContainer>
      <TopToolbar>
        <ActionButton 
          secondary
          topicColor={currentTopicColor}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onShowCategories}
        >
          ← Categories
        </ActionButton>
        
        {cards.length > 0 && (
          <CategoryIndicator color={categoryColor}>
            {currentCategory} ({categoryProgress.current}/{categoryProgress.total})
          </CategoryIndicator>
        )}
        
        <ActionButton 
          secondary
          topicColor={currentTopicColor}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onCreateCard}
        >
          + New Card
        </ActionButton>
      </TopToolbar>
      
      <ProgressBar>
        <ProgressFill progress={progressPercentage} topicColor={currentTopicColor} />
      </ProgressBar>
      
      {cards.length > 0 ? (
        <>
          <FlashCard key={currentCardIndex} card={cards[currentCardIndex]} />
          
          <CardNavigationContainer>
            <NavigationButton
              topicColor={currentTopicColor}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handlePrevInCategory}
              disabled={currentCardIndex === 0 && categoryProgress.current === 1}
              aria-label="Previous card in category"
              title="Previous in category"
            >
              ←
            </NavigationButton>
            
            <ProgressDisplay>
              {currentCardIndex + 1} / {cards.length}
            </ProgressDisplay>
            
            <NavigationButton
              topicColor={currentTopicColor}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleNextInCategory}
              disabled={currentCardIndex === cards.length - 1}
              aria-label="Next card in category"
              title="Next in category"
            >
              →
            </NavigationButton>
          </CardNavigationContainer>
          
          <ButtonsContainer>
            {currentCardIndex === cards.length - 1 && (
              <ActionButton
                topicColor={currentTopicColor}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleRefresh}
              >
                🔄 Get New Cards
              </ActionButton>
            )}
          </ButtonsContainer>
        </>
      ) : (
        <div>No cards available.</div>
      )}
    </DeckContainer>
  );
};

export default FlashCardDeck;