let myChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterCostChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    const costUrl = '/api/cost/' + (params.toString() ? `?${params.toString()}` : '');
    const fishbuyUrl = '/api/fishbuy/' + (params.toString() ? `?${params.toString()}` : '');

    const [costRes, fishbuyRes] = await Promise.all([
        fetch(costUrl),
        fetch(fishbuyUrl)
    ]);

    const [costData, fishbuyData] = await Promise.all([
        costRes.json(),
        fishbuyRes.json()
    ]);

    const merged = mergeByDate(costData, fishbuyData);
    drawChart(merged);
}

function mergeByDate(costData, fishbuyData) {
    const map = {};

    // Aggregate cost per date
    costData.forEach(item => {
        const date = item.date;
        map[date] = map[date] || { date, cost: 0, fishbuy: 0 };
        map[date].cost += parseFloat(item.cost || 0);
    });

    // Aggregate fishbuy price per date
    fishbuyData.forEach(item => {
        const date = item.date;
        map[date] = map[date] || { date, cost: 0, fishbuy: 0 };
        map[date].fishbuy += parseFloat(item.price || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function drawChart(data) {
    const labels = data.map(item => item.date);
    const costData = data.map(item => item.cost);
    const fishbuyData = data.map(item => item.fishbuy);

    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cost',
                    data: costData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)'
                },
                {
                    label: 'Fishbuy Price',
                    data: fishbuyData,
                    backgroundColor: 'rgba(100, 149, 237, 0.6)'
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