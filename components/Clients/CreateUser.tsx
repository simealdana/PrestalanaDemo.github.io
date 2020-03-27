declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var resources = require('./../../Resources');
var scriptClient = require('./Scripts/Script');
var Input = require('muicss/lib/react/input');
var uuidv1 = require('uuid/v1');
var Webcam = require('react-webcam');
var axios = require('axios');
var Redirect = require('react-router-dom').Redirect;
var cloneDeep = require('lodash.clonedeep');
const load = "images/loading.gif";

class CreateClient extends React.Component {
    state = {
        redirect: false,
        idClient: "", //"D6D5EE1E-C748-41FE-B74B-03B5E872744D",
        idFolder: "",// "66237",
        idRowDocument: "",
        step: 1,
        objectImage: null,
        showModal: false,
        disable: false,
        registerDate: "",
        identificationType: 0,
        identificationNumber: "",
        clientName: null,
        clientFirstLastName: null,
        clientSecondLastName: null,
        gender: "-",
        dateOfBirth: null,
        age: null,
        nacionality: "-",
        stateOfBirth: "-",
        maritalStatus:"-",
        rfc: null,
        curp: null,
        address: null,
        outdoorNumber: null,
        interiorNumber: null,
        state: "-",
        city: "-",
        municipe: "-",
        colony: "-",
        postalCode: null,
        economicActivity: "-",
        email: null,
        movil: null,
        otherMovil: null,
        housePhone: null,
        workPhone: null,
        otherPhone: null,
        notes: null,
        howDidYouFindoutAboutUs: null,
        lastUserWhoAttendedYou: null,
        referralClientSi: true,
        referralClientNo: false,
        dataForMarketingSi: true,
        dataForMarketingNo: false,
        imageProfile: null,
        //documents
        beginningOfValidity: null,
        endOfValidity: null,
        documentType: "-",
        selectedFiles: [],
        pothos: [],
        //coowner
        coownerName: null,
        coownerLastname: null,
        coownerSecondLastname: null,
        coownerType: "-",
        coownerLabelType: null,
        coownerNacionality: "-",
        coownerLabelNacionality: null,
        coownerPhone: null,
        coownersList: [],
        beneficiariesList:[]
    }

