# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketing', '0002_banner'),
    ]

    operations = [
        migrations.RenameField(
            model_name='banner',
            old_name='active',
            new_name='ativo',
        ),
        migrations.RenameField(
            model_name='banner',
            old_name='nome',
            new_name='imagem',
        ),
    ]
