DROP DATABASE IF EXISTS proyecto_integrador_2;
CREATE DATABASE proyecto_integrador_2;
USE proyecto_integrador_2;

-- TABLA DE USUARIOS
CREATE TABLE Usuario(
    id INT AUTO_INCREMENT,
    correo_electronico VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    rol ENUM('Paciente', 'Administrador') NOT NULL DEFAULT 'Paciente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT Usuario_PK PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE PACIENTES
CREATE TABLE Paciente(
    id INT AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo_biologico ENUM('Masculino', 'Femenino') NOT NULL, 
    
    CONSTRAINT Paciente_PK PRIMARY KEY(id),
    CONSTRAINT Paciente_Usuario_FK FOREIGN KEY(usuario_id) 
        REFERENCES Usuario(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE EXPEDIENTE CLÍNICO
CREATE TABLE Expediente_Clinico(
    id INT AUTO_INCREMENT,
    paciente_id INT UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT Expediente_Clinico_PK PRIMARY KEY(id),
    CONSTRAINT Expediente_Clinico_FK1 FOREIGN KEY(paciente_id) 
        REFERENCES Paciente(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE EVALUACIÓN DE RIESGO
CREATE TABLE Evaluacion_Riesgo(
    id INT AUTO_INCREMENT,
    expediente_id INT NOT NULL,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Bloque Demográfico / Físico
    edad_al_evaluar INT NOT NULL,

    peso DECIMAL(5, 2) NULL, 
    altura DECIMAL(3, 2) NULL, 
    
    imc DECIMAL(4, 2) NOT NULL, 
    
    -- Bandera de trazabilidad para el IMC
    imc_imputado BOOL NOT NULL DEFAULT FALSE,
    
    -- Variables Demográficas Adicionales
    origen_etnico INT NOT NULL, -- Valores del 1 al 9 según el estándar
    categoria_tabaquismo INT NOT NULL, -- Valores del 1 al 5
    indice_townsend DECIMAL(5, 2) NOT NULL, -- Índice de privación material
    
    -- Bloque Clínico con Trazabilidad de Imputación
    presion_sistolica DECIMAL(5, 2) NOT NULL,
    presion_sistolica_imputada BOOL NOT NULL DEFAULT FALSE,
    desviacion_std_presion DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    
    ratio_colesterol_hdl DECIMAL(5, 2) NOT NULL,
    ratio_colesterol_imputado BOOL NOT NULL DEFAULT FALSE,
    
    -- Bloque de Comorbilidades (Booleanos QRISK3/QDiabetes)
    tratamiento_hipertension BOOL NOT NULL DEFAULT FALSE,
    fibrilacion_auricular BOOL NOT NULL DEFAULT FALSE,
    diabetes_tipo_1 BOOL NOT NULL DEFAULT FALSE,
    diabetes_tipo_2 BOOL NOT NULL DEFAULT FALSE,
    historial_familiar_cvd BOOL NOT NULL DEFAULT FALSE,
    antipsicoticos_atipicos BOOL NOT NULL DEFAULT FALSE,
    corticosteroides BOOL NOT NULL DEFAULT FALSE,
    migrana BOOL NOT NULL DEFAULT FALSE,
    artritis_reumatoide BOOL NOT NULL DEFAULT FALSE,
    enfermedad_renal_cronica BOOL NOT NULL DEFAULT FALSE,
    enfermedad_mental_grave BOOL NOT NULL DEFAULT FALSE,
    lupus BOOL NOT NULL DEFAULT FALSE,
    disfuncion_erectil BOOL NOT NULL DEFAULT FALSE,
    
    bajon_peso_involuntario BOOL NOT NULL DEFAULT FALSE,

    riesgo_porcentaje DECIMAL(5, 2) NOT NULL,
    
    CONSTRAINT Evaluacion_Riesgo_PK PRIMARY KEY(id),
    CONSTRAINT Evaluacion_Riesgo_FK FOREIGN KEY(expediente_id) 
        REFERENCES Expediente_Clinico(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


use proyecto_integrador_2;

select * from Usuario;
select * from Paciente;
select * from Expediente_Clinico;
select * from Evaluacion_Riesgo; 