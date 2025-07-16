// Sample database list for demo
let databases = [
    { id: 1, name: 'Sample Database', tables: 5, lastModified: '2024-03-20' },
    { id: 2, name: 'E-commerce DB', tables: 8, lastModified: '2024-03-19' }
];

// Initialize page
window.addEventListener('load', function() {
    renderDatabaseList();
});

function renderDatabaseList() {
    const container = document.getElementById('databaseList');
    container.innerHTML = databases.map(db => `
        <div class="database-item" onclick="selectDatabase(${db.id})">
            <h3>${db.name}</h3>
            <p>${db.tables} tables</p>
            <p>Last modified: ${db.lastModified}</p>
        </div>
    `).join('');
}

function showCreateForm(type) {
    const modal = document.getElementById('createModal');
    const modalForms = document.getElementById('modalForms');
    
    // Different forms based on creation type
    const forms = {
        new: `
            <h2>Create New Database</h2>
            <form onsubmit="handleNewDatabase(event)">
                <input type="text" placeholder="Database Name" required>
                <button type="submit" class="primary-btn">Create</button>
            </form>
        `,
        csv: `
            <h2>Upload CSV File</h2>
            <form onsubmit="handleCSVUpload(event)">
                <input type="file" accept=".csv" required>
                <button type="submit" class="primary-btn">Upload</button>
            </form>
        `,
        sql: `
            <h2>SQL to ERD</h2>
            <form onsubmit="handleSQLConversion(event)">
                <textarea placeholder="Paste your SQL schema here..." required></textarea>
                <button type="submit" class="primary-btn">Convert</button>
            </form>
        `,
        external: `
            <h2>Connect External Database</h2>
            <form onsubmit="handleExternalConnection(event)">
                <input type="text" placeholder="Host" required>
                <input type="text" placeholder="Port" required>
                <input type="text" placeholder="Database Name" required>
                <input type="text" placeholder="Username" required>
                <input type="password" placeholder="Password" required>
                <button type="submit" class="primary-btn">Connect</button>
            </form>
        `,
        rpa: `
            <h2>RPA Scraper Setup</h2>
            <form onsubmit="handleRPASetup(event)">
                <input type="url" placeholder="Target URL" required>
                <textarea placeholder="Describe the data you want to scrape..." required></textarea>
                <button type="submit" class="primary-btn">Start Scraping</button>
            </form>
        `
    };

    modalForms.innerHTML = forms[type];
    modal.style.display = 'block';

    // Close button functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = () => modal.style.display = 'none';
    
    // Close on outside click
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

// Form handlers
function handleNewDatabase(e) {
    e.preventDefault();
    const name = e.target.querySelector('input').value;
    
    // Add new database to list
    databases.push({
        id: databases.length + 1,
        name: name,
        tables: 0,
        lastModified: new Date().toISOString().split('T')[0]
    });
    
    renderDatabaseList();
    document.getElementById('createModal').style.display = 'none';
}

function handleCSVUpload(e) {
    e.preventDefault();
    const file = e.target.querySelector('input[type="file"]').files[0];
    
    // Here you would process the CSV file
    // For demo, we'll just simulate success
    alert('CSV uploaded successfully! Redirecting to ERD page...');
    window.location.href = 'erd.html';
}

function handleSQLConversion(e) {
    e.preventDefault();
    const sql = e.target.querySelector('textarea').value;
    
    // Here you would process the SQL
    // For demo, we'll just simulate success
    alert('SQL processed successfully! Redirecting to ERD page...');
    window.location.href = 'erd.html';
}

function handleExternalConnection(e) {
    e.preventDefault();
    // Here you would handle the connection
    // For demo, we'll just simulate success
    alert('Connected successfully! Redirecting to ERD page...');
    window.location.href = 'erd.html';
}

function handleRPASetup(e) {
    e.preventDefault();
    // Here you would set up the RPA scraper
    // For demo, we'll just simulate success
    alert('Scraper configured successfully! The process will run in the background.');
    document.getElementById('createModal').style.display = 'none';
}

function selectDatabase(id) {
    // Here you would typically load the database
    // For demo, we'll just redirect to ERD page
    window.location.href = 'erd.html';
} 