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
    const totalCostData = data.map(item =>
        (item.cost || 0) + (item.fishbuy || 0) + (item.salary || 0)
    );

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
                    label: 'Total Cost',
                    data: totalCostData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const item = data[index];

                            const itemCost = (item.cost || 0).toFixed(2);
                            const fishCost = (item.fishbuy || 0).toFixed(2);
                            const salary = (item.salary || 0).toFixed(2);
                            const total = (
                                (item.cost || 0) +
                                (item.fishbuy || 0) +
                                (item.salary || 0)
                            ).toFixed(2);

                            return [
                                `Total: ${total}`,
                                '',
                                `Item Cost: ${itemCost}`,
                                `Fish Cost: ${fishCost}`,
                                `Salary: ${salary}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}