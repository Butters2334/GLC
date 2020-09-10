from django.db import models

# Create your models here.


class user(models.Model):
    user_id          = models.AutoField(primary_key=True)
    username         = models.CharField('用户名称', max_length=255)
    password         = models.CharField('用户密码', max_length=255)
    user_type        = models.IntegerField('用户类型(0扫描1后台2admin)',default=1)
    user_token       = models.CharField('临时token有效期一天', max_length=255,default="")
    token_timeout    = models.FloatField('token截止的有效期',default=0)

    class Meta:
        db_table     = 'GLCUser'