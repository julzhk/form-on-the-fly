# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-12 15:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0010_auto_20160312_1515'),
    ]

    operations = [
        migrations.AddField(
            model_name='rangeelement',
            name='min',
            field=models.IntegerField(default=0),
        ),
    ]
