# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-27 16:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0003_formelement_hidden'),
    ]

    operations = [
        migrations.AlterField(
            model_name='formelement',
            name='placeholder',
            field=models.CharField(blank=True, default=b'placeholder', max_length=255),
        ),
    ]
