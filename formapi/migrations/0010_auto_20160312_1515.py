# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-12 15:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0009_rangeelement'),
    ]

    operations = [
        migrations.AddField(
            model_name='rangeelement',
            name='label',
            field=models.CharField(default=b'label', max_length=255),
        ),
        migrations.AddField(
            model_name='rangeelement',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]