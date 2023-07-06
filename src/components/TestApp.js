import React, { useState, useEffect } from 'react';
import styles from './TestApp.module.scss';

const TestApp = () => {
  const boardWidth = 20;
  const boardHeight = 20;

  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState(generateFoodPosition());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore') || 0);

  useEffect(() => {
    const moveSnake = setInterval(() => {
      const head = { x: snake[0].x, y: snake[0].y };

      switch (direction) {
        case "right":
          head.x++;
          break;
        case "left":
          head.x--;
          break;
        case "up":
          head.y--;
          break;
        case "down":
          head.y++;
          break;
        default:
          break;
      }

      if (
        head.x < 0 ||
        head.x >= boardWidth ||
        head.y < 0 ||
        head.y >= boardHeight
      ) {
        clearInterval(moveSnake);
        setGameOver(true);
        return;
      }

      if (head.x === food.x && head.y === food.y) {
        setSnake([head, ...snake]);
        setFood(generateFoodPosition());
        setScore(score + 1);
      } else {
        setSnake([head, ...snake.slice(0, snake.length - 1)]);
      }
    }, 200);

    return () => {
      clearInterval(moveSnake);
    };
  }, [direction, snake, food, boardWidth, boardHeight, score]);

  useEffect(() => {
    if (gameOver) {
      setSnake([{ x: 0, y: 0 }]);
      setDirection("right");
      setFood(generateFoodPosition());
      setScore(0);
      setGameOver(false);

      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('bestScore', score);
      }
    }
  }, [gameOver, bestScore, score]);

  const handleButtonClick = (newDirection) => {
    setDirection(newDirection);
  };

  function generateFoodPosition() {
    const x = Math.floor(Math.random() * boardWidth);
    const y = Math.floor(Math.random() * boardHeight);
    return { x, y };
  }

  return (
    <div>
      <div>
        <h2>Best Score: {bestScore}</h2>
        <h2>Score: {score}</h2>
      </div>
      <div
        style={{
          width: `${boardWidth * 20}px`,
          height: `${boardHeight * 20}px`,
          border: "1px solid #009432",
          position: "relative",
          background: '#b9e87d'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: segment.y * 20,
              left: segment.x * 20,
              width: "20px",
              height: "20px",
              backgroundColor: index === 0 ? "#f6b93b" : "#fad390",
              border: "1px solid #F79F1F"
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: food.y * 20,
            left: food.x * 20,
            width: "20px",
            height: "20px",
            backgroundColor: "#27ae60",
          }}
        />
      </div>
      
      <div style={{
          width: `${boardWidth * 20}px`,
          height: `${boardHeight * 10}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <div className={styles.buttonWrapper}>
          <div className={styles.upButtonWrapper}>
            <button className={styles.button} style={{
              rigth: '80px'
            }}
            onClick={() => handleButtonClick("up")}>Up</button>
          </div>

          <div>
            <button className={styles.button} onClick={() => handleButtonClick("left")}>Left</button>
            <button className={styles.button} onClick={() => handleButtonClick("down")}>Down</button>
            <button className={styles.button} onClick={() => handleButtonClick("right")}>Right</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApp;