# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-12 14:37
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0006_auto_20160312_1434'),
    ]

    operations = [
        migrations.RenameField(
            model_name='textelement',
            old_name='text',
            new_name='placeholder',
        ),
    ]