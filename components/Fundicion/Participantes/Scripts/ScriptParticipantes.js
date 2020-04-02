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
					"url": resources.WebApiGoldenStart + "fundicion/listadoDeAsignaciones?filtro=" + document.getElementById("SearchValue").value,
					"type": "POST",
					"datatype": "json",
				},
				"order": [[2, "asc"]],
				"rowCallback": function (row, data, index) {
					if (data.Estatus == "Pendiente" || data.Estatus == "En sucursal" || data.Estatus == "En tránsito") {
						$('td', row).css('background-color', 'white');
					}
					else {
						$('td', row).css('background-color', '#F2F2F2');
					}
				},
				"columnDefs":
					[
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
						{ "searchable": true, "targets": [1, 2, 3] },
						{ "className": "text-center", "targets": [0, 1, 2, 3] },
					],
				"columns": [
					{
						"targets": 0,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							if (full.Estatus == "Pendiente" || full.Estatus == "En sucursal" || full.Estatus == "En tránsito") {
								if (full.EditFlag == "True") {
									return '<div class="md-checkbox"><a href="#" class="Editar"><i class="material-icons edit-modal" style="Color:gray">edit</i></a></div>';
								}
								else {
									return '<div class="md-checkbox">' +
										'<input type="checkbox" class="DC" name="bolsas" id="' + full.IDFundicion + '" value="' + full.IDFundicion + '">' +
										'<label for="' + full.IDFundicion + '"></label>' +
										'</div>';
								}
							}
							else {
								return '<div class="md-checkbox">' +
									'<span class="material-icons" style="color:gray">check</span>' +
									'</div>';
							}
						},
					},
					{
						"targets": 1,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<div class="label-value label-column wth-20">' +
								'<span>No.Asignación</span>' +
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
								'<label>' + full.NombreFundidora + '</label>' +
								'</div>';
						},
					},
					{
						"targets": 4,
						"data": "link",
						"orderable": false,
						"render": function (data, type, full, meta) {
							return '<a href="#" class="Detalles" style="color:gray"><i class="material-icons icon-3points wth-20">more_horiz</i></a>';
						},
					},
				],
			});
		},
		refresh: function () {
			dt.ajax.reload();
		}
	}
	$('.link').on("click", listado.refresh);
	listado.init();
	$('#ListadoAsignaciones tbody').on('click', '.Detalles', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDF = row.data().IDFundicion;
		$.ajax({
			type: 'GET',
			url: resources.WebApiGoldenStart + "fundicion/detallesAsignacion?IDFundicion=" + IDF,
			//headers: { Authorization: token },
			dataType: 'json',
			success: function (detalles) {
				var HTMLtext;
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					if (detalles.Encargado != "") {
						HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
						HTMLtext += '<div class="item-table">';
						HTMLtext += '<div class="label-value label-column">';
						HTMLtext += '<span>Sucursal</span>';
						HTMLtext += '<label>' + detalles.Sucursal + '</label>';
						HTMLtext += '</div>';
						HTMLtext += '<div class="item-table">';
						HTMLtext += '<div class="label-value dp-flex align-items-center">';
						HTMLtext += '<div class="m-right--15px">';
						HTMLtext += '<img src="/images/foto-user.png" />';
						HTMLtext += '</div>';
						HTMLtext += '<div class="dp-flex flex-column ln-height--12">';
						HTMLtext += '<span>Encargado</span>';
						HTMLtext += '<label>' + detalles.Encargado + '</label>';
						HTMLtext += '</div>';
						HTMLtext += '<div class="item-table">';
						HTMLtext += '<div class="label-value dp-flex align-items-center">';
						HTMLtext += '<div class="m-right--15px">';
						HTMLtext += '<img src="/images/foto-user.png" />';
						HTMLtext += '</div>';
						HTMLtext += '<div class="dp-flex flex-column ln-height--12">';
						HTMLtext += '<span>Testigo</span>';
						HTMLtext += '<label>' + detalles.Testigo + '</label>';
						HTMLtext += '</div>';
						HTMLtext += '<div class="label-value label-column">';
						HTMLtext += '<span>Fecha de Visita a Fundidora</span>';
						HTMLtext += '<label>' + detalles.Fecha + '</label>';
						HTMLtext += '</div>';
						HTMLtext += '</div>';
						HTMLtext += '</div>';
					} else {
						HTMLtext = '<div class="table-collapse" style="border:1px solid; border-color:#f1f1f1">';
						HTMLtext += '<div class="item-table">';
						HTMLtext += '<div class="label-value label-column">';
						HTMLtext += '<span>Sucursal</span>';
						HTMLtext += '<label>' + detalles.Sucursal + '</label>';
						HTMLtext += '</div>';
						HTMLtext += '</div>';
					}
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
	$('#ListadoAsignaciones tbody').on('click', '.Editar', function () {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var IDFundicion = parseInt(row.data().IDFundicion);
		var Estatus = row.data().Estatus;
		if (Estatus !== "Pendiente") {
			swal("No es posible editar!", "La asignación ya supero el estatus de ‘pendiente‘.", "warning");
		} else {
			var el = document.getElementById("corregir");
			document.getElementById("corregir").value = IDFundicion;
			if (el) { el.click(); }
		}
	});
}

export function ValidarSeleccion() {
	var Cont = 0;
	$('#ListadoAsignaciones input[type="checkbox"]').each(function () {
		if ($(this).is(":checked")) {
			Cont = parseInt(Cont) + 1;
		}
	});
	return Cont;
};

export function ListasSeleccion() {
	var lista = new Array();
	$("input[type=checkbox]:checked").each(function () {
		lista.push(parseInt(this.value));
	});
	return lista;
};

export function RefreshList() {
	var table = $('#ListadoAsignaciones').DataTable();
	table.draw();
}
