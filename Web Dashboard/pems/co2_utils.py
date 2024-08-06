import pymssql


connection_settings = {
    'server': 'ml-db-vm.database.windows.net',
    'user': 'vl_admin',
    'password': 'Password123!',
    'database': 'ml_db',
    'port': 1433,
    'timeout': 30
}

# Function to fetch data from Azure SQL Database
def fetch_co2_data(start_date, end_date):
    conn = pymssql.connect(**connection_settings)
    cursor = conn.cursor(as_dict=True)
    query = """
    SELECT * FROM [dbo].[ml_data_result_co2] WHERE insert_time >= %s AND insert_time <= %s ORDER BY insert_time DESC;
    """
    cursor.execute(query, (start_date, end_date))
    data = cursor.fetchall()
    conn.close()
    return data

# Function to calculate average values for different time intervals
def calculate_co2_averages():
    conn = pymssql.connect(**connection_settings)
    cursor = conn.cursor(as_dict=True)
    # database vm time zone is 60 min faster than Calgary time
    intervals = {
        "last_minute": -61,
        "last_10_minutes": -70,
        "last_day": -1500
    }

    averages = {}
    for key, start_time in intervals.items():
        query = """
        SELECT AVG(value) as avg_value FROM [dbo].[ml_data_result_co2] WHERE insert_time >= DATEADD(MINUTE, %d, CONVERT(datetime, CONVERT(datetimeoffset, GETDATE()) AT TIME ZONE 'Mountain Standard Time'));
        """
        cursor.execute(query, start_time)
        result = cursor.fetchone()
        averages[key] = result['avg_value'] if result['avg_value'] is not None else 0

    conn.close()
    return averages

def fetch_sensor_name():
    conn = pymssql.connect(**connection_settings)
    cursor = conn.cursor(as_dict=True)
    query = """
    SELECT DISTINCT attribute FROM [dbo].[ml_data_co2] ORDER BY attribute;
    """
    cursor.execute(query)
    data = cursor.fetchall()
    conn.close()
    return data

def fetch_sensor_data(start_date, end_date, sensor_name):
    conn = pymssql.connect(**connection_settings)
    cursor = conn.cursor(as_dict=True)
    query = """
    SELECT * FROM [dbo].[ml_data_co2] WHERE insert_time >= %s AND insert_time <= %s AND attribute = %s ORDER BY insert_time DESC;
    """
    cursor.execute(query, (start_date, end_date, sensor_name))
    data = cursor.fetchall()
    conn.close()
    return data
