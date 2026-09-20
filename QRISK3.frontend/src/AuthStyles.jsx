import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f8fa; /* Fondo gris muy claro para resaltar la tarjeta */
  padding: 20px;
`;

export const AuthCard = styled.div`
  background-color: #ffffff;
  width: 100%;
  max-width: 450px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05); /* Sombra suave como en tus capturas */
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const AuthTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #1a1a1a;
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  background-color: #212121; /* El botón oscuro de tus mockups */
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  padding: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #000000;
  }
  
  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

export const TextLink = styled.p`
  margin-top: 25px;
  font-size: 14px;
  color: #666;

  span {
    color: #212121;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
`;