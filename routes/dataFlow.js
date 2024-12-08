import { Router } from "express";
import express from 'express';
import { DataFlow } from "../controllers/dataFlowController.js";
import { allViews}  from "../controllers/dataFlowController.js"

export const dataFlowRouter = Router();
export const allViewsRouter  = Router();

//dataFlowRouter.get('/dataFlow', DataFlow.redirectToBoard);
dataFlowRouter.post('/connect', DataFlow.connection);
dataFlowRouter.post('/tableNames', DataFlow.getTableNames);
dataFlowRouter.post('/connectTable', DataFlow.connectionTable);
allViewsRouter.get('/', allViews.redirectMenu);
//allViewsRouter.get('/', allViews. redirectInicio);
allViewsRouter.get('/formulario', allViews.redirecProyeccion);
allViewsRouter.get('/basesDatos', allViews.redirecBD);
allViewsRouter.get('/ingresos', allViews.redirecIngresos);
allViewsRouter.get('/egresos', allViews.redirecEgresis);
allViewsRouter.get('/neteo', allViews.redirecNeteo);
dataFlowRouter.post('/procesar-datos', DataFlow.procesarDatos);
//dataFlowRouter.post('/guardar-predecir', DataFlow.guardarPredecir);


