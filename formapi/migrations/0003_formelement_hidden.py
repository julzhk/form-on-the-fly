# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-27 16:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0002_auto_20160210_1917'),
    ]

    operations = [
        migrations.AddField(
            model_name='formelement',
            name='hidden',
            field=models.BooleanField(default=False),
        ),
    ]
