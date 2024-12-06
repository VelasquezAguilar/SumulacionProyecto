import joblib
import numpy as np
from tensorflow.keras.models import load_model

# Cargar el modelo que se entreno en el otro archivo
modelo = load_model('mi_modelo.keras')

# Cargar el escalador , con el que normalizamos los datos es decir que pudiecen ser interpretados como valores entre 0 y 1 
scaler = joblib.load('escalador.pkl')

# Nueva entrada base (valores generales para las variables adicionales)
nueva_entrada_base = np.array([[12, 1, 0, 0, 0, 1, 30, 1, 1, 178, 0, 1, 18000, 1]])

# Función para ajustar el mes en la entrada
def ajustar_mes(entrada_base, mes):
    entrada_modificada = entrada_base.copy()
    entrada_modificada[0, 0] = mes  # Cambiar el valor del mes (posición 0)
    return entrada_modificada

# Generar predicciones para los meses: actual, anterior, siguiente, etc.
mes_actual = 12
meses_a_predecir = [
    (mes_actual - 2 - 1) % 12 + 1,  # Mes anterior al anterior
    (mes_actual - 1 - 1) % 12 + 1,  # Mes anterior
    mes_actual,                     # Mes actual
    (mes_actual + 1 - 1) % 12 + 1,  # Mes siguiente
    (mes_actual + 2 - 1) % 12 + 1   # Mes siguiente al siguiente
]

# Almacenar las predicciones
predicciones = {}

for mes in meses_a_predecir:
    entrada = ajustar_mes(nueva_entrada_base, mes)
    entrada_normalizada = scaler.transform(entrada)
    prediccion = modelo.predict(entrada_normalizada)
    predicciones[mes] = prediccion[0][0]

# Mostrar resultados
print("Predicciones por mes:")
for mes, valor in predicciones.items():
    print(f"Mes {mes}: Predicción de ingresos {valor}")
