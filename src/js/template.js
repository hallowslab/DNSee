const contentArea = document.getElementById('tabContent');

// Loads the apropriate template into tab-content
export function loadTemplate(templateId) {
    contentArea.innerHTML = ''; // Clear old content
    const tpl = document.getElementById(templateId);
    contentArea.appendChild(tpl.content.cloneNode(true));
}