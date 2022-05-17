from flask import Flask, flash, redirect, render_template, request, session, abort, Response, url_for, stream_with_context, jsonify, send_from_directory
from flask_login import current_user, login_user, logout_user, login_required
from flask_login import LoginManager
from is_safe_url import is_safe_url
from forms import LoginForm, UserAddForm, PwdChangeForm
from user import User

import datetime as dt
import json
import sys
import os
import math
import uuid
import logging
import logging.config
import yaml
import dbclient as db

compapp = Flask(__name__)
compapp.secret_key = '0d7962dc1b5fe00b9183f625af787f7ee61ebe82375e7d899143671b85097de5c2b6e3ae'

logging_dict_config = yaml.safe_load(open('log_config.yaml', 'r'))
logging.config.dictConfig(logging_dict_config)
logger = logging.getLogger(__name__)


## User and Login stuff
login_manager = LoginManager()
login_manager.init_app(compapp)
login_manager.login_view = "login"

REQUIRE_PASSWORD = True

def get_user_role(user):
  role = None
  if(not REQUIRE_PASSWORD):
    role = "admin" ## if passwords are not required, all users default to admin
  userset = db.get_users(user.get_id())
  if(len(userset) > 0):
    role = userset[0]["role"]
  return role

@login_manager.user_loader
def load_user(user_id):
  user = User()
  user.set_id(user_id)
  user.set_role(get_user_role(user))
  logger.debug("(load_user) ID = %s, role = %s", user.get_id(), user.get_role())
  return user

@compapp.route('/login', methods=['GET', 'POST'])
def login():
  logger.debug("In login")
  if current_user.is_authenticated:
    print(url_for('data'))
    return redirect(url_for('data'))
  
  form = LoginForm()
  if form.validate_on_submit():
      current_user_name = form.username.data
      current_user_pwd = form.password.data
      valid_password = db.check_password(current_user_name, current_user_pwd)
      if( REQUIRE_PASSWORD and not valid_password):
        logger.warning("INVALID PASSWORD FOR "+str(current_user_name))
        error_message = "Invalid Password"
        require_password = REQUIRE_PASSWORD
        resp = Response(render_template('login.html', **locals()))
        return resp

      user = User()
      user.set_id(current_user_name)
      user.set_role(get_user_role(user))
      loggedin = login_user(user)
      db.update_logindate(current_user_name)
      logger.info("login from form, success = %s", loggedin)
      next = request.args.get('next')
      if next == None:
        print(url_for('data'))
        next = url_for('data')
      if not is_safe_url(next, '192.168.140.128'):
        return abort(400)
      return redirect(next)
  else:
      current_user_name = None
      logger.info("(login else) Username = %s", current_user_name)
      require_password = REQUIRE_PASSWORD
      resp = Response(render_template('login.html', **locals()))
      return resp

@compapp.route('/login/signoff', methods=['GET', 'POST'])
def signout():
  logout_user()
  return redirect(url_for('login'))

## Admin pages
@compapp.route('/admin', methods=['GET'])
@login_required
def admin():
  logger.warning(current_user)
  if(not REQUIRE_PASSWORD or current_user.role == "admin"):
    username = current_user.name
    resp = Response(render_template('admin.html', **locals()))
    return resp
  else:
    logger.warning("FAILED ADMIN ACCESS: "+str(current_user)+" tried to access /admin")
    return redirect(url_for('data'))

@compapp.route('/admin/users', methods=['GET'])
@login_required
def admin_users():
  if(not REQUIRE_PASSWORD or current_user.role == "admin"):
    username = current_user.name
    userlist = db.get_users()
    resp = Response(render_template('admin_user.html', **locals()))
    return resp
  else:
    logger.warning("FAILED ADMIN ACCESS: "+str(current_user)+" tried to access /admin/users")
    return redirect(url_for('data'))

@compapp.route('/admin/users/add', methods=['GET', 'POST'])
@login_required
def admin_users_add():
  if(not REQUIRE_PASSWORD or current_user.role == "admin"):
    form = UserAddForm()
    if form.validate_on_submit():
      new_user_name = form.username.data
      new_user_pwd = form.password.data
      new_user_role = form.role.data
      db.add_user(username=new_user_name, password=new_user_pwd, role=new_user_role)

      return redirect(url_for('admin_users'))

    username = current_user.name
    resp = Response(render_template('admin_user_add.html', **locals()))
    return resp
  else:
    logger.warning("FAILED ADMIN ACCESS: "+str(current_user)+" tried to access /admin/users/add")
    return redirect(url_for('data'))

@compapp.route('/admin/users/pwd', methods=['GET', 'POST'])
@login_required
def admin_users_pwd():
  if(not REQUIRE_PASSWORD or current_user.role == "admin"):
    form = UserAddForm()
    if form.validate_on_submit():
      new_user_name = form.username.data
      new_user_pwd = form.password.data
      if(new_user_pwd == ""):
        new_user_pwd = None
      new_user_role = form.role.data
      db.update_user(new_user_name, password=new_user_pwd, role=new_user_role)
      return redirect(url_for('admin_users'))

    username = request.args.get('user',None)
    if(username == None):
      return redirect(url_for('admin_users')) ## if no user go back to user list
    user = db.get_users(username)[0]
    role=user["role"]

    resp = Response(render_template('admin_user_pwd.html', **locals()))
    return resp
  else:
    logger.warning("FAILED ADMIN ACCESS: "+str(current_user)+" tried to access /admin/users/pwd")
    return redirect(url_for('data'))

