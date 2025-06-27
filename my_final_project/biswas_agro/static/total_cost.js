let myChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterCostChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let costUrl = '/api/cost/';
    let fishbuyUrl = '/api/fishbuy/';
    let salaryUrl = '/api/salary/';
    const params = new URLSearchParams();

    // Add the selected date range as parameters
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    costUrl += query;
    fishbuyUrl += query;
    salaryUrl += query;

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

    // collect and sort cost data by date, oldest first
    const collected = collectByDate(costData, fishbuyData, salaryData);
    drawChart(collected);

}

function collectByDate(costData, fishbuyData, salaryData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (groupBy === 'month') return date.slice(0, 7);        // YYYY-MM
        if (groupBy === 'year') return date.slice(0, 4);         // YYYY
        return date;                                             // Full date (default)
    }

    // Aggregate cost per date
    costData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0 };
        map[group].cost += parseFloat(item.cost || 0);
    });

    // Aggregate fishbuy price per date
    fishbuyData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0 };
        map[group].fishbuy += parseFloat(item.price || 0);
    });

    salaryData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0 };
        map[group].salary += parseFloat(item.total || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

function drawChart(data) {
    const labels = data.map(item => item.group);
    const totalCostData = data.map(item => (item.cost || 0) + (item.fishbuy || 0) + (item.salary || 0));

    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    const isHorizontalBar = selectedChartType === 'horizontalBar';

    myChart = new Chart(ctx, {
        type: isHorizontalBar ? 'bar' : (selectedChartType === 'area' ? 'line' : selectedChartType),
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Cost ৳',
                    data: totalCostData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)',
                    borderColor: 'rgba(167, 189, 167, 0.6)',
                    fill: selectedChartType === 'area',

                }
            ]
        },
        options: {
            indexAxis: isHorizontalBar ? 'y' : 'x',
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const item = data[index];

                            const itemCost = (item.cost || 0);
                            const fishCost = (item.fishbuy || 0);
                            const salary = (item.salary || 0);
                            const total = (
                                (item.cost || 0) +
                                (item.fishbuy || 0) +
                                (item.salary || 0)
                            );

                            return [
                                'Total Cost: ' + total,
                                '',
                                'Item Cost: ' + itemCost,
                                'Fish Cost: ' + fishCost,
                                'Salary: ' + salary
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

function downloadChartAsPDF() { 
    const canvas = document.getElementById('myChart');
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
    pdf.save('total_cost_chart.pdf');
}