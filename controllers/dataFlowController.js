import { connect } from "../database/connection.js";
import sql from "mssql";
//import { spawn } from 'child_process';
let connectionPool;
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';


export class DataFlow {

    // Formatear los metadatos de las tablas
    static format_metadata(recordset) {
        let formattedData = { source: {} };
        recordset.forEach(register => {
            formattedData.source[register.columnName] = {
                dataType: register.dataType,
                length: register.length,
                precision: register.precision
            }
        });
        return formattedData;
    }

    // Obtener metadatos de una tabla
    static async getTableMetadata(tableName) {
        try {
            let result = await connectionPool.request().query(`
                SELECT COLUMN_NAME AS columnName,
                    DATA_TYPE AS dataType, 
                    CHARACTER_MAXIMUM_LENGTH AS length, 
                    NUMERIC_PRECISION AS precision 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME='${tableName}';`
            );
            let formattedData = this.format_metadata(result.recordset);
            return formattedData;
        } catch (error) {
            console.log("Error al obtener metadatos: ", error);
        }
    }



    // Método para establecer la conexión con la base de datos
    static async connection(req, res) {
        try {
            const { server, dataBase, user, password } = req.body;

            if (!connectionPool) {
                // Establecer la conexión con la base de datos utilizando los parámetros
                const pool = await connect(user, password, server, dataBase);
                connectionPool = pool; // Guardar la conexión en connectionPool
                //console.log("coneccion es entonces :", message)

                res.status(200).json({ message: 'Conexión establecida con éxito' });
            }
        } catch (error) {
            console.log("Error de conexión: ", error);
            res.status(400).json({ message: 'Sucedió un error durante la conexión' });
        }
    }




    //Metod para obtener la estrucututra de la tabla seleccionada 
    // Método para establecer la conexión con la base de datos
    static async connectionTable(req, res) {
        try {
            const { server, dataBase, user, password } = req.body;

            if (!connectionPool) {
                // Establecer la conexión con la base de datos utilizando los parámetros
                const pool = await connect(user, password, server, dataBase);
                connectionPool = pool; // Guardar la conexión en connectionPool
                //console.log("coneccion es entonces :", message)
                table = localStorage.getItem("selectedTable");
                var queryResult;

                queryResult = await DataFlow.getTableMetadata(table);
                res.status(200).json({ message: `Informacion de la tabla ${table}`, testQueryResult: queryResult });
                res.status(200).json({ message: 'Conexión establecida con éxito' });
            }
        } catch (error) {
            console.log("Error de conexión: ", error);
            res.status(400).json({ message: 'Sucedió un error durante la conexión' });
        }
    }




    // Obtener los nombres de las tablas después de que la conexión esté establecida
    static async getTableNames(req, res) {
        try {

            console.log("Verificando conexión...", connectionPool);
            // Primero, asegurémonos de que la conexión esté abierta
            console.log("Verificando conexión...", connectionPool);

            // Si ya hay una conexión establecida en connectionPool, no es necesario reconectar
            if (!connectionPool) {
                return res.status(400).json({ message: 'No se ha establecido conexión con la base de datos' });
            }


            var queryResult = await connectionPool.request().query(`
                SELECT table_name 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE table_type = 'BASE TABLE' AND table_name != 'sysdiagrams';`
            );


            // Enviar los resultados de las tablas al frontend
            res.status(200).json({
                message: 'Se obtuvieron las tablas de la base de datos',
                recordset: queryResult.recordset
            });

        } catch (error) {
            console.log("Error al obtener las tablas: ", error);
            res.status(400).json({ message: 'No se pudieron obtener las tablas' });
        }
    }


    //Metodo para procesar los datos del  fromualrio ose obtenerlos ya procesados 
    static procesarDatos = (req, res) => {
        const datos = req.body;
    
        // Validar que se recibieron los datos
        if (!datos || Object.keys(datos).length === 0) {
            return res.status(400).json({ error: 'No se recibieron datos' });
        }
    
        console.log("Datos recibidos del frontend:", datos);
    
        // Obtener la ruta del directorio actual
        const __dirname = path.resolve();
    
        // Obtener la ruta absoluta del archivo JSON
        const filePath = path.join(__dirname, 'json', 'datosFormulario.json');
    
        // Sobrescribir el archivo con los nuevos datos
        fs.writeFile(filePath, JSON.stringify(datos, null, 2), (err) => {
            if (err) {
                console.error("Error al guardar los datos:", err);
                return res.status(500).json({ error: 'Error al guardar los datos en el archivo JSON' });
            }
    
             // Ejecutar el script Python para hacer las predicciones
         exec('python Python/PredecirVentas.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error ejecutando el script Python: ${error.message}`);
                return res.status(500).json({ success: false, message: 'Error al ejecutar el script' });
            }

            if (stderr) {
                console.error(`Stderr del script Python: ${stderr}`);
                return res.status(500).json({ success: false, message: 'Error en el script Python' });
            }

            console.log(`Salida del script Python: ${stdout}`);
             
             // Redirigir al usuario a la nueva ruta
            
            // Después de ejecutar el script, devolver una respuesta de éxito
            res.status(200).json({ success: true, redirectTo: '/ingresos' });
            
            // Responder con éxito
           // res.status(200).json({ mensaje: "Datos sobrescritos correctamente en el archivo JSON" });
        });
        });


        
    };



    //Metodo para ejecutar el archivo python para hacer la prediccion 
    static ingresoPrediciendo = (req, res) => {
        // Ejecutar el archivo Python
        exec('python3 PredecirVentas.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error ejecutando Python: ${error.message}`);
                return res.status(500).send('Error al ejecutar el script');
            }
    
            if (stderr) {
                console.error(`Stderr de Python: ${stderr}`);
                return res.status(500).send('Error al ejecutar el script');
            }
    
            console.log(`Salida de Python: ${stdout}`);
    
            // Redirigir al usuario a la nueva ruta
            res.redirect('http://localhost:3030/ingresos');
        });
    
    };


};


export class allViews {
    static redirectMenu(req, res) {
        res.render('menu');
    }
    static redirectInicio(req, res) {
        res.render('inicio');
    }

    static redirecProyeccion(req, res) {
        res.render('formularios');
    }

    static redirecBD(resq, res) {
        res.render('basesDatos');
    }
    static redirecIngresos(req, res) {
        res.render('ingresos');
    }

    static redirecEgresis(req, res) {
        res.render('egresos');
    }

    static redirecNeteo(req, res) {
        res.render('neteo');
    }

}