var resources = require('../../../../Resources');
var listado

export function LoadListadoDeAsignaciones() {
	var dt;
	listado = {
		dt: null,
		init: function () {
			dt = $("#ListadoAsignaciones").DataTable({
				"language":
				{
					"sProcessing": "Procesando...",
					"sLengthMenu": "Mostrar _MENU_ registros",
					"sZeroRecords": "No se encontraron resultados",
					"sEmptyTable": "Ningun dato disponible en esta tabla",
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
					"url": resources.WebApiGoldenStart + "fundicion/historicoDeAsignaciones?filtro=" + document.getElementById("SearchValue").value,
					"type": "POST",
					"datatype": "json",
				},
				"order": [[0, "asc"]],
				"columnDefs":
					[
						{
							"targets": 0,
							"visible": false,
						},
						{
							"targets": 2,
							render: function (data, type, row) {
								var color = 'gray';
								if (data === "En proceso") {
									color = 'yellow';
								}
								if (data === "En sucursal") {
									color = 'violet';
								}
								if (data === "En tránsito") {
									color = 'blue';
								}
								if (data === "Fundido") {
									color = 'green';
								}
								if (data === "Cancelado") {
									color = 'red';
								}
								return '<div class="label-value dp-flex align-items-center">' +
									'<span class="circle circle-' + color + '"></span>' +
									'<label>' + data + '</label>' +
									'</div>';
							}
						},
						{ "searchable": true, "targets": [1, 2, 3, 4] },
						{ "className": "text-center", "targets": [5] },
					],
				"columns": [
					{ "targets": 0, "data": "IDFundicion", "name": "IDFundicion", "autoWidth": true },
					{
						"targets": 1,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<div class="label-value label-column wth-20">' +
								'<span>Asignacion</span>' +
								'<label>' + full.IDFundicion + '</label>' +
								'</div>';
						},
					},
					{ "targets": 2, "data": "Estatus", "name": "Estatus", "autoWidth": true },
					{
						"targets": 3,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<div class="label-value label-column">' +
								'<span>Fundidora</span>' +
								'<label>' + full.Fundidora + '</label>' +
								'</div>';
						},
					},
					{
						"targets": 4,
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<div class="label-value dp-flex align-items-center">' +
								'<div class="m-right--15px">' +
								'<img src="' + full.RutaImagen + '" />' +
								'</div>' +
								'<div class="dp-flex flex-column">' +
								'<span>Auditor</span>' +
								'<label>' + full.Auditor + '</label>' +
								'</div>' +
								'</div>';
						},
					},
					{
						"targets": 5,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<a href="#" style="color:gray" class="Editar"> <i class="material-icons">edit</i></a>' +
								'<a href="#" style="color:gray" class="Eliminar"> <i class="material-icons delete">delete</i></a>' +
								'<a href="#" class="Detalles" style = "color:gray"> <i class="material-icons icon-3points wth-20">more_horiz</i></a > ';
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
	$('.link').on("click", listado.refresh);
	$('#ListadoAsignaciones tbody').on('click', '.Detalles', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDF = row.data().IDFundicion;
		$.ajax({
			type: 'GET',
			url: resources.WebApiGoldenStart + "fundicion/detallesDeAsignacion?idFundicion=" + IDF,
			//headers: { Authorization: token },
			accepts: "application/json",
			contentType: "application/json",
			success: function (data) {
				var HTMLtext;
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="label-value label-column wth-40">';
					HTMLtext += '<span>Sucursal</span>';
					HTMLtext += '<label>' + data[0].Sucursal + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-20">';
					HTMLtext += '<span>Región</span>'
					HTMLtext += '<label>' + data[0].Region + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-20">';
					HTMLtext += '<span>No. prendas</span>'
					HTMLtext += '<label>' + data[0].Prendas + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-20">';
					HTMLtext += '<span>Costo de paquete</span>';
					HTMLtext += '<label>' + data[0].CostoPaquetes + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="item-table">';
					HTMLtext += '<div class="label-value label-column wth-40">';
					HTMLtext += '<span>Inicio de elaboración paquete</span>';
					HTMLtext += '<label>' + data[0].InicioElaboracionPaquete + '</label>';
					HTMLtext += '</div>';
					HTMLtext += '<div class="label-value label-column wth-60">';
					HTMLtext += '<span>Fin de leaboración paquete</span>';
					HTMLtext += '<label>' + data[0].TerminoElaboracionPaquete + '</label>';
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
	$('#ListadoAsignaciones tbody').on('click', '.Eliminar', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDFundicion = parseInt(row.data().IDFundicion);
		var IDEstatus = parseInt(row.data().IDEstatus);
		if (IDEstatus > 1) {
			swal("No es posible eliminar!", "La asignación ya supero el estatus de ‘pendiente‘.", "warning");
		} else {
			swal({
				title: "¿Estás seguro de eliminar la asignación a sucursal?",
				icon: "warning",
				buttons: ["NO", "SI"],
				dangerMode: true,
			})
			.then((willDelete) => {
				if (willDelete) {
					$.ajax({
						type: "POST",
						url: resources.WebApiGoldenStart + "fundicion/eliminarAsignacion?idFundicion=" + IDFundicion,
						//headers: { Authorization: token },
						contentType: false,
						processData: false,
						cache: false,
						complete: function (result) {
							if (result.responseText === "true") {
								var table = $('#ListadoAsignaciones').DataTable();
								table.draw();
								swal({
									title: "!La asignación de auditoria ha sido eliminada con éxito!",
									icon: "success",
								});
							} else {
								swal({
									title: "!Se produjo un error al intentar guardar!",
									icon: "warning",
								});
							}
						}
					});
				}
			});
		}
	});
	$('#ListadoAsignaciones tbody').on('click', '.Editar', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDFundicion = parseInt(row.data().IDFundicion);
		var IDEstatus = parseInt(row.data().IDEstatus);
		if (IDEstatus > 2) {
			swal("No es posible editar!", "La asignación ya supero el estatus de ‘pendiente‘.", "warning");
		} else {
			var el = document.getElementById("corregir");
			document.getElementById("corregir").value = IDFundicion;
			if (el) {el.click();}
		}
	});
}

export function RefreshList() {
	var table = $('#ListadoAsignaciones').DataTable();
	table.draw();
}
