from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils.translation import ugettext_lazy as _

from mainapp.models import Donation


class FooterForm(forms.Form):
    name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'type': 'text',
        'placeholder': 'Imię',
    }))

    surname = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'type': 'text',
        'placeholder': 'Nazwisko',
    }))

    message = forms.CharField(max_length=1000, widget=forms.Textarea(attrs={
        'type': 'text',
        'placeholder': 'Tutaj wpisz wiadomość',
        'rows': '3',
        'maxlength': '1000',
    }))

    def clean_name(self):
        name = self.cleaned_data['name']
        if len(name) > 100:
            raise ValidationError(_('Proszę podać imię które zawiera do 100 znaków'))
        return name[0].upper() + name[1:].lower()

    def clean_surname(self):
        surname = self.cleaned_data['surname']
        if len(surname) > 100:
            raise ValidationError(_('Proszę podać nazwisko które zawiera do 100 znaków'))
        return surname[0].upper() + surname[1:].lower()

    def clean_message(self):
        message = self.cleaned_data['message']
        if len(message) > 1000:
            raise ValidationError(_('Wiadomośc może zawierać do 1000 znaków'))
        return message


class DonationForm(forms.ModelForm):
    class Meta:
        model = Donation
        fields = ('quantity', 'address', 'phone_number', 'city',
                  'post_code', 'pick_up_date', 'pick_up_time', 'pick_up_comment')

    def __init__(self, *args, **kwargs):
        super(DonationForm, self).__init__(*args, **kwargs)

        # Phone number validator
        PHONE_REGEX = RegexValidator(r'^(\+\d{1,2})?\d{9}$', "Numer telefonu musi mieć format +XXXXXXXXXXX")
        phone_validators = [PHONE_REGEX],
        phone_number = self.fields['phone_number']
        phone_number.validators.append(phone_validators)

        # Post Code validator
        POST_CODE_REGEX = RegexValidator(r'^\d{2}\-?\d{3}$', "Kod pocztowy musi mieć format: XX-XXX.")
        post_code_validators = [POST_CODE_REGEX]
        post_code = self.fields['post_code']
        post_code.validators.append(post_code_validators)

    def clean_quantity(self):
        quantity = self.cleaned_data['quantity']
        if quantity < 1:
            raise ValidationError(_("Proszę podać prawidłową ilość worków"))
        return quantity

    def clean_address(self):
        address = self.cleaned_data['address']
        if len(address) > 200:
            raise ValidationError(_("Proszę podać poprawny adres"))
        return address

    def clean_phone_number(self):
        phone_number = self.cleaned_data['phone_number']
        if len(phone_number) > 12:
            raise ValidationError(_("Proszę podać poprawny number"))
        return phone_number

    def clean_city(self):
        city = self.cleaned_data['city']
        if len(city) > 100:
            raise ValidationError(_("Proszę podać poprawne miasto"))
        return city

    def clean_post_code(self):
        post_code = self.cleaned_data['post_code']
        if len(post_code) > 6:
            raise ValidationError(_("Proszę podać poprawny kod pocztowy"))
        return post_code

    def clean_pick_up_date(self):
        pass

    def clean_pick_up_time(self):
        pass

    def clean_pick_up_comment(self):
        comment = self.cleaned_data['pick_up_comment']
        if len(comment) > 500:
            raise ValidationError(_("Maksymalnie możesz wpisać 500 znaków w uwagach dla kuriera"))

