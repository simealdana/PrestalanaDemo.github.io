const initState = {
	participantes: [],
}

const participantesReducer = (state = initState, action) => {
	switch (action.type) {
		case "UPDATE_PARTICIPANTES":
			return {
				...state,
				participantes: action.payload
			}
		default:
			return state;
	}
};

export default participantesReducer;