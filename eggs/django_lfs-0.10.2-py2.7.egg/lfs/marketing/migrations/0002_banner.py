# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketing', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nome', models.CharField(help_text='The name of the product.', max_length=255, verbose_name='Name')),
                ('link', models.CharField(help_text='The name of the product.', max_length=255, verbose_name='Name')),
                ('active', models.BooleanField(default=True, verbose_name='Active')),
            ],
        ),
    ]
