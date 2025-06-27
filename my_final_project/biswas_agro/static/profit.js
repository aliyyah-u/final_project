let profitChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterProfitChart() {
    const startMonth = document.getElementById('start-date').value; // YYYY-MM
    const endMonth = document.getElementById('end-date').value;

    let startDate = null;
    let endDate = null;

    // Only calculate dates if values chosen
    if (startMonth) {
        startDate = startMonth + '-01'; // 1st day of month
    }
    if (endMonth) {
        const dateParts = endMonth.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const lastDay = new Date(year, month, 0); // last day of end month (next month 0th day)
        endDate = lastDay.toISOString().slice(0, 10); // YYYY-MM-DD

    }

    let costUrl = '/api/cost/';
    let fishbuyUrl = '/api/fishbuy/';
    let salaryUrl = '/api/salary/';
    let earningUrl = '/api/earning/';

    // Add the selected date range as parameters
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    costUrl += query;
    fishbuyUrl += query;
    salaryUrl += query;
    earningUrl += query;

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

    const collected = collectByDate(costData, fishbuyData, salaryData, earningData)
    drawProfitChart(collected);
}

function collectByDate(costData, fishbuyData, salaryData, earningData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (groupBy === 'month') return date.slice(0, 7);    // "YYYY-MM"
        if (groupBy === 'year') return date.slice(0, 4);     // "YYYY"
        return date;                                         // Full date (default)
    }

    // Aggregate cost per group
    costData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 }; // group = date/month/year key
        map[group].cost += parseFloat(item.cost || 0);
    });

    // Aggregate fishbuy per group
    fishbuyData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[group].fishbuy += parseFloat(item.price || 0);
    });

    // Aggregate salary per group
    salaryData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[group].salary += parseFloat(item.total || 0);
    });

    // Aggregate earnings per group
    earningData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[group].earnings += parseFloat(item.price || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

function drawProfitChart(data) {
    const labels = data.map(item => item.group);
    const totalCostData = data.map(item => (item.cost || 0) + (item.fishbuy || 0) + (item.salary || 0));
    const earningsData = data.map(item => item.earnings || 0);

    const ctx = document.getElementById('profitChart');

    if (profitChart) {
        profitChart.destroy();
    }

    profitChart = new Chart(ctx, {
        type: selectedChartType === 'area' ? 'line' : selectedChartType,
        data: {
            labels,
            datasets: [
                {
                    label: 'Total Cost ৳',
                    data: totalCostData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)',
                    borderColor: 'rgba(220, 53, 69, 0.6)',
                    fill: selectedChartType === 'area',
                },
                {
                    label: 'Earnings ৳',
                    data: earningsData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)',
                    borderColor: 'rgba(167, 189, 167, 0.6)',
                    fill: selectedChartType === 'area',
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

                            const itemCost = item.cost || 0;
                            const fishCost = item.fishbuy || 0;
                            const salary = item.salary || 0;
                            const totalCost = itemCost + fishCost + salary;
                            const earnings = item.earnings || 0;
                            const profit = earnings - totalCost;

                            if (context.dataset.label == 'Total Cost ৳') {
                                return [
                                    'Total Cost: ' + totalCost,
                                    'Cost Breakdown: ',
                                    'Item Cost: ' + itemCost,
                                    'Fish Cost: ' + fishCost,
                                    'Salary: ' + salary,
                                    '',
                                    'Profit: ' + profit
                                ];
                            }

                            if (context.dataset.label == 'Earnings ৳') {
                                return [
                                    'Earnings: ' + earnings,
                                    '',
                                    'Profit: ' + profit
                                ];
                            }

                            return '';
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

function downloadChartAsPDF() { 
    const canvas = document.getElementById('profitChart');
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jspdf.jsPDF('portrait');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData); // original image (pixels)
    const pdfWidth = pageWidth * 0.9;     // Scale image width

    // Calculate ratio for fitted pdfHeight from: (new height) / (new width) = (original height) / (original width)
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // // Default top-left position (10, 10)
    const x = 10;
    const y = 10;

    pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
    pdf.save('profit_chart.pdf');
}