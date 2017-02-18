from django.conf import settings
from django.utils.translation import ugettext_lazy as _

POSTAL_ADDRESS_L10N = getattr(settings, 'POSTAL_ADDRESS_L10N', True)

# each address line is a tuple of format (field_label, required)
POSTAL_ADDRESS_LINE1 = getattr(settings, "POSTAL_ADDRESS_LINE1", (_(u"Street"), True))
POSTAL_ADDRESS_LINE2 = getattr(settings, "POSTAL_ADDRESS_LINE2", (_(u"Numero e Bairro"), True))
POSTAL_ADDRESS_CITY = getattr(settings, "POSTAL_ADDRESS_CITY", (_(u"City"), True))
POSTAL_ADDRESS_STATE = getattr(settings, "POSTAL_ADDRESS_STATE", (_(u"State"), True))
POSTAL_ADDRESS_CODE = getattr(settings, "POSTAL_ADDRESS_CODE", (_(u"Zip code"), True))