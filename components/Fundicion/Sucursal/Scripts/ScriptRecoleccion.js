var resources = require('../../../../Resources');
var listado;
var dt;
var listadoAL;
var dtAL;
var listadoAUC;
var dtAUC;
var listadoAUL;
var dtAUL;
var FlagInicioALL = true;
var FlagInicioAUL = true;
var TablaAlmonedaAmpliada = false;
var TablaAuditadasAmpliada = false;
var IDSucursal;
var SearchAlmoneda = "";
var SearchAlmonedaEnlarge = "";
var SearchAuditoria = "";
var SearchAuditoriaEnlarge = "";

export function vermas() {
	document.getElementById("carousel-view").classList.toggle("dp-none");
	document.getElementById("carousel-hide").classList.toggle("dp-flex");
}

export function playhislide() {
	$('.slide').hiSlide();
}

export function LoadAlmoneda(Sucursal) {
	IDSucursal = Sucursal;
	listado = {
		dt: null,
		init: function () {
			dt = $("#listadoAlmoneda").DataTable({
				"language":
				{
					"sProcessing": "Procesando...",
					"sLengthMenu": "Mostrar _MENU_ registros",
					"sZeroRecords": "No se encontraron resultados",
					"sEmptyTable": "Ningún dato disponible en esta tabla",
					"sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
					"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
					"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
					"sInfoPostFix": "",
					"sSearch": "Buscar:",
					"sUrl": "",
					"sInfoThousands": ",",
					"sLoadingRecords": "Cargando...",
					"oPaginate": {
						"sFirst": "Primero",
						"sLast": "Último",
						"sNext": "Siguiente",
						"sPrevious": "Anterior"
					},
					"oAria": {
						"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
						"sSortDescending": ": Activar para ordenar la columna de manera descendente"
					}
				},
				"processing": true,
				"serverSide": true,
				"filter": false,
				"paging": true,
				"pageLength": 5,
				"lengthChange": false,
				"ordering": false,
				"ajax": {
					"url": resources.WebApiGoldenStart + "fundicion/listadoAlmoneda",
					"type": "POST",
					"datatype": "json",
					"data": function (data) {
						data.IDSucursal = IDSucursal;
						data.Search = SearchAlmoneda;
					}
				},
				"columnDefs":
					[
						{
							"targets": 0,
							"visible": false,
						},
					],
				"columns": [
					{ "targets": 0, "data": "RowID", "name": "RowID", "autoWidth": true },
					{
						"targets": 1,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<div class="box-sku" style="background-color:transparent">' +
								'<div class="LLamarModal label-value">' +
								'<img src="data:image/jpeg;base64,' + full.ImagenPrincipal + '" />&nbsp' +
								'<span>SKU</span>&nbsp' +
								'<label>' + full.SKU + '</label>' +
								'</div>' +
								'<a class="DetallesALC" style="color:gray"><i class="material-icons icon-3points wth-20">more_horiz</i></a>' +
								'</div>';
						},
					},
				],
			});
		},
		refresh: function () {
			dt.ajax.reload();
		}
	}

	listado.init();
	$('#listadoAlmoneda tbody').on('click', '.DetallesALC', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDF = row.data().RowID;
		$.ajax({
			type: 'POST',
			url: resources.WebApiGoldenStart + "fundicion/detallesPrendaEnAlmoneda?IDPrenda=" + IDF,
			dataType: 'json',
			success: function (detalles) {
				var HTMLtext;
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="label-value label-column wth-15">';
					HTMLtext += '<span>Cartera</span>';
					HTMLtext += '<label>' + detalles.Cartera + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-10">';
					HTMLtext += '<span>Familia</span>'
					HTMLtext += '<label>' + detalles.Familia + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-15">';
					HTMLtext += '<span>Subamilia</span>'
					HTMLtext += '<label>' + detalles.SubFamilia + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-10">';
					HTMLtext += '<span>Kilataje</span>';
					HTMLtext += '<label>' + detalles.Kilataje + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					row.child
					row.child(HTMLtext).show();
					tr.addClass('shown');
				}
			},
			error: function (xhr, status, error) {
				swal("Oops!", "No fue posible completar la solicitud.", "warning");
			}
		});
	});
	$('#listadoAlmoneda tbody').on('click', '.LLamarModal', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDPrenda = row.data().RowID;
		var el = document.getElementById("corregir");
		document.getElementById("corregir").value = IDPrenda;
		if (el) { el.click(); }
	});
}

