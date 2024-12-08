import json
import joblib
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


from tensorflow.keras.models import load_model

# Función para cargar datos desde un archivo JSON
def cargar_datos_json(ruta_archivo):
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
            return json.load(archivo)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error al cargar el archivo JSON: {e}")
        return None

# Función para guardar predicciones en un archivo JSON
def guardar_predicciones_json(ruta_archivo, predicciones):
    try:
        # Convertir los valores a tipo `float` para serialización
        predicciones_convertidas = {str(k): float(v) for k, v in predicciones.items()}
        with open(ruta_archivo, 'w', encoding='utf-8') as archivo:
            json.dump(predicciones_convertidas, archivo, ensure_ascii=False, indent=4)
        print(f"Predicciones guardadas en {ruta_archivo}")
    except Exception as e:
        print(f"Error al guardar predicciones en JSON: {e}")

# Función para realizar predicciones basadas en el modelo y datos JSON
def realizar_predicciones(ruta_json, modelo_path, scaler_path, ruta_salida_json):
    # Cargar datos del JSON
    datos_json = cargar_datos_json(ruta_json)
    if not datos_json:
        return "No se encontraron datos en el archivo JSON."

    # Asignar valores desde el JSON
    mes = datos_json.get('mes', 0)
    producto = datos_json.get('producto', 0)
    precio = datos_json.get('precio', 0)
    tipo_venta = datos_json.get('tipoVenta', 0)
    publicidad = datos_json.get('publicidad', 0)
    garantia = datos_json.get('garantia', 0)
    descuento = datos_json.get('descuento', 0)
    edad_media = datos_json.get('edadMedia', 0)
    genero_segmento = datos_json.get('generoSegmento', 0)
    pais = datos_json.get('pais', 0)
    puntos_venta = datos_json.get('puntosVenta', 0)
    canales = datos_json.get('canales', 0)

    # Base de entrada
    nueva_entrada_base = np.array([[mes, producto, precio, descuento, publicidad, puntos_venta,
                                    edad_media, genero_segmento, pais, garantia, canales, 887, tipo_venta]])

    # Cargar el modelo y el escalador
    modelo = load_model(modelo_path)
    scaler = joblib.load(scaler_path)

    # Ajustar la entrada para un mes específico
    def ajustar_mes(entrada_base, mes):
        entrada_modificada = entrada_base.copy()
        entrada_modificada[0, 0] = mes
        return entrada_modificada

    # Generar predicciones para los meses seleccionados
    meses_a_predecir = [
        (mes - 2 - 1) % 12 + 1,  # Mes anterior al anterior
        (mes - 1 - 1) % 12 + 1,  # Mes anterior
        mes,                     # Mes actual
        (mes + 1 - 1) % 12 + 1,  # Mes siguiente
        (mes + 2 - 1) % 12 + 1   # Mes siguiente al siguiente
    ]

    # Almacenar las predicciones
    predicciones = {}
    for mes_a_predecir in meses_a_predecir:
        entrada = ajustar_mes(nueva_entrada_base, mes_a_predecir)
        entrada_normalizada = scaler.transform(entrada)
        prediccion = modelo.predict(entrada_normalizada)
        predicciones[mes_a_predecir] = prediccion[0][0]  # np.float32

        # Imprimir el resultado de la predicción
        print(f"Mes {mes_a_predecir}: Predicción de ingresos {float(prediccion[0][0])}")

    # Guardar las predicciones en el archivo JSON
    guardar_predicciones_json(ruta_salida_json, predicciones)

    return predicciones

# Rutas de los archivos necesarios
ruta_json = 'D:/Downloads-NUEVO/Proyecto_teoria_de_la_simulacion/json/datosFormulario.json'
modelo_path = 'mi_modelo.keras'
scaler_path = 'escalador.pkl'
ruta_salida_json = 'D:/Downloads-NUEVO/Proyecto_teoria_de_la_simulacion/json/PrediccionesRealizadas.json'

# Ejecutar la función y obtener resultados
resultados = realizar_predicciones(ruta_json, modelo_path, scaler_path, ruta_salida_json)

# Confirmación
print("Resultados finales:", resultados)