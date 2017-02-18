# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0002_set_null_to_address_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='DinheiroTroco',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Troco', models.CharField(max_length=100, verbose_name='Troco', blank=True)),
                ('customer', models.ForeignKey(related_name='dinheiro_troco', verbose_name='Customer', blank=True, to='customer.Customer', null=True)),
            ],
        ),
    ]
