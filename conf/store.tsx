﻿declare var require: any

var createStore = require('redux').createStore;
var compose = require('redux').compose;
var combineReducers = require('redux').combineReducers;
var cartReducer = require('../components/ShoppingCar/Reducer').default;
var ecommerceRedurce = require('../components/Ecommerce/Reducer').default;
var fundicionAsignacionReducer = require('../components/Fundicion/Asignaciones/Reducer').default;
var fundicionParticipantesReducer = require('../components/Fundicion/Participantes/Reducer').default;
var fundicionSucursalReducer = require('../components/Fundicion/Sucursal/Reducer').default;
var clientReducer = require('../components/Clients/Reducer').default;
var dashboardReducer = require('../components/Dashboard/Reducer').default;

//const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;

const rootReducer = combineReducers({
    cart: cartReducer,
	ecommerce: ecommerceRedurce,
	asignacion: fundicionAsignacionReducer,
	participantes: fundicionParticipantesReducer,
	sucursal: fundicionSucursalReducer,
	client: clientReducer,
	dashboard: dashboardReducer
});

const store = createStore(
    rootReducer
    //,composeEnhancers
);

export default store;