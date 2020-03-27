export function zoom(imagen) {
    var zoomGaleria = document.getElementById("zoom-product");

    zoomGaleria.src = imagen;

    $(document).ready(function () {
        $('[data-toggle="popover"]').popover();
    });
}

export function openModal() {
    $('#modal-buy--product').modal('show')
}

export function closeModal() {
    $('.modal-backdrop').remove();
}

export function handleCityDropdownView(disabled) {
    document.getElementById("city").disabled = disabled;
}

export function handleMunicipeDropdownView(disabled) {
    document.getElementById("municipe").disabled = disabled;
}

export function handleColonyDropdownView(disabled) {
    document.getElementById("colony").disabled = disabled;
}

export function handlePostalCodeView(disabled) {
    document.getElementById("postalCode").disabled = disabled;
}

export function handleHideAge() {
    document.getElementById("age").disabled = true;
}

export function handleSpinner(show) {
    if (show) {
        $("#loader").show();
    } else {
        $("#loader").hide();
    }
}

export function handleChangeTab(idTabToActivate, idTabToBlock) {
    $('#' + idTabToActivate).trigger('click');
    var element = document.getElementById(idTabToActivate);
    var elementToBlock = document.getElementById(idTabToBlock);
    element.classList.remove("disabled");
    element.classList.add("active");
    elementToBlock.classList.remove("active");
    elementToBlock.classList.add("disabled");
}

export function handleShow(idPanelShow, idPanelHide) {
    var element = document.getElementById(idPanelShow);
    element.classList.add("show");
    element.classList.add("active");

    if (idPanelHide != undefined) {
        var element = document.getElementById(idPanelHide);
        element.classList.remove("show");
        element.classList.remove("active");
    }
}

export function handleOpenUploadImage() {

    var addressDocument = document.getElementById("documentType").value;
    var beginningOfValidity = document.getElementById("beginningOfValidity").value;
    var endOfValidity = document.getElementById("endOfValidity").value;

    if (addressDocument === "-" || beginningOfValidity === "" || endOfValidity === "") {
        alert('Para adjuntar una imagen, por favor completa primero tipo de documento y fechas de vigencia')
    } else {

        var el = document.getElementById("selectFile");
        if (el) {
            el.click();
        }
    }
}
