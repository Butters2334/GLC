# Generated by Django 2.2.6 on 2019-11-25 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('goods', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='goods',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('goods_param_0', models.CharField(max_length=255, verbose_name='季度')),
                ('goods_param_1', models.CharField(max_length=255, verbose_name='科目')),
                ('goods_param_2', models.CharField(max_length=255, verbose_name='年级')),
                ('goods_param_3', models.CharField(max_length=255, verbose_name='讲次')),
                ('goods_param_4', models.CharField(max_length=255, verbose_name='班次')),
                ('goods_param_5', models.CharField(max_length=255, verbose_name='发放明细')),
                ('goods_id', models.CharField(max_length=255, unique=True, verbose_name='商品码')),
                ('goods_position_list', models.CharField(max_length=255, verbose_name='货架位置')),
                ('goods_status', models.IntegerField(default=0, verbose_name='商品状态0正常1下架')),
                ('goods_stock', models.IntegerField(default=-1, verbose_name='商品库存<0未录入')),
                ('db_install_time', models.DateTimeField(auto_now_add=True, verbose_name='入库时间')),
                ('db_update_time', models.DateTimeField(auto_now=True, verbose_name='状态更新时间')),
            ],
            options={
                'db_table': 'GLCGoods',
            },
        ),
    ]
