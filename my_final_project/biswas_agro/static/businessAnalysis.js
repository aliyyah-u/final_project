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

function getSelectedFish() {
    const selectedFishId = document.getElementById('fishname').value;

    const fishMap = {
        "1": null, // All Fish
        "2": "রুই",
        "3": "কাতলা",
        "4": "মৃগেল",
        "5": "গ্রাস কার্প",
        "6": "পুটি",
        "7": "তেলাপিয়া",
        "8": "চিংড়ি",
        "9": "সিলভার কার্প",
        "10": "ধানী",
        "11": "জাপানি",
        "12": "মাছের ডিম",
        "13": "ব্লাড কার্প",
        "14": "ব্রিগেড",
        "16": "শোল"
    };

    const fishName = fishMap[selectedFishId];

    return {
        selectedFishId,
        fishName
    };
}

async function filterChart() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const sectorValue = document.getElementById('sector').value;


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

    const collected = collectByDate(filteredCostData, filteredFishbuyData, salaryData, filteredEarningData);
    drawChart(collected, sourceName, sectorName, fishName);
}

function collectByDate(costData, fishbuyData, salaryData, earningData) {
    const map = {};
    const groupBy = document.getElementById('grouping').value;

    function getGroup(date) {
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
                    label: 'Total Cost ৳ (' + 'Source: ' + sourceName + ', ' + ' Sector: ' + sectorName + 'Fish Name: ' + fishName + ')'
                    ,
                    data: totalCostData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)',
                    borderColor: 'rgba(220, 53, 69, 0.6)',
                    fill: isArea,
                    tension: tensionValue,
                    showLine: !isScatter,
                },
                {
                    label: 'Earnings ৳ (' + 'Source: ' + sourceName + ', ' + ' Sector: ' + sectorName + 'Fish Name: ' + fishName + ')',
                    data: earningsData,
                    backgroundColor: 'rgba(167, 189, 167, 0.6)',
                    borderColor: 'rgba(167, 189, 167, 0.6)',
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
    pdf.save('sources_chart.pdf');
}