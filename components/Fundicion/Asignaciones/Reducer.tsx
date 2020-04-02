const initState = {
	asignacion: [{
		Asignacion: 0,
		Sucursal: 0,
		Fecha: null,
		Auditor: 0,
		Fundidora: 0,
		Region: "",
		Estado: "",
	}],
	sucursales: [],
	region: "",
	fundidoras: [],
	auditores: [],
}

const asignacionReducer = (state = initState, action) => {
	switch (action.type) {
		case "UPDATE_SUCURSALES":
			return {
				...state,
				sucursales: action.payload
			}
		case "UPDATE_REGION":
			return {
				...state,
				region: action.payload
			}
		case "UPDATE_FUNDIDORAS":
			return {
				...state,
				fundidoras: action.payload
			}
		case "UPDATE_AUDITORES":
			return {
				...state,
				auditores: action.payload
			}
		case "UPDATE_ASIGNACION":
			return {
				...state,
				asignacion: action.payload
			}
		default:
			return state;
	}
};

export default asignacionReducer;