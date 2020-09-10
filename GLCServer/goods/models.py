from django.db import models
from datetime import datetime,timedelta

#商品
class goods(models.Model):
    id                     = models.AutoField(primary_key=True)
    goods_param_0          = models.CharField('季度', max_length=255)
    goods_param_1          = models.CharField('科目', max_length=255)
    goods_param_2          = models.CharField('年级', max_length=255)
    goods_param_3          = models.CharField('讲次', max_length=255)
    goods_param_4          = models.CharField('班次', max_length=255)
    goods_param_5          = models.CharField('发放明细', max_length=255)
    goods_id               = models.CharField('商品码', max_length=255,unique=True)
    goods_position_list    = models.CharField('货架位置', max_length=255)#没找到怎么存数组,暂时转字符串存入
    goods_type           = models.IntegerField('商品类型0正常1临时',default=0)
    goods_expiration_date = models.DateTimeField('教材过期时间(默认在创建教材后的三个月过期)',default=datetime.now()+timedelta(days=30*3))

    goods_status           = models.IntegerField('商品状态0正常1下架',default=0)
    goods_stock            = models.IntegerField('商品库存<0未录入',default=-1)
    goods_stock_max        = models.IntegerField('库存上限<0未录入',default=-1)
    db_install_time   = models.DateTimeField('入库时间',auto_now_add=True)
    db_update_time   = models.DateTimeField('状态更新时间',auto_now=True)
    class Meta:
        db_table = 'GLCGoods'
