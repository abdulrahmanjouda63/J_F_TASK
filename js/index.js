let dataUrl = 'https://api.example.com/transactiondata'; // Replace with your API endpoint
let data = [];
let chart;

async function getData() {
    let response = await fetch(dataUrl);
    let data = await response.json();
    return data;
}

function filterData() {
    let customerName = document.getElementById('customerName').value;
    let transactionAmount = document.getElementById('transactionAmount').value;
    let filteredData = data.filter(item => {
        return (customerName ? item.customerName.includes(customerName) : true) &&
            (transactionAmount ? item.transactionAmount == transactionAmount : true);
    });
    displayData(filteredData);
}

function displayData(data) {
    let dataBody = document.getElementById('dataBody');
    dataBody.innerHTML = '';
    data.forEach(item => {
        let row = document.createElement('tr');
        let customerNameCell = document.createElement('td');
        customerNameCell.textContent = item.customerName;
        let transactionAmountCell = document.createElement('td');
        transactionAmountCell.textContent = item.transactionAmount;
        let dateCell = document.createElement('td');
        dateCell.textContent = item.date;
        row.appendChild(customerNameCell);
        row.appendChild(transactionAmountCell);
        row.appendChild(dateCell);
        dataBody.appendChild(row);
    });
    createChart(data);
}

function createChart(data) {
    if (chart) {
        chart.destroy();
    }
    let customerName = data[0].customerName;
    let dates = [...new Set(data.map(item => item.date))]; // Get unique dates
    let amounts = dates.map(date => {
        let transactions = data.filter(item => item.date === date);
        return transactions.reduce((acc, item) => acc + item.transactionAmount, 0);
    });
    chart = new Chart(document.getElementById('chart'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `Total transaction amount per day for ${customerName}`,
                data: amounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadData() {
    if (localStorage.getItem('data')) {
        data = JSON.parse(localStorage.getItem('data'));
    } else {
        data = await getData();
        localStorage.setItem('data', JSON.stringify(data)); // Store data in local storage
    }
    displayData(data);
}

loadData();

document.getElementById('addCustomerButton').addEventListener('click', addCustomer);

function addCustomer(event) {
    event.preventDefault(); // Prevent the form from submitting
    let newCustomerName = document.getElementById('newCustomerName').value;
    let newTransactionAmount = document.getElementById('newTransactionAmount').value;
    let newDate = document.getElementById('newDate').value;

    // Create a new customer object
    let newCustomer = {
        customerName: newCustomerName,
        transactionAmount: newTransactionAmount,
        date: newDate
    };

    // Add the new customer to the data array
    data.push(newCustomer);

    // Update local storage
    localStorage.setItem('data', JSON.stringify(data));

    // Clear the form fields
    document.getElementById('newCustomerName').value = '';
    document.getElementById('newTransactionAmount').value = '';
    document.getElementById('newDate').value = '';

    // Update the table and chart
    displayData(data);
}
