import json
import joblib
import numpy as np
from tensorflow.keras.models import load_model

# Función para cargar datos desde un archivo JSON
def cargar_datos_json(ruta_archivo):
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
            datos = json.load(archivo)
        return datos
    except FileNotFoundError:
        print(f"El archivo JSON en {ruta_archivo} no se encontró.")
        return []
    except json.JSONDecodeError:
        print(f"Error al decodificar el archivo JSON en {ruta_archivo}.")
        return []

# Ruta del archivo JSON
ruta_json = 'D:/Downloads-NUEVO/Proyecto_teoria_de_la_simulacion/json/datosFormulario.json'

# Cargar datos del JSON
datos_json = cargar_datos_json(ruta_json)

# Verificar si se cargaron datos
if not datos_json:
    print("No se encontraron datos en el archivo JSON.")
else:
    print(f"Datos cargados del archivo JSON: {datos_json}")
    
    
#/////////////////////////////////////////////////
for dato in datos_json:
    # Asignar valores del JSON a variables
    mes = dato.get('mes', 0)
    producto = dato.get('producto', 0)
    precio = dato.get('precio', 0)
    tipo_venta = dato.get('tipoVenta', 0)
    publicidad = dato.get('publicidad', 0)
    garantia = dato.get('garantia', 0)
    descuento = dato.get('descuento', 0)
    edad_media = dato.get('edadMedia', 0)
    genero_segmento = dato.get('generoSegmento', 0)
    pais = dato.get('pais', 0)
    puntos_venta = dato.get('puntosVenta', 0)
    canales = dato.get('canales', 0)

    # Imprimir las variables para verificar
    print(f"""
    Mes: {mes}
    Producto: {producto}
    Precio: {precio}
    Tipo de Venta: {tipo_venta}
    Publicidad: {publicidad}
    Garantía: {garantia}
    Descuento: {descuento}
    Edad Media: {edad_media}
    Género Segmento: {genero_segmento}
    País: {pais}
    Puntos de Venta: {puntos_venta}
    Canales: {canales}
    """)
    
    nueva_entrada_base = np.array([[mes, producto, precio, descuento, publicidad, puntos_venta,
                               edad_media, genero_segmento, pais, garantia, canales, 0, tipo_venta, 1]])
    
    
      #print("Nueva entrada para el modelo:", nueva_entrada_base)

# Cargar el modelo y el escalador
modelo = load_model('mi_modelo.keras')
scaler = joblib.load('escalador.pkl')

# Nueva entrada base (valores generales para las variables adicionales)
##nueva_entrada_base = np.array([[12, 1, 0, 0, 0, 1, 30, 1, 1, 178, 0, 1, 18000, 1]])
 
 

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

# Opcional: usar datos del JSON para enriquecer las predicciones
for dato in datos_json:
    # Ejemplo: incorporar datos del JSON en las predicciones
    print(f"Usando dato adicional del JSON: {dato}")





