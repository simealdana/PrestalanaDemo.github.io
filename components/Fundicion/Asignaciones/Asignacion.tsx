declare var require: any

import 'datatables.net';

var React = require('react');
var connect = require('react-redux').connect;
var Scripts = require('./Scripts/ScriptAsignacion');
var ScriptsFundicion = require('../Scripts/Script');
var resources = require('../../../Resources');
var uuidv1 = require('uuid/v1');
var Loader = require('react-loader');
var Redirect = require('react-router-dom').Redirect;

const swal = require('sweetalert');

class Asignacion extends React.Component {

	state = {
		Tipo: "",
		Sucursal: "",
		Auditor: "",
		Fundidora: "",
		Fecha: "",
		Region: "",
		SaveBotonEnabled: true,
		redirect: false,
	}

	renderRedirect = () => {
		if (this.state.redirect) {
			return (
				<Redirect
					to={{
						pathname: "/Fundicion/Consultas",
					}}
				/>
			);
		}
	}

	setRedirect = () => {
		this.setState({
			redirect: true
		});
	};

	componentDidMount() {
		Scripts.LoadSucursalesParaAuditar();
		Scripts.LoadSucursalesAuditadas();
		Scripts.SetSucursalParaAuditar();
		ScriptsFundicion.SetLinkTitle("Fundición");
		this.handleGetSucursales();
		this.handleGetFundidoras();
		this.SetMinDate();
	};

	handleChange(e) {
		var control = document.getElementById(e.target.id) as HTMLSelectElement
		if (e.target.id === "Sucursal") {
			this.setState({
				[e.target.id]: control.value,
				["Auditor"]: "",
				["Region"]: "",
			});
			if (control.value !== "") {
				this.handleGetAuditores(control.value);
				this.handleGetRegionDeSucursal(control.value);
			}
		}
		else {
			this.setState({ [e.target.id]: control.value });
		}
	}

