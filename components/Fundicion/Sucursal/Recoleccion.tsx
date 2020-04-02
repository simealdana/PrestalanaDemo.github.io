declare var require: any

import 'datatables.net';
import './Scripts/jquery.hislide.min.js';
require('../../../styles/jquery.hislide.min.css')


var React = require('react');
var connect = require('react-redux').connect;
var resources = require('../../../Resources');
var Loader = require('react-loader');
var Scripts = require('./Scripts/ScriptRecoleccion');
var uuidv1 = require('uuid/v1');
var Modal = require("react-modal");
const swal = require('sweetalert');
const NoImage = "../../../images/NoImage.png";



class Recoleccion extends React.Component {

	state = {
		rows: 13,
		Kilataje: "",
		PesoMetal: "",
		PesoAccesorio: "",
		PesoTotal: 0,
		DiferenciaPesoMetal: 0,
		CostoMutuo: 0,
		Incidencia: "NO",
		TipoIncidencia: "",
		Responsables: "",
		MontoARetener: 0,
		Observaciones: "",

		SearchAlmoneda: "",
		SearchAlmonedaEnlarge: "",
		SearchAuditoria: "",
		SearchAuditoriaEnlarge: "",
		flagConPrendasAuditadas: false,
		showAuditoriaModal: false,
		done: false,
		redirect: false,
	}

	componentDidMount() {

		const { datosAsignacion } = this.props;
		this.handleGetSummary();
		Scripts.LoadAlmoneda(datosAsignacion[0].IDSucursal);
		Scripts.LoadPrendasAuditadas();
		Scripts.playhislide();

	};

	handleGetSummary() {

		const { datosAsignacion } = this.props;

		const { updateDatosAsignacion } = this.props;

		fetch(resources.WebApiGoldenStart + "fundicion/resumenDeRecoleccion?IDSucursal=" + datosAsignacion[0].IDSucursal,
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
				if (response != null) {
					var dtosasig = [{
						IDSucursal: datosAsignacion[0].IDSucursal,
						IDFundicion: datosAsignacion[0].IDFundicion,
						Fundidora: datosAsignacion[0].Fundidora,
						Auditor: datosAsignacion[0].Persona,
						Sucursal: datosAsignacion[0].Sucursal,
						Region: datosAsignacion[0].Region,
						Fecha: datosAsignacion[0].Fecha,
						Prendas: response.Prendas,
						CostoPaquete: response.Costo,
						PrendasAuditado: response.PrendasAuditado,
						CostoAuditado: response.CostoAuditado,
						PrendasIncidencia: response.PrendasIncidencia,
						CostoIncidencia: response.CostoIncidencia,
					}];
					updateDatosAsignacion(dtosasig);
				}

			})
			.catch((err) => {
				swal("Error!", err.message, "error");
			});

