import React from 'react';
import styled from 'styled-components';
import Slide from './components/Slide';

const Div = styled.div`
  width: 800vw;
  max-width: 800px;
  margin: 0 20px;
  border-radius: 4px;
  border: 1px solid #0b9a6d;
  background: #0b9a6d;
  color: #fff;
  padding: 100px 0;
  text-align: center;
`;

function App() {
  return (
    <Slide navigation={false}>
      <Div>
        <h1>Element 01</h1>
      </Div>
      <Div>
        <h1>Element 02</h1>
      </Div>
      <Div>
        <h1>Element 03</h1>
      </Div>
      <Div>
        <h1>Element 04</h1>
      </Div>
      <Div>
        <h1>Element 05</h1>
      </Div>
      <Div>
        <h1>Element 06</h1>
      </Div>
    </Slide>
  );
}

export default App;
