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

async function filterChart() {
    let url = '/api/land/';
    const params = new URLSearchParams();
    if (params.toString()) url += `?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    drawChart(data);
}

function drawChart(data) {
    const labels = data.map(item => item[selectedXAxisType]);
    const myData = data.map(item => item[selectedYAxisType]);

    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels: labels,
            datasets: [{
                label: selectedYAxisType,
                data: myData,
                backgroundColor: 'rgba(167, 189, 167, 0.6)',
                borderColor: 'rgba(167, 189, 167, 0.6)'
            }]
        },
        options: {
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