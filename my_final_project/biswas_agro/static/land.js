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