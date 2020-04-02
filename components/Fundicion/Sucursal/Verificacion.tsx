declare var require: any
var React = require('react');
var connect = require('react-redux').connect;
var Loader = require('react-loader');
var Redirect = require('react-router-dom').Redirect;
var resources = require('../../../Resources');
const swal = require('sweetalert');

class Verificacion extends React.Component {

	state = {
		flagPendiente: false,
		done: false,
		redirect: false,
	}

	setRedirect = () => {
		if (this.state.flagPendiente == true) {
			this.setState({ redirect: true });
		} 
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return (
				<Redirect
					to={{
						pathname: "/Fundicion/Sucursal/Recoleccion",
					}}
				/>
			);
		}
	}

	componentDidMount() {
		this.handleGetDatosAsignacion();
	};

	handleGetDatosAsignacion() {

		const { updateDatosAsignacion } = this.props;

		fetch(resources.WebApiGoldenStart + "fundicion/verificacionDeDatos",
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
				this.setState({ flagPendiente: response.flagPendiente })
				if (response.verificacionDatos == null) {
					swal("!No tienes ninguna asignación!", "Por favor consultalo con el jefe de auditoria", "warning");
				} else {
					var dtosasig = [{
						IDSucursal: response.verificacionDatos.IDSucursal,
						IDFundicion: response.verificacionDatos.IDFundicion,
						Fundidora: response.verificacionDatos.Fundidora,
						Auditor: response.verificacionDatos.Persona,
						Sucursal: response.verificacionDatos.Sucursal,
						Region: response.verificacionDatos.Region,
						Fecha: response.verificacionDatos.Fecha,
						Prendas: response.verificacionDatos.Prendas,
						CostoPaquete: response.verificacionDatos.CostoPaquete,
						PrendasAuditado: "00",
						CostoAuditado: "$0.00",
						PrendasIncidencia: "00",
						CostoIncidencia: "$0.00",
					}];
					updateDatosAsignacion(dtosasig);
				}
			})
			.catch((err) => {
				swal("Error!", err.message, "error");
			});

		this.setState({ done: true });
	}

	render() {

		const { datosAsignacion } = this.props

		const { done, flagPendiente } = this.state;

		var header = (

			<div className="header">
				<div className="tab-page--menu col-10">
					<div id="verificacionDeDatosAuditor" className="item-page--menu item-active">
						<a>Verificación de Datos</a>
					</div>
					<div id="recoleccionDeOro" className="item-page--menu">
						<a>Recolección de Oro</a>
					</div>
					<div id="capturaDePapeleta" className="item-page--menu">
						<a>Captura de Papeleta</a>
					</div>
					<div id="validacionPeso" className="item-page--menu">
						<a>Validación de Peso</a>
					</div>
					<div id="actaDeHechos" className="item-page--menu">
						<a>Acta de Hechos</a>
					</div>
				</div>
			</div>)

		const warningStyle = { 'color': 'gray', 'fontSize': '30px' };
	
		var warningMessage = (
			
			<div className="text-button--right">
				<div className="paragraph">
					<span className="material-icons" style={warningStyle}>warning</span>
					No se encontró un registro de visita pendiente para esta fecha o los datos de la Asignación no están completos. Por favor verifique.
				</div>
			</div>)

		var form = (

			<div>
				<div className="text-button--right">
					<div className="paragraph">
						<span>
							Verifica que los datos que te asignó tu gerente coincidan con la visita a la sucursal.
						</span>
					</div>
					<div className="buttons">
						<a onClick={this.setRedirect} className="btns btn-go">Siguente</a>
					</div>
				</div>
				<div className="form">
					<div className="item-form">
						<div className="mui-textfield mui-textfield--float-label">
							<input id="dateFechaAsignacion" type="text" defaultValue={datosAsignacion[0].Fecha} />
							<label>Fecha</label>
						</div>
						<div className="mui-textfield mui-textfield--float-label">
							<input id="regionAsignacion" type="text" defaultValue={datosAsignacion[0].Region} />
							<label>Región</label>
						</div>
						<div className="mui-textfield mui-textfield--float-label">
							<input id="fundidoraAsignacion" type="text" defaultValue={datosAsignacion[0].Fundidora} />
							<label>Fundidora</label>
						</div>
					</div>
					<div className="item-form">
						<div className="mui-textfield mui-textfield--float-label">
							<input id="prendasAsignacion" type="text" defaultValue={datosAsignacion[0].Prendas} />
							<label>N° de Prendas</label>
						</div>
						<div className="mui-textfield mui-textfield--float-label">
							<input id="auditorAsignacion" type="text" defaultValue={datosAsignacion[0].Auditor} />
							<label>Auditor en sucursal</label>
						</div>
						<div className="mui-textfield mui-textfield--float-label">
							<input id="costoVitrinaOroAsignacion" type="text" defaultValue={datosAsignacion[0].CostoPaquete} />
							<label>Costo de paquete</label>
						</div>
					</div>
					<div className="item-form">
						<div className="mui-textfield mui-textfield--float-label">
							<input id="sucursalAsignacion" type="text" defaultValue={datosAsignacion[0].Sucursal} />
							<label>Sucursal</label>
						</div>
					</div>
				</div>
			</div>)

		return (

			<div>
				{header}
				<div className="content-page verificacion-datos">
					<Loader loaded={done} />
					{flagPendiente ? form : warningMessage}
				</div>
				{this.renderRedirect()}
			</div>);
	}
}

function mapStateTopProps(state) {
	return {
		datosAsignacion: state.sucursal.datosAsignacion,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateDatosAsignacion: datosAsignacion => {
			dispatch({ type: "UPDATE_DATOS_ASIGNACION", payload: datosAsignacion })
		},
	}
}

export default connect(mapStateTopProps, mapDispatchToProps)(Verificacion);

