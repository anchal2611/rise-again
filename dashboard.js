// Wait for the DOM to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Sidebar Toggle Logic ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const closeSidebarButton = document.getElementById('close-sidebar-button');
    const sidebar = document.getElementById('sidebar');

    if (hamburgerButton && sidebar) {
        // Open sidebar when hamburger is clicked
        hamburgerButton.addEventListener('click', () => {
            sidebar.classList.add('is-open');
        });
    }

    if (closeSidebarButton && sidebar) {
        // Close sidebar when 'X' button is clicked
        closeSidebarButton.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
        });
    }
});
