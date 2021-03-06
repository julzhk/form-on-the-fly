# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-12 15:43
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0016_textelement_label'),
    ]

    operations = [
        migrations.CreateModel(
            name='DropdownItemCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(default=0)),
                ('label', models.CharField(default=b'label', max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='dropdownitem',
            name='category',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='formapi.DropdownItemCategory'),
            preserve_default=False,
        ),
    ]
