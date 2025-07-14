// Initialise chart and default chart type
let myChart = null;
let selectedChartType = 'bar';

// Set the selected chart type
function setChartType(type) {
    selectedChartType = type;
}

// Main function to fetch data and render chart
async function filterCostChart() {
    // Get selected date range values
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // API URLs
    let costUrl = '/api/cost/';
    let fishbuyUrl = '/api/fishbuy/';
    let salaryUrl = '/api/salary/';
    const params = new URLSearchParams();

    // Append query parameters for filtering by date
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    costUrl += query;
    fishbuyUrl += query;
    salaryUrl += query;

    let costData = [], fishbuyData = [], salaryData = [];

    try {
        // Fetch data
        const [costRes, fishbuyRes, salaryRes] = await Promise.all([
            fetch(costUrl),
            fetch(fishbuyUrl),
            fetch(salaryUrl)
        ]);

        // Convert responses to JSON
        [costData, fishbuyData, salaryData] = await Promise.all([
            costRes.json(),
            fishbuyRes.json(),
            salaryRes.json()
        ]);

        // Aggregate and format data for charting
        const aggregatedData = aggregateByDate(costData, fishbuyData, salaryData);
        drawChart(aggregatedData);
    } 
    catch (error) {
        console.error('Please try again - failed to load chart data:', error);
    }
}

// Groups and sums data by selected date format (day, month, or year)
function aggregateByDate(costData, fishbuyData, salaryData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (!date) return "No Date";
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

    // Sum salaries
    salaryData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0 };
        map[group].salary += parseFloat(item.total || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

// Render chart given selected data
function drawChart(data) {
    const labels = data.map(item => item.group);
    const totalCostData = data.map(item => (item.cost || 0) + (item.fishbuy || 0) + (item.salary || 0));

    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    const isHorizontalBar = selectedChartType === 'horizontalBar';
    const isSpline = selectedChartType === 'spline';
    const isArea = selectedChartType === 'area';
    const isScatter = selectedChartType === 'scatter';

    let chartType;
    if (isHorizontalBar) {
        chartType = 'bar';
    } else if (isSpline || selectedChartType === 'line' || isArea || isScatter) {
        chartType = 'line';
    } else {
        chartType = selectedChartType;
    }

    let tensionValue;
    if (isSpline) {
        tensionValue = 0.4;
    } else {
        tensionValue = 0;
    }

    let indexAxisValue;
    if (isHorizontalBar) {
        indexAxisValue = 'y';
    } else {
        indexAxisValue = 'x';
    }


    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Cost ৳',
                    data: totalCostData,
                    backgroundColor: 'rgba(89, 212, 142, 0.8)',
                    borderColor: 'rgba(89, 212, 142, 0.8)',
                    fill: isArea,
                    tension: tensionValue,
                    showLine: !isScatter,
                }
            ]
        },
        options: {
            indexAxis: indexAxisValue,
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