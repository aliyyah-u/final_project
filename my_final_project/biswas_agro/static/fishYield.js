let fishChart = null;
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

async function filterYieldChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const fishName = getSelectedFish().fishName;

    let url = '/api/fishbuy/';
    const params = new URLSearchParams();

    // Add the selected date range as parameters
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (params.toString()) url += `?${params.toString()}`;

   try {
        const response = await fetch(url);
        const fishbuyData = await response.json();

        // Filter by fish name if selected
        let filtered = fishbuyData;
        if (fishName) {
            filtered = [];
            for (let i = 0; i < fishbuyData.length; i++) {
                if (fishbuyData[i].fishname === fishName) {
                    filtered.push(fishbuyData[i]);
                }
            }
        }

        const grouped = groupByDate(filtered);
        drawChart(grouped, fishName);
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

function groupByDate(fishbuyData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (groupBy === 'month') return date.slice(0, 7);        // YYYY-MM
        if (groupBy === 'year') return date.slice(0, 4);         // YYYY
        return date;                                             // Full date (default)
    }

    // Aggregate fishbuy price per date
    fishbuyData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, fishbuy: 0 };
        map[group].fishbuy += parseFloat(item.fishquantity || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

function drawChart(data, fishName) {
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

    fishChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [
                {
                label: 'Quantity of: ' + (fishName || 'All Fish') + ')',
                data: fishBuyData,
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

    // // Default top-left position (10, 10)
    const x = 10;
    const y = 10;

    pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
    pdf.save('fish_yield_chart.pdf');
}