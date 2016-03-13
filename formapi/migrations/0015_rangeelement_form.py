# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-12 15:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0014_rangeelement_initial_value'),
    ]

    operations = [
        migrations.AddField(
            model_name='rangeelement',
            name='form',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='formapi.Form'),
            preserve_default=False,
        ),
    ]