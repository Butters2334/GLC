from django.db import models


# 订单表,上传数据的时候判断第22的位置是否有'课程'
class order(models.Model):
    # 自增主键,因为不能保证订单号是否唯一
    id                      = models.AutoField(primary_key=True)
    order_id                = models.CharField('订单号', max_length=255,unique=True)
    tracking_id             = models.CharField('运单号', max_length=255)
    platform_id             = models.CharField('平台订单号', max_length=255)
    other_order_id          = models.CharField('换单单号', max_length=255)
    order_status            = models.CharField('状态', max_length=255)
    other_param_0           = models.CharField('付费方式', max_length=255)
    other_param_1           = models.CharField('是否超区', max_length=255)
    other_param_2           = models.CharField('超区原因', max_length=255)
    other_param_3           = models.CharField('取件码', max_length=255)
    other_param_4           = models.CharField('代收货款', max_length=255)
    other_param_5           = models.CharField('下单人', max_length=255)
    other_param_6           = models.CharField('下单账号', max_length=255)
    other_param_7           = models.CharField('下单人部门', max_length=255)
    other_param_8           = models.CharField('寄件人', max_length=255)
    other_param_9           = models.CharField('寄件人手机', max_length=255)
    other_param_a           = models.CharField('寄件人公司', max_length=255)
    user_name               = models.CharField('收件人', max_length=255)
    user_phone              = models.CharField('收件人手机', max_length=255)
    user_addr               = models.CharField('收件人地址', max_length=255)
    user_company            = models.CharField('收件人公司', max_length=255)
    order_package_number    = models.CharField('包裹数量', max_length=255)
    curriculum              = models.CharField('备注', max_length=255)
    order_time              = models.CharField('下单时间', max_length=255)
    other_param_b           = models.CharField('业务类型', max_length=255)
    other_param_c           = models.CharField('物品名', max_length=255)
    other_param_d           = models.CharField('生鲜温层', max_length=255)
    other_param_e           = models.CharField('返单类型', max_length=255)
    other_param_f           = models.CharField('是否保价', max_length=255)
    other_param_10          = models.CharField('保价金额', max_length=255)
    expected_time           = models.CharField('预计送达', max_length=255)
    order_weight            = models.CharField('下单重量(kg)', max_length=255)
    other_param_11          = models.CharField('是否拒收', max_length=255)
    other_param_12          = models.CharField('验货方式', max_length=255)
    order_state_time        = models.CharField('状态更新时间', max_length=255)
    curriculum_num          = models.IntegerField('课程数量', default=1)
    order_db_status         = models.IntegerField('当前订单状态(0待拣货1拣货中2待打包3待发货4发货中5已收件6已存档)', default=0)
    order_db_install_time   = models.DateTimeField('入库时间',auto_now_add=True)
    order_db_update_time   = models.DateTimeField('状态更新时间',auto_now=True)

    class Meta:
        db_table            = 'GLCOrder'