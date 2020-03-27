const initState = {
    pathnameRedirect: ""
}

const dashboardReducer = (state = initState, action) => {
    switch (action.type) {
        case "UPDATE_GLOBAL_REDIRECT":
            return {
                ...state,
                pathnameRedirect: action.payload
            }
        default:
            return state;
    }
};

export default dashboardReducer;