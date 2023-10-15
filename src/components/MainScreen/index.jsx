import React, { useState, useEffect } from 'react';
import './style.css';

function MainBlock({ photoArray = [1, 2, 3, 4] }) {
  const [currentItem, setCurrentItem] = useState(0);

  // Функция для автоматической смены элементов каждые 5 секунд
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentItem((prevItem) => (prevItem + 1) % photoArray.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [photoArray]);

  const handleDotClick = (index) => {
    setCurrentItem(index);
  };

  return (
   <div></div>
  );
}

export default MainBlock;