    renderRedirect = () => {
        const { pathnameRedirect } = this.props;
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: pathnameRedirect
                    }}
                />
            );
        }      
    }

    setImageZoom = image => {
        scriptClient.zoom(image);
    };

    calculateAge(birthday) {
        var birthday_arr = birthday.split("-");
        var today_date = new Date();
        var today_year = today_date.getFullYear();
        var today_month = today_date.getMonth();
        var today_day = today_date.getDate();
        var age = today_year - birthday_arr[0];

        if (today_month < (birthday_arr[1] - 1)) {
            age--;
        }
        if (((birthday_arr[1] - 1) == today_month) && (today_day < birthday_arr[2])) {
            age--;
        }

        return age;
    }

    componentDidMount() {
        scriptClient.openModal();
        scriptClient.handleCityDropdownView(true);
        scriptClient.handleMunicipeDropdownView(true);
        scriptClient.handleColonyDropdownView(true);
        scriptClient.handlePostalCodeView(true);
        scriptClient.handleHideAge();
        const { clientSelected } = this.props;
        this.handleGetIdentificationTypes();
        this.handleGetCivilStatus();
        this.handleGetCities();
        this.handleGetEntities();
        this.handleGetDocumentAdressProof();
        this.handleNationality();
        this.handleEconomicActivity();
        this.handleGetClientTypes();
        if (clientSelected !== undefined) {
            if (clientSelected.IDCliente !== undefined) {
                this.setState({ 'disable': true }, () => {
                    this.handleGetClientInformation(clientSelected.IDCliente);
                    this.handleGetDocumentAddressProofClient(clientSelected.IDCliente);
                    this.handleGetCoOwner(clientSelected.IDCliente);
                    this.handleBeneficiary(clientSelected.IDCliente);
                })
            }
        }
    }

    componentDidUpdate() {
        const { step } = this.state;
        scriptClient.openModal();

        if (step === 1) {
            scriptClient.handleChangeTab('home-tab', 'documents-tab');
            scriptClient.handleChangeTab('home-tab', 'coowners-tab');
            scriptClient.handleShow('cliente_1');
        } else if (step == 2) {
            scriptClient.handleChangeTab('documents-tab', 'home-tab');
            scriptClient.handleShow('cliente_3', 'cliente_1');
        } else if (step == 3) {
            scriptClient.handleChangeTab('coowners-tab', 'documents-tab');
            scriptClient.handleShow('cliente_4', 'cliente_3');
        }
        
    }

    handleUpload(e) {
        let images = [];
        let objImage = {
            id: 0,
            image: null,
            documentTypeLabel: "",
            documentTypeId: 0,
            endOfValidity: "",
            beginningOfValidity: "",
            status: ""
        };

        const { selectedFiles } = this.state;
        e.preventDefault();
        var element = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(element);
        reader.onloadend = function () {

            var documentType = document.getElementById('documentType') as HTMLInputElement;
            var beginningOfValidity = document.getElementById('beginningOfValidity') as HTMLInputElement;
            var endOfValidity = document.getElementById('endOfValidity') as HTMLInputElement;
            var beginningOfValidity = document.getElementById('beginningOfValidity') as HTMLInputElement;

            var GivenDate = endOfValidity.value;
            var CurrentDate = new Date();
            var DateGivenDate = new Date(GivenDate);

            selectedFiles.map(image => {
                images.push(image);
            });
            objImage.id = images.length === 0 ? 0 : images[images.length - 1].id + 1;
            objImage.image = reader.result;
            objImage.documentTypeLabel = this.props.documentAdressProofList.find(document => document.IDTipoDocumento === Number(documentType.value)).Descripcion;
            objImage.documentTypeId = Number(documentType.value);
            objImage.endOfValidity = endOfValidity.value;
            objImage.beginningOfValidity = beginningOfValidity.value;
            objImage.status = DateGivenDate > CurrentDate? "Fundido": "No Fundido"

            images.push(objImage);
            this.setState({ selectedFiles: images }, function () {
                documentType.value = "-";
                beginningOfValidity.value = "";
                endOfValidity.value = "";
            });
            }.bind(this);
    }

    handleMunicipes() {
        const { updateMunicipies, client } = this.props;

        var idEntidad = client[0].IDEntidad === "" ? this.state.state : client[0].IDEntidad;
        var idCiudad = client[0].IDCiudad === "" ? this.state.city : client[0].IDCiudad;

        if (client != null) {
            fetch(resources.WebApiGoldenStart + "Municipality/Municipalities?idEntidad=" + idEntidad + "&idCiudad=" + idCiudad,
                {
                    mode: 'cors',
                    method: "GET",
                    headers: new Headers({
                        'Accept': 'application/json'
                    })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('BAD HTTP stuff');
                    }
                }).then(response => {
                    updateMunicipies(response)
                    this.setState({ ['municipe']: response[0].IDMunicipio }, function () {
                        this.handleGetColony();
                    });
                })
                .catch((err) => {
                    console.log('Error', err.message);
                });
        }
    }

    handleGetColony() {
        const { updateColonies, client } = this.props;
        scriptClient.handleSpinner(true);

        var idEntidad = client[0].IDEntidad === "" ? this.state.state : client[0].IDEntidad;
        var idCiudad = client[0].IDCiudad === "" ? this.state.city : client[0].IDCiudad;
        var idMunicipe = client[0].IDMunicipio === "" ? this.state.municipe : client[0].IDMunicipio;

        if (client != null) {
            fetch(resources.WebApiGoldenStart + "Colony/Colonies?idEntidad=" + idEntidad + "&idCiudad=" + idCiudad + "&IDMunicipio=" + idMunicipe,
                {
                    mode: 'cors',
                    method: "GET",
                    headers: new Headers({
                        'Accept': 'application/json'
                    })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('BAD HTTP stuff');
                    }
                }).then(response => {
                    updateColonies(response);
                    scriptClient.handleSpinner(false);
                })
                .catch((err) => {
                    console.log('Error', err.message);
                    scriptClient.handleSpinner(false);
                });
        }
    }

    handleGetCities() {
        const { updateCities } = this.props;
        fetch(resources.WebApiGoldenStart + "City/Cities",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateCities(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetClientTypes() {
        const { updateClientTypes } = this.props;
        fetch(resources.WebApiGoldenStart + "ClientTypes/GetClienTypes",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateClientTypes(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleEconomicActivity() {
        const { updateEconomicActivity } = this.props;
        fetch(resources.WebApiGoldenStart + "EconomicActivity/EconomicActivity",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateEconomicActivity(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetCivilStatus() {
        const { updateCivilStatus } = this.props;
        fetch(resources.WebApiGoldenStart + "CivilStatus/CivilStatus",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateCivilStatus(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetEntities() {
        const { updateEntities } = this.props;
        fetch(resources.WebApiGoldenStart + "Entitiy/Entities",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateEntities(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetIdentificationTypes() {
        const { updateIdentificationTypes } = this.props;
        fetch(resources.WebApiGoldenStart + "IdentificationsTypes/IdentificationTypes",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateIdentificationTypes(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetClientInformation(clientId) {
        const { updateUpdateClient } = this.props;
        fetch(resources.WebApiGoldenStart + "Client/FindClientById?IdClient=" + clientId,
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateUpdateClient(response);
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetDocumentAdressProof() {
        const { updateDocumentAdressProofList } = this.props;
        fetch(resources.WebApiGoldenStart + "TypeDocuments/TypeDocumentsByCategory?idCategoria=30",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateDocumentAdressProofList(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetDocumentAddressProofClient(clientId) {
        const { updateDocumentAddressProofClient } = this.props;

        fetch(resources.WebApiGoldenStart + "ProofAddress/GetProofAddressByClient?idClient=" + clientId,
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateDocumentAddressProofClient (response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleGetCoOwner(clientId) {
        const { updateCoOwner } = this.props;
        fetch(resources.WebApiGoldenStart + "Cotitular/ObtenerCotutularesCliente?IdCliente=" + clientId,
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateCoOwner(response);
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleSaveClientInfo() {
        scriptClient.handleSpinner(true);
        fetch(resources.WebApiGoldenStart + "Client/CreateCliente",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify({
                    "IdUsuarioCreaClient": resources.idUsuerInsert,
                    "Audit_FechaInsert": this.state.registerDate,
                    "Identificaciones": [{
                        "IDTipoIdentificacion": this.state.identificationType,
                        "NumIdentificacion": this.state.identificationNumber,
                        "Estatus": 1,
                        "Actualizar": 1
                    }],
                    "Nombres": this.state.clientName,
                    "ApellidoMaterno": this.state.clientSecondLastName ,
                    "ApellidoPaterno": this.state.clientFirstLastName,
                    "FechaNacimiento": this.state.dateOfBirth,
                    "Sexo": this.state.gender,
                    "IDNacionalidad": this.state.nacionality,
                    "IDEntidadNacimiento": this.state.stateOfBirth,
                    "IDEstadoCivil": this.state.maritalStatus,
                    "ClaveRFC": this.state.rfc,
                    "ClaveCURP": this.state.curp,
                    "Direccion": this.state.address,
                    "NumExterior": this.state.outdoorNumber,
                    "NumInterior": this.state.interiorNumber,
                    "IDEntidad": this.state.state,
                    "IDCiudad": this.state.city,
                    "IDMunicipio": this.state.municipe,
                    "IDColonia": this.state.colony,
                    "IdActividadEconomica": this.state.economicActivity,
                    "Email": this.state.email,
                    "TelefonoMovil": this.state.movil,
                    "OtroMovil": this.state.otherMovil,
                    "TelefonoParticular": this.state.housePhone,
                    "TelefonoTrabajo": this.state.workPhone,
                    "OtroTelefono": this.state.otherPhone,
                    "Notas": this.state.notes,
                    "ComoSeEntero": this.state.howDidYouFindoutAboutUs,
                    "UltimoUsuarioEnAtenderlo": this.state.lastUserWhoAttendedYou,
                    "DeseaSerClienteReferenciador": this.state.referralClientSi === true ? true : false,
                    "DatosParaMercadeo": this.state.dataForMarketingSi === true ? true : false
                })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                this.setState({ 'idClient': response.IDClient.toUpperCase(), 'idFolder': response.IDFolder.toUpperCase() });
                const fd = new FormData();
                fd.append("image", this.state.objectImage, 'profile.jpeg');
                axios
                    .post(
                        "https://us-central1-prestalana-207222.cloudfunctions.net/uploadFile",
                        fd,
                        { headers: { folderName: response.IDClient + "/Profile" } }
                    )
                    .then(imageUrl => {
                        this.handleEditFolder(response.IDFolder, imageUrl.data, resources.idUsuerInsert);
                    })
                    .catch(err => console.log(err));

            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleTakePhoto = () => {
        this.setState({
            showModal: true
        });
    };

    handleChange(e) {
        var control = document.getElementById(e.target.id) as HTMLInputElement
      
        const { updateMunicipies, updateColonies, colonies } = this.props;

        if (e.target.id === "state") {
            scriptClient.handleCityDropdownView(false);
            scriptClient.handleMunicipeDropdownView(true);
            this.setState({ [e.target.id]: control.value, ["city"]: "-" });
            updateMunicipies({})
            updateColonies({})

            if (control.value === "") {
                scriptClient.handleCityDropdownView(true);
                scriptClient.handleColonyDropdownView(true);
            }
            
        } else if (e.target.id === "city") {
            if (control.value === "") {
                scriptClient.handleColonyDropdownView(true);
                this.setState({["city"]: "-" });
                updateMunicipies({})
                updateColonies({})
            } else {
                scriptClient.handleColonyDropdownView(false);
                this.setState({ [e.target.id]: control.value }, function () {
                    this.handleMunicipes();
                });
            }
        } else if (e.target.id === "dateOfBirth")
        {
            var age = this.calculateAge(control.value);
            this.setState({ ['age']: age + " Años", [e.target.id]: control.value  });

        } else if (e.target.id === "referralClientSi"){
            this.setState({ ['referralClientSi']: true });
            this.setState({ ['referralClientNo']: false });
        } else if (e.target.id === "referralClientNo") {
            this.setState({ ['referralClientSi']: false });
            this.setState({ ['referralClientNo']: true });
        } else if (e.target.id === "dataForMarketingSi") {
            this.setState({ ['dataForMarketingSi']: true });
            this.setState({ ['dataForMarketingNo']: false });
        } else if (e.target.id === "dataForMarketingNo") {
            this.setState({ ['dataForMarketingSi']: false });
            this.setState({ ['dataForMarketingNo']: true });
        } else if (e.target.id =="colony")
        {
            var postalCode = colonies.find(o => o.IDColonia === Number(control.value)).CodigoPostal
            this.setState({ [e.target.id]: control.value,  "postalCode": postalCode })
        }
        else
        {
            this.setState({ [e.target.id]: control.value });
        }
    }

    handleNationality() {
        const { updateNationalities } = this.props;
        fetch(resources.WebApiGoldenStart + "Nacionalities/ObtenerNacionalidades",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateNationalities(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleEditFolder(idFolder, imagePath, idUserCreate) {
        fetch(resources.WebApiGoldenStart + "Documents/CreateDocument",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify({
                    "IDFolder": idFolder,
                    "IDSucursalFolder": resources.idSucursal,
                    "IDTipoDocumento": 1,
                    "Actualizar": 0,
                    "Estatus": 1,
                    "IDTabla": 0,
                    "Audit_UsuarioInsert": idUserCreate ,
                    "RutaImagen": imagePath
                })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                scriptClient.handleSpinner(false);
                this.setState({ 'step': 2, "idRowDocument": response.RowID});
                alert("Cliente Creado Stiscfactoriamente.");
            }
        ).catch(err => {
            scriptClient.handleSpinner(false);
            console.log(err)
        });
    }

    handleBeneficiary(clientId) {
        const { updateBeneficiary } = this.props;
        fetch(resources.WebApiGoldenStart + "Beneficiary/GetBeneficiarios?IdCliente=" + clientId,
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateBeneficiary(response)
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handleDataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

    handleUploadDocuments () {
        scriptClient.handleSpinner(true);
        this.handleAddressProofDocuments().then(response => {
            this.handleSaveAddressProof(response);
        });
    }

    handleAddressProofDocuments = async () => {
        const { idClient, idFolder, selectedFiles } = this.state;
        var list = [];
        var document = {
            IDCliente: idClient,
            IdFolder: idFolder,
            IDSucursal: resources.idSucursal,
            IDUsuarioInsert: resources.idUsuerInsert,
            InicioVigencia: "",
            FinVigencia: "",
            NombreComprobante: "",
            IDTipoComprobante: "",
            RutaImagen: "",
            RowID: ""
        }

        await Promise.all(selectedFiles.map(async image => {
            var rowId = uuidv1();
            var objImage = this.handleDataURLtoFile(image.image, rowId.toUpperCase() + '.jpg');
            const fd = new FormData();
            fd.append("image", objImage, rowId.toUpperCase() + '.jpg');
            await axios
                .post(
                    "https://us-central1-prestalana-207222.cloudfunctions.net/uploadFile",
                    fd,
                    { headers: { folderName: idClient + "/AddressProof" } }
                )
                .then(imageUrl => {
                    list.push({
                        IDCliente: idClient,
                        IdFolder: idFolder,
                        IDSucursal: resources.idSucursal,
                        IDUsuarioInsert: resources.idUsuerInsert,
                        InicioVigencia: image.beginningOfValidity,
                        FinVigencia: image.endOfValidity,
                        NombreComprobante: image.documentTypeLabel,
                        IDTipoComprobante: image.documentTypeId,
                        RutaImagen: imageUrl.data,
                        RowID: rowId
                    });
                })
                .catch(err => console.log(err));
        }));

      return await Promise.resolve(list);
    }

    handleSaveAddressProof(addressProof) {
        fetch(resources.WebApiGoldenStart + "ProofAddress/CreateProofAddressByClient",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(addressProof)
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                scriptClient.handleSpinner(false);
                if (response) {
                    this.setState({ 'step': 3 });
                    alert("Documentos cargados satisfactoriamente.");
                } else {
                    alert("Error al guardar documentos.")
                }
            }
            ).catch(err => {
                scriptClient.handleSpinner(false);
                console.log(err)
            });
    }

    handleAgregarCOBE() {
        if (this.state.coownerType === "-" ||
            this.state.coownerNacionality === "-" ||
            this.state.coownerPhone === null ||
            this.state.coownerName === null ||
            this.state.coownerLastname === null ||
            this.state.coownerSecondLastname === null) {
            alert('Por favor complete todos los campos.')
        } else {

            const { coownersList, beneficiariesList } = this.state;
            const { updateBeneficiary, updateCoOwner } = this.props;
            var control = document.getElementById('coownerType') as HTMLInputElement

            let cl = [];
            let bl = [];

            var coowner = {
                IdNacionalidad: this.state.coownerNacionality,
                Nacionalidad: this.state.coownerNacionality === "0" ? "NINGUNA" : this.state.coownerNacionality === "1" ? "MEXICANA" : "EXTRANJERA" ,
                TelefonoMovil: this.state.coownerPhone,
                Nombres: this.state.coownerName,
                ApellidoPaterno: this.state.coownerLastname,
                ApellidoMaterno: this.state.coownerSecondLastname
            }

            if (control.value === "1") {
                coownersList.map(coowner => {
                    cl.push(coowner)
                });
                cl.push(coowner);
                updateCoOwner(cl);

            } else if (control.value === "2") {
                beneficiariesList.map(beneficiary => {
                    bl.push(beneficiary)
                });
                bl.push(coowner);
                updateBeneficiary(bl);
            }

            this.setState({ "coownerNacionality": "-", "coownerType": "-", "coownerPhone": null, "coownerName": null, "coownerLastname": null, "coownerSecondLastname": null, "coownersList": cl, "beneficiariesList": bl });
        }
    }

    handleSaveCOBE() {
        scriptClient.handleSpinner(true);
        const { beneficiaries, coOwners } = this.props;


        var listBeneficiaries = [];
        var listCoOwners = [];
        var beneficiariesDTO = {
            IDCliente: this.state.idClient,
            IDFolder: this.state.idFolder,
            IDSucursalFolder: resources.idSucursal,
            Audit_UsuarioInsert: resources.idUsuerInsert,
            RowID: "",
            IDTabla: 0,
            Nombres: "",
            ApellidoPaterno:"",
            ApellidoMaterno: "",
            Actualizar:"",
            Audit_FechaInsert:"",
            Audit_UsuarioUpdate:"",
            IDNacionalidad: "",
            //CoownaerProperties
            IdCliente: this.state.idClient,
            IdSucursal: resources.idSucursal,
            IdUsuarioCreaCotitular: resources.idUsuerInsert,
            Direccion: "-",
            TelefonoParticular: 0,
            TelefonoMovil: 0,
            TelefonoTrabajo: 0,
            ClaveCURP: "-",
            ClaveRFC: "-",
            Sexo: "-",
            NombreEmpresa: "-",
            Email: "-",
            Notas: "-"
        }

        beneficiaries.map(beneficiary => {
            beneficiariesDTO.Nombres = beneficiary.Nombres;
            beneficiariesDTO.ApellidoPaterno = beneficiary.ApellidoPaterno;
            beneficiariesDTO.ApellidoMaterno = beneficiary.ApellidoMaterno;
            beneficiariesDTO.IDTabla = 0;
            beneficiariesDTO.IDNacionalidad = beneficiary.IdNacionalidad;

            listBeneficiaries.push(beneficiariesDTO);
        });

        coOwners.map(coOwner => {
            beneficiariesDTO.Nombres = coOwner.Nombres;
            beneficiariesDTO.ApellidoPaterno = coOwner.ApellidoPaterno;
            beneficiariesDTO.ApellidoMaterno = coOwner.ApellidoMaterno;
            beneficiariesDTO.IDTabla = 0;
            beneficiariesDTO.IDNacionalidad = coOwner.IdNacionalidad;
            listCoOwners.push(beneficiariesDTO);
        });

        if (listCoOwners.length > 0) {
            this.handleSaveCoowners(listCoOwners).then(() => {
                if (listBeneficiaries.length > 0) {
                    this.handleSaveBeneficiaries(listBeneficiaries).then(() => {
                        scriptClient.handleSpinner(false);
                        this.setState({ "redirect": true });
                    });
                } else {
                    scriptClient.handleSpinner(false);
                    this.setState({ "redirect": true });
                };
            });
        } else {
            this.handleSaveBeneficiaries(listBeneficiaries).then(() => {
                scriptClient.handleSpinner(false);
                this.setState({ "redirect": true });
            });
        }
    }

    handleSaveBeneficiaries = async (listBeneficiaries) => {
      await  fetch(resources.WebApiGoldenStart + "Beneficiary/CreateBeneficiario",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(listBeneficiaries)
            }).then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                if (response) {
                    alert("Beneficiarios creados sasfactoriamente.");
                }
                else {
                    alert("Error al crear beneficiarios");
                }
            }
            ).catch(err => {
                scriptClient.handleSpinner(false);
                console.log(err)
            });
    }

    handleSaveCoowners = async (listCoOwners)=> {
        await fetch(resources.WebApiGoldenStart + "Cotitular/CreateCotitulares",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(listCoOwners)
            }).then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                scriptClient.handleSpinner(false);
                if (response) {
                    alert("Cotitulares creados sasfactoriamente.");
                } else {
                    alert("Error al guardar listado de cotitulares.")
                }
            }
            ).catch(err => {
                scriptClient.handleSpinner(false);
                console.log(err)
            });
    }

    render() {
        const { clientSelected, client, itentificationTypes, cities, civilStatus, entities, colonies, municipies, documentAdressProofList, documentAdressProofClient, coOwners, isEdit, updateUpdateClient, nationalities, beneficiaries, economicActivity, clientTypes} = this.props
        const { showModal, selectedFiles } = this.state;
        const disableDivs = { 'display': 'none' };

        if (isEdit && client[0].ProfileImage != "") {
            var nc = [{
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
            }];
            updateUpdateClient(nc)
        }

        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };

        const WebcamCapture = () => {
            const webcamRef = React.useRef(null);
            const { updateUpdateClient } = this.props;

            const capture = React.useCallback(
                () => {
                    const imageSrc = webcamRef.current.getScreenshot();
                    var g = this.handleDataURLtoFile(imageSrc, 'profile.jpg');
                    this.setState({ 'objectImage': g})
                    this.setState({ 'imageProfile': imageSrc})
                    updateUpdateClient(client);
                    this.setState({ showModal: false });
                    scriptClient.closeModal();
                },
                [webcamRef]
            );

            return (
                <>
                    <Webcam
                        audio={false}
                        height={720}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={videoConstraints}
                    />
                    <button onClick={capture}>Capturar Foto</button>
                </>
            );
        };

        var form = (<div className="tabs-box">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li key={uuidv1()} className="nav-item">
                    <a className="nav-link disabled" id="home-tab" data-toggle="tab" href="#cliente_1" role="tab" aria-controls="home">Información General</a>
            </li>

                {/*  <li className="nav-item">
                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#cliente_2" role="tab" aria-controls="profile" aria-selected="false">Huellas</a>
                </li>*/}

                <li key={uuidv1()} className="nav-item">
                    <a className="nav-link disabled" id="documents-tab" data-toggle="tab" href="#cliente_3" role="tab" aria-controls="contact" >Comprobantes</a>
            </li>
                <li key={uuidv1()} className="nav-item">
                    <a className="nav-link disabled" id="coowners-tab" data-toggle="tab" href="#cliente_4" role="tab" aria-controls="contact">Cotitular/Beneficiario</a>
            </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade cliente-info-general" id="cliente_1" role="tabpanel" aria-labelledby="cliente1-tab">
                    <div className="form">
                        <div className="container-form">
                        <div className="line-subtitle--form">
                            <span>Información básica</span>
                            <hr/>
                        </div>
                        <div className="dp-flex">
                            <div className="photo-cliente">
                                    <div className="photo">
                                        {
                                            client[0].ProfileImage === "" ? (
                                                <img className="photo-cliente" src={this.state.imageProfile} alt="Alternate Text" />) :
                                                (<img className="photo-cliente" src={`data:image/jpeg;base64,${client[0].ProfileImage}`} alt="Alternate Text" />)
                                        }

                                        <button type="button" onClick={() => this.handleTakePhoto()} >Capturar foto</button>
                                    </div>
                            </div>
                            <div className="box-item--form">
                                <div className="item-form">
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <Input label="Input 1" floatingLabel={true} type="text" id="registerDate" onChange={this.handleChange.bind(this)} value={ client[0].Audit_FechaInsert === "" ? this.state.registerDate : client[0].Audit_FechaInsert.split("T")[0]} required />
                                        <i className="material-icons icon-calendar">today</i>
                                    </div>
                                        <div className="mui-select">
                                            <select className="select-text" id="identificationType" onChange={this.handleChange.bind(this)} value={client[0].IDTipoIdentificacion === "" ? this.state.identificationType : client[0].IDTipoIdentificacion} required>
                                                {itentificationTypes != null &&
                                                    itentificationTypes.map(identification => {
                                                        return (<option key={uuidv1()} selected value={identification.IDTipoIdentificacion}>{identification.TipoIdentificacion}</option>)
                                                    })
                                                }
                                            </select>
                                            <label className="asterisk">{client[0].IDTipoIdentificacion === "" ? "Tipo de identificación" : ""}</label>
                                    </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="identificationNumber" onChange={this.handleChange.bind(this)}  value={client[0].NumeroIdentificacion === "" ? this.state.identificationNumber : client[0].NumeroIdentificacion} required />
                                        
                                            <label className="asterisk">{client[0].NumeroIdentificacion === "" ? "Número": ""}</label>
                                        <i className="material-icons" data-toggle="modal" data-target="#modal-documento--identificacion">attach_file</i>
                                    </div>
                                </div>
                                <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="clientName" onChange={this.handleChange.bind(this)} value={client[0].Nombres === "" ? this.state.clientName : client[0].Nombres} required />
                                        
                                            <label className="asterisk">{client[0].Nombres === ""  ? "Nombres" : ""}</label>
                                    </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="clientFirstLastName" onChange={this.handleChange.bind(this)}  value={client[0].ApellidoPaterno === "" ? this.state.clientFirstLastName : client[0].ApellidoPaterno} required />
                                            
                                            <label className="asterisk">{client[0].ApellidoPaterno === ""  ? "Primer apellido" : ""}</label>
                                    </div>
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="clientSecondLastName" onChange={this.handleChange.bind(this)} value={client[0].ApellidoMaterno === "" ? this.state.clientSecondLastName : client[0].ApellidoMaterno} required />
                                            
                                            <label className="asterisk">{client[0].ApellidoMaterno === "" ? "Segundo apellido" : ""}</label>
                                    </div>
                                </div>
                                <div className="item-form">
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="dateOfBirth" onChange={this.handleChange.bind(this)} value={client[0].FechaNacimiento === "" ? this.state.dateOfBirth : client[0].FechaNacimiento.split("T")[0]} required />
                                            
                                            <label className="asterisk">{client[0].FechaNacimiento === "" ? "Fecha de de nacimiento" : ""}</label>
                                        <i className="material-icons icon-calendar">today</i>
                                    </div>
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="age" onChange={this.handleChange.bind(this)} value={client[0].FechaNacimiento === "" ? this.state.age : this.calculateAge(client[0].FechaNacimiento.split("T")[0]) + " Años"} required />
                                        
                                            <label>{this.state.age === null ? "Edad" : ""}</label>
                                    </div>
                                        <div className="mui-select">
                                            <select className="select-text" id="gender" onChange={this.handleChange.bind(this)} value={client[0].Sexo === "" ? this.state.gender : client[0].Sexo} required>
                                                <option value="" selected>Seleccione</option>
                                                <option key={uuidv1()} value="M">Masculino</option>
                                                <option key={uuidv1()} value="F">Femenino</option>
                                            </select>
                                            <label className="select-label">{client[0].Sexo === "" ? "Sexo" : ""}</label>
                                    </div>
                                </div>
                                    <div className="item-form">


                                        <select className="select-text" id="nacionality" onChange={this.handleChange.bind(this)} value={this.state.nacionality} required>
                                            <option key={uuidv1()} value="-" disabled selected>Seleccione</option>
                                            {nationalities.length > 0 &&
                                                nationalities.map(nacionality => {
                                                    return (<option key={uuidv1()} selected value={nacionality.IDNacionalidad}>{nacionality.Nacionalidad}</option>)
                                                })
                                            }
                                        </select>


                                        <div className="mui-select">
                                            <select className="select-text" id="stateOfBirth" onChange={this.handleChange.bind(this)} value={client[0].ENTIDADNACIMIENTO === "" ? this.state.stateOfBirth : client[0].ENTIDADNACIMIENTO} required>
                                                <option key={uuidv1()} value="-">Seleccione</option>
                                                {entities != null &&
                                                    entities.map(entity => {
                                                        return (<option key={uuidv1()} selected value={entity.IDEntidad}>{entity.EntidadFederativa}</option>)
                                                    })
                                                }
                                            </select>
                                            <label className="asterisk">{client[0].ENTIDADNACIMIENTO === "" ? "Estado de nacimiento" : ""}</label>
                                    </div>

                                        <div className="mui-select">
                                            <select className="select-text" id="maritalStatus" onChange={this.handleChange.bind(this)} value={client[0].IDEstadoCivil === "" ? this.state.maritalStatus : client[0].IDEstadoCivil} required>
                                                <option key={uuidv1()} value="-">Seleccione</option>
                                                {civilStatus != null &&
                                                    civilStatus.map(status => {
                                                        return (<option key={uuidv1()} selected value={status.IDEstadoCivil}>{status.EstadoCivil}</option>)
                                                    })
                                                }                                              
                                            </select>
                                            <label className="asterisk">{client[0].IDEstadoCivil === "" ? "Estado civil" : ""}</label>
                                        </div>

                                </div>
                                <div className="item-form">
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="rfc" onChange={this.handleChange.bind(this)} value={client[0].ClaveRFC === "" ? this.state.rfc : client[0].ClaveRFC} required />
                                            
                                            <label className="asterisk">{client[0].ClaveRFC === "" ? "R.F.C" : ""}</label>
                                    </div>
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="curp" onChange={this.handleChange.bind(this)} value={client[0].ClaveCURP === "" ? this.state.curp : client[0].ClaveCURP} required />
                                            
                                            <label className="asterisk">{client[0].ClaveCURP === "" ? "C.U.R.P" : ""}</label>
                                    </div>
                                    <div className="wth-100">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className="container-form">
                        <div className="line-subtitle--form">
                            <span>Información Complementaria</span>
                            <hr/>
                        </div>
                        <div className="box-item--form">
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="address" onChange={this.handleChange.bind(this)} value={client[0].Direccion === "" ? this.state.address : client[0].Direccion} required />
                                        <label className="asterisk">{client[0].Direccion === ""  ? "Dirección" : ""}</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" onChange={this.handleChange.bind(this)} id="outdoorNumber" value={client[0].NumExterior === "" ? this.state.outdoorNumber : client[0].NumExterior} required />
                                        <label className="asterisk">{client[0].NumExterior === "" ? "Número exterior" : ""}</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="interiorNumber" onChange={this.handleChange.bind(this)} value={client[0].NumInterior === "" ? this.state.interiorNumber : client[0].NumInterior} required />
                                        
                                        <label className="asterisk">{client[0].NumInterior === "" ? "Número interior" : ""}</label>
                                </div>
                            </div>
                                <div className="item-form">
                                 

                                    <div className="mui-select">
                                        <select className="select-text" id="state" onChange={this.handleChange.bind(this)} value={client[0].IDEntidad === "" ? this.state.state : client[0].IDEntidad} required>
                                            <option key={uuidv1()} value="">Seleccione</option>
                                            {entities.length > 0 &&
                                                entities.map(entity => {
                                                    return (<option key={uuidv1()} selected value={entity.IDEntidad}>{entity.EntidadFederativa}</option>)
                                                })
                                            }
                                        </select>
                                        <label className="select-label">{client[0].IDEntidad === "" ? "Estado" : ""}</label>
                                    </div>

                                    <div className="mui-select">
                                        <select className="select-text" id="city" onChange={this.handleChange.bind(this)} value={client[0].IDCiudad === "" ? this.state.city : client[0].IDCiudad} required>
                                            <option key={uuidv1()} value="">Seleccione</option>
                                            {cities.length > 0 &&
                                                cities.map(city => {
                                                    return (<option key={uuidv1()} selected value={city.IDCiudad}>{city.Ciudad}</option>)
                                                })
                                            }
                                        </select>
                                        <label className="select-label">{client[0].IDCiudad === "" ? "Ciudad" : ""}</label>
                                    </div>

                                    <div className="mui-select">
                                       
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="municipe" value={municipies.length > 0 ? municipies[0].Municipio: ""}/>
                                            <label className="select-label">{client[0].IDMunicipio === "" ? "Delegación o Municipio" : ""}</label>
                                        </div>
                                    </div>
                            </div>
                                <div className="item-form">

                                    <div className="mui-select">
                                        <select className="select-text" id="colony" onChange={this.handleChange.bind(this)} value={client[0].IDColonia === "" ? this.state.colony : client[0].IDColonia} required>
                                            <option key={uuidv1()} value="">Seleccione</option>
                                            {colonies.length > 0 &&
                                                colonies.map(colony => {
                                                    return (<option key={uuidv1()} selected value={colony.IDColonia}>{colony.Colonia}</option>)
                                                })
                                            }
                                        </select>
                                        <label className="select-label">{ client[0].IDColonia === "" ? "Colonia" : ""}</label>
                                    </div>



                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="postalCode" value={this.state.postalCode} required />
                                        
                                        <label className="asterisk">{client[0].CodigoPostal === "" ? "Código postal" : ""}</label>
                                    </div>

                                    <div className="mui-select">
                                        <select className="select-text" id="economicActivity" onChange={this.handleChange.bind(this)} value={client[0].IdActividadEconomica === "" ? this.state.economicActivity : client[0].IdActividadEconomica} required>
                                            <option key={uuidv1()} value="">Seleccione</option>
                                            {economicActivity.length > 0 &&
                                                economicActivity.map(ea => {
                                                    return (<option key={uuidv1()} value={ea.IDActividadEconomica}>{ea.Descripcion}</option>)
                                                })
                                            }
                                        </select>
                                        <label className="select-label">{client[0].IDColonia === "" ? "Actividad económica" : ""}</label>
                                    </div>
                            </div>
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="email" onChange={this.handleChange.bind(this)} value={client[0].Email === "" ? this.state.email : client[0].Email} required />
                                        <label className="asterisk">{client[0].Email === "" ? "Correo electrónico" : ""}</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="movil" onChange={this.handleChange.bind(this)} value={client[0].TelefonoMovil === "" ? this.state.movil : client[0].TelefonoMovil} required />
                                    
                                        <label className="asterisk">{client[0].TelefonoMovil === "" ? "Teléfono Movil" : ""}</label>
                                </div>
                                <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="otherMovil" onChange={this.handleChange.bind(this)} value={client[0].OtroTelefonoMovil === "" ? this.state.otherMovil : client[0].OtroTelefonoMovil} required />
                                        <label className="asterisk">Otro Telefono</label>
                                </div>
                            </div>
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="housePhone" onChange={this.handleChange.bind(this)} value={client[0].TelefonoParticular === "" ? this.state.housePhone : client[0].TelefonoParticular} required />
                                        
                                        <label className="asterisk">{client[0].TelefonoParticular === ""  ? "Teléfono de casa" : ""}</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="workPhone" onChange={this.handleChange.bind(this)} value={client[0].TelefonoTrabajo === "" ? this.state.workPhone : client[0].TelefonoTrabajo} required />
                                        
                                        <label className="asterisk">{client[0].TelefonoTrabajo === "" ? "Teléfono del trabajo" : ""}</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="otherPhone" onChange={this.handleChange.bind(this)} value={client[0].OtroTelefono === "" ? this.state.otherPhone : client[0].OtroTelefono} required />
                                    
                                    <label className="asterisk">Otro teléfono</label>
                                </div>
                            </div>
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="notes" onChange={this.handleChange.bind(this)} value={client[0].Notas === "" ? this.state.notes : client[0].Notas} required />
                                        
                                        <label className="asterisk">{client[0].Notas === "" ? "Notas" : ""}</label>
                                </div>
                            </div>
                        </div>

                        </div>
                        <div className="container-form">
                        <div className="line-subtitle--form">
                            <span>Información Complementaria</span>
                            <hr/>
                        </div>
                        <div className="box-item--form">
                            <div className="item-form">
                                <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="howDidYouFindoutAboutUs" onChange={this.handleChange.bind(this)} value={client[0].ComoSeEntero === "" ? this.state.howDidYouFindoutAboutUs : client[0].ComoSeEntero} required />
                                    <label className="asterisk">¿Comó se enteró de nosotros?</label>
                                </div>
                                <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="lastUserWhoAttendedYou" onChange={this.handleChange.bind(this)} value={client[0].UltimoUsuarioEnAtenderlo === "" ? this.state.lastUserWhoAttendedYou : client[0].UltimoUsuarioEnAtenderlo} required />
                                    <label className="asterisk">Último usuario que lo atendió</label>
                                </div>
                                <div className="radio-button">
                                    <label className="label-radio">¿Desea ser cliente referenciador?</label>
                                    <div className="item-radio--button">
                                            <div className="pd-right--30px">
                                                <input type="radio" id="referralClientSi" value="Si" onChange={this.handleChange.bind(this)} name="radio-group" checked={this.state.referralClientSi === true} />
                                                Si
                                        </div>
                                        <div>
                                                <input type="radio" id="referralClientNo" value="No" onChange={this.handleChange.bind(this)} name="radio-group" checked={this.state.referralClientNo === true} />
                                                No
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item-form">
                                <div className="radio-button">
                                        <label className="label-radio">¿Acepta usar los datos personales para mercadeo?</label>

                                    <div className="item-radio--button">
                                            <div className="pd-right--30px">
                                                <input type="radio" id="dataForMarketingSi" value="Si" checked={this.state.dataForMarketingSi === true} onChange={this.handleChange.bind(this)}/>
                                                Si
                                        </div>
                                        <div>
                                                <input type="radio" id="dataForMarketingNo" value="No" checked={this.state.dataForMarketingNo === true} onChange={this.handleChange.bind(this)}/>
                                                No
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>
                        <a onClick={() => this.handleSaveClientInfo()} className="btns btn-go">Guardar</a>
                    </div>
                </div>
                <div>
                {/*
                <div className="tab-pane fade cliente-huellas" id="cliente_2" role="tabpanel" aria-labelledby="huellas-tab">
                <div className="dp-flex">
                    <div className="hand text-center">
                        <div>
                            <img src="~/image/hand-left.svg" alt="hand-left" />
                            <div className="finger finger-1"></div>
                            <div className="finger finger-2"></div>
                            <div className="finger finger-3"></div>
                            <div className="finger finger-4 active check"></div>
                            <div className="finger finger-5"></div>
                        </div>
                        <span>Mano izquierda</span>
                    </div>
                    <div className="container-fingerprint">
                        <div className="box-finger">
                            <span className="fingerprint"></span>
                        </div>
                        <a href="#" className="btns btn-se swal-save">Capturar huella</a>
                    </div>
                    <div className="hand text-center">
                        <div>
                            <img src="~/image/hand-right.svg" alt="hand-left" />
                            <div className="finger finger-6 active"></div>
                            <div className="finger finger-7"></div>
                            <div className="finger finger-8"></div>
                            <div className="finger finger-9"></div>
                            <div className="finger finger-10"></div>
                        </div>
                        <span>Mano derecha</span>
                    </div>

                </div>


            </div>
                */}
                </div>
                <div className="tab-pane fade clientes-comprobantes" id="cliente_3" role="tabpanel" aria-labelledby="contact-tab">
                    <div>
                    <form>
                        <div   className="mui-select">
                                <select className="select-text" id="documentType" onChange={this.handleChange.bind(this)} value={this.state.documentType} required>
                                    <option key={uuidv1()} value="-" disabled selected>Seleccione</option>
                                    {documentAdressProofList.length > 0 && 
                                        documentAdressProofList.map(addressProof=> {
                                            return (<option key={uuidv1()} selected value={addressProof.IDTipoDocumento}>{addressProof.Descripcion}</option>)
                                        })
                                    }
                            </select>
                            <label className="asterisk select-label">Comprobante de domicilio</label>
                        </div>
                            <div className="mui-textfield mui-textfield--float-label">
                            <input type="text" id="beginningOfValidity" onChange={this.handleChange.bind(this)} value={this.state.beginningOfValidity} required />
                            <label className="asterisk">Inicio de vigencia</label>
                            <i className="material-icons icon-calendar">today</i>
                        </div>
                        <div className="mui-textfield mui-textfield--float-label">
                            <input type="text" id="endOfValidity" onChange={this.handleChange.bind(this)} value={this.state.endOfValidity} required />
                            <label className="asterisk">Fin de vigencia</label>
                            <i className="material-icons icon-calendar">today</i>
                        </div>
                    </form>
                    <div className="contenedor-imagenes">
                        <div className="contenedor-selector">
                                {
                                    selectedFiles.length === 0 ? 
                                    documentAdressProofClient.length > 0 &&
                                documentAdressProofClient.map((document, index) => {
                                    {   
                                        return index != 0 ?
                                            (<div key={uuidv1()} className="ps-relative">
                                                <img key={uuidv1()} className="activada" src={document.image} onClick={() => this.setImageZoom(document.RutaImagen)} />
                                                <span key={uuidv1()} className="numero">{index}</span>
                                            </div>) : <div />  
                                    }
                                }) :
                                        selectedFiles.map((file, index) => {
                                            {
                                                return index != 0 ?
                                                    (<div key={uuidv1()} className="ps-relative">
                                                        <img key={uuidv1()} className="activada" src={file.image} onClick={() => this.setImageZoom(file.image)} />
                                                        <span key={uuidv1()} className="numero">{index}</span>
                                                    </div>) : <div />
                                            }
                                        })
                            }
                            </div>
                            {
                                selectedFiles.length === 0 ? 
                                <div className="zoom-imagen">
                                        <img id="zoom" src={documentAdressProofClient.length > 0 ? documentAdressProofClient[0].RutaImagen : ""} onClick={() => this.cambiarImagen(this)} />
                                    <i className="material-icons foto-zoom" data-toggle="modal" data-target="#zoom-foto">search</i>
                                    </div> :
                                    <div className="zoom-imagen">
                                        <img id="zoom" src={selectedFiles[0].image} onClick={() => this.cambiarImagen(this)} />
                                        <i className="material-icons foto-zoom" data-toggle="modal" data-target="#zoom-foto">search</i>
                                    </div> 
                            }
                    </div>

                        {client=== null? (<div className="btn-captura">
                        <a href="#" className="btns btn-se">Capturar</a>
                        <span className="popover-info" data-toggle="popover" data-content="Toma 3 fotografías de la papeleta, selecciona la mejor y asegúrate de que sea legible.
    La foto presentada en el recuadro grande es la que se guardará.">
                            <i className="material-icons">info</i>
                        </span>
                    </div>): (<div/>)}
                    <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="bold">Comprobante de domicilio</th>
                                <th className="text-center bold">Estatus</th>
                                <th className="text-center bold">Fin de vigencia</th>
                                <th className="text-center bold"></th>
                            </tr>
                        </thead>
                            <tbody>

                                    {
                                            selectedFiles.length === 0 ? 
                                        documentAdressProofClient.length > 0 &&
                                    documentAdressProofClient.map((document, index) => {
                                        {
                                            return (<tr key={uuidv1()} id={index}>
                                                <td key={uuidv1()} className="semibold">{document.NombreComprobante}</td>
                                                <td key={uuidv1()} className="text-center dp-flex align-items-center">
                                                    <span key={uuidv1()} className="circle circle-green"></span>
                                                    <label key={uuidv1()}>Fundido</label>
                                                </td>
                                                <td key={uuidv1()} className="text-center">{document.InicioVigencia.split("T")[0]}</td>
                                                <td key={uuidv1()} className="text-center">
                                                </td>
                                            </tr>)
                                        }
                                    }) :
                                            selectedFiles.map((document, index) => {
                                                {
                                                    return (<tr key={uuidv1()}>
                                                        <td key={uuidv1()} className="semibold">{document.documentTypeLabel}</td>
                                                        <td key={uuidv1()} className="text-center dp-flex align-items-center">
                                                            <span key={uuidv1()} className={document.status === "Fundido" ? "circle circle-green" : "circle circle-red"}></span>
                                                            <label key={uuidv1()}>{document.status}</label>
                                                        </td>
                                                        <td key={uuidv1()} className="text-center">{document.endOfValidity}</td>
                                                    </tr>)
                                                }
                                            })

                                }
                        </tbody>
                    </table>
                        </div>
                    </div>
                    
                    <input id="selectFile" type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.handleUpload.bind(this)} style={disableDivs} />
                    <button onClick={scriptClient.handleOpenUploadImage}>Seleccionar documento</button> 
                    <div><a onClick={() => this.handleUploadDocuments()} className="btns btn-go mt-3 save">Guardar</a></div>   
                </div>
                <div className="tab-pane fade" id="cliente_4" role="tabpanel" aria-labelledby="cotitular-tab">
                <div className="form">
                        <div className="item-form">
                            <div className="mui-textfield mui-textfield--float-label">
                                <Input label="Nombres" floatingLabel={true} type="text" id="coownerName" onChange={this.handleChange.bind(this)} value={this.state.coownerName} required />
                            </div>
                            <div className="mui-textfield mui-textfield--float-label">
                                <Input label="Primer apellido" floatingLabel={true} type="text" id="coownerLastname" onChange={this.handleChange.bind(this)} value={this.state.coownerLastname} required />
                            </div>
                            <div className="mui-textfield mui-textfield--float-label">
                                <Input label="Segundo apellido" floatingLabel={true} type="text" id="coownerSecondLastname" onChange={this.handleChange.bind(this)} value={this.state.coownerSecondLastname} required />
                            </div>
                    </div>
                        <div className="item-form">
                             <div className="mui-select">
                                <select className="select-text" id="coownerType" onChange={this.handleChange.bind(this)} value={this.state.coownerType} required>
                                    <option key={uuidv1()} value="-" disabled selected>Seleccione</option>
                                    <option key={uuidv1()} value="1">Cotitular</option>
                                    <option key={uuidv1()} value="2">Beneficiario</option>
                                    </select>
                                    <label className="select-label">Tipo</label>
                            </div>
                            <div className="mui-select">
                                <select className="select-text" id="coownerNacionality" onChange={this.handleChange.bind(this)} value={this.state.coownerNacionality} required>
                                    <option key={uuidv1()} value="-" disabled selected>Seleccione</option>
                                    {nationalities.length > 0 &&
                                        nationalities.map(nacionality => {
                                            return (<option key={uuidv1()} selected value={nacionality.IDNacionalidad}>{nacionality.Nacionalidad}</option>)
                                        })
                                    }
                                </select>

                            <label className="select-label">Nacionalidad</label>
                        </div>
                        <div className="mui-textfield mui-textfield--float-label">
                                <Input label="Teléfono" floatingLabel={true} type="text" id="coownerPhone" onChange={this.handleChange.bind(this)} value={this.state.coownerPhone} required />
                           
                            </div>
                            <a onClick={() => this.handleAgregarCOBE()} className="btns btn-go">Agregar</a>
                            <a onClick={() => this.handleSaveCOBE()} style={(coOwners.length > 0 || beneficiaries.length > 0) ? { 'display': ''} : disableDivs} className="btns btn-go">Guardar</a>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="bold">Nombres y apellidos</th>
                                <th className="text-center bold">Tipo</th>
                                <th className="text-center bold">Nacionalidad</th>
                                <th className="text-center bold">Teléfono</th>
                                <th className="text-center bold"></th>
                            </tr>
                        </thead>
                            <tbody>
                                {coOwners.length > 0 &&
                                    coOwners.map((coOwner, index) => {
                                        {
                                            return (
                                                <tr key={uuidv1()} className={(index % 2) ? "tr-selected" :""} >
                                                    <td key={uuidv1()} className="semibold">{coOwner.Nombres +" "+ coOwner.ApellidoPaterno +" "+ coOwner.ApellidoMaterno}</td>
                                                    <td key={uuidv1()} className="text-center">Cotitular</td>
                                                    <td key={uuidv1()} className="text-center">{coOwner.Nacionalidad}</td>
                                                    <td key={uuidv1()} className="text-center">{coOwner.TelefonoMovil}</td>
                                                    <td key={uuidv1()} className="text-center">
                                                        {/*<i key={uuidv1()} className="material-icons">edit</i>*/}
                                                        <i key={uuidv1()} className="material-icons remove">delete</i>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                                }
                                {
                                    beneficiaries.length > 0 &&
                                    beneficiaries.map((beneficiary, index) => {
                                        {
                                            return (
                                                <tr key={uuidv1()} className={(index % 2) ? "tr-selected" : ""} >
                                                    <td key={uuidv1()} className="semibold">{beneficiary.Nombres + " " + beneficiary.ApellidoPaterno + " " + beneficiary.ApellidoMaterno}</td>
                                                    <td key={uuidv1()} className="text-center">Beneficiario</td>
                                                    <td key={uuidv1()} className="text-center">{beneficiary.Nacionalidad}</td>
                                                    <td key={uuidv1()} className="text-center">{beneficiary.TelefonoMovil}</td>
                                                    <td key={uuidv1()} className="text-center">
                                                        {/*<i key={uuidv1()} className="material-icons">edit</i>*/}
                                                        <i key={uuidv1()} className="material-icons remove">delete</i>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                                }
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
                    </div>) 
        
        return (
            <div className="content-page" id="info-general">
                <div id='loader' style={disableDivs}>
                    <img src={load} width='1500px' height='1500px' />
                </div>
                {isEdit ?
                    <fieldset>{form}</fieldset>:
                    <fieldset disabled>{form}</fieldset>    
                }
                {showModal ?
                    <div className="modal" id="modal-buy--product">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                                    <div className="modal-header">
                                        <div className="message-success">
                                            <i className="material-icons">done</i>
                                            <span>Captura Foto Cliente</span>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <WebcamCapture />
                                    </div>
                                    <div className="modal-footer">
                                  
                                    </div>
                                </div>
                        </div>

                    </div>
                    : null}
                {this.renderRedirect()}
            </div>
        )
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart,
        amountPurchase: state.ecommerce.amountPurchase,
        list: state.ecommerce.list,
        client: state.client.client,
        fingerPrints: state.client.fingerPrints,
        vauchers: state.client.vauchers,
        coOwners: state.client.coOwners,
        itentificationTypes: state.client.itentificationTypes,
        cities: state.client.cities,
        civilStatus: state.client.civilStatus,
        entities: state.client.entities,
        colonies: state.client.colonies,
        municipies: state.client.municipies,
        documentAdressProofList: state.client.documentAdressProofList,
        documentAdressProofClient: state.client.documentAdressProofClient,
        isEdit: state.client.isEdit,
        nationalities: state.client.nationalities,
        beneficiaries: state.client.beneficiaries,
        economicActivity: state.client.economicActivity,
        clientTypes: state.client.clientTypes,
        pathnameRedirect: state.dashboard.pathnameRedirect
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateClientTypes: clientTypes => {
            dispatch({ type:  "UPDATE_CLIENT_TYPES", payload: clientTypes})
        },
        updateEconomicActivity: economicActivity => {
            dispatch({ type: "UPDATE_ECONIMIC_ACTIVITY", payload: economicActivity})
        },
        updateUpdateClient: client => {
            dispatch({ type: "UPDATE_CLIENT", payload: client })
        },
        updateIdentificationTypes: identifications => {
            dispatch({ type: "UPDATE_IDENTIFICATION_TYPES", payload: identifications })
        },
        updateCities: cities => {
            dispatch({ type: "UPDATE_CITIES", payload: cities })
        },
        updateEntities: entities => {
            dispatch({ type: "UPDATE_ENTITIES", payload: entities })
        },
        updateCivilStatus: civilStatus => {
            dispatch({ type: "UPDATE_CIVIL_STATUS", payload: civilStatus})
        },
        updateColonies: colonies => {
            dispatch({ type: "UPDATE_COLONIES", payload: colonies})
        },
        updateMunicipies: municipies => {
            dispatch({ type: "UPDATE_MUNICIPIES", payload: municipies})
        },
        updateDocumentAdressProofList: documentAdressProofList => {
            dispatch({ type: "UPDATE_DOCUMENTS_ADDRESS_PROOF", payload: documentAdressProofList})
        },
        updateDocumentAddressProofClient: documentAddressProofClient => {
            dispatch({ type: "UPDATE_DOCUMENTS_ADDRESS_PROOF_CLIENT", payload: documentAddressProofClient })
        },
        updateCoOwner: coOwners => {
            dispatch({ type: "UPDATE_COOWNERS", payload: coOwners})
        },
        updateNationalities: nationalities => {
            dispatch({ type: "UPDATE_NATIONALITIES", payload: nationalities })
        },
        updateBeneficiary: beneficiaries => {
            dispatch({ type: "UPDATE_BENEFICIARIES", payload: beneficiaries})
        }
    }
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(CreateClient);