from django.db import models
from datetime import datetime,timedelta

#课程表
class curriculum(models.Model):
    id                      = models.AutoField(primary_key=True)
    curriculum_id           = models.CharField('课程id', max_length=255,unique=True)
    curriculum_name         = models.CharField('课程名称', max_length=255)
    curriculum_good_list    = models.CharField('课程内教材列表使用逗号分割', max_length=255)
    db_install_time   = models.DateTimeField('入库时间',auto_now_add=True)
    db_update_time   = models.DateTimeField('状态更新时间',auto_now=True)
    cur_expiration_date = models.DateTimeField('结课时间(默认在创建教材后的三个月过期)',default=datetime.now()+timedelta(days=30*3))
    cur_start_date = models.DateTimeField('开课时间(默认在创建教材时)',default=datetime.now()+timedelta(seconds=1))
    class Meta:
        db_table = 'GLCCurriculum'
