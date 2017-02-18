# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0004_auto_20160813_1849'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='Troco',
            field=models.CharField(max_length=255, verbose_name='Dinheiro Troco', blank=True),
        ),
    ]
