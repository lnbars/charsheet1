import sys
import os
import json
import sqlite3
import logging
import uuid
from passlib.hash import sha512_crypt
from datetime import datetime

logger = logging.getLogger(__name__)

#valid_tables = ['characters', 'user']
valid_tables = ['characters', "attributes", 'user', "characteristics"]
#valid_attribute_fields = ['personid', 'name', 'contacts', 'influence', 'fame', 'status', 'wits', 'intelligence', 'manipulation', 'charisma', 'leadership', 'empathy', 'subterfuge' ]

DB_NAME="characters.db"
conn = sqlite3.connect(DB_NAME)
c=conn.cursor()

def get_db_conn(dbname=DB_NAME):
  conn = sqlite3.connect(dbname)
  conn.row_factory = sqlite3.Row
  return conn

## get_characters
def get_characters(username=None):
  query = "SELECT DISTINCT username, charid, charname FROM characters"
  wherestrings = []
  whereparams = []
  if username != None:
    wherestrings.append("username=?")
    whereparams.append(username)
  if (len(wherestrings) > 0):
    query += " WHERE " + " and ".join(wherestrings)
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(query, tuple(whereparams))
  result = cursor.fetchall()
  cursor.close()
  conn.close()
  return [dict(row) for row in result]

def get_attributes(username, charid, all=False):
  query = "SELECT username, charid, attribute, dots, added_date FROM attributes"
  order_by = " order by username, charid, attribute, added_date desc"
  wherestrings = []
  whereparams = []
  if username != None:
    wherestrings.append("username=?")
    whereparams.append(username)
    wherestrings.append("charid=?")
    whereparams.append(charid)
  if (len(wherestrings) > 0):
    query += " WHERE " + " and ".join(wherestrings)
  query += order_by
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(query, tuple(whereparams))
  result = cursor.fetchall()
  cursor.close()
  conn.close()

  retarray = []
  rusername = ""
  rcharid = ""
  rattribute = ""
  for row in result:
    drow = dict(row)
    if(drow["username"] == rusername and drow["charid"] == rcharid and drow["attribute"] == rattribute):
      ## Skip unless all is True
      if(all):
        retarray.append(drow)
    else:
      retarray.append(drow)
    rusername = drow["username"]
    rcharid = drow["charid"]
    rattribute = drow["attribute"]
  return retarray ##[dict(row) for row in result]


def update_character_attribute(charid, username, attribute, dots):
  ##if(attribute in valid_attribute_fields):
    row = {}
    row["username"] = username
    row["charid"] = charid
    row["attribute"] = attribute
    row["dots"] = dots
    row["added_date"] = datetime.now()
    insert_row("attributes", row)

def add_character(username, charname):
  query = "SELECT MAX(charid) as maxcharid from characters"
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(query)
  result = cursor.fetchall()
  cursor.close()
  conn.close()
  retarray = [dict(row) for row in result]
  maxcharid = retarray[0]["maxcharid"]
  if(maxcharid == None):
    maxcharid = 1
  else:
    maxcharid = int(maxcharid)+1
  #print(maxcharid)
  row = {}
  row["username"] = username
  row["charid"] = maxcharid
  row["charname"] = charname
  insert_row("characters", row)
  return maxcharid
  

def update_character(username, charid, charname):
  query = "UPDATE characters SET charname = ? WHERE username = ? AND charid = ?";
  whereparams = [charname, username, charid]
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(query, tuple(whereparams))
  conn.commit()
  cursor.close()
  conn.close()

def delete_character(username, charid):
  # delete characters with this charid, delete attributes with this charid, delete characteristics with this charid
  delete_char_query = "DELETE from characters where username=? AND charid=?"
  delete_attr_query = "DELETE from attributes where username=? AND charid=?"
  delete_stic_query = "DELETE from characteristics where username=? AND charid=?"
  
  whereparams = [username, charid]
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(delete_char_query, tuple(whereparams))
  cursor.execute(delete_attr_query, tuple(whereparams))
  cursor.execute(delete_stic_query, tuple(whereparams))
  conn.commit()
  cursor.close()
  conn.close()


