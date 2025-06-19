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

async function filterProfitChart() {
    const startMonth = document.getElementById('start-date').value;
    const endMonth = document.getElementById('end-date').value;

    const params = new URLSearchParams();

    if (startMonth) {
        const range = getMonthDateRange(startMonth);
        params.append('start', range.start);
    }
    if (endMonth) {
        const range = getMonthDateRange(endMonth);
        params.append('end', range.end);
    }

    let costUrl = '/api/cost/';
    let fishbuyUrl = '/api/fishbuy/';
    let salaryUrl = '/api/salary/';
    let earningUrl = '/api/earning/';

    if (params.toString()) {
        costUrl += `?${params.toString()}`;
        fishbuyUrl += `?${params.toString()}`;
        salaryUrl += `?${params.toString()}`;
        earningUrl += `?${params.toString()}`;
    }

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

    const dateMap = {};

    costData.forEach(item => {
        const date = item.date;
        dateMap[date] = dateMap[date] || { cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        dateMap[date].cost += parseFloat(item.cost) || 0;
    });

    fishbuyData.forEach(item => {
        const date = item.date;
        dateMap[date] = dateMap[date] || { cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        dateMap[date].fishbuy += parseFloat(item.price) || 0;
    });

    salaryData.forEach(item => {
        const date = item.date;
        dateMap[date] = dateMap[date] || { cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        dateMap[date].salary += parseFloat(item.total) || 0;
    });

    earningData.forEach(item => {
        const date = item.date;
        dateMap[date] = dateMap[date] || { cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        dateMap[date].earnings += parseFloat(item.price) || 0;
    });

    const dates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));

    const chartData = dates.map(date => ({
        date,
        cost: dateMap[date].cost,
        fishbuy: dateMap[date].fishbuy,
        salary: dateMap[date].salary,
        totalCost: dateMap[date].cost + dateMap[date].fishbuy + dateMap[date].salary,
        earnings: dateMap[date].earnings
    }));

    drawProfitChart(chartData);
}

function drawProfitChart(data) {
    const labels = data.map(item => item.date);
    const totalCostData = data.map(item => item.totalCost);
    const earningsData = data.map(item => item.earnings);

    // Tooltip data
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
                    label: 'Total Cost',
                    data: totalCostData,
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
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const idx = context.dataIndex;
                            if (context.dataset.label === 'Total Cost') {
                                return `Total Cost: $${totalCostData[idx].toFixed(2)}`;
                            } else if (context.dataset.label === 'Earnings') {
                                return `Earnings: $${earningsData[idx].toFixed(2)}`;
                            }
                            return '';
                        },
                        afterBody: function(context) {
                            const idx = context[0].dataIndex;
                            const cost = costData[idx] || 0;
                            const fishbuy = fishbuyData[idx] || 0;
                            const salary = salaryData[idx] || 0;
                            const earnings = earningsData[idx] || 0;
                            const profit = earnings - (cost + fishbuy + salary);
                            return [
                                `Cost Breakdown:`,
                                `- Item Cost: $${cost.toFixed(2)}`,
                                `- Fish Cost: $${fishbuy.toFixed(2)}`,
                                `- Salary: $${salary.toFixed(2)}`,
                                ``,
                                `Profit: $${profit.toFixed(2)}`
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