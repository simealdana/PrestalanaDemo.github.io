const React = require('react');
const connect = require('react-redux').connect;
const Input = require('muicss/lib/react/input');
import ProgressBar from 'react-bootstrap/ProgressBar'
const scriptClient = require('./Scripts/Script');


class Upclient extends React.Component{
    state = {
        redirect: false,
        idClient: "", //"D6D5EE1E-C748-41FE-B74B-03B5E872744D",
        idFolder: "",// "66237",
        idRowDocument: "",
        step: 25,
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
        imageSrc: null, 

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
        beneficiariesList:[],
        nationalities:[]
    }
    componentDidMount() {
        scriptClient.openModal();
        this.getCoOwners();
        this.getNacionality();
        this.getCoOwners();
    }

//Gets
    getNacionality= ()=>{
        // llamada a backend
        let MockNacionality = [
            {IDNacionalidad:'1', Nacionalidad:'Venezuela'},
            {IDNacionalidad:'2' , Nacionalidad:'Mexico'},
        ]
        this.setState({...this.state,nationalities:MockNacionality})
        console.log(this.state)
    }

    getCoOwners = ()=>{
        // Llamada get al backend
        let mockCoOwners = [
            {Nombre:'Simeon',ApellidoPaterno:'Aldana',ApellidoMaterno:'Vasquez',Nacionalidad:'Venezolano',TelefonoMovil:'65336844'},
            {Nombre:'Simeon',ApellidoPaterno:'Aldana',ApellidoMaterno:'Vasquez',Nacionalidad:'Venezolano',TelefonoMovil:'65336844'},
            {Nombre:'Simeon',ApellidoPaterno:'Aldana',ApellidoMaterno:'Vasquez',Nacionalidad:'Venezolano',TelefonoMovil:'65336844'},
        ]
        this.setState({...this.state,coownersList:mockCoOwners});
    }

    getBeneficiario = ()=>{
        // Llamada get al backend
        let mockCoOwners = [
            {Nombre:'Simeon',ApellidoPaterno:'Aldana',ApellidoMaterno:'Vasquez',Nacionalidad:'Venezolano',TelefonoMovil:'65336844'},
            {Nombre:'Simeon',ApellidoPaterno:'Aldana',ApellidoMaterno:'Vasquez',Nacionalidad:'Venezolano',TelefonoMovil:'65336844'},
            {Nombre:'Simeon',ApellidoPaterno:'Aldana',ApellidoMaterno:'Vasquez',Nacionalidad:'Venezolano',TelefonoMovil:'65336844'},
        ]
        this.setState({...this.state,beneficiariesList:mockCoOwners});
    }

    validator = (estado)=>{
        const state = this.state
        if(!state.clientName) return true
    }

    handleSubmit = () => {
        const valid = this.validator(this.state);
        if (valid) {
            alert('Hola')
        }
    };
    
    handleChange = ({target})=>{
        const { id , value} = target;
        this.setState({...this.state,[`${id}`]:value})
    }

    handleChangeNumber = ({target})=>{
        const { id , value} = target;
        if (isNaN(value)) {
            this.setState({...this.state,[`${id}`]:''});
            return
        }   
        this.setState({...this.state,[`${id}`]:value})
    }

    handleSetImagem = (e)=>{
        e.preventDefault();
        let files = this.state.selectedFiles;
        let auxImg:any = ""
        files.push(e.target.files)    
        let file = e.target.files[0],
        pattern = /image-*/,
        reader = new FileReader(),
        self = this
        
        if (!file.type.match(pattern)) {
            alert('Formato inválido');
            return;
        }
        
        this.setState({...this.state,selectedFiles:files});
        reader.onload = (e)=>{
            reader.result;
        }
        setTimeout(() => {
            this.setState({...this.state,imageSrc:reader.result});
            console.log(this.state)
        }, 1000);
        
        reader.readAsDataURL(file);
    }

    setImageZoom = image => {
        scriptClient.zoom(image);
    };

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

    progressBar = (porcentaje:number)=>{
        this.setState({...this.state,step:porcentaje});
    }

