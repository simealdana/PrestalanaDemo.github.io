const initState = {
    client: [{
        ProfileImage: "",
        Audit_FechaInsert: "",
        FechaNacimiento: "",
        Sexo: "",
        IDNacionalidad: "",
        IDEntidad: "",
        IDEstadoCivil: "",
        ClaveRFC: "",
        ClaveCURP: "",
        Direccion: "",
        NumExterior: "",
        NumInterior: "",
        ENTIDADNACIMIENTO: "",
        IDCiudad: "",
        IDMunicipio: "",
        IDColonia: "",
        CodigoPostal: "",
        IdActividadEconomica: "",
        ActividadEconimica: "",
        Email: "",
        TelefonoMovil: "",
        OtroTelefonoMovil: "",
        TelefonoParticular: "",
        TelefonoTrabajo: "",
        Notas: "",
        IDTipoIdentificacion: "",
        ComoSeEntero: "",
        DatosParaMercadeo: false,
        DeseaSerClienteReferenciador: false,
        UltimoUsuarioEnAtenderlo: ""

    }],
    isEdit: false,
    fingerPrints: {},
    vauchers: {},
    coOwners: [],
    itentificationTypes: [],
    entities: [],
    civilStatus: [],
    cities: [],
    colonies: [],
    municipies: [],
    documentAdressProofList: [],
    documentAdressProofClient: [],
    filterClients: null,
    nationalities: [],
    beneficiaries: [],
    economicActivity: [],
    clientTypes: [],
}

const clientReducer = (state = initState, action) => {
    switch (action.type) {
        case "UPDATE_CLIENT_TYPES":
            return {
                ...state,
                clientTypes: action.payload
            }
        case "UPDATE_ECONIMIC_ACTIVITY":
            return {
                ...state,
                economicActivity: action.payload
            }
        case "UPDATE_BENEFICIARIES":
            return {
                ...state,
                beneficiaries: action.payload
            }
        case "UPDATE_CLIENT":
            return {
                ...state,
                client: action.payload
            }
        case "UPDATE_FINGER_PRINT":
            return {
                ...state,
                fingetPrints: action.payload
            }
        case "UPDATE_VAUCHERS":
            return {
                ...state,
                vauchers: action.payload
            }
        case "UPDATE_COOWNERS":
            return {
                ...state,
                coOwners: action.payload
            }
        case "UPDATE_IDENTIFICATION_TYPES":
            return {
                ...state,
                itentificationTypes: action.payload
            }
        case "UPDATE_CIVIL_STATUS":
            return {
                ...state,
                civilStatus: action.payload
            }
        case "UPDATE_ENTITIES":
            return {
                ...state,
                entities: action.payload
            }
        case "UPDATE_CITIES":
            return {
                ...state,
                cities: action.payload
            }
        case "UPDATE_COLONIES":
            return {
                ...state,
                colonies: action.payload
            }
        case "UPDATE_MUNICIPIES":
            return {
                ...state,
                municipies: action.payload
            }
        case "UPDATE_DOCUMENTS_ADDRESS_PROOF":
            return {
                ...state,
                documentAdressProofList: action.payload
            }
        case "UPDATE_DOCUMENTS_ADDRESS_PROOF_CLIENT":
            return {
                ...state,
                documentAdressProofClient: action.payload
            }
        case "UPDATE_IS_EDIT":
            return {
                ...state,
                isEdit: action.payload
            }
        case "CLIENTS_FILTERED":
            return {
                ...state,
                filterClients: action.payload
            }
        case "UPDATE_NATIONALITIES":
            return {
                ...state,
                nationalities: action.payload
            }
        default:
            return state;
    }
};

export default clientReducer;
