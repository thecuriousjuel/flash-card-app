import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getTopicColor } from '../utils/arrayUtils';

const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 350px;
  perspective: 1500px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    height: 280px;
  }
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
`;

const CardSide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-radius: 16px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardFront = styled(CardSide)`
  background-color: ${props => props.backgroundColor};
  color: white;
`;

const CardBack = styled(CardSide)`
  background-color: white;
  color: #2c3e50;
  border: 1px solid #e1e1e1;
`;

const TopicLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    top: 15px;
    left: 15px;
  }
`;

const Question = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  margin: 0;
  color: white;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Answer = styled.div`
  font-size: 1.4rem;
  text-align: center;
  line-height: 1.5;
  max-width: 100%;
  overflow-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const RevealButton = styled(motion.button)`
  position: absolute;
  bottom: 20px;
  padding: 8px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 6px 16px;
    font-size: 0.9rem;
  }
`;

const AnswerContainer = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 1.5rem;
  color: #2c3e50;
  max-width: 100%;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 1rem;
  }
`;

const Button = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    margin-top: 1rem;
  }
`;

const Instruction = styled.div`
  position: absolute;
  bottom: 15px;
  font-size: 0.9rem;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    bottom: 10px;
  }
`;

// Animation variants
const cardVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: "easeInOut" }
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const answerRevealVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const FlashCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const topicColor = getTopicColor(card.topic);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleReset = () => {
    setIsFlipped(false);
  };

  return (
    <CardContainer>
      {/* Removed floating reveal button */}
      <CardInner
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        onClick={handleCardClick}
      >
        <CardFront
          backgroundColor={topicColor}
          style={{
            transform: "rotateY(0deg)",
            zIndex: isFlipped ? 1 : 2
          }}
        >
          <AnimatePresence mode="wait">
            {!isFlipped && (
              <motion.div
                key="front"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <TopicLabel>{card.topic}</TopicLabel>
                <Question>{card.question}</Question>

                {/* Removed reveal answer button */}

                <Instruction>Tap anywhere to flip card</Instruction>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFront>

        <CardBack
          style={{
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 2 : 1
          }}
        >
          <AnimatePresence mode="wait">
            {isFlipped && (
              <motion.div
                key="back"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <h3>Answer:</h3>
                <Answer>{card.answer}</Answer>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  style={{
                    backgroundColor: 'white',
                    color: '#3498db',
                    borderColor: '#3498db',
                    marginTop: '1.5rem'
                  }}
                >
                  Back to Question
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

export default FlashCard;