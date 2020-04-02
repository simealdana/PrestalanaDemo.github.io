declare var require: any

import 'datatables.net';

var React = require('react');
var connect = require('react-redux').connect;
var resources = require('../../../Resources');
var uuidv1 = require('uuid/v1');
var Loader = require('react-loader');
var Scripts = require('./Scripts/ScriptParticipantes');

var Modal = require("react-modal");

const swal = require('sweetalert');

class Participantes extends React.Component {

	state = {
		Sucursal: "",
		Fundidora:"",
		Asignacion:"",
		Encargado: "",
		Testigo:"",
		Fecha: "",
		EncargadoModificado: "",
		TestigoModificado: "",
		FechaModificado: "",
		SearchValue: "",
		showModal: false,
		done: true,

		SaveBotonEnabled: true,
	}

	closeModal = () => {
		this.setState({
			Asignacion: "",
			Sucursal: "",
			Fundidora: "",
			EncargadoModificado: "",
			TestigoModificado: "",
			FechaModificado: "",
		});
		this.setState({ showModal: false });
	}

	componentDidMount() {
		Scripts.LoadListadoDeAsignaciones();
		this.handleGetParticipantes();
		this.SetMinDate();
	};

	handleChange(e) {
		var control = document.getElementById(e.target.id) as HTMLInputElement
		this.setState({ [e.target.id]: control.value });
	}

	SetMinDate() {
		var today = new Date().toISOString().split("T")[0];
		document.getElementById("Fecha").setAttribute("min", today);
	}

	SetMinDateModificado(date) {
		var today = new Date(date).toISOString().split("T")[0];
		document.getElementById("FechaModificado").setAttribute("min", today);
	}

