/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generates a random color from a predefined palette
 * @returns {string} - A color in hexadecimal format
 */
export const getRandomColor = () => {
  const colors = [
    '#2ecc71', // Green
    '#3498db', // Blue
    '#9b59b6', // Purple
    '#e74c3c', // Red
    '#f39c12', // Orange
    '#1abc9c', // Teal
    '#d35400', // Pumpkin
    '#c0392b', // Pomegranate
    '#16a085', // Green Sea
    '#8e44ad', // Wisteria
    '#2980b9', // Belize Hole
    '#f1c40f', // Sunflower
    '#27ae60', // Nephritis
    '#e67e22', // Carrot
    '#2c3e50', // Midnight Blue
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Returns a color based on the topic for consistent topic coloring
 * @param {string} topic - The topic to generate a color for
 * @returns {string} - A consistent color in hexadecimal format for that topic
 */
export const getTopicColor = (topic) => {
  // Check if topic is undefined or null, return a default color
  if (topic === undefined || topic === null) {
    return '#2c3e50'; // Default midnight blue color
  }
  
  const topicColors = {
    'React': '#61dafb',
    'JavaScript': '#f7df1e',
    'CSS': '#264de4',
    'HTML': '#e34c26',
    'General': '#2c3e50'
  };
  
  // If the topic has a predefined color, use it, otherwise generate a "random" but consistent color
  if (topicColors[topic]) {
    return topicColors[topic];
  } else {
    // Hash the topic name to get a consistent number
    let hash = 0;
    // Convert topic to string to ensure it has a length property
    const topicStr = String(topic);
    for (let i = 0; i < topicStr.length; i++) {
      hash = topicStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert the hash to a hexadecimal color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
  }
};