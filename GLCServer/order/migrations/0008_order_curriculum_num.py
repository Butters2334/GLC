# Generated by Django 2.2.6 on 2019-12-14 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0007_auto_20191212_1611'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='curriculum_num',
            field=models.IntegerField(default=1, max_length=5, verbose_name='课程数量'),
        ),
    ]
