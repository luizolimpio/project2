import unicodedata
from lfs.marketing.models import Banner, Replacebusca
from django import forms

class BannerForm(forms.ModelForm):
    class Meta:
        model =  Banner
        exclude = ()

    def __init__(self, *args, **kwargs):
        super(BannerForm, self).__init__(*args, **kwargs)
        self.fields["link"].required = True
        self.fields["imagem"].required = True

class ReplacebuscaForm(forms.ModelForm):
    class Meta:
        model =  Replacebusca
        exclude = ()


    def __init__(self, *args, **kwargs):
        super(ReplacebuscaForm, self).__init__(*args, **kwargs)
        self.fields["termo"].required = True
        self.fields["novotermo"].required = True

    def clean(self):
        termo = self.cleaned_data["termo"].upper()
        novotermo = self.cleaned_data["novotermo"].upper()

        self.cleaned_data["termo"] = unicode(unicodedata.normalize('NFKD', termo).encode('ascii', 'ignore'))
        self.cleaned_data["novotermo"] = unicode(unicodedata.normalize('NFKD', novotermo).encode('ascii', 'ignore'))

        return self.cleaned_data