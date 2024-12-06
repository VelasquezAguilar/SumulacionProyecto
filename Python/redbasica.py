import tensorflow as tf
import numpy as np


celcius =np.array([-40, -10, 0, 8, 15, 22, 38], dtype=float)
faren = np.array([-40, 14, 32, 46, 59, 72, 100], dtype= float)


#Las capas desas son las que tiene todas las conexiones desde cada neurona hacia todas las neuronas de la siguiente capa 
capa = tf.keras.layers.Dense(units = 1 , input_shape= [1])           #las unidades o neuronas de  la capa y la capa de salida solo tiene una neurona  , impot_shape son las neuronas de entrada  
modelo = tf.keras.Sequential([capa])                               

modelo.compile(                                  #para aque el modelopueda ser entrenado 
    optimizer = tf.keras.optimizers.Adam(0.1),        #el algoritmo adams es el que le dice como cambiar los pesos y los segos para lograr los resultados  y aprenda 
    loss='mean_squared_error'                       #una poca catidad de errores grandes es peor que que una gran cantidad de erores pequeños 

)

print('comnzando entrenamiento .....')
entrenando = modelo.fit(celcius , faren, epochs=1000, verbose = False )  #iidcamos el arreglo de entradas y el arreglo de salida ademas de lacitade de veces que intentara encontrear esos redultados 
print('entrenamiento terminado')


# esto es para ver los resultados de perdia, es decir que tanto acertaba la funccion la red  desde la primera vuleta a la ultima 
import matplotlib.pyplot as plt
plt.xlabel("# epoca")
plt.ylabel("magnitud de perida")
plt.plot(entrenando.history["loss"])


print("Haciendo una prediccion")
resultado =modelo.predict([100.0])
print("El resultado es : " + str(resultado) + " farenhait")