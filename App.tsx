import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const GRID_SIZE = 10;
interface Coordinate {
  x: number;
  y: number;
}
const INITIAL_SNAKE: Coordinate[] = [{ x: 5, y: 5 }];
const INITIAL_FOOD: Coordinate = { x: 3, y: 3 };

export default function App() {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(INITIAL_FOOD);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) moveSnake();
    }, 200);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  const moveSnake = () => {
    const head = snake[0];
    let newHead: Coordinate | undefined;

    switch (direction) {
      case 'UP':
        newHead = { x: head.x, y: (head.y - 1 + GRID_SIZE) % GRID_SIZE };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: (head.y + 1) % GRID_SIZE };
        break;
      case 'LEFT':
        newHead = { x: (head.x - 1 + GRID_SIZE) % GRID_SIZE, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: (head.x + 1) % GRID_SIZE, y: head.y };
        break;
    }

    if (!newHead || checkCollision(newHead)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const checkCollision = (head: Coordinate): boolean => {
    return snake.some((segment: Coordinate) => segment.x === head.x && segment.y === head.y);
  };

  const generateFood = (): Coordinate => {
    let newFood: Coordinate;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment: Coordinate) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const handleDirectionChange = (newDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (
      (direction === 'UP' && newDirection !== 'DOWN') ||
      (direction === 'DOWN' && newDirection !== 'UP') ||
      (direction === 'LEFT' && newDirection !== 'RIGHT') ||
      (direction === 'RIGHT' && newDirection !== 'LEFT')
    ) {
      setDirection(newDirection);
    }
  };

  return (
    <View style={styles.container}>
      {gameOver ? (
        <Text style={styles.gameOverText}>Game Over</Text>
      ) : (
        <View style={styles.grid}>
          {Array.from({ length: GRID_SIZE }).map((_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: GRID_SIZE }).map((_, col) => {
                const isSnake = snake.some((segment: Coordinate) => segment.x === col && segment.y === row);
                const isFood = food.x === col && food.y === row;
                return (
                  <View
                    key={col}
                    style={[styles.cell, isSnake && styles.snake, isFood && styles.food]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => handleDirectionChange('UP')} style={styles.button}><Text>UP</Text></TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity onPress={() => handleDirectionChange('LEFT')} style={styles.button}><Text>LEFT</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleDirectionChange('RIGHT')} style={styles.button}><Text>RIGHT</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleDirectionChange('DOWN')} style={styles.button}><Text>DOWN</Text></TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  grid: {
    width: 200,
    height: 200,
    backgroundColor: '#333',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#444',
  },
  snake: {
    backgroundColor: 'green',
  },
  food: {
    backgroundColor: 'red',
  },
  controls: {
    marginTop: 20,
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  button: {
    padding: 10,
    backgroundColor: '#555',
    margin: 5,
    alignItems: 'center',
  },
  gameOverText: {
    color: 'white',
    fontSize: 24,
  },
});
