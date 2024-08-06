import pymssql


connection_settings = {
    'server': 'ml-db-vm.database.windows.net',
    'user': 'vl_admin',
    'password': 'Password123!',
    'database': 'ml_db',
    'port': 1433,
    'timeout': 30
}


def fetch_sensorDrift_data(start_date, end_date):
    conn = pymssql.connect(**connection_settings)
    cursor = conn.cursor(as_dict=True)
    query = """
    SELECT * FROM [dbo].[sensor_drift_table] WHERE insert_time >= %s AND insert_time <= %s ORDER BY insert_time DESC;
    """
    cursor.execute(query, (start_date, end_date))
    data = cursor.fetchall()
    conn.close()
    return data


def fetch_top1_sensorDrift_data():
    conn = pymssql.connect(**connection_settings)
    cursor = conn.cursor(as_dict=True)
    query = """
    SELECT TOP (1) * FROM [dbo].[sensor_drift_table] ORDER BY insert_time DESC;
    """
    cursor.execute(query)
    data = cursor.fetchall()
    conn.close()
    return data