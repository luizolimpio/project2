# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paymentmethod',
            name='type',
            field=models.PositiveSmallIntegerField(default=3, verbose_name='Type', choices=[(0, 'Plain'), (1, 'Bank'), (2, 'Credit Card'), (3, 'Dinheiro Troco')]),
        ),
    ]
