var resources = require('../../../../Resources');

export function LoadSucursalesParaAuditar() {
	$("#ListadoSucursales").DataTable({
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
		"ordering": false,
		"paging": false,
		"info": false,
		"filter": false,
		"ajax": {
			"url": resources.WebApiGoldenStart + "fundicion/listadoSucursales",
			"type": "GET",
			//"headers": { Authorization: token },
			"accepts": "application/json",
			"contentType": "application/json",
			"dataSrc": ""
		},
		"columns": [
			{
				"targets": 0,
				"data": "link",
				"orderable": false,
				"render": function (data, type, full, meta) {
					return '<div class="md-checkbox"><input id="' + full.IDSucursal + '" type="checkbox"><label for="' + full.IDSucursal + '"></label></div>'
				},
			},
			{ "targets": 1, "data": "Sucursal", "name": "Sucursal", "autoWidth": true },
			{ "targets": 2, "data": "Region", "name": "Region", "autoWidth": true },
			{ "targets": 3, "data": "Prendas", "name": "Prendas", "autoWidth": true },
			{ "targets": 4, "data": "CostoPaquete", "name": "CostoPaquete", "autoWidth": true },
		],
		"columnDefs":
			[
				{ "className": "text-center", "targets": [0, 2, 3, 4] },
			],
		fixedColumns: true
	});
}

export function SetSucursalParaAuditar() {
	$('#ListadoSucursales tbody').on('click', 'input[type="checkbox"]', function () {
		if ($(this).prop('checked') == true) {
			$('input[type="checkbox"]').not(this).prop('checked', false);
			var valor = $(this).prop('id')
			var input = document.getElementById("Sucursal");
			input = $('#Sucursal')[0];
			input.value = valor;
			event = new Event('change', { bubbles: true });
			input.dispatchEvent(event);
		}
	});
}

export function LoadSucursalesAuditadas() {
	$("#SucursalesAuditadas").DataTable({
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
		"ordering": false,
		"paging": false,
		"info": false,
		"filter": false,
		"ajax": {
			"url": resources.WebApiGoldenStart + "fundicion/listadoSucursalesAuditadas",
			"type": "GET",
			//"headers": { Authorization: token },
			"accepts": "application/json",
			"contentType": "application/json",
			"dataSrc": ""
		},
		"columns": [
			{ "targets": 0, "data": "Sucursal", "name": "Sucursal", "autoWidth": true },
			{ "targets": 1, "data": "Region", "name": "Region", "autoWidth": true },
			{ "targets": 2, "data": "FechaVisita", "name": "FechaVisita", "autoWidth": true },
		],
		"columnDefs":
			[
				{ "className": "text-center", "targets": [1, 2] },
			],
		fixedColumns: true
	});
}



