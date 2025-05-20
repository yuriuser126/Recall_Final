// pages/HomePage.js
import React from 'react';
import Greeting from '../components/Greeting';
import Button from '../components/Button';
import useCounter from '../hooks/useCounter';

function HomePage() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <Greeting name="사용자" />
      <p>카운트: {count}</p>
      <Button onClick={increment}>증가</Button>
      <Button onClick={decrement}>감소</Button>
    </div>
  );
}

export default HomePage;