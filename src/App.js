import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import DatabaseLoader from './components/DatabaseLoader';
import FlashCardDeck from './components/FlashCardDeck';
import CategorySelection from './components/CategorySelection';
import CreateCardForm from './components/CreateCardForm';
import JsonReader from './components/JsonReader';
import { shuffleArray, getTopicColor } from './utils/arrayUtils';
import { ThemeContext } from './context/ThemeContext';

const ErrorMessage = styled.div`
  background-color: ${props => props.darkMode ? '#ff000033' : '#ffebee'};
  color: ${props => props.darkMode ? '#ff6b6b' : '#d32f2f'};
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  border: 1px solid ${props => props.darkMode ? '#ff6b6b' : '#ef5350'};
  text-align: center;
  width: 100%;
  max-width: 600px;
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--text-color);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  color: var(--subtitle-color);
  font-size: 1.2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ThemeToggleButton = styled.button`
  background-color: var(--toggle-bg);
  color: var(--text-color);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute;
  top: 0;
  right: 0;
  
  &:hover {
    background-color: var(--button-hover);
    color: white;
  }
`;

function App() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [flashCards, setFlashCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [topicColors, setTopicColors] = useState({});
  const [error, setError] = useState(null);

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsDataLoaded(false);
  };
  
  const handleDataLoaded = (data) => {
    setFlashCards(data);
    setIsDataLoaded(true);
  };

  useEffect(() => {
    // If we have flash cards data, show category selection
    if (flashCards.length > 0) {
      if (!isDataLoaded) {
        setIsDataLoaded(true);
      }
      
      // Show category selection if we don't have any selected categories
      if (selectedCategories.length === 0) {
        setShowCategorySelection(true);
      }
      
      // Generate topic colors for all categories
      const topics = [...new Set(flashCards.map(card => card.topic))];
      const colors = {};
      topics.forEach(topic => {
        colors[topic] = getTopicColor(topic);
      });
      setTopicColors(colors);
    }
  }, [flashCards, isDataLoaded, selectedCategories.length]);

  // Function to select cards from selected categories
  const selectCardsByCategories = (categories) => {
    // Filter cards by selected categories
    const filteredCards = flashCards.filter(card => categories.includes(card.topic));
    
    // Group cards by topic
    const cardsByTopic = filteredCards.reduce((acc, card) => {
      if (!acc[card.topic]) {
        acc[card.topic] = [];
      }
      acc[card.topic].push(card);
      return acc;
    }, {});
    
    let selectedCards = [];
    
    // Select 10 cards from each selected category or all if less than 10
    categories.forEach(category => {
      if (cardsByTopic[category]) {
        const shuffledCategoryCards = shuffleArray([...cardsByTopic[category]]);
        const cardsToSelect = Math.min(10, shuffledCategoryCards.length);
        const categoryCards = shuffledCategoryCards.slice(0, cardsToSelect);
        
        // Add category and index information to each card for navigation
        const cardsWithIndex = categoryCards.map((card, index) => ({
          ...card,
          categoryIndex: index,
          totalInCategory: cardsToSelect
        }));
        
        selectedCards = [...selectedCards, ...cardsWithIndex];
      }
    });
    
    // Group selected cards by category for easier navigation
    const organizedCards = [];
    categories.forEach(category => {
      const categoryCards = selectedCards.filter(card => card.topic === category);
      organizedCards.push(...categoryCards);
    });
    
    return organizedCards;
  };

  const handleCategorySelection = (categories) => {
    setSelectedCategories(categories);
    const cards = selectCardsByCategories(categories);
    setSelectedCards(cards);
    setShowCategorySelection(false);
  };
  
  const refreshCards = (currentCategory = null) => {
    if (selectedCategories.length > 0) {
      if (currentCategory) {
        // Only refresh cards from the current category
        // Get all cards that are not from the current category
        const otherCategoryCards = selectedCards.filter(card => card.topic !== currentCategory);
        
        // Get fresh cards from the current category
        const categoryCards = flashCards.filter(card => card.topic === currentCategory);
        const shuffledCategoryCards = shuffleArray([...categoryCards]);
        const cardsToSelect = Math.min(10, shuffledCategoryCards.length);
        const newCategoryCards = shuffledCategoryCards.slice(0, cardsToSelect);
        
        // Add category and index information to each card
        const cardsWithIndex = newCategoryCards.map((card, index) => ({
          ...card,
          categoryIndex: index,
          totalInCategory: cardsToSelect
        }));
        
        // Combine with other category cards and set as selected cards
        setSelectedCards([...otherCategoryCards, ...cardsWithIndex]);
      } else {
        // Original behavior - refresh cards from all selected categories
        const cards = selectCardsByCategories(selectedCategories);
        setSelectedCards(cards);
      }
    }
  };
  
  const showCategoriesScreen = () => {
    setShowCategorySelection(true);
  };
  
  const toggleCreateCardForm = () => {
    setShowCreateCard(!showCreateCard);
  };
  
  const addNewCard = (newCard, newCategory = null) => {
    // Add the new card to the flash cards
    const updatedId = flashCards.length > 0 ? Math.max(...flashCards.map(card => card.id)) + 1 : 1;
    const cardWithId = { ...newCard, id: updatedId };
    
    // Update flashCards array
    setFlashCards([...flashCards, cardWithId]);
    
    // If it's a new category, update topic colors
    if (newCategory && !topicColors[newCategory]) {
      setTopicColors({
        ...topicColors,
        [newCategory]: getTopicColor(newCategory)
      });
    }
    
    // Close the create card form
    setShowCreateCard(false);
    
    // If we're in study mode with selected categories, refresh cards if the new card's topic is included
    if (selectedCategories.includes(newCard.topic)) {
      refreshCards();
    }
  };

  return (
    <AppContainer>
      {error && <ErrorMessage darkMode={darkMode}>{error}</ErrorMessage>}
      {!isDataLoaded && !showCreateCard && (
        <DatabaseLoader onDataLoaded={handleDataLoaded} onError={handleError} />
      )}
      <Header>
        <HeaderContent>
          <div>
            <Title>Flash Card Revision</Title>
            <Subtitle>Revise topics quickly with interactive flash cards</Subtitle>
          </div>
          <ThemeToggleButton onClick={toggleTheme}>
            {darkMode ? '☀️' : '🌙'}
          </ThemeToggleButton>
        </HeaderContent>
      </Header>
      
      {!isDataLoaded ? (
        <JsonReader onFileLoaded={data => setFlashCards(data.flashcards || data)} />
      ) : showCategorySelection ? (
        <CategorySelection 
          categories={[...new Set(flashCards.map(card => card.topic))]}
          topicColors={topicColors}
          onStart={handleCategorySelection}
        />
      ) : showCreateCard ? (
        <CreateCardForm 
          availableCategories={[...new Set(flashCards.map(card => card.topic))]} 
          onAddCard={addNewCard}
          onCancel={toggleCreateCardForm}
        />
      ) : (
        <React.Fragment>
          <FlashCardDeck 
            cards={selectedCards} 
            topicColors={topicColors}
            onRefresh={refreshCards} 
            onShowCategories={showCategoriesScreen}
            onCreateCard={toggleCreateCardForm}
          />
        </React.Fragment>
      )}
    </AppContainer>
  );
}

export default App;