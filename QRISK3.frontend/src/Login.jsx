import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthContainer, AuthCard, AuthTitle,
  FormGroup, Label, Input,
  PrimaryButton, TextLink
} from './AuthStyles';

const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({
    correo: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Ajusta el puerto (ej. 5001) para coincidir con la ejecución de .NET
      const response = await fetch(`${devServerUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Almacenar el token en el navegador
        localStorage.setItem('token', data.token);

        // Navegar a la pantalla de evaluación
        navigate('/evaluacion');
      } else {
        // Mostrar mensaje de credenciales incorrectas desde el backend
        setError(data.message || 'Error al autenticar.');
      }
    } catch (err) {
      setError('Error de red. Verifica que el backend esté en ejecución: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          Iniciar Sesión
        </AuthTitle>

        {/* Renderizado condicional del error */}
        {error && <p style={{ color: '#d93025', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={credentials.correo}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Contraseña</Label>
            <Input
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? 'Verificando...' : 'Entrar'}
          </PrimaryButton>
        </form>

        <TextLink>
          ¿No tienes una cuenta? <span onClick={() => navigate('/registro')}>Regístrate aquí</span>
        </TextLink>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;