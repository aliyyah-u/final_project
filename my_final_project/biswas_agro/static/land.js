let myChart = null;
let selectedChartType = 'bar';
let selectedXAxisType = 'id';
let selectedYAxisType = 'amount';

function setChartType(type) {
    selectedChartType = type;
}

function setXAxisType(xType) {
    selectedXAxisType = xType;
}

function setYAxisType(yType) {
    selectedYAxisType = yType;
}

// Fetch and filter chart data
async function filterChart() {
    let url = '/api/land/';
    const params = new URLSearchParams();
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        drawChart(data);
    } catch (error) {
        console.error('Failed to fetch chart data:', error);
    }
}

function drawChart(data) {
    const labels = data.map(item => item[selectedXAxisType]);
    const myData = data.map(item => item[selectedYAxisType]);

    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    const isHorizontalBar = selectedChartType === 'horizontalBar';
    const isSpline = selectedChartType === 'spline';
    const isArea = selectedChartType === 'area';

    let chartType;
    if (isHorizontalBar) {
        chartType = 'bar';
    } else if (isSpline || selectedChartType === 'line' || isArea) {
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
            labels,
            datasets: [{
                label: selectedXAxisType + " vs " + selectedYAxisType,
                data: myData,
                backgroundColor: 'rgba(89, 212, 142, 0.8)',
                borderColor: 'rgba(89, 212, 142, 0.8)',
                fill: isArea,
                tension: tensionValue
            }]
        },
        options: {
            indexAxis: isHorizontalBar ? 'y' : 'x',
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
    pdf.save('land_chart.pdf');
}