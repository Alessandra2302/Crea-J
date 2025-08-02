// JavaScript para menú desplegable de perfil con funcionalidad de click
document.addEventListener('DOMContentLoaded', function() {
    const profileMenus = document.querySelectorAll('.profile-menu');
    
    profileMenus.forEach(function(profileMenu) {
        const trigger = profileMenu.querySelector('a');
        
        // Manejar click en el botón de perfil
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Cerrar otros menús abiertos
            profileMenus.forEach(function(otherMenu) {
                if (otherMenu !== profileMenu) {
                    otherMenu.classList.remove('active');
                }
            });
            
            // Toggle del menú actual
            profileMenu.classList.toggle('active');
        });
    });
    
    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', function(e) {
        profileMenus.forEach(function(profileMenu) {
            if (!profileMenu.contains(e.target)) {
                profileMenu.classList.remove('active');
            }
        });
    });
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            profileMenus.forEach(function(profileMenu) {
                profileMenu.classList.remove('active');
            });
        }
    });
    
    // Prevenir que los clicks en el dropdown cierren el menú
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});
