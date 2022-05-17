#!/usr/bin/python3.7
import sys
import os
import sqlite3

conn = sqlite3.connect('characters.db')
c=conn.cursor()

try:
  c.execute('''CREATE TABLE characters (charid integer, charname text, username char(64), added_date date)''')
  ##c.execute('''CREATE TABLE characters (charid integer, charname text, attribute text, dots integer, username char(64), added_date date)''')
except:
  pass

try:
  c.execute('''CREATE TABLE characteristics (charid integer, attribute text, value text, username char(64), added_date date)''')
except:
  pass

try:
  c.execute('''CREATE TABLE attributes (charid integer, attribute text, dots integer, username char(64), added_date date)''')
except:
  pass

try:
  c.execute('''CREATE TABLE user (username char(64), password char(64), salt char(64), role char(64), distinguishedname char(256), last_login date, id_created date, deleted_date date)''')
except:
  pass

