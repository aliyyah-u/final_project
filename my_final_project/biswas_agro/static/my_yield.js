let yearsPopulated = false;
let myChart = null;
let selectedChartType = 'bar';

function extractYearsFromData(data) {
    const yearSet = new Set();
    data.forEach(item => {
        const year = new Date(item.date).getFullYear();
        yearSet.add(year);
    });
    return [...yearSet]; //convert set into array
}

function populateYearDropdown(years) {
    if (yearsPopulated) return;

    const select = document.getElementById('year-select');
    years.sort((a, b) => b - a); // Order dropdown latest years first

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
    });
    yearsPopulated = true;
}

async function fetchYears() {
    const response = await fetch('/api/fishbuy/');
    const data = await response.json();

    const years = extractYearsFromData(data);
    populateYearDropdown(years);
}

function totalFish(data, selectedYear) {
    const fish = {};

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const date = new Date(item.date);
        const year = date.getFullYear();

        if (selectedYear && year != selectedYear) {
            continue;
        }

        if (!fish[year]) {
            fish[year] = 0;
        }

        fish[year] += item.fishquantity;
    }

    return fish;
}

function drawFishBuyChart(data) {
    const labels = data.map(item => item.year);
    const quantities = data.map(item => item.quantity);

    const ctx = document.getElementById('fishChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: selectedChartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Fish Quantity per Year',
                data: quantities,
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

async function loadFishBuyChart() {
    const selectedYear = document.getElementById('year-select').value;
    const response = await fetch('/api/fishbuy/');
    const data = await response.json();
    const fish = totalFish(data, selectedYear);

    const chartData = Object.keys(fish).map(year => ({
        year,
        quantity: fish[year]
    })).sort((a, b) => a.year - b.year);

    drawFishBuyChart(chartData);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchYears(); // Populate year dropdown on page load
});

document.getElementById('generate-chart-button').addEventListener('click', () => {
    loadFishBuyChart(); // Load and generate the chart when the button is clicked
});