def update_characteristic(username, charid, attribute, value):
  row = {}
  row["username"] = username
  row["charid"] = charid
  row["attribute"] = attribute
  row["value"] = value
  row["added_date"] = datetime.now()
  insert_row("characteristics", row)

def get_characteristic(username, charid, attribute, all=False):
  query = "SELECT username, charid, attribute, value, added_date FROM characteristics"
  order_by = " order by username, charid, attribute, added_date desc"
  wherestrings = []
  whereparams = []
  if username != None:
    wherestrings.append("username=?")
    whereparams.append(username)
    wherestrings.append("charid=?")
    whereparams.append(charid)
    if(attribute):
      wherestrings.append("attribute=?")
      whereparams.append(attribute)
  if (len(wherestrings) > 0):
    query += " WHERE " + " and ".join(wherestrings)
  query += order_by
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(query, tuple(whereparams))
  result = cursor.fetchall()
  cursor.close()
  conn.close()

  retarray = []
  rusername = ""
  rcharid = ""
  rattribute = ""
  for row in result:
    drow = dict(row)
    if(drow["username"] == rusername and drow["charid"] == rcharid and drow["attribute"] == rattribute):
      ## Skip unless all is True
      if(all):
        retarray.append(drow)
    else:
      retarray.append(drow)
    rusername = drow["username"]
    rcharid = drow["charid"]
    rattribute = drow["attribute"]
  return retarray ##[dict(row) for row in result]




## update and delete rows
def insert_row(tablename, row):
  if tablename not in valid_tables:
    raise Exception(tablename+" is not a valid table")

  for k in row:
    if type(row[k]) in [dict,list]:
      row[k] = json.dumps(row[k])

  logger.debug("{0}".format(row))
  conn=get_db_conn()
  cursor = conn.cursor()
  query="INSERT INTO "+tablename+" ({0}) VALUES (%s)"
  query=query.format(', '.join(list(row.keys()))) % ', '.join('?' * len(row))
  logger.debug(query)
  logger.debug("{0}".format(tuple(map(str, list(row.values())),)))
  cursor.execute(query, tuple(map(str, list(row.values())),))
  rowcount=cursor.rowcount
  conn.commit()
  cursor.close()
  conn.close()
  return rowcount

def delete_row(tablename, wheredict):
  if tablename not in valid_tables:
    raise Exception(tablename+" is not a valid table")

  sql = '''DELETE FROM {0} WHERE {1}'''
  where = " and ".join([k+" = ? " for k in wheredict])
  q = sql.format(tablename, where)
  params = []
  for k in wheredict:
    params.append(wheredict[k])
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(q, tuple(params))
  conn.commit()
  cursor.close()
  conn.close()




## user handling
"""
   get_users

get user info

"""
def get_users(username=None, Full=False):

  query = "SELECT username, role, distinguishedname, last_login, id_created, deleted_date FROM user"
  if(Full):
    query = "SELECT username, salt, password, role, distinguishedname, last_login, id_created, deleted_date FROM user"

  wherestrings = []
  whereparams = []
  if username:
    wherestrings.append("username=?")
    whereparams.append(username)
  if (len(wherestrings) > 0):
    query += " WHERE " + " and ".join(wherestrings)
  conn=get_db_conn()
  cursor = conn.cursor()
  cursor.execute(query, tuple(whereparams))
  result = cursor.fetchall()
  cursor.close()
  conn.close()
  return [dict(row) for row in result]

def add_user(username=None, password=None, distinguishedname=None, role=None):
  if( username == None ):
    raise RuntimeError("Must have a username when calling dbclient.add_user")
  if( password==None and distinguishedname==None):
    raise RuntimeError("Must have a password or distinguished name when calling dbclient.add_user")
  if( role == None ):
    role = "user"

  curr_user = get_users(username)
  if(len(curr_user)>0):
    raise RuntimeError("username = "+username+" exists!")

  row = {}
  row["username"] = username
  if( role != None ):
    row["role"] = role
  row["id_created"] = datetime.now()

  pwdhash = ''
  if(password != None):
    pwdhash = sha512_crypt.hash(password)
    salt = pwdhash.split("$")[3]
    row["salt"] = salt
    row["password"] = pwdhash
  if( distinguishedname != None ):
    row["distinguishedname"] = distinguishedname

  insert_row("user", row)



