flask_port=8088
flask_hostname=192.168.140.128
abspath=`readlink -f $0`
path=/home/hpccdemo/vtmsheet

FLASK_APP=${path}/compapp.py
export FLASK_APP

cd /home/hpccdemo/vtmsheet
flask run --host=${flask_hostname} --port=${flask_port}


