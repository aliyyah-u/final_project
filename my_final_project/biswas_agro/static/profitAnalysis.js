// Initialise chart and default chart type
let myChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
}

let allCostItems = [];

async function loadCostItems() {
    const response = await fetch('/api/costitems');
    allCostItems = await response.json();
}

window.addEventListener('DOMContentLoaded', function () {
    loadCostItems();
});

const sourceMap = {
    "1": "North",
    "2": "East",
    "3": "South",
    "4": "West",
    "5": "Uzzal"
};

const sectorMap = {
    "0": "Others",
    "1": "Fish",
    "2": "Vegetables"
};

// Load fish dropdown upon page reload
document.addEventListener('DOMContentLoaded', populateFishDropdown);

function getSelectedSource() {
    const selectedSource = document.getElementById('source').value;
    let sourceName = null;
    let sourceId = null;

    if (selectedSource) {
        sourceName = sourceMap[selectedSource];
        sourceId = parseInt(selectedSource);
    }

    return {
        selectedSource: selectedSource,
        sourceName: sourceName,
        sourceId: sourceId
    };
}

function getSelectedSector() {
    const selectedSector = document.getElementById('sector').value;
    let sectorName = null;
    let sectorId = null;

    if (selectedSector) {
        sectorName = sectorMap[selectedSector];
        sectorId = parseInt(selectedSector);
    }

    return {
        selectedSector: selectedSector,
        sectorName: sectorName,
        sectorId: sectorId
    };
}

// Get selected fish from dropdown
function getSelectedFish() {
    const fishName = document.getElementById('fishname').value;
    return { fishName };
}

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

async function filterChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const sourceInfo = getSelectedSource();
    const sourceName = sourceInfo.sourceName;
    const sourceId = sourceInfo.sourceId;
    const selectedSource = sourceInfo.selectedSource;

    const sectorInfo = getSelectedSector();
    const sectorName = sectorInfo.sectorName;
    const sectorId = sectorInfo.sectorId;
    const selectedSector = sectorInfo.selectedSector;

    const { fishName } = getSelectedFish();

    let costUrl = '/api/cost/';
    let fishbuyUrl = '/api/fishbuy/';
    let salaryUrl = '/api/salary/';
    let earningUrl = '/api/earning/';

    // Add the selected date range as parameters
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    costUrl += query;
    fishbuyUrl += query;
    salaryUrl += query;
    earningUrl += query;

    const [costRes, fishbuyRes, salaryRes, earningRes] = await Promise.all([
        fetch(costUrl),
        fetch(fishbuyUrl),
        fetch(salaryUrl),
        fetch(earningUrl)
    ]);

    const [costData, fishbuyData, salaryData, earningData] = await Promise.all([
        costRes.json(),
        fishbuyRes.json(),
        salaryRes.json(),
        earningRes.json()
    ]);

    let filteredFishbuyData = fishbuyData;

    if (selectedSource) {
        filteredFishbuyData = filteredFishbuyData.filter(item => item.fishto === sourceName);
    }
    if (fishName) {
        filteredFishbuyData = filteredFishbuyData.filter(item => item.fishname === fishName);
    }

    // Filter earning data by source
    let filteredEarningData = earningData;
    if (selectedSource) {
        filteredEarningData = earningData.filter(function (item) {
            return item.source === sourceId;
        });
    }

    if (selectedSector) {
        filteredEarningData = filteredEarningData.filter(item => item.sector === sectorId);
    }

    let filteredCostData = costData;

    if (selectedSector) {
        filteredCostData = costData.filter(cost => {
            const costItem = allCostItems.find(ci => ci.id === cost.costitems_id);
            return costItem && costItem.sector === sectorId;
        });
    }

        if (
            (!costData || costData.length === 0) &&
            (!fishbuyData || fishbuyData.length === 0) &&
            (!salaryData || salaryData.length === 0)
        ) {
            console.error('No data available for the selected date range.');
            alert('No data available for the selected date range.');

            if (myChart) {
                myChart.destroy(); // Remove old chart
                myChart = null;
            }
            return;
        }

    const collected = groupByDate(filteredCostData, filteredFishbuyData, salaryData, filteredEarningData);
    drawChart(collected, sourceName, sectorName, fishName);
}

function groupByDate(costData, fishbuyData, salaryData, earningData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
        if (!date) return "No Date";
        if (groupBy === 'month') return date.slice(0, 7);    // "YYYY-MM"
        if (groupBy === 'year') return date.slice(0, 4);     // "YYYY"
        return date;                                         // Full date (default)
    }

    // Aggregate cost per group
    costData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 }; // group = date/month/year key
        map[group].cost += parseFloat(item.cost || 0);
    });

    // Aggregate fishbuy per group
    fishbuyData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[group].fishbuy += parseFloat(item.price || 0);
    });

    // Aggregate salary per group
    salaryData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[group].salary += parseFloat(item.total || 0);
    });

    // Aggregate earnings per group
    earningData.forEach(item => {
        const group = getGroup(item.date);
        map[group] = map[group] || { group, cost: 0, fishbuy: 0, salary: 0, earnings: 0 };
        map[group].earnings += parseFloat(item.price || 0);
    });

    // Return as sorted array
    return Object.values(map).sort((a, b) => new Date(a.group) - new Date(b.group));
}

function drawChart(data, sourceName, sectorName, fishName) {
    const labels = data.map(item => item.group);
    const totalCostData = data.map(item => (item.cost || 0) + (item.fishbuy || 0) + (item.salary || 0));
    const earningsData = data.map(item => item.earnings || 0);

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
                    label: 'Total Cost ৳ (' + 'Source: ' + (sourceName || ' All Sources') + ', Sector: ' + (sectorName || ' All Sectors') + ', Fish Name: ' + (fishName || ' All Fish') + ')'
                    ,
                    data: totalCostData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)',
                    borderColor: 'rgba(220, 53, 69, 0.6)',
                    fill: isArea,
                    tension: tensionValue,
                    showLine: !isScatter,
                },
                {
                    label: 'Earnings ৳ (' + 'Source: ' + (sourceName || ' All Sources') + ', Sector: ' + (sectorName || ' All Sectors') + ')',
                    data: earningsData,
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

                            const itemCost = item.cost || 0;
                            const fishCost = item.fishbuy || 0;
                            const salary = item.salary || 0;
                            const totalCost = itemCost + fishCost + salary;
                            const earnings = item.earnings || 0;
                            const profit = earnings - totalCost;

                            if (context.dataset.label.startsWith('Total Cost ৳')) {

                                return [
                                    'Total Cost: ' + totalCost,
                                    'Cost Breakdown: ',
                                    'Item Cost: ' + itemCost,
                                    'Fish Cost: ' + fishCost,
                                    'Salary: ' + salary,
                                    '',
                                    'Profit: ' + profit
                                ];
                            }

                            if (context.dataset.label.startsWith('Earnings ৳')) {
                                return [
                                    'Earnings: ' + earnings,
                                    '',
                                    'Profit: ' + profit
                                ];
                            }

                            return '';
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
    pdf.save('profit_Analysis_chart.pdf');
}