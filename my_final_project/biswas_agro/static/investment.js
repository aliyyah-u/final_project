let myChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let url = '/api/investment/';
    const params = new URLSearchParams();

    // Add the selected date range as parameters
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    // Sort cost data by date, oldest first
    const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    drawChart(sorted);
}

function drawChart(data) {
    const labels = data.map(item => item.date);
    const myData = data.map(item => item.amount);

    const ctx = document.getElementById('myChart');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Investment amount',
                data: myData,
                backgroundColor: 'rgba(167, 189, 167, 0.6)'
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
    pdf.save('investment_chart.pdf');
}