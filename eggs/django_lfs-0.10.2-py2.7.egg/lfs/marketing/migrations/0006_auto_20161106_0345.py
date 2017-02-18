# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketing', '0005_auto_20161106_0327'),
    ]

    operations = [
        migrations.AlterField(
            model_name='replacebusca',
            name='termo',
            field=models.CharField(unique=True, max_length=255, verbose_name='Termo', blank=True),
        ),
    ]