function LoadEnlargeAlmoneda() {
	listadoAL = {
		dtAL: null,
		init: function () {
			dtAL = $("#listadoAlmonedaL").DataTable({
				"language":
				{
					"sProcessing": "Procesando...",
					"sLengthMenu": "Mostrar _MENU_ registros",
					"sZeroRecords": "No se encontraron resultados",
					"sEmptyTable": "Ningún dato disponible en esta tabla",
					"sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
					"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
					"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
					"sInfoPostFix": "",
					"sSearch": "Buscar:",
					"sUrl": "",
					"sInfoThousands": ",",
					"sLoadingRecords": "Cargando...",
					"oPaginate": {
						"sFirst": "Primero",
						"sLast": "Último",
						"sNext": "Siguiente",
						"sPrevious": "Anterior"
					},
					"oAria": {
						"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
						"sSortDescending": ": Activar para ordenar la columna de manera descendente"
					}
				},
				"processing": true,
				"serverSide": true,
				"filter": false,
				"paging": true,
				"pageLength": 5,
				"lengthChange": false,
				"ordering": false,
				"ajax": {
					"url": resources.WebApiGoldenStart + "fundicion/listadoAlmoneda",
					"type": "POST",
					"datatype": "json",
					"data": function (data) {
						data.IDSucursal = IDSucursal;
						data.Search = SearchAlmonedaEnlarge;
					}
				},
				"columnDefs":
					[
						{
							"targets": 0,
							"visible": false,
						},
					],
				"columns": [
					{ "targets": 0, "data": "RowID", "name": "RowID", "autoWidth": true },
					{
						"targets": 1,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<div class="box-sku" style="background-color:transparent">' +
								'<div class="LLamarModal label-value wth-25">' +
								'<img src="data:image/jpeg;base64,' + full.ImagenPrincipal + '" />&nbsp' +
								'<span>SKU</span>&nbsp' +
								'<label>' + full.SKU + '</label>' +
								'</div>' +
								'<div class="label-value label-column wth-15">' +
								'<span>Cartera</span>' +
								'<label>' + full.Cartera + '</label>' +
								'</div>' +
								'<div class="label-value label-column wth-10">' +
								'<span>Familia</span>' +
								'<label>' + full.Familia + '</label>' +
								'</div>' +
								'<div class="label-value label-column wth-15">' +
								'<span>Subamilia</span>' +
								'<label>' + full.SubFamilia + '</label>' +
								'</div>' +
								'<div class="label-value label-column wth-15">' +
								'<span>Kilataje</span>' +
								'<label>' + full.Kilataje + '</label>' +
								'</div>' +
								'<a class="DetallesALL" style="color:gray"><i class="material-icons icon-3points wth-20">more_horiz</i></a>' +
								'</div>';
						},
					},
				],
			});
		},
		refresh: function () {
			dtAL.ajax.reload();
		}
	}
	listadoAL.init();
	$('#listadoAlmonedaL tbody').on('click', '.DetallesALL', function () {
		var tr = $(this).closest('tr');
		var row = dtAL.row(tr);
		var IDAL = row.data().RowID;
		$.ajax({
			type: 'POST',
			url: resources.WebApiGoldenStart + "fundicion/detallesPrendaEnAlmoneda?IDPrenda=" + IDAL,
			dataType: 'json',
			success: function (detalles) {
				var HTMLtext;
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="wth-25">';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Marca</span>&nbsp';
					HTMLtext += '<label>' + detalles.Marca + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Modelo</span>&nbsp';
					HTMLtext += '<label>' + detalles.Modelo + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Envejecimiento</span>&nbsp';
					HTMLtext += '<label>' + detalles.Envejecimiento + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Cantidad</span>&nbsp';
					HTMLtext += '<label>' + detalles.Cantidad + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-15">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Fecha empeño</span>';
					HTMLtext += '<label>' + detalles.FechaEmpeño + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Fecha almoneda</span>';
					HTMLtext += '<label>' + detalles.FechaEmpeño + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-10">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Peso<br>total</span>';
					HTMLtext += '<label>' + detalles.PesoTotal + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-15">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Peso<br>accesorios</span>';
					HTMLtext += '<label>' + detalles.PesoAccesorio + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-15">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Peso<br>metal</span>';
					HTMLtext += '<label>' + detalles.PesoMetal + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-20">';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Precio de venta</span>&nbsp';
					HTMLtext += '<label>' + detalles.PrecioVenta + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Costo (Mutuo)</span>&nbsp';
					HTMLtext += '<label>' + detalles.CostoMutuo + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Avalúo</span>&nbsp';
					HTMLtext += '<label>' + detalles.Avaluo + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="label-value wth-30 dp-flex align-items-center">';
					HTMLtext += '<div class="m-right--15px">';
					HTMLtext += '<img src="/images/foto-user.png" />';
					HTMLtext += '</div>';
					HTMLtext += '<div class="dp-flex flex-column ln-height--12">';
					HTMLtext += '<span>Cliente</span>';
					HTMLtext += '<label>' + detalles.Cliente + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value wth-30 dp-flex align-items-center">';
					HTMLtext += '<div class="m-right--15px">';
					HTMLtext += '<img src="/images/foto-user.png" />';
					HTMLtext += '</div>';
					HTMLtext += '<div class="dp-flex flex-column ln-height--12">';
					HTMLtext += '<span>Usuario</span>';
					HTMLtext += '<label>' + detalles.Usuario + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value wth-50">';
					HTMLtext += '<span>Descripción</span> &nbsp';
					HTMLtext += '<label>' + detalles.Decripcion + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					row.child
					row.child(HTMLtext).show();
					tr.addClass('shown');
				}
			},
			error: function (xhr, status, error) {
				swal("Oops!", "No fue posible completar la solicitud.", "warning");
			}
		});
	});
	$('#listadoAlmonedaL tbody').on('click', '.LLamarModal', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDPrenda = row.data().RowID;
		var el = document.getElementById("corregir");
		document.getElementById("corregir").value = IDPrenda;
		if (el) { el.click(); }
	});
}

