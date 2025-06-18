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
    const groupBy = document.getElementById('grouping').value;
    const map = {};

    function getKey(date) {
        if (groupBy === 'month') return date.slice(0, 7);        // YYYY-MM
        if (groupBy === 'year') return date.slice(0, 4);         // YYYY
        return date;                                             // Full date (default)
    }

    costData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0 };
        map[key].cost += parseFloat(item.cost || 0);
    });

    fishbuyData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0 };
        map[key].fishbuy += parseFloat(item.price || 0);
    });

    salaryData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0 };
        map[key].salary += parseFloat(item.total || 0);
    });

    return Object.values(map).sort((a, b) => new Date(a.key) - new Date(b.key));
}

function drawChart(data) {
    const labels = data.map(item => item.key);
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