
    let nombre = $('#galeria-seleccion-nombre')
    let tipo = $('#galeria-seleccion-tipo')
    let tecnica = $('#galeria-seleccion-tecnica')
    let year = $('#galeria-seleccion-year')
    let img = $('#galeria-seleccion-img')
    let enlace = $('#galeria-seleccion-enlace')

    let item

    let left = $('#left-column');
    let right = $('#right-column');

    let down = $('#sort-galeria-down');
    let up = $('#sort-galeria-up');

    $('#galeria-dos .galeria-item').hover(function () {
        $(this).children('.galeria-item-efecto').toggleClass('hovered');
    });


    down.on('click', function() {
        left.toggleClass('active');
        right.toggleClass('active');
    });

    up.on('click', function() {
        left.toggleClass('active');
        right.toggleClass('active');
    });

    $('body').on('click', '#galeria-dos .galeria-item', function () {

        if(left.hasClass('active')) {
            left.removeClass('active');
            right.addClass('active');
        }

        if (item == undefined) {

            nombre.html($(this).attr('data-nombre'));
            tipo.html($(this).attr('data-tipo'));
            tecnica.html($(this).attr('data-tecnica'));
            year.html($(this).attr('data-year'));
            img.attr('src', $(this).attr('data-src'));
            enlace.attr('href', $(this).attr('data-enlace'));
            $(this).children('.galeria-item-efecto').toggleClass('active');

            item = $(this)
            item.addClass('active')

        } else {

            item.children('.galeria-item-efecto').removeClass('active')
            item.removeClass('active')

            nombre.html($(this).attr('data-nombre'));
            tipo.html($(this).attr('data-tipo'));
            tecnica.html($(this).attr('data-tecnica'));
            year.html($(this).attr('data-year'));
            img.attr('src', $(this).attr('data-src'));
            enlace.attr('href', $(this).attr('data-enlace'));
            $(this).children('.galeria-item-efecto').toggleClass('active');

            item = $(this)
            item.addClass('active')
        }
    })

    document.addEventListener('DOMContentLoaded', function () {
        window.addEventListener("wheel", event => document.getElementById('galeria-dos').scrollLeft += event.deltaY / 3);
    }, false);
