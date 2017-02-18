# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='Troco',
            field=models.CharField(max_length=30, verbose_name='Dinheiro Troco', blank=True),
        ),
    ]
