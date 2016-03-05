# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formapi', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='formelement',
            options={'ordering': ['order']},
        ),
        migrations.AddField(
            model_name='formelement',
            name='key',
            field=models.CharField(default=b'', unique=True, max_length=255),
        ),
        migrations.AddField(
            model_name='formelement',
            name='label',
            field=models.CharField(default=b'label', max_length=255),
        ),
        migrations.AddField(
            model_name='formelement',
            name='order',
            field=models.IntegerField(default=1, auto_created=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='formelement',
            name='placeholder',
            field=models.CharField(default=b'placeholder', max_length=255),
        ),
        migrations.AddField(
            model_name='formelement',
            name='type',
            field=models.CharField(default=b'input', max_length=32, choices=[(b'input', b'input'), (b'checkbox', b'checkbox'), (b'password', b'password')]),
        ),
    ]
