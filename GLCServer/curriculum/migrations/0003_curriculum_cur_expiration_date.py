# Generated by Django 2.2.6 on 2020-02-18 07:52

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0002_curriculum'),
    ]

    operations = [
        migrations.AddField(
            model_name='curriculum',
            name='cur_expiration_date',
            field=models.DateTimeField(default=datetime.datetime(2020, 5, 18, 7, 52, 56, 266574), verbose_name='教材过期时间(默认在创建教材后的三个月过期)'),
        ),
    ]
