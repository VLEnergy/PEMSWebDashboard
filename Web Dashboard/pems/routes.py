import os
import secrets
from PIL import Image
from flask import render_template, url_for, flash, redirect, request, jsonify
from pems import app, db, bcrypt
from pems.forms import RegistrationForm, LoginForm, UpdateAccountForm
from pems.models import User
from flask_login import login_user, current_user, logout_user, login_required
from datetime import datetime, timedelta
from pems.co2_utils import fetch_co2_data, calculate_co2_averages, fetch_sensor_name, fetch_sensor_data
from pems.sensorDrift_utils import fetch_sensorDrift_data, fetch_top1_sensorDrift_data


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')


@app.route("/about")
def about():
    return render_template('about.html', title='About')


@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('about'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('about'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('about'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)




@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

# The function is used to save user profile picture
def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)

    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn



@app.route("/account", methods=['GET', 'POST'])
@login_required
def account():
    form = UpdateAccountForm()
    if form.validate_on_submit():
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            current_user.image_file = picture_file
        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Your account has been updated!', 'success')
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account',
                           image_file=image_file, form=form)




@app.route("/co2_data")
def co21():
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    sensor_name = request.args.get('sensor_name')

    if not start_date or not end_date:
        end_date = datetime.now() + timedelta(days=1)
        start_date = end_date - timedelta(days=7)
        start_date = start_date.strftime('%Y-%m-%d')
        end_date = end_date.strftime('%Y-%m-%d')

    if not sensor_name:
        sensor_name = "194-AFDPM/ALM1/PV.CV"

    data = fetch_co2_data(start_date, end_date)
    averages = calculate_co2_averages()
    sensor_data = fetch_sensor_data(start_date,end_date,sensor_name)
    sensor_name_list = fetch_sensor_name()
    data_jsonify = jsonify({"data": data, "averages": averages,"sensor_data":sensor_data,"sensor_name":sensor_name_list})
    return data_jsonify




@app.route("/co2")
@login_required
def co2():
    return render_template('co2.html')




@app.route("/nox")
@login_required
def nox():
    return render_template('nox.html')
   


@app.route("/sensordrift_data")
def sensorDrift_data():
    start_date = request.args.get('start')
    end_date = request.args.get('end')
    if not start_date or not end_date:
        end_date = datetime.now() + timedelta(days=1)
        start_date = end_date - timedelta(days=7)
        start_date = start_date.strftime('%Y-%m-%d')
        end_date = end_date.strftime('%Y-%m-%d')
    
    data = fetch_sensorDrift_data(start_date,end_date)
    data_top1 = fetch_top1_sensorDrift_data()
    data_jsonify = jsonify({"data":data,"datatop1":data_top1})
    return data_jsonify


@app.route("/sensorDrift")
@login_required
def sensorDrift():
    return render_template('sensorDrift.html')