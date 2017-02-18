# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketing', '0004_auto_20160803_1900'),
    ]

    operations = [
        migrations.CreateModel(
            name='Replacebusca',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('termo', models.CharField(max_length=255, verbose_name='Termo', blank=True)),
                ('novotermo', models.CharField(max_length=255, verbose_name='Novo termo', blank=True)),
            ],
        ),
        migrations.AlterField(
            model_name='banner',
            name='imagem',
            field=models.CharField(max_length=255, verbose_name='Imagem'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='link',
            field=models.CharField(max_length=255, verbose_name='link'),
        ),
    ]
