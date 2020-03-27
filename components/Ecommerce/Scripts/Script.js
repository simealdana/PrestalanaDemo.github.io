var inputQuantity = [];

export function createNewVariableForEachUser() {
    function DropDown(el) {
        this.dd = el;
        this.placeholder = this.dd.children('span');
        this.opts = this.dd.find('ul.drop li');
        this.val = '';
        this.index = -1;
        this.initEvents();
    }

    DropDown.prototype = {
        initEvents: function () {
            var obj = this;
            obj.dd.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).toggleClass('active');
            });
            obj.opts.on('click', function () {
                var opt = $(this);
                obj.val = opt.text();
                obj.index = opt.index();
                obj.placeholder.text(obj.val);
                opt.siblings().removeClass('selected');
                opt.filter(':contains("' + obj.val + '")').addClass('selected');
            }).change();
        },
        getValue: function () {
            return this.val;
        },
        getIndex: function () {
            return this.index;
        }
    };

    $(function () {
        // create new variable for each menu
        var dd1 = new DropDown($('#noble-gases'));
        // var dd2 = new DropDown($('#other-gases'));
        $(document).click(function () {
            // close menu on document click
            $('.wrap-drop').removeClass('active');
        });
    });
}

export function intervalCarousel() {
    $('#theCarousel').carousel({
        interval: 2000
    });
}

export function multiItemCarousel() {
    $('.multi-item-carousel .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length > 0) {
            next.next().children(':first-child').clone().appendTo($(this));
        }
        else {
            $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });
}

export function dropdownMenuLink() {
    $('dropdownMenuLink').dropdown();
}

export function slideCarousel() {
    $('#sliderCarousel').carousel({
        interval: 0
    });
}

export function zoom(imagen) {
    var zoomGaleria = document.getElementById("zoom-product");

    zoomGaleria.src = imagen;

    $(document).ready(function () {
        $('[data-toggle="popover"]').popover();
    });
}


export function openModal() {
    $('#modal-search--client').modal('show')
}

export function closeModal() {
    $('#modal-search--client').modal('hide');
    $('.modal-backdrop').remove();
}

export function clickSale() {
    $('#sale').click(function () {
        $(this).removeClass('gray');
        $(this).addClass('green');
        $('#aside').addClass('gray');
        $('#aside').removeClass('green');
        $('#optionAside').removeClass('dp-block');
        $('#optionAside').addClass('dp-none');
    });
}

export function clickAside() {
    $('#aside').click(function () {
        $(this).removeClass('gray');
        $(this).addClass('green');
        $('#sale').addClass('gray');
        $('#sale').removeClass('green');
        $('#optionAside').removeClass('dp-none');
        $('#optionAside').addClass('dp-block');
    });
}

export function clickSale2() {
    $('#sale2').click(function () {
        $(this).removeClass('gray');
        $(this).addClass('green');
        $('#aside2').addClass('gray');
        $('#aside2').removeClass('green');
        $('#optionAside2').removeClass('dp-block');
        $('#optionAside2').addClass('dp-none');
    });
}

export function clickAside2() {
    $('#aside2').click(function () {
        $(this).removeClass('gray');
        $(this).addClass('green');
        $('#sale2').addClass('gray');
        $('#sale2').removeClass('green');
        $('#optionAside2').removeClass('dp-none');
        $('#optionAside2').addClass('dp-block');
    });
}

export function setTapPayment(idTabToActivate, idTabToBlock) {
    var element = document.getElementById(idTabToActivate);
    var elementToBlock = document.getElementById(idTabToBlock);
    element.classList.add("show");
    elementToBlock.classList.remove("show");   
}

export function setFocus(focusControll) {
    document.getElementById(focusControll).focus();
}