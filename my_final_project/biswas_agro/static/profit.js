let profitChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

function getMonthDateRange(monthStr) {
    if (!monthStr) return null;
    const [year, month] = monthStr.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return {
        start: start.toISOString().slice(0, 10),  // YYYY-MM-DD format
        end: end.toISOString().slice(0, 10)
    };
}

function mergeByDate(costData, fishbuyData, salaryData, earningData) {
    const groupBy = document.getElementById('grouping').value;
    const map = {};

    function getKey(date) {
    if (groupBy === 'month') return date.slice(0, 7);    // "YYYY-MM"
    if (groupBy === 'year') return date.slice(0, 4);     // "YYYY"
    return date;                                          // Full date
}

    costData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[key].cost += parseFloat(item.cost || 0);
    });

    fishbuyData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[key].fishbuy += parseFloat(item.price || 0);
    });

    salaryData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[key].salary += parseFloat(item.total || 0);
    });

    earningData.forEach(item => {
        const key = getKey(item.date);
        map[key] = map[key] || { key, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[key].earnings += parseFloat(item.price || 0);
    });

    return Object.values(map).sort((a, b) => new Date(a.key) - new Date(b.key));
}

async function filterProfitChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    const costUrl = '/api/cost/' + (params.toString() ? `?${params.toString()}` : '');
    const fishbuyUrl = '/api/fishbuy/' + (params.toString() ? `?${params.toString()}` : '');
    const salaryUrl = '/api/salary/' + (params.toString() ? `?${params.toString()}` : '');
    const earningUrl = '/api/earning/' + (params.toString() ? `?${params.toString()}` : '');

    const [costRes, fishbuyRes, salaryRes, earningRes] = await Promise.all([
        fetch(costUrl),
        fetch(fishbuyUrl),
        fetch(salaryUrl),
        fetch(earningUrl)
    ]);

    const [costData, fishbuyData, salaryData, earningData] = await Promise.all([
        costRes.json(),
        fishbuyRes.json(),
        salaryRes.json(),
        earningRes.json()
    ]);

    const merged = mergeByDate(costData, fishbuyData, salaryData, earningData)
    drawProfitChart(merged);
}

function drawProfitChart(data) {
    const labels = data.map(item => item.key);
    const totalCostData = data.map(item =>
        (item.cost || 0) + (item.fishbuy || 0) + (item.salary || 0)
    );
    const earningsData = data.map(item => item.earnings);
    const costData = data.map(item => item.cost);
    const fishbuyData = data.map(item => item.fishbuy);
    const salaryData = data.map(item => item.salary);

    const ctx = document.getElementById('profitChart');

    if (profitChart) {
        profitChart.destroy();
    }

    profitChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels,
            datasets: [
                {
                    label: 'Total Cost ৳',
                    data: totalCostData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)'
                },
                {
                    label: 'Earnings ৳',
                    data: earningsData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const idx = context.dataIndex;
                            if (context.dataset.label === 'Total Cost') {
                                return `Total Cost: ${totalCostData[idx].toFixed(2)}`;
                            } else if (context.dataset.label === 'Earnings') {
                                return `Earnings: ${earningsData[idx].toFixed(2)}`;
                            }
                            return '';
                        },
                        afterBody: function (context) {
                            const idx = context[0].dataIndex;
                            const cost = costData[idx] || 0;
                            const fishbuy = fishbuyData[idx] || 0;
                            const salary = salaryData[idx] || 0;
                            const earnings = earningsData[idx] || 0;
                            const profit = earnings - (cost + fishbuy + salary);
                            return [
                                `Cost Breakdown:`,
                                `- Item Cost: ${cost.toFixed(2)}`,
                                `- Fish Cost: ${fishbuy.toFixed(2)}`,
                                `- Salary: ${salary.toFixed(2)}`,
                                ``,
                                `Profit: ${profit.toFixed(2)}`
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