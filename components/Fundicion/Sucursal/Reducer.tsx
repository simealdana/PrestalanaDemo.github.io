const initState = {
	datosAsignacion: [{
		IDSucursal: "",
		IDFundicion: "",
		Fundidora: "",
		Auditor: "",
		Sucursal: "",
		Region: "",
		Fecha: "",
		Prendas: "",
		CostoPaquete: "",
		PrendasAuditado: "",
		CostoAuditado: "",
		PrendasIncidencia: "",
		CostoIncidencia:"",
	}],
	datosprenda: [{
		IDPrenda:"",
		SKU: "",
		Cartera: "",
		Familia: "",
		SubFamilia: "",
		Marca: "",
		Modelo:"",
		FechaEmpeno: "",
		FechaAlmoneda: "",
		Descripcion: "",
		EstadoConservacion: "",
		Kilataje: "",
		PesoMetal: "",
		PesoAccesorio: "",
		PesoTotal: "",
		CostoMutuo: "",
		PrecioVenta: "",
		Avaluo: "",
		Observaciones: "",
	}],
	tiposdeincidencia: [],
	imagenesprenda: [],
}

const sucursalReducer = (state = initState, action) => {
	switch (action.type) {
		case "UPDATE_DATOS_ASIGNACION":
			return {
				...state,
				datosAsignacion: action.payload
			}
		case "UPDATE_DATOS_PRENDA":
			return {
				...state,
				datosprenda: action.payload
			}
		case "UPDATE_TIPOS_INCIDENCIA":
			return {
				...state,
				tiposdeincidencia: action.payload
			}
		case "UPDATE_IMAGENES_PRENDA":
			return {
				...state,
				imagenesprenda: action.payload
			}
		default:
			return state;
	}
};

export default sucursalReducer;