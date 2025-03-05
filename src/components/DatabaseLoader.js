import React, { useEffect } from 'react';

const DatabaseLoader = ({ onDataLoaded, onError }) => {
  useEffect(() => {
    const loadTopicData = async () => {
      try {
        // Use absolute path for development
        // Ensure baseUrl doesn't end with a slash
        // In development mode, we need to access files directly from the public folder
        const baseUrl = process.env.REACT_APP_PUBLIC_URL || '';
        
        // Ensure proper path construction
        const topicsUrl = baseUrl ? `${baseUrl}/database/topics.json` : './database/topics.json';
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Base URL:', baseUrl);
        console.log('Attempting to load topics from:', topicsUrl);
        // First, load the list of topics
        const topicsResponse = await fetch(topicsUrl);
        if (!topicsResponse.ok) {
          throw new Error(`Failed to load topics list. Status: ${topicsResponse.status} ${topicsResponse.statusText}`);
        }
        const topicsData = await topicsResponse.json();
        
        // Initialize array to store all flashcards
        let allFlashcards = [];
        let hasErrors = false;
        
        // Load data for each topic
        for (const topic of topicsData.topics) {
          try {
            const topicUrl = baseUrl ? `${baseUrl}/database/${topic}.json` : `./database/${topic}.json`;
            console.log(`Loading topic from: ${topicUrl}`);
            const response = await fetch(topicUrl);
            if (!response.ok) {
              throw new Error(`Failed to load topic: ${topic}. Status: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            
            // Add flashcards from this topic to the combined array
            if (data && data.flashcards) {
              allFlashcards = [...allFlashcards, ...data.flashcards];
            }
          } catch (error) {
            console.error(`Error loading data for topic ${topic}:`, error);
            hasErrors = true;
          }
        }
        
        if (hasErrors) {
          onError('Some flashcard data failed to load. Please try again.');
        } else if (allFlashcards.length === 0) {
          onError('No flashcard data was loaded. Please try again.');
        } else {
          // Pass the combined flashcards data to the parent component
          onDataLoaded(allFlashcards);
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        onError('Error loading data files. Please try again.');
      }
    };

    loadTopicData();
  }, [onDataLoaded, onError]);

  return null; // This component doesn't render anything
};

export default DatabaseLoader;