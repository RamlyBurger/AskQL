// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeChatbot();
});

// Sample data for demo
const sampleData = {
    sales: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [65, 59, 80, 81, 56, 55]
    },
    customers: {
        labels: ['New', 'Returning', 'Inactive'],
        data: [300, 450, 100]
    },
    products: {
        labels: ['Electronics', 'Clothing', 'Books', 'Food'],
        data: [4000, 3000, 2000, 1000]
    },
    growth: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [10, 15, 8, 12]
    }
};

function initializeCharts() {
    // Sales Trend
    new Chart(document.getElementById('chart1'), {
        type: 'line',
        data: {
            labels: sampleData.sales.labels,
            datasets: [{
                label: 'Monthly Sales',
                data: sampleData.sales.data,
                borderColor: '#2563eb',
                tension: 0.1
            }]
        }
    });

    // Customer Distribution
    new Chart(document.getElementById('chart2'), {
        type: 'pie',
        data: {
            labels: sampleData.customers.labels,
            datasets: [{
                data: sampleData.customers.data,
                backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa']
            }]
        }
    });

    // Product Categories
    new Chart(document.getElementById('chart3'), {
        type: 'bar',
        data: {
            labels: sampleData.products.labels,
            datasets: [{
                label: 'Revenue by Category',
                data: sampleData.products.data,
                backgroundColor: '#2563eb'
            }]
        }
    });

    // Growth Rate
    new Chart(document.getElementById('chart4'), {
        type: 'line',
        data: {
            labels: sampleData.growth.labels,
            datasets: [{
                label: 'Growth Rate (%)',
                data: sampleData.growth.data,
                borderColor: '#2563eb',
                tension: 0.1
            }]
        }
    });
}

// Chatbot functionality
function initializeChatbot() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    
    // Add welcome message
    addMessage('bot', 'Hello! I can help you analyze your data. Try asking about sales trends, customer behavior, or business improvements.');
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        addMessage('user', message);
        processMessage(message);
        userInput.value = '';
    }
}

function addMessage(type, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processMessage(message) {
    // Simple keyword-based responses for demo
    setTimeout(() => {
        let response;
        
        if (message.toLowerCase().includes('top')) {
            response = 'Based on the data, Electronics is our top-performing category with $4,000 in revenue.';
        } else if (message.toLowerCase().includes('sales')) {
            response = 'Sales peaked in March-April, showing a 25% increase from February.';
        } else if (message.toLowerCase().includes('improve')) {
            response = 'To improve sales, consider:\n1. Focus on returning customers (60% of base)\n2. Expand electronics category\n3. Target Q2 for promotions (highest growth rate)';
        } else if (message.toLowerCase().includes('simulation')) {
            response = 'Running a 10% sales increase simulation...\nProjected Revenue: $11,550\nGrowth Impact: +15% customer retention';
        } else {
            response = 'I can help you with sales analysis, customer insights, and business improvements. Try asking about these topics!';
        }
        
        addMessage('bot', response);
    }, 1000);
}

function suggestQuery(type) {
    let query;
    switch(type) {
        case 'top-n':
            query = 'What are our top performing categories?';
            break;
        case 'simulation':
            query = 'Simulate a 10% increase in sales';
            break;
        case 'improvement':
            query = 'How can we improve our business?';
            break;
    }
    
    document.getElementById('userInput').value = query;
    sendMessage();
}

function downloadCharts() {
    // Here you would implement the chart download functionality
    // For demo, we'll just show an alert
    alert('Charts downloaded successfully!');
}

function exportInsights() {
    // Here you would implement the insights export functionality
    // For demo, we'll just show an alert
    alert('Insights exported successfully!');
} 