export function LoadPrendasAuditadas() {
	listadoAUC = {
		dtAUC: null,
		init: function () {
			dtAUC = $("#listadoAuditadas").DataTable({
				"language":
				{
					"sProcessing": "Procesando...",
					"sLengthMenu": "Mostrar _MENU_ registros",
					"sZeroRecords": "No se encontraron resultados",
					"sEmptyTable": "Ningún dato disponible en esta tabla",
					"sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
					"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
					"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
					"sInfoPostFix": "",
					"sSearch": "Buscar:",
					"sUrl": "",
					"sInfoThousands": ",",
					"sLoadingRecords": "Cargando...",
					"oPaginate": {
						"sFirst": "Primero",
						"sLast": "Último",
						"sNext": "Siguiente",
						"sPrevious": "Anterior"
					},
					"oAria": {
						"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
						"sSortDescending": ": Activar para ordenar la columna de manera descendente"
					}
				},
				"processing": true,
				"serverSide": true,
				"filter": false,
				"paging": true,
				"pageLength": 5,
				"lengthChange": false,
				"ordering": false,
				"ajax": {
					"url": resources.WebApiGoldenStart + "fundicion/listadoPrendasAuditadas",
					"type": "POST",
					"datatype": "json",
					"data": function (data) {
						data.IDSucursal = IDSucursal;
						data.Search = SearchAuditoria;
					}
				},
				"columnDefs":
					[
						{
							"targets": 0,
							"visible": false,
						},
					],
				"columns": [
					{ "targets": 0, "data": "RowID", "name": "RowID", "autoWidth": true },
					{
						"targets": 1,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							if (full.TieneIncidencia == true) {
								return '<div class="box-sku" style="background-color:transparent">' +
									'<div class="label-value">' +
									'<img src="data:image/jpeg;base64,' + full.ImagenPrincipal + '" />&nbsp' +
									'<span>SKU</span>&nbsp' +
									'<label>' + full.SKU + '</label>' +
									'<i class="material-icons" style="color:red">priority_high</i>' +
									'</div>' +
									'<div class="dp-flex align-items-center">' +
									"<a href='#' style='color:gray' onclick='ConfirmarEliminar(" + '"' + full.RowID + '"' + ");'><i class='material-icons delete'>delete</i></a>" +
									'<a href="#" class="DetallesAUC" style="color:gray"><i class="material-icons icon-3points">more_horiz</i></a>' +
									'</div>' +
									'</div>';
							} else {
								return '<div class="box-sku" style="background-color:transparent">' +
									'<div class="label-value">' +
									'<img src="data:image/jpeg;base64,' + full.ImagenPrincipal + '" />&nbsp' +
									'<span>SKU</span>&nbsp' +
									'<label>' + full.SKU + '</label>' +
									'</div>' +
									'<div class="dp-flex align-items-center">' +
									"<a href='#' style='color:gray' onclick='ConfirmarEliminar(" + '"' + full.RowID + '"' + ");'><i class='material-icons delete'>delete</i></a>" +
									'<a href="#" class="DetallesAUC" style="color:gray"><i class="material-icons icon-3points">more_horiz</i></a>' +
									'</div>' +
									'</div>';
							}
						},
					},
				],
			});
		},
		refresh: function () {
			dtAUC.ajax.reload();
		}
	}
	listadoAUC.init();
	$('#listadoAuditadas tbody').on('click', '.DetallesAUC', function () {
		var tr = $(this).closest('tr');
		var row = dtAUC.row(tr);
		var Idn = row.data().RowID;
		$.ajax({
			type: 'POST',
			url: resources.WebApiGoldenStart + "fundicion/detallesPrendaEnAlmoneda?IDPrenda=" + Idn,
			dataType: 'json',
			success: function (detalles) {
				var HTMLtext;
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="label-value label-column wth-15">';
					HTMLtext += '<span>Cartera</span>';
					HTMLtext += '<label>' + detalles.Cartera + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-10">';
					HTMLtext += '<span>Familia</span>'
					HTMLtext += '<label>' + detalles.Familia + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-15">';
					HTMLtext += '<span>Subamilia</span>'
					HTMLtext += '<label>' + detalles.SubFamilia + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-10">';
					HTMLtext += '<span>Kilataje</span>';
					HTMLtext += '<label>' + detalles.Kilataje + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					row.child
					row.child(HTMLtext).show();
					tr.addClass('shown');
				}
			},
			error: function (xhr, status, error) {
				swal("Oops!", "No fue posible completar la solicitud.", "warning");
			}
		});
	});
}

