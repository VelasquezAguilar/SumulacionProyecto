CREATE TABLE VentasNormalizadas (
    ID_Venta INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATE NOT NULL,
    ProductoID INT NOT NULL,
    CantidadVendida INT NOT NULL,
    Anio INT NOT NULL,
    IngresosGenerados DECIMAL(10,2) NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    DescuentoAplicado BIT NOT NULL,          -- 0 = No, 1 = Sí
    PublicidadRealizada BIT NOT NULL,        -- 0 = No, 1 = Sí
    Competidores BIT NOT NULL,               -- 0 = No, 1 = Sí
    EdadSegmento INT NOT NULL,
    GeneroSegmento INT NOT NULL,             -- 0 = Masculino, 1 = Femenino, 2 = General
    PaisID INT NOT NULL,
    GarantiaAplicada BIT NOT NULL,           -- 0 = No, 1 = Sí
    MedioDistribucion INT NOT NULL,          -- 0 = Tienda Física, 1 = Online
    TipoVenta INT NOT NULL,                  -- 0 = Consumidor final, 1 = Mayorista
    PoderAdquisitivo DECIMAL(10,2) NOT NULL  -- PIB per cápita del país
);

-- Crear una tabla de productos para normalización
CREATE TABLE Productos (
    ProductoID INT PRIMARY KEY IDENTITY(1,1),
    NombreProducto VARCHAR(100) UNIQUE NOT NULL
);

-- Crear una tabla de países para normalización
CREATE TABLE Paises (
    PaisID INT PRIMARY KEY IDENTITY(1,1),
    NombrePais VARCHAR(100) UNIQUE NOT NULL
);

-- Crear una tabla de géneros para normalización
CREATE TABLE Generos (
    GeneroID INT PRIMARY KEY,
    DescripcionGenero VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar datos base en la tabla de géneros
INSERT INTO Generos (GeneroID, DescripcionGenero) VALUES
(0, 'Masculino'),
(1, 'Femenino'),
(2, 'General');


-- Modificación de la tabla Paises para agregar PIB y poder adquisitivo
ALTER TABLE Paises
ADD PIB DECIMAL(15,2) NOT NULL,
    PoderAdquisitivo DECIMAL(10,2) NOT NULL;

-- Crear tabla para DescuentoAplicado
CREATE TABLE DescuentoAplicado (
    DescuentoID INT PRIMARY KEY,
    Descripcion VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO DescuentoAplicado (DescuentoID, Descripcion) VALUES
(0, 'No Aplicado'),
(1, 'Aplicado');

-- Crear tabla para PublicidadRealizada
CREATE TABLE PublicidadRealizada (
    PublicidadID INT PRIMARY KEY,
    Descripcion VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO PublicidadRealizada (PublicidadID, Descripcion) VALUES
(0, 'No Realizada'),
(1, 'Realizada');

-- Crear tabla para Competidores
CREATE TABLE Competidores (
    CompetidorID INT PRIMARY KEY,
    Descripcion VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO Competidores (CompetidorID, Descripcion) VALUES
(0, 'Sin Competencia'),
(1, 'Con Competencia');

-- Crear tabla para GarantiaAplicada
CREATE TABLE GarantiaAplicada (
    GarantiaID INT PRIMARY KEY,
    Descripcion VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO GarantiaAplicada (GarantiaID, Descripcion) VALUES
(0, 'No Aplicada'),
(1, 'Aplicada');

-- Crear tabla para MedioDistribucion
CREATE TABLE MedioDistribucion (
    MedioID INT PRIMARY KEY,
    Descripcion VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO MedioDistribucion (MedioID, Descripcion) VALUES
(0, 'Tienda Física'),
(1, 'Online');

-- Crear tabla para TipoVenta
CREATE TABLE TipoVenta (
    TipoVentaID INT PRIMARY KEY,
    Descripcion VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO TipoVenta (TipoVentaID, Descripcion) VALUES
(0, 'Consumidor Final'),
(1, 'Mayorista');
