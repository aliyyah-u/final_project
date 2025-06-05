let profitChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterProfitChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    let costUrl = '/api/cost/';
    let earningUrl = '/api/earning/';
    if (params.toString()) {
        costUrl += `?${params.toString()}`;
        earningUrl += `?${params.toString()}`;
    }

    const costResponse = await fetch(costUrl);
    const earningResponse = await fetch(earningUrl);

    const costData = await costResponse.json();
    const earningData = await earningResponse.json();

    // Map cost and earnings by date
    const dateMap = {};

    costData.forEach(item => {
        const date = item.date;
        dateMap[date] = dateMap[date] || { cost: 0, earnings: 0 };
        dateMap[date].cost += item.cost || 0;
    });

    earningData.forEach(item => {
        const date = item.date;
        dateMap[date] = dateMap[date] || { cost: 0, earnings: 0 };
        dateMap[date].earnings += parseFloat(item.price) || 0;
    });

    // Sort dates
    const dates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));
    const chartData = dates.map(date => ({
        date,
        cost: dateMap[date].cost,
        earnings: dateMap[date].earnings
    }));

    drawProfitChart(chartData);
}

function drawProfitChart(data) {
    const labels = data.map(item => item.date);
    const costData = data.map(item => item.cost);
    const earningsData = data.map(item => item.earnings);

    const ctx = document.getElementById('profitChart');

    if (profitChart) {
        profitChart.destroy();
    }

    profitChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cost',
                    data: costData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)'
                },
                {
                    label: 'Earnings',
                    data: earningsData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}