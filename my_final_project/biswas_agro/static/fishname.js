let myChart = null;
let selectedChartType = 'bar';

function setChartType(type) {
    selectedChartType = type;
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

    const { fishName } = getSelectedFish();

    let fishbuyUrl = '/api/fishbuy/';

    // Add the selected date range as parameters
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    fishbuyUrl += query;

    const [fishbuyRes] = await Promise.all([
        fetch(fishbuyUrl)
    ]);

    const [fishbuyData] = await Promise.all([
        fishbuyRes.json()
    ]);

    // Filter fishbuy data by source
    let filteredFishbuyData = fishbuyData;
    if (fishName) {
    filteredFishbuyData = fishbuyData.filter(item => item.fishname === fishName);
}

    const collected = collectByDate(filteredFishbuyData);
    drawChart(collected, fishName);
}

function collectByDate(fishbuyData) {
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

function drawChart(data, fishName) {
    const labels = data.map(item => item.group);
    const fishCostData = data.map(item => ((item.fishbuy || 0)));

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
                    label: 'Cost ৳ ('+ 'Fish Name: ' + fishName + ')',
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

                            if (context.dataset.label.startsWith('Cost ৳')) {

                                return [
                                    'Fish Cost: ' + fishCost
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
    pdf.save('fishNameChart.pdf');
}