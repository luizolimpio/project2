# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0005_auto_20160731_0739'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dinheirotroco',
            name='Troco',
            field=models.CharField(max_length=255, verbose_name='Troco', blank=True),
        ),
    ]
