import bcrypt # For password hashing
from datetime import datetime

def hash_password(password, salt=None):
    # Generate a salt value if not provided
    if not salt:
        salt = bcrypt.gensalt().decode('utf-8')

    # Hash the password with the provided salt
    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'), salt.encode('utf-8'))

    return hashed_password.decode('utf-8'), salt

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def generate_year_array():
    year_array = []
    for i in range(2013, datetime.now().year + 1):
        year_array.append(i)
    return year_array[::-1]

def sort_month_wise(query_result):
    month_wise_query_result = {"GUJ":[0,0,0,0,0,0,0,0,0,0,0,0], "CHN":[0,0,0,0,0,0,0,0,0,0,0,0], "DEL":[0,0,0,0,0,0,0,0,0,0,0,0], "KOL":[0,0,0,0,0,0,0,0,0,0,0,0], "MUM":[0,0,0,0,0,0,0,0,0,0,0,0], "PUN":[0,0,0,0,0,0,0,0,0,0,0,0]}
    for result in query_result:
        month_wise_query_result[(result[2])][result[5].month - 1] += 1

    return month_wise_query_result