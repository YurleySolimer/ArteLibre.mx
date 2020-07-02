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

toggleMenu.addEventListener('click', function() {
    
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
})

// Definir variables para la animación del Toggle del menú

const navbarToggler = document.getElementById('navbar-toggler');

navbarToggler.addEventListener('click', function() {

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

const sidebar = document.getElementById('sidebarCollapse');
const innerSidebar = document.getElementById('sidebar');

// Definir función según el evento disparado

sidebar.addEventListener('click', function() {
    
    if (innerSidebar.classList) {
        
        // Toggle de la clase en nevagadores modernos

        innerSidebar.classList.toggle('active');
      } else {
        
        // Para IE9
        
        let classes = innerSidebar.className.split(" ");
        let i = classes.indexOf("active");
      
        if (i >= 0) {
            classes.splice(i, 1);
        } else {
            classes.push("active");
            innerSidebar.className = classes.join(" ");
        }
      }
});



//
// Sidebar del Filtro END
//


