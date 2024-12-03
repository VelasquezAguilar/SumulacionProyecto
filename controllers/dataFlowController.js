import { connect } from "../database/connection.js";
import sql from "mssql";
let connectionPool;

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
};

export class allViews {

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
        res.render('egresos');
    }

    static redirecEgresis(req, res) {
        res.render('egresos');
    }

    static redirecNeteo(req, res) {
        res.render('neteo');
    }

}