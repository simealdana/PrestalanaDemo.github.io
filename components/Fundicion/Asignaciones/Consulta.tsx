declare var require: any

import 'datatables.net';

var React = require('react');
var connect = require('react-redux').connect;
var Redirect = require('react-router-dom').Redirect;
var resources = require('../../../Resources');
var uuidv1 = require('uuid/v1');
var Loader = require('react-loader');
var Scripts = require('./Scripts/ScriptConsulta');

var Modal = require("react-modal");

const swal = require('sweetalert');

class Consulta extends React.Component {

	state = {
		Asignacion: "",
		Sucursal: "",
		Fecha: "",
		Auditor: "",
		Fundidora: "",
		Region: "",
		Estado:"",
		SearchValue: "",
		redirect: false,
		showModal: false,
		done: true,
		SaveBotonEnabled: true,
	}

	componentDidMount() {
		Scripts.LoadListadoDeAsignaciones();
	};

	handleChange(e) {
		var control = document.getElementById(e.target.id) as HTMLInputElement
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
		} else {
			this.setState({ [e.target.id]: control.value });
		}
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
				console.log('Error', err.message);
			});
	}

	handleGetRegionDeSucursal(Id) {
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
				this.setState({
					["Region"]: response,
				});
			})
			.catch((err) => {
				console.log('Error', err.message);
			});
	}

	handleGetAsignacion() {

		const { updateSucursales, updateAuditores, updateFundidoras } = this.props;

		this.setState({
			done: false,
			showModal: true
		});

		var control = document.getElementById("corregir") as HTMLInputElement

		fetch(resources.WebApiGoldenStart + "fundicion/getAsignacion?Id=" + control.value,
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
			updateSucursales(response.Sucursales);
			updateAuditores(response.Auditores);
			updateFundidoras(response.Fundidoras);
			this.setState({
				done: true,
				showModal: true,
				Asignacion: response.Asignacion.IDAsignacion,
				Sucursal: response.Asignacion.IDSucursal,
				Fecha: new Date(response.Asignacion.FechaVisitaAuditor).toISOString().split("T")[0],
				Auditor: response.Asignacion.IDAuditorEnSucursal,
				Fundidora: response.Asignacion.IDFundidora,
				Region: response.Asignacion.IDRegion,
				Estado: response.Asignacion.Estado,
			});
			this.SetMinDate(this.state.Fecha)
		})
		.catch((err) => {
			console.log('Error', err.message);
		});
	}

	handlePutAsignacion() {

		const { SaveBotonEnabled } = this.state;

		if (SaveBotonEnabled) {
			this.setState({ SaveBotonEnabled: false, done: false })

			if (this.state.Sucursal === "" ||
				this.state.Fecha === "" ||
				this.state.Auditor === "" ||
				this.state.Fundidora === "" ||
				this.state.Region === "") {
				swal("Datos incompletos!", "Por favor asegurese de completar la información.", "warning");
			} else {

				fetch(resources.WebApiGoldenStart + "fundicion/putAsignacion",
				{
					mode: 'cors',
					method: "POST",
					headers: new Headers({
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}),
					cache: 'no-cache',
					body: JSON.stringify({
						"IDFundicion": this.state.Asignacion,
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
						this.setState({ SaveBotonEnabled: true, done: true })
						if (response === true) {
							Scripts.RefreshList();
							swal("¡Asignacion actualizada con éxito!", "Puedes continuar", "success");
							this.closeModal();

						} else {
							swal("Error!", "Se produjo un error al intentar actualizar los datos", "warning");
						}
					})
					.catch((err) => {
						this.setState({ done: true, SaveBotonEnabled: true })
						swal("Error!", err.message, "error");
					});
				}
		} else {
			swal("En proceso!", "por favor espere que culmine la acción ejecutada", "info");
		}
	}

	SetMinDate(date) {
		var today = new Date(date).toISOString().split("T")[0];
		document.getElementById("Fecha").setAttribute("min", today);
	}

	renderRedirect = () => {
		if (this.state.redirect) {
			return (
				<Redirect
					to={{
						pathname: "/Fundicion/Asignaciones",
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

	closeModal = () => {
		this.setState({
			Asignacion: "",
			Sucursal: "",
			Fecha: "",
			Auditor: "",
			Region: "",
			Fundidora: "",
			Estado: "",
		});
		this.setState({ showModal: false });
	}

	render() {

		const { sucursales, auditores, fundidoras } = this.props

		const { showModal, done, SaveBotonEnabled } = this.state;

		const disableDivs = { 'display': 'none' };

		const modalstyle = {
			content: {
				top: '50%',
				left: '50%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)'
			}
		};

		var links = (

			<div className="tab-page--menu col-10">
				<div className="item-page--menu">
					<a onClick={this.setRedirect}>Asignación de Auditoría</a>
				</div>
				<div className="item-page--menu item-active">
					<a>Consulta Auditoría</a>
				</div>
			</div>)

		var title = (

			<div className="text-button--right">
				<div className="paragraph dp-flex">
					<span>
						Listado de auditorías asignadas
					</span>
					<div className="popover-block-container">
						<button type="button" className="popover-icon" data-popover-content="#unique-id" data-toggle="popover" data-placement="right">
							<i className="material-icons" style={{ color: "gray" }}>info_outlined</i>
						</button>
						<div id="unique-id" style={{ display: "none", width: "1000px" }}>
							<div className="popover-body">
								<div className="dp-flex align-items-center">
									<span className="circle circle-green"></span>
									<span>El paquete de oro elaborado llego a la fundidora y se ha fundido con éxito</span>
								</div>
								<div className="dp-flex align-items-center">
									<span className="circle circle-yellow"></span>
									<span>El paquete de oro se encuentra en proceso de elaboración.</span>
								</div>
								<div className="dp-flex align-items-center">
									<span className="circle circle-blue"></span>
									<span>El paquete de oro elaborado ha sido entregado a la recolectora.</span>
								</div>
								<div className="dp-flex align-items-center">
									<span className="circle circle-red"></span>
									<span>Exclusivamente por reposición de prendas en caso de algún siniestro.</span>
								</div>
								<div className="dp-flex align-items-center">
									<span className="circle circle-violet"></span>
									<span>El paquete de oro se ha elaborado con éxito, pero no ha salido de la sucursal.</span>
								</div>
								<div className="dp-flex align-items-center">
									<span className="circle circle-gray"></span>
									<span>El paquete de oro ha sido asignado pero el responsable no ha acudido a la sucursal para su elaboración.</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>)

		var table = (

			<div className="box-data">
				<div className="search">
					<div className="group">
						<input type="text" id="SearchValue" placeholder="Buscar" onChange={this.handleChange.bind(this)} />
						<span className="bar"></span>
						<a className="link"><i className="material-icons icon-search">search</i></a>
					</div>
				</div>
				<div className="overflow-auto" style={{ padding: "10px" }}>
					<table id="ListadoAsignaciones" className="table table-hover" style={{ width: "100%" }}>
						<thead>
							<tr style={{ display: "none" }}>
								<th>ID</th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
							</tr>
						</thead>
					</table>
				</div>
				<input id="corregir" style={disableDivs} type="text" onClick={() => this.handleGetAsignacion()}  />
			</div>)

		var EditModal = (

			<Modal isOpen={showModal} style={modalstyle} ariaHideApp={false}>
				<div className="modal-header">
					<label className="title">Editar la asignación de auditoría</label>
					<button type="button" className="close" onClick={ this.closeModal } >&times;</button>
				</div>
				<div className="modal-body">
					<Loader loaded={done} />
					<div className="form">
						<div className="item-form">
							<div className="group">
								<input id="Asignacion" type="text" value={this.state.Asignacion}/>
								<span className="bar"></span>
								<label className="asterisk">No. de asignación</label>
							</div>
							<div className="group">
								<input id="Estado" type="text" value={this.state.Estado} />
								<span className="bar"></span>
								<label className="asterisk">Estado</label>
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
							<div className="select">
								<select className="select-text" id="Sucursal" onChange={this.handleChange.bind(this)}
									value={this.state.Sucursal}>
									<option key={uuidv1()} value="">Seleccione</option>
									{sucursales != null && sucursales.map(sucursal => {
										return (<option key={uuidv1()} value={sucursal.IDSucursal}>{sucursal.Sucursal}</option>)
									})
									}
								</select>
								<label className="asterisk select-label">Sucursal</label>
							</div>
						</div>
						<div className="item-form">
							<div className="select">
								<select className="select-text" id="Auditor" onChange={this.handleChange.bind(this)}
									value={this.state.Auditor}>
									<option key={uuidv1()} value="">Seleccione</option>
									{auditores != null && auditores.map(usuarios => {
										return (<option key={uuidv1()} value={usuarios.IDUsuario}>{usuarios.NombreUsuario}</option>)
									})
									}
								</select>
								<label className="asterisk select-label">Nombre del auditor</label>
							</div>
							<div className="group">
								<input type="text" id="Region" value={this.state.Region}/>
								<span className="bar"></span>
								<label className="asterisk">Región</label>
							</div>
						</div>
						<div className="item-form">
							<div className="group">
								<input type="Date" id="Fecha" onChange={this.handleChange.bind(this)} value={this.state.Fecha} />
								<span className="bar"></span>
								<label className="asterisk">Fecha de visita</label>
							</div>
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<a href="#" className="btns btn-se" onClick={this.closeModal}>cancelar</a>
					<a href="#" className="btns btn-go siguiente" onClick={() => this.handlePutAsignacion()}>Guardar</a>
				</div>
			</Modal>)

		return (

			<div>
				<div className="header">
					{links}
				</div>
				<div className="content-page consulta-auditoria">
					{title}
					{table}
					{showModal ? EditModal : null }
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
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateSucursales: sucursales => {
			dispatch({ type: "UPDATE_SUCURSALES", payload: sucursales })
		},
		updateFundidoras: fundidoras => {
			dispatch({ type: "UPDATE_FUNDIDORAS", payload: fundidoras })
		},
		updateAuditores: auditores => {
			dispatch({ type: "UPDATE_AUDITORES", payload: auditores })
		},
		updateAsignacion: asignacion => {
			dispatch({ type: "UPDATE_ASIGNACION", payload: asignacion })
		},
	}
}

export default connect(mapStateTopProps, mapDispatchToProps)(Consulta);