		this.setState({ done: true });
	}

	handleChange(e) {
		var control = document.getElementById(e.target.id) as HTMLInputElement
		this.setState({ [e.target.id]: control.value });
	}

	handleKeyDown(e) {
		if (e.key === 'Enter') {
			var control = document.getElementById(e.target.id) as HTMLInputElement
			if (e.target.id === "SearchAlmoneda") {
				this.handleSearch(1);
			}
			if (e.target.id === "SearchAlmonedaEnlarge") {
				this.handleSearch(2);
			}
			if (e.target.id === "SearchAuditoria") {
				this.handleSearch(3);
			}
			if (e.target.id === "SearchAuditoriaEnlarge") {
				this.handleSearch(4);
			}
		}
	}

	handleSearch(type) {
		const { SearchAlmoneda, SearchAlmonedaEnlarge, SearchAuditoria, SearchAuditoriaEnlarge } = this.state;
		if (type == 1) {
			Scripts.GetSearch(SearchAlmoneda, type);
		}
		if (type == 2) {
			Scripts.GetSearch(SearchAlmonedaEnlarge, type);
		}
		if (type == 3) {
			Scripts.GetSearch(SearchAuditoria, type);
		}
		if (type == 4) {
			Scripts.GetSearch(SearchAuditoria, SearchAuditoriaEnlarge, type);
		}
	}

	closeModal = () => {
		this.setState({ showAuditoriaModal: false });
	}

	handleGetAuditoria() {

		const { datosAsignacion } = this.props

		const { updateDatosPrenda, updateTiposDeIncidencia, updateImagenesPrenda } = this.props;

		this.setState({
			done: false,
			showAuditoriaModal: true
		});

		var control = document.getElementById("corregir") as HTMLInputElement

		fetch(resources.WebApiGoldenStart + "fundicion/auditoriaPrenda?IDPrenda=" + control.value + "&IDFundicion=" + datosAsignacion[0].IDFundicion,
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
				var dp = [{
					IDPrenda: control.value,
					SKU: response.DatosPrenda.SKU,
					Cartera: response.DatosPrenda.Cartera,
					Familia: response.DatosPrenda.Familia,
					SubFamilia: response.DatosPrenda.SubFamilia,
					Marca: response.DatosPrenda.Marca,
					Modelo: response.DatosPrenda.Modelo,
					FechaEmpeno: response.DatosPrenda.FechaEmpeño,
					FechaAlmoneda: response.DatosPrenda.FechaAlmoneda,
					Descripcion: response.DatosPrenda.Descripcion,
					EstadoConservacion: response.DatosPrenda.EstadoConservacion,
					Kilataje: response.DatosPrenda.KilatajeI,
					PesoMetal: response.DatosPrenda.PesoMetalD,
					PesoAccesorio: response.DatosPrenda.PesoAccesorioD,
					PesoTotal: response.DatosPrenda.PesoTotalD,
					CostoMutuo: response.DatosPrenda.CostoMutuo,
					PrecioVenta: response.DatosPrenda.PrecioVenta,
					Avaluo: response.DatosPrenda.Avaluo,
					Observaciones: response.DatosPrenda.Observaciones,
				}];
				updateDatosPrenda(dp);
				updateTiposDeIncidencia(response.TiposDeIncidencia);
				if (response.Imagenes != null) {
					updateImagenesPrenda(response.Imagenes);
				}

			})
			.catch((err) => {
				swal("Error!", err.message, "error");
			});

		this.setState({ done: true });
	}

	createBodyCarouselHide = () => {
		const { imagenesprenda } = this.props
		const maxSizeImg = { 'maxWidth': '220px', 'maxHeight': '220px' };
		let body = []
		for (let i = 0; i < imagenesprenda.count; i++) {
			if (i == 0) {
				body.push(
					<div className="carousel-item active">
						<img className="d-flex mg-lf-rg--auto" style={maxSizeImg} src={`data:image/jpeg;base64,${imagenesprenda[i]}`}></img>
					</div>)
			} else {
				body.push(
					<div className="carousel-item">
						<img className="d-flex mg-lf-rg--auto" style={maxSizeImg} src={`data:image/jpeg;base64,${imagenesprenda[i]}`}></img>
					</div>)
			}
		}
		return body
	}

	render() {

		const { datosAsignacion, datosprenda, tiposdeincidencia, imagenesprenda } = this.props

		const { done, showAuditoriaModal, rows } = this.state;

		const hideColumn = { 'display': 'none' };

		const paddingTable = { 'padding': '15px' };

		const stretchingTable = { 'width': '100%' };

		const redColor = { 'color': 'red' };

		const maxSizeImg = { 'maxWidth': '220px', 'maxHeight': '220px' };

		const widthM = { 'width': '50%' };

		const width = { 'width': '100%' };

		const InputStyle = { 'background-color': 'white', 'text-align': 'center', 'vertical-align': 'central', 'height': '28px', 'fontSize': 'small' };

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

		var header = (

			<div className="header">
				<div className="tab-page--menu col-10">
					<div id="verificacionDeDatosAuditor" className="item-page--menu">
						<a>Verificación de Datos</a>
					</div>
					<div id="recoleccionDeOro" className="item-page--menu item-active">
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

		var options = (

			<div className="text-button--right">
				<div className="paragraph">
					<span>A continuación se muestra un listado de los artículos en almoneda</span>
				</div>
				<div className="buttons">
					<a className="btns btn-se">Anterior</a>
					<a className="btns btn-go">Siguente</a>
				</div>
			</div>)

		var tables = (

			<div className="row" id="double_div">
				<div className="col-6">
					<span className="title-box">Almoneda</span>
					<div className="box-data almoneda">
						<a onClick={() => Scripts.SetFullScreenAlmoneda()}><i className="icon-fullscreen"></i></a>
						<div className="total-value">
							<span>Prendas: {datosAsignacion[0].Prendas}</span>
							<span>Costo de las prendas: {datosAsignacion[0].CostoPaquete} </span>
						</div>
						<div className="search">
							<div className="mui-textfield mui-textfield--float-label">
								<input key={uuidv1()} type="text" placeholder="Buscar" id="SearchAlmoneda" value={this.state.SearchAlmoneda} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
								<a onClick={() => this.handleSearch(1)}><i className="icon-search"></i></a>
							</div>
						</div>
						<div className="overflow-auto max-height--600px" style={paddingTable}>
							<table id="listadoAlmoneda" className="table table-hover" style={stretchingTable}>
								<thead>
									<tr style={hideColumn}>
										<th></th>
										<th></th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
				<div className="col-6">
					<span className="title-box">Auditadas</span>
					<div className="box-data auditadas">
						<a onClick={() => Scripts.SetFullScreenAuditadas()}><i className="icon-fullscreen"></i></a>
						<div className="total-value">
							<span>Prendas: {datosAsignacion[0].PrendasAuditado}</span>
							<span>Costo de las prendas: {datosAsignacion[0].CostoAuditado}</span>
							<span>Incidencia: <label style={redColor}>{datosAsignacion[0].PrendasIncidencia}</label></span>
							<span>Costo de Incidencia: <label style={redColor}>{datosAsignacion[0].CostoIncidencia}</label></span>
						</div>
						<div className="search">
							<div className="mui-textfield mui-textfield--float-label">
								<input key={uuidv1()} type="text" placeholder="Buscar" id="SearchAuditoria" value={this.state.SearchAuditoria} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
								<a onClick={() => this.handleSearch(3)}><i className="icon-search"></i></a>
							</div>
						</div>
						<div className="overflow-auto max-height--600px" style={paddingTable}>
							<table id="listadoAuditadas" className="table table-hover" style={stretchingTable}>
								<thead>
									<tr style={hideColumn}>
										<th></th>
										<th></th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
					<input id="corregir" style={hideColumn} type="text" onClick={() => this.handleGetAuditoria()} />
				</div>
			</div>)

		var EnlargeAlmonedaTable = (

			<div id="almoneda" className="row fullscreen">
				<div className="col pd-right--50px">
					<span className="title-box">Almoneda</span>
					<div className="box-data">
						<a onClick={() => Scripts.SetScreenAlmoneda()}><i className="icon-fullscreen-exit"></i></a>
						<div className="total-value">
							<span>Prendas: {datosAsignacion[0].Prendas}</span>
							<span>Costo de las prendas: {datosAsignacion[0].CostoPaquete} </span>
						</div>
						<div className="search">
							<div className="mui-textfield mui-textfield--float-label">
								<input key={uuidv1()} type="text" placeholder="Buscar" id="SearchAlmonedaEnlarge" value={this.state.SearchAlmonedaEnlarge} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
								<a onClick={() => this.handleSearch(2)}><i className="icon-search"></i></a>
							</div>
						</div>
						<div className="overflow-auto" style={paddingTable}>
							<table id="listadoAlmonedaL" className="table table-hover" style={stretchingTable}>
								<thead>
									<tr style={hideColumn}>
										<th></th>
										<th></th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
				<div className="item-rotate">
					<span className="title-box">Auditadas</span>
				</div>
			</div>)

		var EnlargeAuditadasTable = (

			<div id="auditadas" className="row fullscreen">
				<a id="btnAlmoneda" className="item-rotate">
					<span className="title-box">Almoneda</span>
				</a>
				<div className="col pd-right--50px">
					<span className="title-box">Auditadas</span>
					<div className="box-data auditadas">
						<a onClick={() => Scripts.SetScreenAuditadas()}><i className="icon-fullscreen-exit"></i>Test</a>
						<div className="total-value">
							<span>Prendas: {datosAsignacion[0].PrendasAuditado}</span>
							<span>Costo de las prendas: {datosAsignacion[0].CostoAuditado}</span>
							<span>Incidencia: <label style={redColor}>{datosAsignacion[0].PrendasIncidencia}</label></span>
							<span>Costo de Incidencia: <label style={redColor}>{datosAsignacion[0].CostoIncidencia}</label></span>
						</div>
						<div className="search">
							<div className="mui-textfield mui-textfield--float-label">
								<input key={uuidv1()} type="text" placeholder="Buscar" id="SearchAuditoriaEnlarge" value={this.state.SearchAuditoriaEnlarge} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
								<a onClick={() => this.handleSearch(4)}><i className="icon-search"></i></a>
							</div>
							<div className="filtro-incidencia">
								<span>Incidencia</span><i className="icon-priority-high"></i>
							</div>
						</div>
						<div className="overflow-auto" style={paddingTable}>
							<table id="listadoAuditadasL" className="table table-hover" style={stretchingTable}>
								<thead>
									<tr style={hideColumn}>
										<th></th>
										<th></th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>)

		var CarouselsingleImage = (

			<img className="d-flex mg-lf-rg--auto" style={maxSizeImg} src={`data:image/jpeg;base64,${imagenesprenda[0]}`}></img>)

		var NoImages = (

			<img className="d-flex mg-lf-rg--auto" style={maxSizeImg} src={NoImage}></img>)

		var Carousel = (

			<div className="slide hi-slide">
				<div className="hi-prev "><i className="material-icons arrow-left">chevron_left</i> </div>
				<div className="hi-next "><i className="material-icons arrow-right">chevron_right</i></div>
				<ul>
					{imagenesprenda != null && imagenesprenda.map(imagen => {
						return (
							<li key={uuidv1()}>
								<img className="d-flex mg-lf-rg--auto" key={uuidv1()} style={maxSizeImg} src={`data:image/jpeg;base64,${imagen}`}></img>
							</li>)
					})
					}
				</ul>
			</div>)

		var CarouselHide = (

			<div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
				<div className="carousel-inner">
					{this.createBodyCarouselHide()}
				</div>
				<a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
					<span className="carousel-control-prev-icon" aria-hidden="true"></span>
					<i className="material-icons arrow-left">chevron_left</i>
				</a>
				<a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
					<span className="carousel-control-next-icon" aria-hidden="true"></span>
					<i className="material-icons arrow-right">chevron_right</i>
					<span className="sr-only">Next</span>
				</a>
			</div>)

		var AuditoriaModal = (

			<Modal isOpen={showAuditoriaModal} style={modalstyle} ariaHideApp={false}>
				<div className="modal-auditoria">
					<div className="modal-header">
						<strong>Ingresa los datos arrojados por tu auditoría en la tabla.</strong>
						<button type="button" className="close" onClick={this.closeModal} >&times;</button>
					</div>
					<div className="modal-body">
						<div id="carousel-view">
							{imagenesprenda != null ?
								(imagenesprenda.length == 1 ? CarouselsingleImage : Carousel)
								: NoImages}
							<div>
								<div className="label-value">
									<span>SKU</span>
									<label>{datosprenda[0].SKU}</label>
									<a onClick={() => Scripts.vermas()}> ver más</a>
								</div>
							</div>
						</div>
						<div id="carousel-hide" className="row">
							<div className="col-3">
								<div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
									{imagenesprenda != null ?
										(imagenesprenda.length == 1 ? CarouselsingleImage : CarouselHide)
										: { NoImages }}
								</div>
							</div>
							<div className="col-1">
								<div className="line"></div>
							</div>
							<div className="col-8 dp-flex justify-content-between" style={widthM}>
								<div>
									<div className="label-value">
										<span>SKU:</span>
										<label id="SKU">{datosprenda[0].SKU}</label>
									</div>
									<div className="label-value">
										<span>Cartera:</span>
										<label>{datosprenda[0].Cartera}</label>
									</div>
									<div className="label-value">
										<span>Familia:</span>
										<label>{datosprenda[0].Familia}</label>
									</div>
									<div className="label-value">
										<span>Subfamilia:</span>
										<label>{datosprenda[0].SubFamilia}</label>
									</div>
									<div className="label-value">
										<span>Marca:</span>
										<label>{datosprenda[0].Marca}</label>
									</div>
									<div className="label-value">
										<span>modelo:</span>
										<label>{datosprenda[0].Modelo}</label>
									</div>
								</div>
								<div>
									<div className="label-value">
										<span>Fecha de empeño:</span>
										<label>{datosprenda[0].FechaEmpeno}</label>
									</div>
									<div className="label-value">
										<span>Fecha de Almoneda:</span>
										<label>{datosprenda[0].FechaAlmoneda}</label>
									</div>
									<div className="label-value label-column">
										<span>Descripción:</span>
										<label>{datosprenda[0].Descripcion}</label>
									</div>
									<div className="label-value label-column">
										<span>Observaciones:</span>
										<label>{datosprenda[0].Observaciones}</label>
									</div>
								</div>
							</div>
						</div>
						<div className="item-modal--body">
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th>Datos</th>
											<th>Datos de la prenda</th>
											<th>Auditoria de prenda</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="semibold" valign="middle">Edo. de Conservación</td>
											<td className="text-center" valign="middle">{datosprenda[0].EstadoConservacion}</td>
											<td className="text-center" valign="middle">{datosprenda[0].EstadoConservacion}</td>
										</tr>
										<tr>
											<td className="semibold" valign="middle">Kilataje (K)</td>
											<td className="text-center" valign="middle">{datosprenda[0].Kilataje}</td>
											<td className="text-center" valign="middle">
												<select id="Kilataje" style={width} onChange={this.handleChange.bind(this)}
													value={this.state.Kilataje}>
													<option key={uuidv1()} value="E"></option>
													<option key={uuidv1()} value="0">0</option>
													<option key={uuidv1()} value="8">8</option>
													<option key={uuidv1()} value="10">10</option>
													<option key={uuidv1()} value="12">12</option>
													<option key={uuidv1()} value="14">14</option>
													<option key={uuidv1()} value="18">18</option>
													<option key={uuidv1()} value="21">21</option>
												</select>
											</td>
										</tr>
										<tr>
											<td className="semibold" valign="middle">Peso metal (g)</td>
											<td className="text-center" valign="middle">{datosprenda[0].PesoMetal}</td>
											<td className="text-center">
												<input className="input-100" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="form-group max-width--32">
								<label>Observaciones:</label>
								<textarea className="form-control" rows={rows} />{this.state.Observaciones}
								<div className="btn-modal--oro">
									<a className="btns btn-go" id="BtnGuardarAuditoria" name="btnAceptar">Guardar</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>)


		return (

			<div>
				{header}
				<div className="content-page recolectar-oro">
					<Loader loaded={done} />
					{options}
					{tables}
					{EnlargeAlmonedaTable}
					{EnlargeAuditadasTable}
					{AuditoriaModal}
				</div>
			</div>);
	}
}

function mapStateTopProps(state) {
	return {
		datosAsignacion: state.sucursal.datosAsignacion,
		datosprenda: state.sucursal.datosprenda,
		tiposdeincidencia: state.sucursal.tiposdeincidencia,
		imagenesprenda: state.sucursal.imagenesprenda,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateDatosAsignacion: datosAsignacion => {
			dispatch({ type: "UPDATE_DATOS_ASIGNACION", payload: datosAsignacion })
		},
		updateDatosPrenda: datosprenda => {
			dispatch({ type: "UPDATE_DATOS_PRENDA", payload: datosprenda })
		},
		updateTiposDeIncidencia: tiposdeincidencia => {
			dispatch({ type: "UPDATE_TIPOS_INCIDENCIA", payload: tiposdeincidencia })
		},
		updateImagenesPrenda: imagenesprenda => {
			dispatch({ type: "UPDATE_IMAGENES_PRENDA", payload: imagenesprenda })
		},
	}
}

export default connect(mapStateTopProps, mapDispatchToProps)(Recoleccion);