function LoadEnlargePrendasAuditadas() {
	listadoAUL = {
		dtAUL: null,
		init: function () {
			dtAUL = $("#listadoAuditadasL").DataTable({
				"language":
				{
					"sProcessing": "Procesando...",
					"sLengthMenu": "Mostrar _MENU_ registros",
					"sZeroRecords": "No se encontraron resultados",
					"sEmptyTable": "Ningún dato disponible en esta tabla",
					"sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
					"sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
					"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
					"sInfoPostFix": "",
					"sSearch": "Buscar:",
					"sUrl": "",
					"sInfoThousands": ",",
					"sLoadingRecords": "Cargando...",
					"oPaginate": {
						"sFirst": "Primero",
						"sLast": "Último",
						"sNext": "Siguiente",
						"sPrevious": "Anterior"
					},
					"oAria": {
						"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
						"sSortDescending": ": Activar para ordenar la columna de manera descendente"
					}
				},
				"processing": true,
				"serverSide": true,
				"filter": false,
				"paging": true,
				"pageLength": 5,
				"lengthChange": false,
				"ordering": false,
				"ajax": {
					"url": resources.WebApiGoldenStart + "fundicion/listadoPrendasAuditadas",
					"type": "POST",
					"datatype": "json",
					"data": function (data) {
						data.IDSucursal = $("#txtIDSucursal").val();
						data.Search = $("#txtBusquedaAUL").val();
					}
				},
				"columnDefs":
					[
						{
							"targets": 0,
							"visible": false,
						},
					],
				"columns": [
					{ "targets": 0, "data": "RowID", "name": "RowID", "autoWidth": true },
					{
						"targets": 1,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							if (full.TieneIncidencia == true) {
								return '<div class="box-sku" style="background-color:transparent">' +
									'<div class="label-value wth-25">' +
									'<img src="data:image/jpeg;base64,' + full.ImagenPrincipal + '" />&nbsp' +
									'<span>SKU</span>&nbsp' +
									'<label>' + full.SKU + '</label>' +
									'<i class="material-icons" style="color:red">priority_high</i>' +
									'</div>' +
									'<div class="label-value label-column wth-15"">' +
									'<span>Cartera</span>' +
									'<label>' + full.Cartera + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-10>' +
									'<span>Familia</span>' +
									'<label>' + full.Familia + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-15">' +
									'<span>Subamilia</span>' +
									'<label>' + full.SubFamilia + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-15">' +
									'<span>Kilataje</span>' +
									'<label>' + full.Kilataje + '</label>' +
									'</div>' +
									'<div class="dp-flex align-items-center">' +
									"<a href='#' style='color:gray' onclick='ConfirmarEliminar(" + '"' + full.RowID + '"' + ");'><i class='material-icons delete'>delete</i></a>" +
									'<a href="#" class="DetallesAUL" style="color:gray"><i class="material-icons icon-3points">more_horiz</i></a>' +
									'</div>' +
									'</div>';
							} else {
								return '<div class="box-sku" style="background-color:transparent">' +
									'<div class="label-value wth-25">' +
									'<img src="data:image/jpeg;base64,' + full.ImagenPrincipal + '" />&nbsp' +
									'<span>SKU</span>&nbsp' +
									'<label>' + full.SKU + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-15"">' +
									'<span>Cartera</span>' +
									'<label>' + full.Cartera + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-10>' +
									'<span>Familia</span>' +
									'<label>' + full.Familia + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-15">' +
									'<span>Subamilia</span>' +
									'<label>' + full.SubFamilia + '</label>' +
									'</div>' +
									'<div class="label-value label-column wth-15">' +
									'<span>Kilataje</span>' +
									'<label>' + full.Kilataje + '</label>' +
									'</div>' +
									'<div class="dp-flex align-items-center">' +
									'<a style="color:gray" class="Eliminar"> <i class="material-icons delete">delete</i></a>' +
									'<a class="DetallesAUL" style="color:gray"><i class="material-icons icon-3points">more_horiz</i></a>' +
									'</div>' +
									'</div>';
							}
						},
					},
				],
			});
		},
		refresh: function () {
			dtAUL.ajax.reload();
		}
	}
	listadoAUL.init();
	$('#listadoAuditadasL tbody').on('click', '.DetallesAUL', function () {
		var tr = $(this).closest('tr');
		var row = dtAUL.row(tr);
		var IDAUL = row.data().RowID;
		$.ajax({
			type: 'POST',
			url: resources.WebApiGoldenStart + "fundicion/detallesPrendaEnAlmoneda?IDPrenda=" + IDAUL,
			dataType: 'json',
			success: function (detalles) {
				var HTMLtext;
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="wth-25">';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Marca</span>&nbsp';
					HTMLtext += '<label>' + detalles.Marca + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Modelo</span>&nbsp';
					HTMLtext += '<label>' + detalles.Modelo + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Envejecimiento</span>&nbsp';
					HTMLtext += '<label>' + detalles.Envejecimiento + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Cantidad</span>&nbsp';
					HTMLtext += '<label>' + detalles.Cantidad + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-15">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Fecha empeño</span>';
					HTMLtext += '<label>' + detalles.FechaEmpeño + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Fecha almoneda</span>';
					HTMLtext += '<label>' + detalles.FechaEmpeño + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-10">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Peso<br>total</span>';
					HTMLtext += '<label>' + detalles.PesoTotal + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-15">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Peso<br>accesorios</span>';
					HTMLtext += '<label>' + detalles.PesoAccesorio + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-15">';
					HTMLtext += '<div class="label-value label-column">';
					HTMLtext += '<span>Peso<br>metal</span>';
					HTMLtext += '<label>' + detalles.PesoMetal + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="wth-20">';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Precio de venta</span>&nbsp';
					HTMLtext += '<label>' + detalles.PrecioVenta + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Costo (Mutuo)</span>&nbsp';
					HTMLtext += '<label>' + detalles.CostoMutuo + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value">';
					HTMLtext += '<span>Avalúo</span>&nbsp';
					HTMLtext += '<label>' + detalles.Avaluo + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="label-value wth-30 dp-flex align-items-center">';
					HTMLtext += '<div class="m-right--15px">';
					HTMLtext += '<img src="/image/foto-user.png" />';
					HTMLtext += '</div>';
					HTMLtext += '<div class="dp-flex flex-column ln-height--12">';
					HTMLtext += '<span>Cliente</span>';
					HTMLtext += '<label>' + detalles.Cliente + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value wth-30 dp-flex align-items-center">';
					HTMLtext += '<div class="m-right--15px">';
					HTMLtext += '<img src="/image/foto-user.png" />';
					HTMLtext += '</div>';
					HTMLtext += '<div class="dp-flex flex-column ln-height--12">';
					HTMLtext += '<span>Usuario</span>';
					HTMLtext += '<label>' + detalles.Usuario + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value wth-50">';
					HTMLtext += '<span>Descripción</span> &nbsp';
					HTMLtext += '<label>' + detalles.Decripcion + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					row.child
					row.child(HTMLtext).show();
					tr.addClass('shown');
				}
			},
			error: function (xhr, status, error) {
				swal("Oops!", "No fue posible completar la solicitud.", "warning");
			}
		});


	});
	$('#listadoAuditadasL tbody').on('click', '.Eliminar', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDPrenda = row.data().RowID;
		swal({
			title: "¿Estás seguro de eliminar la auditoria realizada a la prenda?",
			icon: "warning",
			buttons: ["NO", "SI"],
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					$.ajax({
						type: "POST",
						url: resources.WebApiGoldenStart + "fundicion/eliminarAuditoriaDePrenda?IDPrenda=" + IDPrenda,
						//headers: { Authorization: token },
						contentType: false,
						processData: false,
						cache: false,
						complete: function (result) {
							if (result.responseText === "true") {
								swal({
									title: "!Se eliminó la auditoría realizada a la prenda!",
									icon: "success",
								});
								refreshList();
							} else {
								swal({
									title: "!Se produjo un error al intentar elimina la auditoría!",
									icon: "warning",
								});
							}
						}
					});
				}
			});

	});
}

