let profitChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

function getMonthDateRange(monthStr) {
    if (!monthStr) return null;
    const [year, month] = monthStr.split('-').map(Number); // convert str to num
    const start = new Date(year, month - 1, 1); //month - 1 as js months start from 0. 1 = first day of month
    const end = new Date(year, month, 0); // 0 = last day of month
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
        const startDate = range.start;
        params.append('start', startDate);
    }

    if (endMonth) {
        const range = getMonthDateRange(endMonth);
        const endDate = range.end;
        params.append('end', endDate);
    }


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