# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0006_auto_20160904_1222'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dinheirotroco',
            name='Troco',
            field=models.CharField(max_length=255, null=True, verbose_name='Troco', blank=True),
        ),
    ]
