#创建表模型
from django.db import models
import sys


# reload(sys)
sys.setdefaultencoding('utf-8')




# mysql -u root -p
# 123456

#use django_mysql



# python3 manage.py makemigrations --empty yourappname
# python3 manage.py makemigrations
# python3 manage.py migrate