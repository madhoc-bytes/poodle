import datetime

due_date_str = '2023-07-31'  # Assuming 'due_date' is a string in the format 'YYYY-MM-DD'
due_date = datetime.datetime.strptime(due_date_str, '%Y-%m-%d')

print(due_date)