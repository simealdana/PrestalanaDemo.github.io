const React = require('react');
const Input = require('muicss/lib/react/input');
const connect = require('react-redux').connect;

class GeneralInfo extends React.Component {
    // constructor(){
    //     super(props)
    // }

    render(){
        return(
        <div>

                <div className="tab-pane fade cliente-info-general" >
                    <div className="form ">
                    <div className="container-form ">
                        <div className="line-subtitle--form">
                            <span>Información básica</span>
                            <hr/>
                        </div>
                        <div className="dp-flex ">
                            <div className="photo-cliente ">
                                <div className="photo">
                                <button type="button" >Capturar foto</button>
                                </div>
                            </div>
                            <div className="box-item--form ">
                                <div className="item-form">
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <Input label="Input 1" floatingLabel={true} type="text" id="registerDate"  required />
                                        <i className="material-icons icon-calendar">today</i>
                                    </div>
                                        <div className="mui-select">
                                            <select className="select-text" id="identificationType" required>
                                                <option value="-">1</option>
                                                <option value="1">1</option>
                                                <option value="-">1</option>
                                            </select>
                                            <label className="asterisk">Tipo de identificacion</label>
                                    </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="identificationNumber"  required />
                                        
                                            <label className="asterisk">NUmero</label>
                                        <i className="material-icons" data-toggle="modal" data-target="#modal-documento--identificacion">attach_file</i>
                                    </div>
                                </div>
                                <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="clientName"  required />
                                        
                                            <label className="asterisk">Nombre</label>
                                    </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="clientFirstLastName"    required />
                                            
                                            <label className="asterisk">Primer Apellido</label>
                                    </div>
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="clientSecondLastName"   required />
                                            
                                            <label className="asterisk">Segundo Apellido</label>
                                    </div>
                                </div>
                                <div className="item-form">
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="dateOfBirth"  required />
                                            
                                            <label className="asterisk">Fecha de nacimiento</label>
                                        <i className="material-icons icon-calendar">today</i>
                                    </div>
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="age"  required />
                                        
                                            <label>Edad</label>
                                    </div>
                                        <div className="mui-select">
                                            <select className="select-text" id="gender"  required>
                                                <option value="Seleccione" selected>Seleccione</option>
                                                <option  value="M">Masculino</option>
                                                <option  value="F">Femenino</option>
                                            </select>
                                            <label className="select-label">Sexo</label>
                                    </div>
                                </div>
                                    <div className="item-form">


                                        <select className="select-text" id="nacionality"  required>
                                            <option value="-" disabled selected>Seleccione</option>
                                            {/* {nationalities.length > 0 &&
                                                nationalities.map(nacionality => {
                                                    return (<option key={uuidv1()} selected value={nacionality.IDNacionalidad}>{nacionality.Nacionalidad}</option>)
                                                })
                                            } */}
                                        </select>


                                        <div className="mui-select">
                                            <select className="select-text" id="stateOfBirth"  required>
                                                <option  value="-">Seleccione</option>
                                                {/* {entities != null &&
                                                    entities.map(entity => {
                                                        return (<option key={uuidv1()} selected value={entity.IDEntidad}>{entity.EntidadFederativa}</option>)
                                                    })
                                                } */}
                                            </select>
                                            <label className="asterisk">Estado de nacimiento</label>
                                    </div>

                                        <div className="mui-select">
                                            <select className="select-text" id="maritalStatus"   required>
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
                                <div className="item-form">
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="rfc"   required />
                                            
                                            <label className="asterisk">R.F.C</label>
                                    </div>
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="curp"   required />
                                            
                                            <label className="asterisk">C.U.R.P</label>
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
                                        <input type="text" id="address"   required />
                                        <label className="asterisk">Direccion</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text"  required />
                                        <label className="asterisk">Numero exterior</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="interiorNumber"  required />
                                        
                                        <label className="asterisk">Numero Interior</label>
                                </div>
                            </div>
                                <div className="item-form">
                                 

                                    <div className="mui-select">
                                        <select className="select-text" id="state"  required>
                                            <option  value="-">Seleccione</option>
                                            {/* {entities.length > 0 &&
                                                entities.map(entity => {
                                                    return (<option key={uuidv1()} selected value={entity.IDEntidad}>{entity.EntidadFederativa}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Estado</label>
                                    </div>

                                    <div className="mui-select">
                                        <select className="select-text" id="city"  required>
                                            <option  value="-">Seleccione</option>
                                            {/* {cities.length > 0 &&
                                                cities.map(city => {
                                                    return (<option key={uuidv1()} selected value={city.IDCiudad}>{city.Ciudad}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Ciudad</label>
                                    </div>

                                    <div className="mui-select">
                                       
                                        <div className="mui-textfield mui-textfield--float-label">
                                            <input type="text" id="municipe" />
                                            <label className="select-label">Delegación o Municipio</label>
                                        </div>
                                    </div>
                            </div>
                                <div className="item-form">

                                    <div className="mui-select">
                                        <select className="select-text" id="colony"  required>
                                            <option value="-">Seleccione</option>
                                            {/* {colonies.length > 0 &&
                                                colonies.map(colony => {
                                                    return (<option key={uuidv1()} selected value={colony.IDColonia}>{colony.Colonia}</option>)
                                                })
                                            } */}
                                        </select>
                                        <label className="select-label">Colonia</label>
                                    </div>



                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="postalCode" required />
                                        
                                        <label className="asterisk">Codigo Postal</label>
                                    </div>

                                    <div className="mui-select">
                                        <select className="select-text" id="economicActivity" required>
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
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="email"   required />
                                        <label className="asterisk">Correo Electronico</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="movil"   required />
                                    
                                        <label className="asterisk">Telefono Movil</label>
                                </div>
                                <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="otherMovil"  required />
                                        <label className="asterisk">Otro Telefono</label>
                                </div>
                            </div>
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="housePhone"  required />
                                        
                                        <label className="asterisk">Telefono de Casa</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="workPhone"  required />
                                        
                                        <label className="asterisk">Telefono de trabajo</label>
                                </div>
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="otherPhone"  required />
                                    
                                    <label className="asterisk">Otro teléfono</label>
                                </div>
                            </div>
                            <div className="item-form">
                                    <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="notes" required />
                                        
                                        <label className="asterisk"></label>
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
                                        <input type="text" id="howDidYouFindoutAboutUs"  required />
                                    <label className="asterisk">¿Comó se enteró de nosotros?</label>
                                </div>
                                <div className="mui-textfield mui-textfield--float-label">
                                        <input type="text" id="lastUserWhoAttendedYou" required />
                                    <label className="asterisk">Último usuario que lo atendió</label>
                                </div>
                                <div className="radio-button">
                                    <label className="label-radio">¿Desea ser cliente referenciador?</label>
                                    <div className="item-radio--button">
                                            <div className="pd-right--30px">
                                                <input type="radio" id="referralClientSi" value="Si" />
                                                Si
                                        </div>
                                        <div>
                                                <input type="radio" id="referralClientNo" value="No" />
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
                                                <input type="radio" id="dataForMarketingSi" value="Si" />
                                                Si
                                        </div>
                                        <div>
                                                <input type="radio" id="dataForMarketingNo" value="No" />
                                                No
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>
                        <a className="btns btn-go">Guardar</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(

    )(GeneralInfo);