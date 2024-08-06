var chart;
var sensor1_Chart, sensor2_Chart, sensor3_Chart;
var startDate, endDate;
var sensor1Card, sensor2Card, sensor3Card

function fetchDataAndUpdateChart(startDate, endDate) {
    fetch(`http://127.0.0.1:5000/sensordrift_data?start=${startDate}&end=${endDate}`)
        .then(response => response.json())
        .then(result => {
            console.log("....")
            console.log(startDate);
           
            const data = result.data;
            
            const sensor1Predict = data.map(item=>item.sensor1_predict);
            const sensor1Real = data.map(item=>item.sensor1_real);
            const sensor2Predict = data.map(item=>item.sensor2_predict);
            const sensor2Real = data.map(item=>item.sensor2_real);
            const sensor3Predict = data.map(item=>item.sensor3_predict);
            const sensor3Real = data.map(item=>item.sensor3_real);
            const dates = data.map(item=>item.insert_time);
           
            sensor1_Chart.data.labels = dates;
            sensor1_Chart.data.datasets[0].data = sensor1Predict;
            sensor1_Chart.data.datasets[1].data = sensor1Real;
            sensor1_Chart.update();



            sensor2_Chart.data.labels = dates;
            sensor2_Chart.data.datasets[0].data = sensor2Predict;
            sensor2_Chart.data.datasets[1].data = sensor2Real;
            sensor2_Chart.update();


            sensor3_Chart.data.labels = dates;
            sensor3_Chart.data.datasets[0].data = sensor3Predict;
            sensor3_Chart.data.datasets[1].data = sensor3Real;
            sensor3_Chart.update();



            // Update Sensor 1
  
        sensor1Card.querySelector('.time').textContent = `Time: ${data[0].insert_time}`;
        sensor1Card.querySelector('.predicted_value').textContent = `Predict: ${data[0].sensor1_predict}`;
        sensor1Card.querySelector('.real_value').textContent = `Real: ${data[0].sensor1_real}`;



        // Update Sensor 2
        
        sensor2Card.querySelector('.time').textContent = `Time: ${data[0].insert_time}`;
        sensor2Card.querySelector('.predicted_value').textContent = `Predict: ${data[0].sensor2_predict}`;
        sensor2Card.querySelector('.real_value').textContent = `Real: ${data[0].sensor2_real}`;



        // Update Sensor 3
       
        sensor3Card.querySelector('.time').textContent = `Time: ${data[0].insert_time}`;
        sensor3Card.querySelector('.predicted_value').textContent = `Predict: ${data[0].sensor3_predict}`;
        sensor3Card.querySelector('.real_value').textContent = `Real: ${data[0].sensor3_real}`;




          
            
        })
        .catch(error => console.error('Error fetching data:', error));
}




fetch('http://127.0.0.1:5000/sensordrift_data', {method: 'GET'})
    .then(response => response.json())  // Parse the JSON response
    .then(result => {
        console.log(startDate)
        console.log(endDate)

        const sensor1Predict = result.data.map(item=>item.sensor1_predict);
        const sensor1Real = result.data.map(item=>item.sensor1_real);
        const sensor2Predict = result.data.map(item=>item.sensor2_predict);
        const sensor2Real = result.data.map(item=>item.sensor2_real);
        const sensor3Predict = result.data.map(item=>item.sensor3_predict);
        const sensor3Real = result.data.map(item=>item.sensor3_real);
        const dates = result.data.map(item=>item.insert_time);
        const data = result.data

        var ctx_sensor1 = document.getElementById('sensor1Chart').getContext('2d');
        var ctx_sensor2 = document.getElementById('sensor2Chart').getContext('2d');
        var ctx_sensor3 = document.getElementById('sensor3Chart').getContext('2d');



        endDate = formatDate(dates[0]);
        endDate = new Date(endDate)
        endDate = endDate.setDate(endDate.getDate()+1)
        endDate = formatDate(endDate)

        startDate = formatDate(dates[dates.length - 1]);

        




        sensor1_Chart = new Chart(ctx_sensor1, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Sensor 1 Predict',
                        data: sensor1Predict,

                        borderColor: 'rgba(186, 165, 106, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Sensor 1 Real',
                        data: sensor1Real,
                        borderColor: 'rgba(35, 125, 164, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'BRNG MET Temperature'
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });

        sensor2_Chart = new Chart(ctx_sensor2, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Sensor 2 Predict',
                        data: sensor2Predict,

                        borderColor: 'rgba(185, 165, 106, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Sensor 2 Real',
                        data: sensor2Real,
                        borderColor: 'rgba(35, 125, 164, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Economizer Temperature'
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });


        
        


        sensor3_Chart = new Chart(ctx_sensor3, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Sensor 3 Predict',
                        data: sensor3Predict,

                        borderColor: 'rgba(185, 165, 106, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Sensor 3 Real',
                        data: sensor3Real,
                        borderColor: 'rgba(35, 125, 164, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Steam Head Flow Rate'
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });

    
        // Update Sensor 1
        sensor1Card = document.getElementById('sensor1');
        sensor1Card.querySelector('.time').textContent = `Time: ${data[0].insert_time}`;
        sensor1Card.querySelector('.predicted_value').textContent = `Predict: ${data[0].sensor1_predict}`;
        sensor1Card.querySelector('.real_value').textContent = `Real: ${data[0].sensor1_real}`;



        // Update Sensor 2
        sensor2Card = document.getElementById('sensor2');
        sensor2Card.querySelector('.time').textContent = `Time: ${data[0].insert_time}`;
        sensor2Card.querySelector('.predicted_value').textContent = `Predict: ${data[0].sensor2_predict}`;
        sensor2Card.querySelector('.real_value').textContent = `Real: ${data[0].sensor2_real}`;



        // Update Sensor 3
        sensor3Card = document.getElementById('sensor3');
        sensor3Card.querySelector('.time').textContent = `Time: ${data[0].insert_time}`;
        sensor3Card.querySelector('.predicted_value').textContent = `Predict: ${data[0].sensor3_predict}`;
        sensor3Card.querySelector('.real_value').textContent = `Real: ${data[0].sensor3_real}`;





    }).catch(error => console.error('Error fetching initial data:', error));


    
flatpickr("#dateRangePicker", {
    mode: "range",
    dateFormat: "Y-m-d",
    maxDate: "today",
    onChange: function(selectedDates, dateStr, instance) {
        if (selectedDates.length === 2) {
            startDate = selectedDates[0].toISOString().split('T')[0];
            console.log(startDate);

            let endDateObj = new Date(selectedDates[1]);
            endDateObj.setDate(endDateObj.getDate() + 2);
            endDate = endDateObj.toISOString().split('T')[0];
            console.log(endDate);

            fetchDataAndUpdateChart(startDate, endDate);
        }
    }
});

setInterval(() => {
    
    fetchDataAndUpdateChart(startDate, endDate);

}, 60000);



function formatDate(dateString) {
    // Parse the date string into a Date object
    let date = new Date(dateString);
    
    // Extract the year, month, and day components
    let year = date.getUTCFullYear();
    let month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = date.getUTCDate().toString().padStart(2, '0');
    
    // Format the date as "YYYY-MM-DD"
    let formattedDate = `${year}-${month}-${day}`;
    
    return formattedDate;
}