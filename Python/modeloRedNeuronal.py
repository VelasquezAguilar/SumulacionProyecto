import pyodbc

# Parámetros de conexión
server = 'DESKTOP-LODVA2B\\LOCALHOST'        # Ejemplo: 'localhost' o '192.168.1.1'
database = 'VENTAS' # Ejemplo: 'VentasDB'
username = 'sa'       # Usuario de la base de datos
password = '1234'    # Contraseña de la base de datos

# Cadena de conexión
connection_string = (
    'Driver={SQL Server};'
    f'Server={server};'
    f'Database={database};'
    f'UID={username};'
    f'PWD={password};'
)

# Conectar a la base de datos
try:
    conn = pyodbc.connect(connection_string)
    print("Conexión exitosa a la base de datos")
    # Cerrar la conexión
    conn.close()
except pyodbc.Error as e:
    print("Error al conectar a la base de datos:", e)
# Conectar a la base de datos
import pandas as pd
conn = pyodbc.connect(connection_string)

# Consulta SQL para extraer datos y calcular el mes y el poder adquisitivo
query = """
SELECT 
    MONTH(Fecha) AS Mes,
    ProductoID,
    CantidadVendida,
    PrecioUnitario,
    DescuentoAplicado,
    PublicidadRealizada,
    Competidores,
    EdadSegmento,
    GeneroSegmento,
    v.PaisID,
    GarantiaAplicada,
    MedioDistribucion,
    TipoVenta,
    p.PoderAdquisitivo,  -- Obtener de la tabla Paises
    IngresosGenerados
FROM 
    VentasNormalizadas v
JOIN 
    Paises p ON v.PaisID = p.PaisID;
"""

# Ejecutar la consulta y cargar los datos en un DataFrame de pandas
data = pd.read_sql(query, conn)

# Cerrar la conexión
conn.close()

# Mostrar las primeras filas del DataFrame
print(data.head())


from sklearn.preprocessing import MinMaxScaler

# Seleccionar las columnas de entrada (X)
input_columns = [
'Mes','ProductoID',  'PrecioUnitario', 'DescuentoAplicado', 
    'PublicidadRealizada', 'Competidores', 'EdadSegmento', 'GeneroSegmento', 
    'PaisID', 'GarantiaAplicada', 'MedioDistribucion', 'PoderAdquisitivo',  'TipoVenta'
]  #se elimno  ,'CantidadVendida'

# Instanciar el scaler
scaler = MinMaxScaler()

# Aplicar la normalización a las columnas seleccionadas
data[input_columns] = scaler.fit_transform(data[input_columns])

# Ver los primeros registros normalizados
print(data.head())


# Separar las columnas de entrada (X) y la columna objetivo (Y)
X = data[input_columns]  # Variables de entrada
Y = data['IngresosGenerados']  # Variable a predecir


#comstruccion de la red neuronal 
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Definir la arquitectura de la red neuronal
modelo = Sequential([
    Dense(128, activation='relu', input_shape=(X.shape[1],)),  # Primera capa oculta con 128 neuronas
    Dense(64, activation='relu'),                              # Segunda capa oculta con 64 neuronas
    Dense(32, activation='relu'),                              # Tercera capa oculta con 32 neuronas
    Dense(1)                                                   # Capa de salida para regresión
])

# Compilar el modelo
modelo.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

# Mostrar resumen del modelo
modelo.summary()

# Entrenar el modelo
historial = modelo.fit(X, Y, epochs=50, batch_size=32, validation_split=0.2)


# Guardar el modelo entrenado
modelo.save('mi_modelo.keras')

import joblib
joblib.dump(scaler, 'escalador.pkl')

#ver ver
import matplotlib.pyplot as plt

# Graficar la pérdida durante el entrenamiento
plt.plot(historial.history['loss'], label='Pérdida en entrenamiento')
plt.plot(historial.history['val_loss'], label='Pérdida en validación')
plt.xlabel('Épocas')
plt.ylabel('Pérdida')
plt.legend()
plt.show()

