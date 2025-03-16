import styled from 'styled-components';

export const SynthesizerContainer = styled.div`
  background: #2a2a2a;
  padding: 40px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const KeyboardContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  height: 400px;
  margin: 0;
  padding-top: 20px;
`;

export const WhiteKey = styled.div<{ isPressed?: boolean }>`
  width: 100px;
  height: 350px;
  background: ${props => props.isPressed ? '#cccccc' : 'white'};
  border: 1px solid #333;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  margin: 0 1px;
  transition: background-color 0.1s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

export const BlackKey = styled.div<{ isPressed?: boolean }>`
  width: 60px;
  height: 220px;
  background: ${props => props.isPressed ? '#666666' : '#333'};
  position: absolute;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  z-index: 2;
  margin-left: -40px;
  transition: background-color 0.1s ease;

  &:hover {
    background: #444;
  }
`;

export const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 0 20px;
`;

export const ControlGroup = styled.div`
  background: #333;
  padding: 20px;
  border-radius: 8px;
`;

export const ControlLabel = styled.label`
  display: block;
  color: #fff;
  margin-bottom: 10px;
  font-size: 14px;
`;

export const Slider = styled.input`
  width: 100%;
  margin: 10px 0;
`; 