	handleGetParticipantes() {
		const { updateParticipantes } = this.props;
		fetch(resources.WebApiGoldenStart + "fundicion/participantesEnFundidora",
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
				updateParticipantes(response)
			})
			.catch((err) => {
				swal('Error', err.message, "error")
			});
	}

	handlePutAsignaciones() {

		const { SaveBotonEnabled } = this.state;

		if (SaveBotonEnabled)
		{

			this.setState({ SaveBotonEnabled: false, done: false })

			if (this.state.Encargado === "" || this.state.Fecha === "" || this.state.Testigo === "" || Scripts.ValidarSeleccion() < 1) {
				this.setState({ SaveBotonEnabled: true, done: true })
				swal("Datos incompletos!", "Asegurese de chequear la(s) fundicion(es)", "warning");
			}
			else {

				if (this.state.Encargado === this.state.Testigo) {
					this.setState({ SaveBotonEnabled: true, done: true })
					swal("El encargado y el testigo no pueden ser la misma persona", "Por favor corrija", "warning");
				}
				else
				{
					fetch(resources.WebApiGoldenStart + "fundicion/guardarAsignaciones",
					{
						mode: 'cors',
						method: "POST",
						headers: new Headers({
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}),
						cache: 'no-cache',
						body: JSON.stringify({
							"IDUsuarioEncargado": this.state.Encargado,
							"FechaFundicion": this.state.Fecha,
							"IDUsuarioTestigo": this.state.Testigo,
							"IDFundicionList": Scripts.ListasSeleccion(),
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
							this.setState({
								Encargado: "",
								Testigo: "",
								Fecha: "",
							});
							Scripts.RefreshList();
							swal("¡La(s) asignación(es) se ha(n) realizado con éxito!", "Puedes consultar las asignaciones en la tabla de la derecha.", "success");
						} else {
							swal("Se produjo un error al intentar guardar los datos!", "No es posible continuar", "warning")
						}
					})
					.catch((err) => {
						this.setState({ SaveBotonEnabled: true, done: true })
						swal("Error!", err.message, "error");
					});
				}

			}
		}
		else 
		{
			swal("En proceso!", "por favor espere que culmine la acción ejecutada", "info");
		}
	}

	handlePutAsignacion() {

		const { SaveBotonEnabled } = this.state;

		if (SaveBotonEnabled) {
			this.setState({ SaveBotonEnabled: false, done: false })

			if (this.state.Asignacion === "" ||
				this.state.FechaModificado === "" ||
				this.state.EncargadoModificado === "" ||
				this.state.Fundidora === "" ||
				this.state.Sucursal === "" ||
				this.state.TestigoModificado === "") {

				swal("Datos incompletos!", "Por favor asegurese de completar la información.", "warning");
			} else {

				if (this.state.EncargadoModificado === this.state.TestigoModificado) {
					this.setState({ SaveBotonEnabled: true, done: true })
					swal("El encargado y el testigo no pueden ser la misma persona", "Por favor corrija", "warning");
				} else {
					fetch(resources.WebApiGoldenStart + "fundicion/editarAsignacion",
						{
							mode: 'cors',
							method: "POST",
							headers: new Headers({
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							}),
							cache: 'no-cache',
							body: JSON.stringify({
								"Asignacion": this.state.Asignacion,
								"Sucursal": this.state.Sucursal,
								"Fecha": this.state.FechaModificado,
								"Encargado": this.state.EncargadoModificado,
								"Testigo": this.state.TestigoModificado,
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
								swal("¡Participantes actualizados con éxito!", "Puedes continuar", "success");
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
			
			}
		} else {
			swal("En proceso!", "por favor espere que culmine la acción ejecutada", "info");
		}
	}

	handleGetAsignacion() {

		this.setState({
			done: false,
			showModal: true
		});

		var control = document.getElementById("corregir") as HTMLInputElement
		console.log(control.value);
		fetch(resources.WebApiGoldenStart + "fundicion/editarAsignacionDeParticipantes?Id=" + control.value,
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
					done: true,
					showModal: true,
					Sucursal: response.Sucursal,
					Fundidora: response.Fundidora,
					Asignacion: control.value,
					FechaModificado: new Date(response.Fecha).toISOString().split("T")[0],
					EncargadoModificado: response.Encargado,
					TestigoModificado: response.Testigo,
				});
				this.SetMinDateModificado(this.state.FechaModificado)
			})
			.catch((err) => {
				swal("Error!", err.message, "error");
			});
	}

	render() {

		const { participantes } = this.props

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
				<div className="item-page--menu item-active">
					<a href="#">Participantes en fundidora</a>
				</div>
			</div>)
		
		var form = (

			<div className="form">
				<div>
					1. Seleccione los Participantes e indique la fecha de visita
                </div>
				<br />
				<div className="select">
					<select className="select-text" id="Encargado" onChange={this.handleChange.bind(this)}
						value={this.state.Encargado}>
						<option key={uuidv1()} value="">Seleccione</option>
						{participantes != null && participantes.map(usuarios => {
							return (<option key={uuidv1()} value={usuarios.IDUsuario}>{usuarios.NombreUsuario}</option>)
						})
						}
					</select>
					<label className="asterisk select-label">Encargado</label>
				</div>
				<div className="select">
					<select className="select-text" id="Testigo" onChange={this.handleChange.bind(this)}
						value={this.state.Testigo}>
						<option key={uuidv1()} value="">Seleccione</option>
						{participantes != null && participantes.map(usuarios => {
							return (<option key={uuidv1()} value={usuarios.IDUsuario}>{usuarios.NombreUsuario}</option>)
							})
						}
					</select>
					<label className="asterisk select-label">Testigo</label>
				</div>
				<div className="item-form">
					<div className="group">
						<input type="Date" id="Fecha" onChange={this.handleChange.bind(this)} value={this.state.Fecha} />
						<span className="bar"></span>
						<label className="asterisk">Fecha de visita</label>
					</div>
				</div>
				<span>* Al asignar visita se dará aviso por correo electrónico al Encargado y al Testigo.</span>
			</div>)

		var EditModal = (

			<Modal isOpen={showModal} style={modalstyle} ariaHideApp={false}>
				<div className="modal-header">
					<label className="title">Editar Participantes en Fundición</label>
					<button type="button" className="close" onClick={this.closeModal} >&times;</button>
				</div>
				<div className="modal-body">
					<form>
						<div>
							<dl className="dl-horizontal">
								<dd>
									<div className="group">
										<input type="text" id="Asignacion" value={this.state.Asignacion} />
										<span className="bar"></span>
										<label className="select-label">Asignacion</label>
									</div>
								</dd>
								<dd>
									<div className="group">
										<input type="text" id="Sucursal" value={this.state.Sucursal} />
										<span className="bar"></span>
										<label className="select-label">Sucursal</label>
									</div>
								</dd>
								<dd>
									<div className="group">
										<input type="text" id="Fundidora" value={this.state.Fundidora} />
										<span className="bar"></span>
										<label className="select-label">Fundidora</label>
									</div>
								</dd>
								<dd>
									<div className="select">
										<select className="select-text" id="EncargadoModificado" onChange={this.handleChange.bind(this)}
											value={this.state.EncargadoModificado}>
											<option key={uuidv1()} value="">Seleccione</option>
											{participantes != null && participantes.map(usuarios => {
												return (<option key={uuidv1()} value={usuarios.IDUsuario}>{usuarios.NombreUsuario}</option>)
											})
											}
										</select>
										<label className="asterisk select-label">Encargado</label>
									</div>
								</dd>
								<dd>
									<div className="select">
										<select className="select-text" id="TestigoModificado" onChange={this.handleChange.bind(this)}
											value={this.state.TestigoModificado}>
											<option key={uuidv1()} value="">Seleccione</option>
											{participantes != null && participantes.map(usuarios => {
												return (<option key={uuidv1()} value={usuarios.IDUsuario}>{usuarios.NombreUsuario}</option>)
											})
											}
										</select>
										<label className="asterisk select-label">Testigo</label>
									</div>
								</dd>
								<dd>
									<div className="group">
										<input type="Date" id="FechaModificado" onChange={this.handleChange.bind(this)} value={this.state.FechaModificado} />
										<span className="bar"></span>
										<label className="asterisk">Fecha de visita</label>
									</div>
								</dd>
							</dl>
						</div>
					</form>
				</div>
				<div className="modal-footer">
					<a href="#" className="btns btn-se" onClick={this.closeModal}>cancelar</a>
					<a href="#" className="btns btn-go siguiente" onClick={() => this.handlePutAsignacion()}>Guardar</a>
				</div>
			</Modal>)

		var table = (

			<div>
				<div>
					2. Seleccione la(s) fundicion(es) pendientes
                </div>
				<br/>
				<div className="box-data">
					<div className="search">
						<div className="group">
							<input type="text" id="SearchValue" placeholder="Buscar" onChange={this.handleChange.bind(this)} />
							<span className="bar"></span>
							<a href="#" className="link"><i className="material-icons icon-search">search</i></a>
						</div>
					</div>
					<div className="overflow-auto" style={{ padding: "10px" }}>
						<table id="ListadoAsignaciones" className="table table-hover" style={{ width: "100%" }}>
							<thead>
								<tr style={{ display: "none" }}>
									<th></th>
									<th></th>
									<th></th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
						<br />
						<span>* Las visitas ya realizadas se presentan en gris</span>
						<input id="corregir" style={disableDivs} type="text" onClick={() => this.handleGetAsignacion()} />
					</div>
				</div>
			</div>)

		var Save = (

			<div>
				<br />
				<span>
					3. Asigne los participantes
                </span>
				<br />
				<a href="#" className="btns btn-go visita" onClick={() => this.handlePutAsignaciones()}>Asignar</a>
			</div>)

		return (

			<div>
				<div className="header">
					{links}
				</div>
				<div className="content-page">
					{showModal ? EditModal : null}
					<div className="row" id="double_div">
						<Loader loaded={SaveBotonEnabled} />
						<div className="col-4">
							<fieldset>{form}</fieldset>
							{Save}
						</div>
						<div className="col-8">
							{table}
						</div>
					</div>
				</div>
			</div>);
	}
}

function mapStateTopProps(state) {
	return {
		participantes: state.participantes.participantes,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateParticipantes: participantes => {
			dispatch({ type: "UPDATE_PARTICIPANTES", payload: participantes})
		},
	}
}

export default connect(mapStateTopProps, mapDispatchToProps)(Participantes);
