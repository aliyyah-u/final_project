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
    const salaryUrl = '/api/salary/' + (params.toString() ? `?${params.toString()}` : '');

    const [costRes, fishbuyRes, salaryRes] = await Promise.all([
        fetch(costUrl),
        fetch(fishbuyUrl),
        fetch(salaryUrl)
    ]);

    const [costData, fishbuyData, salaryData] = await Promise.all([
        costRes.json(),
        fishbuyRes.json(),
        salaryRes.json()
    ]);

    const merged = mergeByDate(costData, fishbuyData, salaryData);
    drawChart(merged);
}

function mergeByDate(costData, fishbuyData, salaryData) {
    const map = {};

    // Aggregate cost per date
    costData.forEach(item => {
        const date = item.date;
        map[date] = map[date] || { date, cost: 0, fishbuy: 0, salary: 0 };
        map[date].cost += parseFloat(item.cost || 0);
    });

    // Aggregate fishbuy price per date
    fishbuyData.forEach(item => {
        const date = item.date;
        map[date] = map[date] || { date, cost: 0, fishbuy: 0, salary: 0 };
        map[date].fishbuy += parseFloat(item.price || 0);
    });

      salaryData.forEach(item => {
        const date = item.date;
        map[date] = map[date] || { date, cost: 0, fishbuy: 0, salary: 0 };
        map[date].salary += parseFloat(item.total || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function drawChart(data) {
    const labels = data.map(item => item.date);
    const costData = data.map(item => item.cost);
    const fishbuyData = data.map(item => item.fishbuy);
    const salaryData = data.map(item => item.salary);

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
                    label: 'Item Cost',
                    data: costData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)'
                },
                {
                    label: 'Fish Price',
                    data: fishbuyData,
                    backgroundColor: 'rgba(100, 149, 237, 0.6)'
                },
                 {
                    label: 'Salary',
                    data: salaryData,
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