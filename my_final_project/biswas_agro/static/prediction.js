let fishChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterPredictionChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let url = '/api/fishbuy/';
    const params = new URLSearchParams();

    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    const fishbuyData = await response.json();

    const collected = collectByDate(fishbuyData);
    // Calculate baseline data based on first actual fish quantity (at start date)
    const baseline = calculateBaseline(collected);
    if (baseline.length === 0) {
        alert('No valid data to calculate baseline for the selected date range. Please try different dates.');
        return;
    }
    drawPredictionChart(collected, baseline);
}

function collectByDate(fishbuyData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (groupBy === 'month') return date.slice(0, 7);        // YYYY-MM
        if (groupBy === 'year') return date.slice(0, 4);         // YYYY
        return date;                                             // Full date (default)
    }

    fishbuyData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, fishbuy: 0 };
        map[group].fishbuy += parseFloat(item.fishquantity || 0);
    });

    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

function calculateBaseline(data) {
    if (data.length === 0) return [];

    // Use the first fish quantity as baseline start
    const startValue = data[0].fishbuy || 0;

    // Assume a fixed 10% growth rate per period
    const growthRate = 0.1;

    var projections = [];
    for (var i = 0; i < data.length; i++) {
        var growth = Math.pow(1 + growthRate, i);
        projections[i] = startValue * growth;
    }
    return projections;
}

function drawPredictionChart(data, baselineData) {
    const labels = data.map(item => item.group);
    const fishBuyData = data.map(item => item.fishbuy || 0);

    const ctx = document.getElementById('fishChart');

    if (fishChart) {
        fishChart.destroy();
    }

    const isHorizontalBar = selectedChartType === 'horizontalBar';
    const isSpline = selectedChartType === 'spline';
    const isArea = selectedChartType === 'area';
    const isScatter = selectedChartType === 'scatter';

    let chartType;
    let tensionValue;
    let indexAxisValue;

    if (isHorizontalBar) {
        chartType = 'bar';
    } else if (isSpline || selectedChartType === 'line' || isArea || isScatter) {
        chartType = 'line';
    } else {
        chartType = selectedChartType;
    }

    if (isSpline) {
        tensionValue = 0.4;
    } else {
        tensionValue = 0;
    }
    
    if (isHorizontalBar) {
        indexAxisValue = 'y';
    } else {
        indexAxisValue = 'x';
    }

    fishChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Fish Quantity',
                    data: fishBuyData,
                    backgroundColor: 'rgba(89, 212, 142, 0.8)',
                    borderColor: 'rgba(89, 212, 142, 0.8)',
                    fill: isArea,
                    tension: tensionValue,
                    showLine: !isScatter,
                },
                {
                    label: 'Baseline Growth (Prediction)',
                    data: baselineData,
                    borderColor: 'rgba(39, 191, 245, 0.8)',
                    backgroundColor: 'rgba(39, 191, 245, 0.8)',
                    borderDash: [6, 6], // dashed line
                    fill: isArea,
                    tension: tensionValue,
                    showLine: !isScatter,
                }
            ]
        },
        options: {
            indexAxis: indexAxisValue,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function downloadChartAsPDF() {
    const canvas = document.getElementById('fishChart');
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jspdf.jsPDF('portrait');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData); // original image (pixels)
    const pdfWidth = pageWidth * 0.9;     // Scale image width

    // Calculate ratio for fitted pdfHeight from: (new height) / (new width) = (original height) / (original width)
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Default top-left position (10, 10)
    const x = 10;
    const y = 10;

    pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
    pdf.save('fish_prediction_chart.pdf');
}