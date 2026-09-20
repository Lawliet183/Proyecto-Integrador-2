import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  AuthContainer,
  AuthCard,
  AuthTitle,
  FormGroup,
  Label,
  Input,
  PrimaryButton,
  TextLink
} from './AuthStyles';

// Extendemos los estilos base localmente para manejar las columnas y el selector
const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  background-color: #ffffff;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #1a1a1a;
  }
`;


const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const Register = ({ onNavigateToLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexoBiologico: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    setIsLoading(true);

    try {
      // Mapeamos el estado local de React al DTO de C#
      const payload = {
        Nombres: formData.nombres,
        Apellidos: formData.apellidos,
        FechaNacimiento: formData.fechaNacimiento,
        SexoBiologico: formData.sexoBiologico,
        Correo: formData.correo,
        Password: formData.password
      };

      const response = await fetch(`${devServerUrl}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Auto-login: guardamos el JWT recién creado
        localStorage.setItem('token', data.token);

        // Redirigimos directamente al cuestionario médico
        navigate('/evaluacion');
      } else {
        setError(data.message || 'Ocurrió un error al registrar la cuenta.');
      }
    } catch (err) {
      setError('Error de red. Verifica que el servidor backend esté encendido: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard style={{ maxWidth: '600px' }}> {/* Tarjeta más ancha para las columnas */}
        <AuthTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
          Registro de Paciente
        </AuthTitle>

        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <GridRow>
            <FormGroup>
              <Label>Nombres</Label>
              <Input
                type="text"
                name="nombres"
                placeholder="Tus nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Apellidos</Label>
              <Input
                type="text"
                name="apellidos"
                placeholder="Tus apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </GridRow>

          <GridRow>
            <FormGroup>
              <Label>Fecha de Nacimiento</Label>
              <Input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Sexo Biológico</Label>
              <Select
                name="sexoBiologico"
                value={formData.sexoBiologico}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </Select>
            </FormGroup>
          </GridRow>

          <FormGroup>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <GridRow>
            <FormGroup>
              <Label>Contraseña</Label>
              <Input
                type="password"
                name="password"
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </FormGroup>

            <FormGroup>
              <Label>Confirmar Contraseña</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Repite la contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </GridRow>

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Registrarme'}
          </PrimaryButton>
        </form>

        <TextLink>
          ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')}>Inicia sesión aquí</span>
        </TextLink>
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;