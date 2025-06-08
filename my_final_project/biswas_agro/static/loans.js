let loanChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterLoanChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let url = '/api/loantransactions/';
    const params = new URLSearchParams();

    // Add the selected date range as parameters
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    // Sort cost data by date, oldest first
    const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    drawChart(sorted);
}

function drawChart(data) {
    const labels = data.map(item => item.date);
    const loanData = data.map(item => item.payment);

    const ctx = document.getElementById('loanChart');

    if (loanChart) {
        loanChart.destroy();
    }

    loanChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Loan payment',
                data: loanData,
                backgroundColor: 'rgba(167, 189, 167, 0.6)'
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