    render(){
        const { clientSelected, client, itentificationTypes, cities, civilStatus, entities, colonies, municipies, documentAdressProofList, documentAdressProofClient, coOwners, isEdit, updateUpdateClient, nationalities, beneficiaries, economicActivity, clientTypes} = this.props
        const { showModal, selectedFiles } = this.state;
        const disableDivs = { 'display': 'none' };
        return(
            <div>
                <div className="nav nav-tabs row">
                    <div className="nav-item col-3 text-center">
                        <a className="nav-link select" id="home-tab" data-toggle="tab" onClick={()=>this.progressBar(25)} href="#cliente_1" role="tab" aria-controls="home">Información General</a>
                    </div>
                    <div className="nav-item col-3 text-center">
                        <a className="nav-link disabled" id="coowners-tab" onClick={()=>this.progressBar(50)} data-toggle="tab" href="#cliente_4" role="tab" aria-controls="contact">Huella</a>
                    </div>
                    <div className="nav-item col-3 text-center">
                        <a className="nav-link " id="documents-tab" data-toggle="tab" href="#cliente_3"onClick={()=>this.progressBar(75)}  role="tab" aria-controls="contact" >Comprobantes</a>
                    </div>
                    <div className="nav-item col-3 text-center">
                        <a className="nav-link " id="coowners-tab"  onClick={()=>this.progressBar(100)}  aria-controls="contact">Cotitular/Beneficiario</a>
                    </div>      
                </div>
            <ProgressBar variant="success" now={this.state.step} />

            {this.state.step === 25 ?   
            <form onSubmit={()=>this.handleSubmit()}>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade cliente-info-general" id="cliente_1" role="tabpanel" aria-labelledby="cliente1-tab">
                        <div className="form ">
                        <div className="container-form">
                            <div className="d-flex justify-content-between px-2 py-4">
                                <div>
                                    <span>Registro de Cliente Nuevo</span>
                                </div>
                                <div>
                                    <button type="submit" className="btns btn-go">Guardar</button>
                                </div>
                            </div>
                            <div className="line-subtitle--form px-2 ">
                                <span>Información básica</span>
                                <hr/>
                            </div>
                            {/* <div>
                                <a className="btns btn-go">Guardar</a>
                            </div> */}
                            <div className="dp-flex px-4">
                                <div className="photo-cliente col-2">
                                        <div className="photo w-100"></div>
                                        <button type="button"className="btns btn-go m-0" >Capturar foto</button>
                                </div>
                                <div className="box-item--form col">
                                    <div className="item-form row py-3">
                                        <div className="mui-textfield col-4">
                                            <Input label="Input 1" floatingLabel={true} type="text" id="registerDate"  required onChange={()=> this.handleChange(event)}/>
                                            <i className="material-icons icon-calendar">today</i>
                                        </div>
                                        <div className="mui-select col-4">
                                            <select className="select-text" id="identificationType"  onChange={()=> this.handleChange(event)} required>
                                                <option>1</option>
                                                <option>1</option>
                                                <option>1</option>
                                            </select>
                                            <label className="asterisk">Tipo de identificacion</label>
                                        </div>
                                        <div className="mui-textfield col-4">
                                                <input type="text" id="identificationNumber"   onChange={()=> this.handleChange(event)} required />        
                                                <label className="asterisk">Numero</label>
                                            <i className="material-icons" data-toggle="modal" data-target="#modal-documento--identificacion" >attach_file</i>
                                        </div>
                                    </div>
                                    <div className="item-form row py-3">
                                        <div className="mui-textfield col-4">
                                                <input type="text" id="clientName"  required onChange={()=> this.handleChange(event)}/>
                                                <label className="asterisk">Nombre</label>
                                        </div>
                                        <div className="mui-textfield  col-4">
                                                <input type="text" id="clientFirstLastName"  onChange={()=> this.handleChange(event)} required />
                                                
                                                <label className="asterisk">Primer Apellido</label>
                                        </div>
                                            <div className="mui-textfield col-4">
                                                <input type="text" id="clientSecondLastName"   onChange={()=> this.handleChange(event)}required />
                                                
                                                <label className="asterisk">Segundo Apellido</label>
                                        </div>
                                    </div>
                                    <div className="item-form row py-3">
                                            <div className="mui-textfield col-4">
                                                <input type="text" id="dateOfBirth"  onChange={()=> this.handleChange(event)} required />
                                                
                                                <label className="asterisk">Fecha de nacimiento</label>
                                            <i className="material-icons icon-calendar">today</i>
                                        </div>
                                            <div className="mui-textfield  col-4">
                                                <input type="text" id="age" onChange={()=> this.handleChange(event)} required />
                                            
                                                <label>Edad</label>
                                        </div>
                                            <div className="mui-select col-4">
                                                <select className="select-text" id="gender" onChange={()=> this.handleChange(event)}  required>
                                                    <option  selected>Seleccione</option>
                                                    <option  value="M">Masculino</option>
                                                    <option  value="F">Femenino</option>
                                                </select>
                                                <label className="select-label">Sexo</label>
                                        </div>
                                    </div>
                                    <div className="item-form row py-3">
                                        <div className="mui-select col-4">
                                            <select className="select-text" id="nacionality"  onChange={()=> this.handleChange(event)} required>
                                                <option value="-" disabled selected>Seleccione</option>
                                                {/* {nationalities.length > 0 &&
                                                    nationalities.map(nacionality => {
                                                        return (<option key={uuidv1()} selected value={nacionality.IDNacionalidad}>{nacionality.Nacionalidad}</option>)
                                                    })
                                                } */}
                                            </select>
                                        </div>
                                        <div className="mui-select col-4">
                                            <select className="select-text" id="stateOfBirth"  onChange={()=> this.handleChange(event)} required>
                                                <option  value="-">Seleccione</option>
                                                {/* {entities != null &&
                                                    entities.map(entity => {
                                                        return (<option key={uuidv1()} selected value={entity.IDEntidad}>{entity.EntidadFederativa}</option>)
                                                    })
                                                } */}
                                            </select>
                                            <label className="asterisk">Estado de nacimiento</label>
                                        </div>
                                        <div className="mui-select col-4">
                                            <select className="select-text" id="maritalStatus"   onChange={()=> this.handleChange(event)} required>
                                                <option value="-">Seleccione</option>
                                                {/* {civilStatus != null &&
                                                    civilStatus.map(status => {
                                                        return (<option key={uuidv1()} selected value={status.IDEstadoCivil}>{status.EstadoCivil}</option>)
                                                    })
                                                }                                               */}
                                            </select>
                                            <label className="asterisk">Estado civil</label>
                                        </div>
                                    </div>
                                    <div className="item-form row py-3">
                                        <div className="mui-textfield  col-4">
                                            <input type="text" id="rfc"onChange={()=> this.handleChange(event)}   required />                                           
                                            <label className="asterisk">R.F.C</label>
                                        </div>
                                            <div className="mui-textfield col-4">
                                            <input type="text" id="curp" onChange={()=> this.handleChange(event)}  required />      
                                            <label className="asterisk">C.U.R.P</label>
                                        </div>
                                        <div className="wth-100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-form ">
                            <div className="line-subtitle--form px-2">
                                <span>Información Complementaria</span>
                                <hr/>
                            </div>
                            <div className="box-item--form px-4">
                                <div className="item-form py-3">
                                    <div className="mui-textfield  col-4">
                                        <input type="text" id="address" onChange={()=> this.handleChange(event)}  required />
                                        <label className="asterisk">Direccion</label>
                                    </div>
                                    <div className="mui-textfield  col-4">
                                        <input type="text" id="outdoorNumber"onChange={()=> this.handleChangeNumber(event)} value={this.state.outdoorNumber}required />
                                        <label className="asterisk">Numero exterior</label>
                                    </div>
                                    <div className="mui-textfield  col-4">
                                        <input type="text" id="interiorNumber"  onChange={()=> this.handleChangeNumber(event)} value={this.state.interiorNumber} required />     
                                        <label className="asterisk">Numero Interior</label>
                                    </div>
                                </div>
                                <div className="item-form pt-3 pb-2">
                                    <div className="mui-select col-4">
                                        <select className="select-text" id="state" onChange={()=> this.handleChange(event)}  required>
                                            <option  value="-">Seleccione</option>
                                            {/* {entities.length > 0 &&
                                                entities.map(entity => {
                                                    return (<option key={uuidv1()} selected value={entity.IDEntidad}>{entity.EntidadFederativa}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Estado</label>
                                    </div>
                                    <div className="mui-select col-4">
                                        <select className="select-text" id="city" onChange={()=> this.handleChange(event)} required>
                                            <option  value="-">Seleccione</option>
                                            {/* {cities.length > 0 &&
                                                cities.map(city => {
                                                    return (<option key={uuidv1()} selected value={city.IDCiudad}>{city.Ciudad}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Ciudad</label>
                                    </div>
                                    <div className="mui-select col-4">                                      
                                        <div className="mui-textfield ">
                                            <input type="text" id="municipe"onChange={()=> this.handleChange(event)} />
                                            <label className="select-label">Delegación o Municipio</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-form py-3">
                                    <div className="mui-select col-4">
                                        <select className="select-text" id="colony" onChange={()=> this.handleChange(event)}  required>
                                            <option value="">Seleccione</option>
                                            {/* {colonies.length > 0 &&
                                                colonies.map(colony => {
                                                    return (<option key={uuidv1()} selected value={colony.IDColonia}>{colony.Colonia}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Colonia</label>
                                    </div>
                                    <div className="mui-textfield  col-4">
                                        <input type="text" id="postalCode" required  onChange={()=> this.handleChangeNumber(event)} value={this.state.postalCode} />                                      
                                        <label className="asterisk">Codigo Postal</label>
                                    </div>
                                    <div className="mui-select col-4">
                                        <select className="select-text" id="economicActivity"  onChange={()=> this.handleChange(event)}>
                                            <option  value="-">Seleccione</option>
                                            {/* {economicActivity.length > 0 &&
                                                economicActivity.map(ea => {
                                                    return (<option key={uuidv1()} value={ea.IDActividadEconomica}>{ea.Descripcion}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Actividad economica</label>
                                    </div>
                                </div>
                                <div className="item-form py-3">
                                    <div className="mui-textfield col-4">
                                        <input type="text" id="email"  onChange={()=> this.handleChange(event)} />
                                        <label >Correo Electronico</label>
                                    </div>
                                    <div className="mui-textfield col-4">
                                        <input type="text" id="movil"  onChange={()=> this.handleChangeNumber(event)} value={this.state.movil}/>                                   
                                        <label >Telefono Movil</label>
                                    </div>
                                    <div className="mui-textfield  col-4">
                                            <input type="text" id="otherMovil" onChange={()=> this.handleChangeNumber(event)} value={this.state.otherMovil} />
                                            <label >Otro Telefono</label>
                                    </div>
                                </div>
                                <div className="item-form py-3">
                                    <div className="mui-textfield col-4">
                                        <input type="text" id="housePhone"  onChange={()=> this.handleChangeNumber(event)} value={this.state.housePhone} />                                       
                                        <label >Telefono de Casa</label>
                                    </div>
                                    <div className="mui-textfield  col-4">
                                        <input type="text" id="workPhone"   onChange={()=> this.handleChangeNumber(event)} value={this.state.workPhone}/>                                       
                                        <label >Telefono de trabajo</label>
                                    </div>
                                    <div className="mui-textfield col-4">
                                        <input type="text" id="otherPhone"  onChange={()=> this.handleChangeNumber(event)} value={this.state.otherPhone}/>                               
                                    <label >Otro teléfono</label>
                                    </div>
                                </div>
                                <div className="item-form py-3">
                                    <div className="mui-textfield  col">
                                        <input type="text" id="notes" onChange={()=> this.handleChange(event)} />        
                                        <label >Notas</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-form">
                            <div className="line-subtitle--form px-2">
                                <span>Mercadotenia</span>
                                <hr/>
                            </div>
                            <div className="box-item--form px-4">
                                <div className="item-form row px-4  py-3">
                                    <div className="mui-textfield col-4">
                                        <input type="text" id="howDidYouFindoutAboutUs" onChange={()=> this.handleChange(event)} />
                                        <label >¿Comó se enteró de nosotros?</label>
                                    </div>
                                    <div className="mui-textfield col-4">
                                        <input type="text" id="lastUserWhoAttendedYou"  onChange={()=> this.handleChange(event)} />
                                        <label >Último usuario que lo atendió</label>
                                    </div>
                                    <div className="radio-button col-4">
                                        <label className="label-radio">¿Desea ser cliente referenciador?</label>
                                        <div className="item-radio--button">
                                            <div className="mui-radio col-4">
                                                <input type="radio" id="optionsSi"value="Si" onChange={()=> this.handleChange(event)}/>
                                                <label> Si</label>
                                            </div>
                                            <div className="mui-radio col-4">
                                                <input type="radio" id="optionsNo"value="No" onChange={()=> this.handleChange(event)}/>
                                                <label> No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-form row px-4 py-3">
                                    <div className="radio-button col-4">
                                        <label className="label-radio">¿Acepta usar los datos personales para mercadeo?</label>
                                        <div className="item-radio--button">
                                            <div className="mui-radio col-4">
                                                <input type="radio" id="dataForMarketingSi"value="Si" onChange={()=> this.handleChange(event)}/>
                                                <label> Si</label>
                                            </div>
                                            <div className="mui-radio col-4">
                                                <input type="radio" id="dataForMarketingNo"value="No" onChange={()=> this.handleChange(event)}/>
                                                <label> No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
            :
            <div></div>
            }

            {this.state.step === 75 ? 
            <div>
                <div id="cliente_3">
                    <form className="w-100">
                        <div className="form">
                            <div className="container-form">
                                <div className="row px-2 py-4">
                                    <div className="col-8">
                                        <span>Registro de Cliente Nuevo</span>
                                    </div>
                                    <div className="d-flex justify-content-between col-4">
                                        <button className="btns btn-go" onClick={()=>this.progressBar(50)} >Atras</button>
                                        <button type="submit" className="btns btn-go">Guardar</button>
                                    </div>
                                </div>
                                <div className="row col-8">
                                    <div className="mui-select col-4">
                                            <select className="select-text" id="documentType" onSelect={()=>{this.handleChange(event)}} value={this.state.documentType} required>
                                                <option  value="-" disabled selected>Seleccione</option>
                                                {/* {documentAdressProofList.length > 0 && 
                                                    documentAdressProofList.map(addressProof=> {
                                                        return (<option key={uuidv1()} selected value={addressProof.IDTipoDocumento}>{addressProof.Descripcion}</option>)
                                                    })
                                                } */}
                                        </select>
                                        <label className="asterisk select-label">Comprobante de domicilio</label>
                                    </div>
                                    <div className="mui-textfield mui-textfield--float-label col-4">
                                        <input type="text" id="beginningOfValidity" onChange={()=>{this.handleChange(event)}} value={this.state.beginningOfValidity} required />
                                        <label className="asterisk">Inicio de vigencia</label>
                                        <i className="material-icons icon-calendar">today</i>
                                    </div>
                                    <div className="mui-textfield mui-textfield--float-label col-4">
                                        <input type="text" id="endOfValidity" onChange={()=>{this.handleChange(event)}} value={this.state.endOfValidity} required />
                                        <label className="asterisk">Fin de vigencia</label>
                                        <i className="material-icons icon-calendar">today</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                        <div className="contenedor-imagenes col-8">
                            <div className="contenedor-selector">
                                <input type="file" onChange={()=>{this.handleSetImagem(event)}}/>
            
                                {
                                        

                                        this.state.selectedFiles.length > 0 ?
                                        this.state.selectedFiles.map((file, index) => {                                      
                                        <div >
                                            <img  className="activada" src={this.state.imageSrc} width="200px" height="200px" onClick={() => this.setImageZoom(file.image)} />
                                            <span className="numero">{index}</span>
                                        </div>
                                        })
                                        :
                                        <div>                                        <img  className="activada" src={this.state.imageSrc} width="200px" height="200px"  />
                                            </div>

                                } 
                                </div>
                                {/* {
                                    selectedFiles.length === 0 ? 
                                    <div className="zoom-imagen">
                                            <img id="zoom" src={documentAdressProofClient.length > 0 ? documentAdressProofClient[0].RutaImagen : ""} onClick={() => this.cambiarImagen(this)} />
                                        <i className="material-icons foto-zoom" data-toggle="modal" data-target="#zoom-foto">search</i>
                                        </div> :
                                        <div className="zoom-imagen">
                                            <img id="zoom" src={selectedFiles[0].image} onClick={() => this.cambiarImagen(this)} />
                                            <i className="material-icons foto-zoom" data-toggle="modal" data-target="#zoom-foto">search</i>
                                        </div> 
                                } */}
                        </div>
                        <div className="btn-captura">
                            <a href="#" className="btns btn-se">Capturar</a>
                            <span className="popover-info" data-toggle="popover" data-content="Toma 3 fotografías de la papeleta, selecciona la mejor y asegúrate de que sea legible.
                                    La foto presentada en el recuadro grande es la que se guardará.">
                                    <i className="material-icons">info</i>
                            </span>
                        </div>
                        
                        <div className="table-responsive col-8">
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
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                            </div>
                        </div>
                        
                        <input id="selectFile" type="file" accept="image/x-png,image/gif,image/jpeg" />
                        <button >Seleccionar documento</button> 
                        <div><a className="btns btn-go mt-3 save">Guardar</a></div>   
                    </div>
                    :
            <div></div>
            }
            {this.state.step === 100 ?
            <div className="row pl-3">
             <div className="col-12 row px-2 py-4 ">
                <div className="col">
                    <span>Registro de Cliente Nuevo</span>
                </div>
                <div className="d-flex justify-content-between col-4">
                    <button className="btns btn-go" onClick={()=>this.progressBar(75)} >Atras</button>
                    <button type="submit" className="btns btn-go">Finalizar</button>
                </div>
            </div>
            <div className="form col-8 px-2">
                <div className="item-form col-8 px-2 py-2">
                    <div className="mui-textfield mui-textfield--float-label">
                        <Input label="Nombres" floatingLabel={true} type="text" id="coownerName"   required />
                    </div>
                    <div className="mui-textfield mui-textfield--float-label">
                        <Input label="Primer apellido" floatingLabel={true} type="text" id="coownerLastname"   required />
                    </div>
                    <div className="mui-textfield mui-textfield--float-label">
                        <Input label="Segundo apellido" floatingLabel={true} type="text" id="coownerSecondLastname"   required />
                    </div>
                </div>
                <div className="item-form col-8 px-2 py-2">
                        <div className="mui-select">
                        <select className="select-text" id="coownerType"  required>
                            <option  value="-" disabled selected>Seleccione</option>
                            <option  value="1">Cotitular</option>
                            <option  value="2">Beneficiario</option>
                            </select>
                            <label className="select-label">Tipo</label>
                    </div>
                    <div className="mui-select">
                        <select className="select-text" id="coownerNacionality"  required>
                            <option  value="-" disabled selected>Seleccione</option>
                            {this.state.nationalities.length > 0 &&
                                this.state.nationalities.map(nacionality => {
                                    return (<option  selected value={nacionality.IDNacionalidad}>{nacionality.Nacionalidad}</option>)
                                })
                            }
                        </select>

                    <label className="select-label">Nacionalidad</label>
                </div>
                <div className="mui-textfield mui-textfield--float-label">
                        <Input label="Teléfono" floatingLabel={true} type="text" id="coownerPhone" onChange={this.handleChange.bind(this)} value={this.state.coownerPhone} required />
                    
                    </div>
            </div>
        </div>
        
        <div className="table-responsive col-8 pt-4 mt-2">
            <table className="table pt-5">
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
                        {this.state.coownersList.length > 0 &&
                            this.state.coownersList.map((coOwner, index) => {
                                {
                                    return (
                                        <tr  className={(index % 2) ? "tr-selected" :""} >
                                            <td  className="semibold">{coOwner.Nombres +" "+ coOwner.ApellidoPaterno +" "+ coOwner.ApellidoMaterno}</td>
                                            <td  className="text-center">Cotitular</td>
                                            <td  className="text-center">{coOwner.Nacionalidad}</td>
                                            <td  className="text-center">{coOwner.TelefonoMovil}</td>
                                            <td  className="text-center">
                                                {/*<i key={uuidv1()} className="material-icons">edit</i>*/}
                                                <i  className="material-icons remove">delete</i>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        {
                            this.state.beneficiariesList.length > 0 &&
                            this.state.beneficiariesList.map((beneficiary, index) => {
                                {
                                    return (
                                        <tr className={(index % 2) ? "tr-selected" : ""} >
                                            <td  className="semibold">{beneficiary.Nombres + " " + beneficiary.ApellidoPaterno + " " + beneficiary.ApellidoMaterno}</td>
                                            <td  className="text-center">Beneficiario</td>
                                            <td  className="text-center">{beneficiary.Nacionalidad}</td>
                                            <td  className="text-center">{beneficiary.TelefonoMovil}</td>
                                            <td  className="text-center">
                                                {/*<i key={uuidv1()} className="material-icons">edit</i>*/}
                                                <i  className="material-icons remove">delete</i>
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
            : <div></div>
            }
</div>
        )
    }
}

export default connect(

)(Upclient);