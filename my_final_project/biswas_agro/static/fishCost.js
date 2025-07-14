let myChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

// Load fish dropdown upon page reload
document.addEventListener('DOMContentLoaded', populateFishDropdown);


async function populateFishDropdown() {
    const select = document.getElementById('fishname');
    select.innerHTML = ''; // clear dropdown

    // Add "All Fish" option
    const optionAll = document.createElement('option');
    optionAll.value = '';
    optionAll.textContent = 'All Fish';
    select.appendChild(optionAll);

    try {
        const response = await fetch('/api/fishbuy/');
        const data = await response.json();

        // Collect unique fish names
        const fishSet = new Set();
        for (let i = 0; i < data.length; i++) {
            const name = data[i].fishname;
            if (name) fishSet.add(name);
        }
        const fishNames = Array.from(fishSet);

        // Add each fish from DB to dropdown
        for (let i = 0; i < fishNames.length; i++) {
            const option = document.createElement('option');
            option.value = fishNames[i];
            option.textContent = fishNames[i];
            select.appendChild(option);
        }

    } catch (error) {
        console.error('Could not load fish:', error);
    }
}

// Get selected fish from dropdown
function getSelectedFish() {
    const fishName = document.getElementById('fishname').value;
    return { fishName };
}

async function filterChart() {
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;
    const fishName = getSelectedFish().fishName;

    let url = '/api/fishbuy/';

    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const query = params.toString() ? '?' + params.toString() : '';
    url += query;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Filter by fish name if selected
        let filtered = data;
        if (fishName) {
            filtered = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].fishname === fishName) {
                    filtered.push(data[i]);
                }
            }
        }

        const grouped = groupByDate(filtered);
        drawChart(grouped, fishName);
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Group data by date/month/year
function groupByDate(fishbuyData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (groupBy === 'month') return date.slice(0, 7);    // "YYYY-MM"
        if (groupBy === 'year') return date.slice(0, 4);     // "YYYY"
        return date;                                         // Full date (default)
    }

    // Aggregate fishbuy per group
    fishbuyData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, fishbuy: 0 };
        map[group].fishbuy += parseFloat(item.price || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

// Draw chart with Chart.js
function drawChart(data, fishName) {
    const labels = data.map(item => item.group);
    const fishCostData = data.map(item => (item.fishbuy || 0));

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
            labels,
            datasets: [
                {
                    label: 'Cost (Fish: ' + (fishName || 'All') + ')',
                    data: fishCostData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)',
                    borderColor: 'rgba(220, 53, 69, 0.6)',
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

                            const fishCost = item.fishbuy || 0;
                            return 'Fish Cost: ' + fishCost;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
    });
}

function downloadChartAsPDF() {
    const canvas = document.getElementById('myChart');
    const img = canvas.toDataURL('image/png');

    const pdf = new jspdf.jsPDF('portrait');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(img);
    const width = pageWidth * 0.9;
    const height = (imgProps.height * width) / imgProps.width;

    pdf.addImage(img, 'PNG', 10, 10, width, height);
    pdf.save('fish__cost_chart.pdf');
}