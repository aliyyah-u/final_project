let loanChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

async function filterLoanChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    let url = '/api/loantransactions/';
    const params = new URLSearchParams();

    // Add the selected date range as parameters
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    const loanData = await response.json();

    const collected = collectByDate(loanData);
    drawLoanChart(collected);
}

function collectByDate(loanData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (groupBy === 'month') return date.slice(0, 7);    // "YYYY-MM"
        if (groupBy === 'year') return date.slice(0, 4);     // "YYYY"
        return date;                                         // Full date (default)
    }

    // Aggregate loan per group
    loanData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, loan: 0 }; // group = date/month/year key
        map[group].loan += parseFloat(item.payment || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

function drawLoanChart(data) {
    const labels = data.map(item => item.group);
    const loanData = data.map(item => item.loan || 0);

    const ctx = document.getElementById('loanChart');

    if (loanChart) {
        loanChart.destroy();
    }

    const isHorizontalBar = selectedChartType === 'horizontalBar';

    loanChart = new Chart(ctx, {
        type: isHorizontalBar ? 'bar' : (selectedChartType === 'area' ? 'line' : selectedChartType),
        data: {
            labels: labels,
            datasets: [{
                label: 'Loan payment ৳',
                data: loanData,
                backgroundColor: 'rgba(167, 189, 167, 0.6)',
                borderColor: 'rgba(167, 189, 167, 0.6)',
                fill: selectedChartType === 'area',
            }]
        },
        options: {
            indexAxis: isHorizontalBar ? 'y' : 'x',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function downloadChartAsPDF() { 
    const canvas = document.getElementById('loanChart');
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
    pdf.save('loan_chart.pdf');
}