export function SetFullScreenAlmoneda() {
	SearchAlmonedaEnlarge = "";
	if (FlagInicioALL) {
		LoadEnlargeAlmoneda();
		FlagInicioALL = false;
	} else {
		dtAL.ajax.reload();
	}
	TablaAlmonedaAmpliada = true;
	ampliarAlmoneda();
}

export function SetScreenAlmoneda() {
	SearchAlmoneda = "";
	dt.ajax.reload();
	TablaAlmonedaAmpliada = false;
	reducirAlmoneda();
}

export function SetFullScreenAuditadas() {
	SearchAuditoriaEnlarge = "";
	if (FlagInicioAUL) {
		LoadEnlargePrendasAuditadas();
		FlagInicioAUL = false;
	} else {
		dtAUL.ajax.reload();
	}
	TablaAuditadasAmpliada = true;
	ampliarAuditada();
}

export function SetScreenAuditadas() {
	SearchAuditoria = "";
	dtAUC.ajax.reload();
	TablaAuditadasAmpliada = false;
	reducirAuditada();
}

export function GetSearch(Search, type) {
	if (type == 1) {
		SearchAlmoneda = Search;
		dt.ajax.reload();
	}
	if (type == 2) {
		SearchAlmonedaEnlarge = Search;
		dtAL.ajax.reload();
	}
	if (type == 3) {
		SearchAuditoria = Search;
		dtAUC.ajax.reload();
	}
	if (type == 4) {
		SearchAuditoriaEnlarge = Search;
		dtAUL.ajax.reload();
	}
}

function ampliarAlmoneda() {
	document.getElementById("almoneda").classList.toggle("dp-block");
	document.getElementById("double_div").classList.toggle("dp-none");
}

function reducirAlmoneda() {
	document.getElementById("almoneda").classList.remove("dp-block");
	document.getElementById("double_div").classList.remove("dp-none");
}

function ampliarAuditada() {
	document.getElementById("auditadas").classList.toggle("dp-block");
	document.getElementById("double_div").classList.toggle("dp-none");
}

function reducirAuditada() {
	document.getElementById("auditadas").classList.remove("dp-block");
	document.getElementById("double_div").classList.remove("dp-none");
}