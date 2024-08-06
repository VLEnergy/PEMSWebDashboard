var chart;
var sensor_chart;
var startDate, endDate;
var sensorName;

function fetchDataAndUpdateChart(startDate, endDate,sensorName) {
    //console.log(startDate.concat("---"));
    //console.log(endDate);
    //console.log(sensorName);
    fetch(`http://127.0.0.1:5000/co2_data?sensor_name=${sensorName}&start=${startDate}&end=${endDate}`)
        .then(response => response.json())
        .then(result => {
           
            const data = result.data;
            console.log(data.concat("....."))
            const averages = result.averages;
            const sensor_name = result.sensor_name;
            const sensor_data = result.sensor_data;
            

            const labels = data.map(entry => entry.insert_time);
            const values = data.map(entry => entry.value);
            const sensor_labels = sensor_data.map(entry => entry.insert_time);
            const sensor_values = sensor_data.map(entry => entry.value);
            

            sensor_chart.data.labels = sensor_labels;
            sensor_chart.data.datasets[0].data = sensor_values;
            console.log(sensor_labels)
            console.log(sensor_values)
            sensor_chart.update();



            // Update chart data
            chart.data.labels = labels;
            chart.data.datasets[0].data = values;
            chart.update();



            // Update average values in the table
            document.getElementById('lastMinuteAvg').innerText = averages.last_minute.toFixed(2);
            document.getElementById('last10MinutesAvg').innerText = averages.last_10_minutes.toFixed(2);
            document.getElementById('lastDayAvg').innerText = averages.last_day.toFixed(2);
        })
        .catch(error => console.error('Error fetching data:', error));
}

fetch('http://127.0.0.1:5000/co2_data', {method: 'GET'})
    .then(response => response.json())  // Parse the JSON response
    .then(result => {
        console.log(startDate)
        console.log(endDate)
        console.log(sensorName)

        const data = result.data;
        const averages = result.averages;
        const sensor_data = result.sensor_data;
        const sensor_name = result.sensor_name;
      

        const labels = data.map(entry => entry.insert_time); // Extract insert_time values
        const values = data.map(entry => entry.value);
        var ctx = document.getElementById('realtimeChart').getContext('2d');
        const sensorSelect = document.getElementById('sensorSelect');
            // Clear existing options
            sensorSelect.innerHTML = '';

            // Add new options based on fetched data
            sensor_name.forEach(sensor => {
                const option = document.createElement('option');
                option.value = sensor.attribute;
                option.textContent = sensor.attribute;
                sensorSelect.appendChild(option);
        });


        // Set default values for startDate, endDate, and sensorName
        endDate = formatDate(labels[0]);
        endDate = new Date(endDate)
        endDate = endDate.setDate(endDate.getDate()+1)
        endDate = formatDate(endDate)

        startDate = formatDate(labels[labels.length - 1]);
        sensorName = sensor_name[0].attribute;
        console.log(typeof endDate)
        console.log(endDate)
        console.log(sensorName)
        



        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Real-time Data',
                    data: values,
                    fill: false,
                    borderColor: 'rgb(186, 165, 106)',
                    backgroundColor: 'rgba(186, 165, 106, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Real Time CO2 Concentration'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 10, // Limit the number of labels on X-axis
                            callback: function(value, index, values) {
                                // Format date as 'DD MMM YYYY'
                                var date = new Date(value);
                                return date.toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                });
                            }
                        }
                    }]
                }
            }
        });

        // Update average values in the table
        document.getElementById('lastMinuteAvg').innerText = averages.last_minute.toFixed(2);
        document.getElementById('last10MinutesAvg').innerText = averages.last_10_minutes.toFixed(2);
        document.getElementById('lastDayAvg').innerText = averages.last_day.toFixed(2);

        const sensor_labels = sensor_data.map(entry => entry.insert_time); // Extract insert_time values
        const sensor_values = sensor_data.map(entry => entry.value);
        var ctx_sensor = document.getElementById('realtimeSensorChart').getContext('2d');

        sensor_chart = new Chart(ctx_sensor, {
            type: 'line',
            data: {
                labels: sensor_labels,
                datasets: [{
                    label: 'Real-time Data',
                    data: sensor_values,
                    fill: false,
                    borderColor: 'rgb(186, 165, 106)',
                    backgroundColor: 'rgba(186, 165, 106, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Selected Sensor Real Time Data'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 10, // Limit the number of labels on X-axis
                            callback: function(value, index, values) {
                                // Format date as 'DD MMM YYYY'
                                var date = new Date(value);
                                return date.toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                });
                            }
                        }
                    }]
                }
            }
        });



    })
    .catch(error => console.error('Error fetching initial data:', error));

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

            fetchDataAndUpdateChart(startDate, endDate, sensorName);
        }
    }
});


// Event listener for sensor select change
document.getElementById('sensorSelect').addEventListener('change', function() {
    sensorName = this.value;
    fetchDataAndUpdateChart(startDate, endDate, sensorName);
    console.log(sensorName)
});

setInterval(() => {
    
        fetchDataAndUpdateChart(startDate, endDate, sensorName);
    
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