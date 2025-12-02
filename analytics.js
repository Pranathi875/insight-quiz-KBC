const categoryData = {
    Geography: 20,
    History: 25,
    Science: 15,
    Biology: 10,
    Art: 5,
    Chemistry: 10,
    Mathematics: 5,
    Physics: 5,
    Language: 5
};

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#FFD700', // Gold
                    '#FF6B6B', // Red
                    '#4ECDC4', // Teal
                    '#667EEA', // Purple
                    '#764BA2', // Dark Purple
                    '#F093FB', // Pink
                    '#F5576C', // Coral
                    '#36A2EB', // Blue
                    '#FFCE56'  // Yellow
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            animation: {
                animateRotate: false,
                animateScale: true,
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Question Categories Distribution'
                }
            }
        }
    });
});
