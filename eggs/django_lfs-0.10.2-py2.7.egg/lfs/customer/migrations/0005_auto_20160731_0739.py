# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0004_customer_selected_dinheiro_troco'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='selected_dinheiro_troco',
            field=models.ForeignKey(related_name='selected_dinheiro_troco', verbose_name='Dinheiro Troco', blank=True, to='customer.DinheiroTroco', null=True),
        ),
    ]
