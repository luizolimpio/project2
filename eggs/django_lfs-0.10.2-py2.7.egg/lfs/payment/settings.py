# django imports
from django.utils.translation import ugettext_lazy as _

DIRECT_DEBIT = 1
CASH_ON_DELIVERY = 2
PAYPAL = 3
PRE_PAYMENT = 4
BY_INVOICE = 5
CREDIT_CARD = 6

CC_AMERICAN_EXPRESS = "AMEX"
CC_MASTERCARD = "MASTER"
CC_VISA = "VISA"
CC_CARTAOPROPIO = "Cartao da loja"
CC_GOLDCARD = "Gold card"
CC_MAESTRO = "Maestro"
CC_BANESECARD = "Banesecard"
CC_ELO = "Elo"
CC_ALELO = "Alelo"
CC_HYPERCARD = "Hypercard"
CC_SODEXO = "Sodexo"



CREDIT_CARD_TYPE_CHOICES = (
    (CC_MASTERCARD, _(u"Mastercard")),
    (CC_CARTAOPROPIO, _(u"Cartao da loja")),
    (CC_VISA, _(u"Visacard")),
    (CC_GOLDCARD, _(u"Gold card")),
    (CC_MAESTRO, _(u"Maestro")),
    (CC_BANESECARD, _(u"Banesecard")),
    (CC_ELO, _(u"Elo")),
    (CC_ELO, _(u"Alelo")),
    (CC_HYPERCARD, _(u"Hypercard")),
    (CC_SODEXO, _(u"Sodexo")),
)

PM_PLAIN = 0
PM_BANK = 1
PM_CREDIT_CARD = 2
PM_DINHEIRO_TROCO = 8

PAYMENT_METHOD_TYPES_CHOICES = (
    (PM_PLAIN, _(u"Plain")),
    (PM_BANK, _(u"Bank")),
    (PM_CREDIT_CARD, _(u"Credit Card")),
    (PM_DINHEIRO_TROCO, _(u"Dinheiro Troco")),

)

PM_ORDER_IMMEDIATELY = 0
PM_ORDER_ACCEPTED = 1

PM_MSG_TOP = 10
PM_MSG_FORM = 11
