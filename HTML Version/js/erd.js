// Initialize jsPlumb for diagram connections
document.addEventListener('DOMContentLoaded', function() {
    initializeERD();
});

let jsPlumb;
let selectedElement = null;

function initializeERD() {
    jsPlumb = jsPlumbBrowser.getInstance({
        Container: "erdContainer",
        ConnectionsDetachable: true,
        EndpointStyle: { fill: "#567567" },
        Connector: ["Bezier", { curviness: 50 }],
        Endpoints: [["Dot", { radius: 5 }], ["Dot", { radius: 5 }]],
        PaintStyle: { stroke: "#567567", strokeWidth: 2 }
    });

    // Make elements draggable
    jsPlumb.draggable(document.querySelectorAll(".table-element"), {
        grid: [10, 10]
    });
}

function addElement(type) {
    const container = document.getElementById('erdContainer');
    const element = document.createElement('div');
    
    switch(type) {
        case 'table':
            element.className = 'table-element';
            element.innerHTML = `
                <div class="table-header">
                    <span class="table-name">New Table</span>
                    <span class="table-actions">
                        <button onclick="editTable(this)">✏️</button>
                        <button onclick="deleteTable(this)">❌</button>
                    </span>
                </div>
                <div class="table-columns">
                    <div class="column">
                        <span>id (PK)</span>
                        <span class="column-type">int</span>
                    </div>
                </div>
            `;
            break;
            
        case 'relationship':
            // For relationships, we'll use jsPlumb connections
            if (selectedElement) {
                selectedElement.classList.remove('selected');
                selectedElement = null;
                return;
            }
            return;
            
        case 'note':
            element.className = 'note-element';
            element.innerHTML = `
                <div class="note-content" contenteditable="true">
                    Add note here...
                </div>
            `;
            break;
    }
    
    // Position the new element
    element.style.position = 'absolute';
    element.style.left = '50px';
    element.style.top = '50px';
    
    container.appendChild(element);
    
    // Make the new element draggable
    if (type === 'table' || type === 'note') {
        jsPlumb.draggable(element, {
            grid: [10, 10]
        });
    }
    
    // Add endpoints for tables
    if (type === 'table') {
        jsPlumb.addEndpoint(element, {
            anchor: "AutoDefault",
            isSource: true,
            isTarget: true,
            connector: ["Bezier", { curviness: 50 }],
            maxConnections: -1
        });
    }
}

function editTable(button) {
    const table = button.closest('.table-element');
    const propertyEditor = document.getElementById('propertyEditor');
    
    propertyEditor.innerHTML = `
        <div class="property-form">
            <input type="text" id="tableName" placeholder="Table Name" 
                   value="${table.querySelector('.table-name').textContent}">
            <div class="columns-editor">
                <h4>Columns</h4>
                <div id="columnsList">
                    ${Array.from(table.querySelectorAll('.column')).map(col => `
                        <div class="column-edit">
                            <input type="text" value="${col.querySelector('span').textContent}">
                            <input type="text" value="${col.querySelector('.column-type').textContent}">
                            <button onclick="removeColumn(this)">-</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="addColumn()">Add Column</button>
            </div>
            <button onclick="saveTableChanges()">Save Changes</button>
        </div>
    `;
    
    selectedElement = table;
    table.classList.add('selected');
}

function addColumn() {
    const columnsList = document.getElementById('columnsList');
    const newColumn = document.createElement('div');
    newColumn.className = 'column-edit';
    newColumn.innerHTML = `
        <input type="text" placeholder="Column Name">
        <input type="text" placeholder="Data Type">
        <button onclick="removeColumn(this)">-</button>
    `;
    columnsList.appendChild(newColumn);
}

function removeColumn(button) {
    button.closest('.column-edit').remove();
}

function saveTableChanges() {
    if (!selectedElement) return;
    
    const tableName = document.getElementById('tableName').value;
    selectedElement.querySelector('.table-name').textContent = tableName;
    
    const columns = selectedElement.querySelector('.table-columns');
    columns.innerHTML = '';
    
    document.querySelectorAll('.column-edit').forEach(colEdit => {
        const inputs = colEdit.querySelectorAll('input');
        columns.innerHTML += `
            <div class="column">
                <span>${inputs[0].value}</span>
                <span class="column-type">${inputs[1].value}</span>
            </div>
        `;
    });
    
    selectedElement.classList.remove('selected');
    selectedElement = null;
    
    document.getElementById('propertyEditor').innerHTML = `
        <div class="no-selection">
            Select an element to edit its properties
        </div>
    `;
}

function deleteTable(button) {
    const table = button.closest('.table-element');
    jsPlumb.remove(table);
}

function autoLayout() {
    // Simple grid layout
    const elements = document.querySelectorAll('.table-element, .note-element');
    const gridSize = Math.ceil(Math.sqrt(elements.length));
    const spacing = 200;
    
    elements.forEach((el, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        el.style.left = (col * spacing + 50) + 'px';
        el.style.top = (row * spacing + 50) + 'px';
    });
    
    jsPlumb.repaintEverything();
}

function exportERD() {
    // Here you would implement the export functionality
    // For demo, we'll just show an alert
    alert('ERD exported successfully!');
} 