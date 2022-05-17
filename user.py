#cython: language_level=3
from flask_login import UserMixin

class User(UserMixin):
  id = None
  name = None
  role = None
  def __repr__(self):
    return '<User {} ({})>'.format(self.id, self.role)
  def get_id(self):
    return self.id;
  def set_id(self, newid):
    self.id = newid
    self.name = newid
  def get_role(self):
    return self.role
  def set_role(self, newrole):
    self.role = newrole