	handleGetSucursales() {
		const { updateSucursales } = this.props;
		fetch(resources.WebApiGoldenStart + "fundicion/sucursalesConPrendasParaFundir",
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
			updateSucursales(response)
		})
		.catch((err) => {
			swal("Error!", err.message, "error");
		});
	}

	handleGetRegionDeSucursal(Id) {
		const { updateRegion } = this.props;
		fetch(resources.WebApiGoldenStart + "fundicion/regionDeSucursal?idSucursal=" + Id,
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
			updateRegion(response)
			this.setState({
				["Region"]: response,
			});
		})
		.catch((err) => {
			swal("Error!", err.message, "error");
		});
	}

	handleGetFundidoras() {
		const { updateFundidoras } = this.props;
		fetch(resources.WebApiGoldenStart + "fundicion/listadoFundidoras",
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
			updateFundidoras(response)
		})
		.catch((err) => {
			console.log('Error', err.message);
		});
	}

	handleGetAuditores(Id) {
		const { updateAuditores } = this.props;
		fetch(resources.WebApiGoldenStart + "fundicion/auditoresDeSucursal?IdSucursal=" + Id,
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
			updateAuditores(response)
		})
		.catch((err) => {
			swal("Error!", err.message, "error");
		});
	}

	SetMinDate() {
		var today = new Date().toISOString().split("T")[0];
		document.getElementById("Fecha").setAttribute("min", today);
	}

	handleSaveAsignacion() {
		const { SaveBotonEnabled } = this.state;
		if (SaveBotonEnabled){
			if (this.state.Sucursal === "" ||
				this.state.Fecha === "" ||
				this.state.Auditor === "" ||
				this.state.Fundidora === "" ||
				this.state.Region === "") {
				this.setState({ SaveBotonEnabled: true })
				swal("Datos incompletos!", "Por favor asegurese de completar la información.", "warning");
			} else {
				this.setState({ SaveBotonEnabled: false })
				fetch(resources.WebApiGoldenStart + "fundicion/GuardarAsignacion",
					{
						mode: 'cors',
						method: "POST",
						headers: new Headers({
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}),
						cache: 'no-cache',
						body: JSON.stringify({
							"IDSucursal": this.state.Sucursal,
							"FechaVisitaAuditor": this.state.Fecha,
							"IDAuditorEnSucursal": this.state.Auditor,
							"IDFundidora": this.state.Fundidora,
							"IDRegion": parseInt(this.state.Region),
						})
					}).then(response => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP stuff');
						}
					}).then(response => {
						this.setState({ SaveBotonEnabled: true })
						if (response === true) {
							this.setState({
								["Sucursal"]: "",
								["Fecha"]: "",
								["Auditor"]: "",
								["Region"]: "",
								["Fundidora"]: "",
							});
							swal("¡Asignacion realizada con éxito!", "Puedes continuar", "success");
						} else {
							swal("Error!", "Ya esta asignada una visita para la fecha seleccionada \n (o se produjo un error al intentar guardar)", "warning");
						}
					})
					.catch((err) => {
						this.setState({ SaveBotonEnabled: true })
						swal("Error!", err.message, "error");
					});
			}
		}
		else {
			swal("En proceso!", "por favor espere que culmine la acción ejecutada", "info");
		}
	}

	render() {

		const { sucursales, auditores, fundidoras } = this.props

		const { SaveBotonEnabled } = this.state;

		var links = (

			<div className="tab-page--menu col-10">
				<div className="item-page--menu item-active">
					<a href="#">Asignación de Auditoría</a>
				</div>
				<div className="item-page--menu">
					<a onClick={this.setRedirect}>Consulta Auditoría</a>
				</div>
			</div>)

		var options = (

			<div className="text-button--right">
				<div className="paragraph">
					<label id="lbtitle">Asignación auditoría de sucursal.</label>
				</div>
				<div className="buttons">
					<a href="#" className="btns btn-se">Cancelar</a>
					<a onClick={() => this.handleSaveAsignacion()} className="btns btn-go visita">Asignar visita</a>
				</div>
			</div>)

		var form = (

			<div className="form">
				<div className="item-form">
					<div className="select">
						<select className="select-text" id="Tipo" onChange={this.handleChange.bind(this)}>
							<option key={uuidv1()} value="">Seleccione</option>
							<option value="1">Auditor en sucursal</option>
						</select>
						<label className="asterisk select-label">Tipo de asignación</label>
					</div>
					<div className="select">
						<select className="select-text" id="Sucursal" onChange={this.handleChange.bind(this)}
							value={this.state.Sucursal}>
							<option key={uuidv1()} value="">Seleccione</option>
							{sucursales != null && sucursales.map(sucursal =>
								{
								return (<option key={uuidv1()} value={sucursal.IDSucursal}>{sucursal.Sucursal}</option>)
								})
							}
						</select>
						<label className="asterisk select-label">Sucursal</label>
					</div>
					<div className="select">
						<select className="select-text" id="Auditor" onChange={this.handleChange.bind(this)}
							value={this.state.Auditor}>
							<option key={uuidv1()} value="">Seleccione</option>
							{auditores != null && auditores.map(usuarios => {
								return (<option key={uuidv1()} value={usuarios.IDUsuario}>{usuarios.NombreUsuario}</option>)
								})
							}
						</select>
						<label id="lbParticipante" className="asterisk select-label">Nombre del auditor</label>
					</div>
				</div>
				<div className="item-form">
					<div className="select">
						<select className="select-text" id="Fundidora" onChange={this.handleChange.bind(this)}
							value={this.state.Fundidora}>
							<option key={uuidv1()} value="">Seleccione</option>
							{fundidoras != null && fundidoras.map(fundidora => {
								return (<option key={uuidv1()} value={fundidora.IDFundidora}>{fundidora.NombreFundidora}</option>)
								})
							}
						</select>
						<label className="asterisk select-label">Fundidora</label>
					</div>
					<div className="group">
						<input type="Date" id="Fecha" onChange={this.handleChange.bind(this)} value={this.state.Fecha}/>
						<span className="bar"></span>
						<label className="asterisk">Fecha de visita</label>
					</div>
					<div className="group">
						<input type="text" id="Region" value={this.state.Region}/>
						<span className="bar"></span>
						<label className="asterisk">Región</label>
					</div>
				</div>
			</div>)

		var SucursalesParaAuditar = (

			<div className="box-table m-right--50px" style={{ width: 545 }}>
				<div className="box-titulo"><span>Sucursales a auditar</span></div>
				<table id="ListadoSucursales" className="table">
					<thead>
						<tr>
							<th></th>
							<th className="text-left bold">Sucursal</th>
							<th className="text-center bold">Región</th>
							<th className="text-center bold">No. Partidas</th>
							<th className="text-center bold">Costo Paquete</th>
						</tr>
					</thead>
				</table>
			</div>)

		var SucursalesAuditadas = (

			<div className="box-table">
				<div className="box-titulo"><span>Sucursales auditadas</span></div>
				<table id="SucursalesAuditadas" className="table" style={{ width: 450 }}>
					<thead>
						<tr>
							<th className="text-left bold">Sucursal</th>
							<th className="text-center bold">Región</th>
							<th className="text-center bold">Fecha visita</th>
						</tr>
					</thead>
				</table>
			</div>)

		return (

			<div>
				<div className="header">
					{links}
				</div>
				<div className="content-page asignacion-auditoria">
					{options}
					<Loader loaded={SaveBotonEnabled} />
					<fieldset>{form}</fieldset>
					<div className="dp-flex m-bottom--20px">
						{SucursalesParaAuditar}
						{SucursalesAuditadas}
					</div>
				</div>
				{this.renderRedirect()}
			</div>);
	}
}

function mapStateTopProps(state) {
	return {
		sucursales: state.asignacion.sucursales,
		fundidoras: state.asignacion.fundidoras,
		auditores: state.asignacion.auditores,
		asignacion: state.asignacion.asignacion,
		region: state.asignacion.region,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateSucursales: sucursales => {
			dispatch({ type: "UPDATE_SUCURSALES", payload: sucursales})
		},
		updateRegion: region => {
			dispatch({ type: "UPDATE_REGION", payload: region })
		},
		updateFundidoras: fundidoras => {
			dispatch({ type: "UPDATE_FUNDIDORAS", payload: fundidoras })
		},
		updateAuditores: auditores => {
			dispatch({ type: "UPDATE_AUDITORES", payload: auditores })
		},
		updateClient: asignacion => {
			dispatch({ type: "UPDATE_ASIGNACION", payload: asignacion })
		},
	}
}

export default connect(mapStateTopProps, mapDispatchToProps)(Asignacion);

