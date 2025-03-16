import styled from 'styled-components';

export const Button = styled.button<{ variant?: 'danger' | 'primary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
  background: ${props => 
    props.variant === 'danger' ? '#aa3333' :
    props.variant === 'primary' ? '#4CAF50' :
    '#5a5a5a'};
  color: white;

  &:hover {
    background: ${props => 
      props.variant === 'danger' ? '#cc4444' :
      props.variant === 'primary' ? '#45a049' :
      '#6a6a6a'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6a6a6a;
  }
`; 