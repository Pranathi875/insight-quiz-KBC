document.addEventListener('DOMContentLoaded', () => {
    const perf = JSON.parse(localStorage.getItem('kbcPerformance')) || { today: {}, week: {}, month: {}, total: 0 };

    // Get data for the last 7 days for weekly chart
    const weeklyLabels = [];
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        weeklyLabels.push(date.toLocaleDateString());
        weeklyData.push(perf.today[dateStr] || 0);
    }

    // Get data for the last 12 months for monthly chart
    const monthlyLabels = [];
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.getMonth() + '-' + date.getFullYear();
        monthlyLabels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        monthlyData.push(perf.month[monthStr] || 0);
    }

    // Calculate improvement: cumulative games over time
    const improvementLabels = [];
    const improvementData = [];
    let cumulative = 0;
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.getMonth() + '-' + date.getFullYear();
        cumulative += perf.month[monthStr] || 0;
        improvementLabels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        improvementData.push(cumulative);
    }

    // Weekly Games Chart
    const weeklyOptions = {
        series: [{
            name: 'Games Played',
            data: weeklyData
        }],
        chart: {
            type: 'bar',
            height: 250,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 1000
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '60%',
                distributed: false
            }
        },
        colors: ['#00D4FF'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: weeklyLabels,
            labels: {
                rotate: -45
            }
        },
        yaxis: {
            title: {
                text: 'Games Played'
            }
        },
        title: {
            text: 'Games Played This Week',
            align: 'center'
        },
        tooltip: {
            theme: 'dark'
        }
    };
    const weeklyChart = new ApexCharts(document.querySelector("#weeklyChart"), weeklyOptions);
    weeklyChart.render();

    // Monthly Games Chart
    const monthlyOptions = {
        series: [{
            name: 'Games Played',
            data: monthlyData
        }],
        chart: {
            type: 'area',
            height: 250,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 1000
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.4,
                gradientToColors: ['#FFD700'],
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        colors: ['#FFD700'],
        xaxis: {
            categories: monthlyLabels
        },
        yaxis: {
            title: {
                text: 'Games Played'
            }
        },
        title: {
            text: 'Games Played Per Month',
            align: 'center'
        },
        tooltip: {
            theme: 'dark'
        }
    };
    const monthlyChart = new ApexCharts(document.querySelector("#monthlyChart"), monthlyOptions);
    monthlyChart.render();

    // Improvement Chart (Cumulative Progress)
    const improvementOptions = {
        series: [{
            name: 'Cumulative Games',
            data: improvementData
        }],
        chart: {
            type: 'area',
            height: 250,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 1000
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.4,
                gradientToColors: ['#4CAF50'],
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        colors: ['#4CAF50'],
        xaxis: {
            categories: improvementLabels
        },
        yaxis: {
            title: {
                text: 'Cumulative Games'
            }
        },
        title: {
            text: 'Improvement Over Time (Cumulative)',
            align: 'center'
        },
        tooltip: {
            theme: 'dark'
        }
    };
    const improvementChart = new ApexCharts(document.querySelector("#improvementChart"), improvementOptions);
    improvementChart.render();
});

function getWeekStart() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff)).toDateString();
}

function getPrevWeekStart() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day - 7;
    return new Date(d.setDate(diff)).toDateString();
}

function getPrevMonth() {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.getMonth() + '-' + d.getFullYear();
}