def delete_user(username):
    delete_row('user', {'username':username})

def update_logindate(username):
  user = get_users(username, True)
  if(user == None or len(user) == 0):
    logger.error("dbclient.update_logindate NO USER MATCHED: "+username)
    return False
  curr_user = user[0]
  if(username != curr_user["username"]):
    logger.error("dbclient.update_logindate EXPECTED: "+username+" GOT user: "+username) ## should never see this
    return False

  logindate = datetime.now()
  query = "UPDATE user SET last_login=? WHERE username=?"
  params = (logindate, username)
  logger.warning(query)
  logger.warning(params)
  conn = get_db_conn()
  cursor=conn.cursor()
  cursor.execute(query, params)
  conn.commit()
  cursor.close()
  conn.close()

def update_user(username, password=None, distinguishedname=None, role=None):
  user = get_users(username, True)
  if(user == None or len(user) == 0):
    logger.error("dbclient.set_password NO USER MATCHED: "+username)
    return False
  curr_user = user[0]
  if(username != curr_user["username"]):
    logger.error("dbclient.check_password EXPECTED: "+username+" GOT user: "+username) ## should never see this
    return False

  if(password != None):
    logger.warning("UPDATE USER, changing password for "+username)
    pwdhash = sha512_crypt.hash(password)
    salt = pwdhash.split("$")[3]
    query = "UPDATE user SET salt=?, password=? WHERE username=?"
    params = (salt, pwdhash, username)
    conn = get_db_conn()
    cursor=conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    cursor.close()
    conn.close()
  if(distinguishedname != None):
    query = "UPDATE user SET distinguishedname=? WHERE username=?"
    params = (distinguishedname, username)
    conn = get_db_conn()
    cursor=conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    cursor.close()
    conn.close()
  if(role != None):
    query = "UPDATE user SET role=? WHERE username=?"
    params = (role, username)
    conn = get_db_conn()
    cursor=conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    cursor.close()
    conn.close()

def check_password(username, password):
  user = get_users(username, True)
  if(user == None or len(user) == 0):
    logger.error("dbclient.check_password NO USER MATCHED: "+username)
    return False
  curr_user = user[0]
  if(username != curr_user["username"]):
    logger.error("dbclient.check_password EXPECTED: "+username+" GOT user: "+username) ## should never see this
    return False
  pwdhash = sha512_crypt.hash(password, salt=curr_user["salt"])
  if(pwdhash == curr_user["password"]):
    return True
  else:
    logger.error("dbclient.check_password BAD PASSWORD FOR "+username)
    return False


if __name__ == "__main__":
  #add_user(username="ubarsmx", password="password1", role="admin")
  #users = get_users(username="ubarsmx", Full=True)
  #print(users)
  #print("-----------------------------------------------------------------------------------------------")
  #users = get_users()
  #print(users)

  #add_character("ubarsmx", "B")
  #update_character("ubarsmx", 2, "B-2")
  chars = get_characters(username="ubarsmx")
  print(chars)
  #update_character_attribute(1, "ubarsmx", "stamina", 1)  
  #update_character_attribute(1, "ubarsmx", "stamina", 2)  
  #update_character_attribute(1, "ubarsmx", "stamina", 3)  
  #update_character_attribute(1, "ubarsmx", "stamina", 1)  
  #update_character_attribute(1, "ubarsmx", "stamina", 5)  
  #update_character_attribute(1, "ubarsmx", "stamina", 4)  
  #update_character_attribute(1, "ubarsmx", "stamina", 3)  
  #update_character_attribute(1, "ubarsmx", "wits", 2)  
  #update_character_attribute(1, "ubarsmx", "wits", 1)  
  #print()
  char = get_attributes(username="ubarsmx", charid=1, all=False)
  print(char)
  print()
  cc = get_characteristic(username="ubarsmx", charid=3, attribute=None, all=False)
  print(cc)




