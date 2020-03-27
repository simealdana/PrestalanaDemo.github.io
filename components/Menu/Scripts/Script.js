export function toggleMenu() {
    $('.btn-menu').click(function () {
        $('.contenedor-menu .menu').slideToggle();
    });
}

export function slideSubMenu() {
    $('.menu li:has(ul)').click(function (e) {
        e.preventDefault();

        if ($(this).hasClass('item-active')) {
            $(this).removeClass('item-active');
            $(this).children('ul').slideUp();
        } else {
            $('.menu li ul').slideUp();
            $('.menu li').removeClass('item-active');
            $(this).addClass('item-active');
            $(this).children('ul').slideDown();
        }
    });
}


export function resizeMenu() {
    $(window).resize(function () {
        if ($(document).width() > 450) {
            $('.contenedor-menu .menu').css({ 'display': 'block' });
        }

        if ($(document).width() < 450) {
            $('.contenedor-menu .menu').css({ 'display': 'none' });
            $('.menu li ul').slideUp();
            $('.menu li').removeClass('item-active');
        }
    });
}

export function refMenu() {
    $('.menu li ul li a').click(function () {
        window.location.href = $(this).attr("href");
    });
}
export function containerMenu() {
    $('.btn-menu').on('click', function () {
        $('.container-menu').toggleClass("container-menu--show");
    });
}

//export function newClientMenu() {
//    $("#newClient").click(function () {
//        localStorage.setItem("link", "newClient");
//        setTimeout('document.location = "' + "http://localhost:52742/Home/Index" + '"', 100);
//    });
//}

export function swalMenu() {
    $('.other-document').click(function () {
        swal({
            title: "¿Quieres cargar otro documento?",
            icon: "warning",
            buttons: ["NO", "SI"],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal({
                        title: "!Carge otro documento!",
                        icon: "success",
                    });
                } else {
                    swal({
                        title: "¡Los documentos han sido guardados con éxito!",
                        icon: "success",
                    });
                }
            });
    });
}

export function swalSaveMenu() {
    $('.swal-save').click(function () {

        swal("¡Las huellas han sido guardadas con éxito!", "Puedes continuar", "success");
    });
}
