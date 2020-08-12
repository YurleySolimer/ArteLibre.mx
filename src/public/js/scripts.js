//
// Sidebar del Administrador y animación del Menú toggle
//


// Definir variables

const rutaActual = window.location.pathname;
const rutasAdmin = document.getElementsByClassName('list-item-admin');


// Iterar sobre todos los elementos del menú para saber cual debe obtener la clase active

for (i = 0; i < rutasAdmin.length; i++) {

    let pathname = rutasAdmin[i].getAttribute('href')

    if (pathname == rutaActual) {
        rutasAdmin[i].className = 'list-item-admin active';
    }
}

// Definir variables para la animación del Toggle del sidebar

const toggleMenu = document.getElementById('toggle-admin-menu');
const wrapperAdmin = document.getElementById('sidebar-wrapper-admin');

if(toggleMenu != undefined) {

    toggleMenu.addEventListener('click', function () {

        if (toggleMenu.classList) {
            
            // Toggle de la clase en nevagadores modernos

            toggleMenu.classList.toggle('active');
        wrapperAdmin.classList.toggle('active');
        
    } else {

        // Para IE9
        
        let classes = toggleMenu.className.split(" ");
        let i = classes.indexOf("active");

        if (i >= 0) {
            classes.splice(i, 1);
        } else {
            classes.push("active");
            toggleMenu.className = classes.join(" ");
        }
    }
});
}

// Definir variables para la animación del Toggle del menú

const navbarToggler = document.getElementById('navbar-toggler');

navbarToggler.addEventListener('click', function () {

    if (navbarToggler.classList) {

        // Toggle de la clase en nevagadores modernos

        navbarToggler.classList.toggle('active');

    } else {

        // Para IE9

        let classes = navbarToggler.className.split(" ");
        let i = classes.indexOf("active");

        if (i >= 0) {
            classes.splice(i, 1);
        } else {
            classes.push("active");
            navbarToggler.className = classes.join(" ");
        }
    }
});

//
// Sidebar del Aministrador END
//


//
// Sidebar del Filtro
//

// Definir variables
if (document.getElementById('sidebarCollapse') || document.getElementById('sidebar') != null) {

    const sidebar = document.getElementById('sidebarCollapse');
    const innerSidebar = document.getElementById('sidebar');
    
    sidebar.addEventListener('click', function() {
        let nodo = document.getElementById('nodo-flecha');
        nodo.classList.toggle('fa-arrow-right');
        nodo.classList.toggle('fa-arrow-left');
    });
    
    // Definir función según el evento disparado
    sidebar.addEventListener('click', function () {
        
        
        if (innerSidebar.classList) {
            // Toggle de la clase en nevagadores modernos
            innerSidebar.classList.toggle('active');
        } else {

            // Para IE9
            let classesBtn = sidebar.className.split(" ");
            let k = classesBtn.indexOf("active");
            let classes = innerSidebar.className.split(" ");
            let i = classes.indexOf("active");

            if (i >= 0 ) {
                classesBtn.splice(k, 1);
                classes.splice(i, 1);
            } else {
                classesBtn.push("active");
                classes.push("active");
                innerSidebar.className = classes.join(" ");
                sidebar.className = classes.join(" ");
            }
        }
    });

}


//
// Sidebar del Filtro END
//



//
// Llenar selector de año de creación en Nueva Obra
//

const aCreacion = document.getElementById('fcreacion');
const fecha = new Date();
const yy = fecha.getFullYear();

if (aCreacion != undefined) {

    for (i = yy; i >= yy - 60; i--) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = i;
        aCreacion.add(opt);
    }
}
    
//
// Selector END
//


