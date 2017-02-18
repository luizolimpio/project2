# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0002_auto_20160729_0405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paymentmethod',
            name='type',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Type', choices=[(0, 'Plain'), (1, 'Bank'), (2, 'Credit Card'), (8, 'Dinheiro Troco')]),
        ),
    ]