@compapp.route('/admin/users/delete', methods=['GET'])
@login_required
def admin_user_delete():
  if(not REQUIRE_PASSWORD or current_user.role == "admin"):
    username = request.args.get('user',None)
    if(username != None and username != ""):
      logger.info("delete %s",username)
      db.delete_user(username)
    return redirect(url_for('admin_users'))
  else:
    logger.warning("FAILED ADMIN ACCESS: "+str(current_user)+" tried to access /admin/users/delete")
    return redirect(url_for('data'))

@compapp.route('/user/settings', methods=['GET', 'POST'])
@login_required
def user_settings():
  form = PwdChangeForm()
  if form.validate_on_submit():
    current_user_name = current_user.name
    old_user_pwd = form.oldpassword.data
    new_user_pwd = form.password.data
    repeat_user_pwd = form.repeatpassword.data
    valid_password = db.check_password(current_user_name, old_user_pwd)
    if(not valid_password):
      logger.warning("INVALID PASSWORD FOR "+str(current_user_name))
      error_message = "Invalid Password"
      resp = Response(render_template('user_settings.html', **locals()))
      return resp
    elif(not (new_user_pwd == repeat_user_pwd) ):
      logger.warning("PASSWORDS DID NOT MATCH FOR "+str(current_user_name))
      error_message = "Passwords do not match"
      resp = Response(render_template('user_settings.html', **locals()))
      return resp
    else:
      logger.warning("PASSWORD CHANGED FOR "+str(current_user_name))
      db.update_user(current_user_name, password=new_user_pwd)
      error_message = "Password Changed"
      resp = Response(render_template('user_settings.html', **locals()))
      return resp

  else:
    resp = Response(render_template('user_settings.html', **locals()))
    return resp

## end admin pages







@compapp.route("/data", methods=['GET'])
@login_required
def data():
    resp = Response(render_template('data.html', **locals()))
    return resp

@compapp.route("/characters", methods=['POST', 'GET'])
@login_required
def characters():
  username = current_user.name
  if request.method == 'GET':
    return Response(json.dumps(db.get_characters(username)))
  if request.method == 'POST':
    return Response(json.dumps(db.get_characters(username)))


@compapp.route("/character/add", methods=['POST', 'GET'])
@login_required
def addcharacter():
  username = current_user.name
  if request.method == 'GET' or request.method == 'POST':
    charid = db.add_character(username, "newChar")
    resp = {"charid": charid, "charname":"newChar"}
    return Response(json.dumps(resp))

@compapp.route("/character/delete", methods=['POST'])
@login_required
def deletecharacter():
  username = current_user.name
  if request.method == 'POST':
    req = request.json
    charid = req["charid"]
    db.delete_character(username, charid)
    resp = {"charid":charid, "charname":"deleted"};
    return Response(json.dumps(resp));

@compapp.route("/character/update", methods=['POST'])
@login_required
def updatecharacter():
  username = current_user.name
  if request.method == 'POST':
    req = request.json
    charid = req["charid"]
    charname = req["charname"]
    db.update_character(username, charid, charname)
    return Response("Updated "+str(charid));


@compapp.route("/attribute/update", methods=['POST'])
@login_required
def updateattribute():
  username = current_user.name
  if request.method == 'POST':
    req = request.json
    charid = req["charid"]
    attribute = req["attribute"]
    dots = req["dots"]
    rowcount = db.update_character_attribute(charid, username, attribute, dots)
    return Response("Rows Updated "+str(rowcount));

@compapp.route("/attributes", methods=['POST'])
@login_required
def attributes():
  username = current_user.name
  if request.method == 'POST':
    req = request.json
    charid = req["charid"]
    logger.info("Attributes request for "+str(charid))
    return Response(json.dumps(db.get_attributes(username, charid)))


@compapp.route("/characteristic/update", methods=['POST'])
@login_required
def updatecharacteristic():
  username = current_user.name
  if request.method == 'POST':
    req = request.json
    charid = req["charid"]
    attribute = req["attribute"]
    value = req["value"]
    rowcount = db.update_characteristic(username, charid, attribute, value)
    return Response("Rows Updated "+str(rowcount));

@compapp.route("/characteristics", methods=['POST'])
@login_required
def characteristics():
  username = current_user.name
  if request.method == 'POST':
    req = request.json
    charid = req["charid"]
    attribute = None
    if("attribute" in req):
      attribute = req["attribute"]
    logger.info("Attributes request for "+str(charid))
    logger.info(username)
    logger.info(charid)
    logger.info(attribute)
    return Response(json.dumps(db.get_characteristic(username, charid, attribute)))


def getAsInt(val):
  try:
    v = int(val)
    return v
  except ValueError:
    return None;









