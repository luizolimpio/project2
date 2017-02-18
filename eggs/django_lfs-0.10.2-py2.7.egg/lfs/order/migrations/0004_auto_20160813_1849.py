# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0003_order_cartao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='state',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='State', choices=[(0, 'Submitted'), (1, 'Recebido'), (7, 'Prepared'), (2, 'Sent'), (3, 'Closed'), (4, 'Canceled'), (5, 'Payment Failed'), (6, 'Payment Flagged')]),
        ),
    ]
