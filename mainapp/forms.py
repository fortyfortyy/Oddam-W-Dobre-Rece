from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

from mainapp.models import Donation, Institution, Category


class FooterForm(forms.Form):
    name_errors = {
        "required": _("Imię jest wymagane"),
        "max_length": _("Imię jest za długie. Maksymalnie możesz użyć do 100 znaków"),
        "invalid": _("Proszę podać poprawne imię"),
    }
    email_errors = {
        "required": _("Email jest wymagany"),
        "max_length": _("Email jest za długi. Maksymalnie możesz użyć do 100 znaków"),
        "invalid": _("Proszę podać poprawny adres email"),
    }
    message_errors = {
        "required": _("Pole 'Wiadomość' jest wymagane"),
        "max_length": _("Wiadomość jest za długie. Maksymalnie możesz użyć do 1000 znaków"),
        "invalid": _("Proszę wprowadź wiadomość"),
    }

    name = forms.CharField(max_length=100, error_messages=name_errors, widget=forms.TextInput(attrs={
        'type': 'text',
        'name': 'name',
        'placeholder': 'Imię',
    }))

    email = forms.CharField(max_length=100, error_messages=email_errors, widget=forms.TextInput(attrs={
        'type': 'email',
        'name': 'email',
        'placeholder': 'Email',
    }))

    message = forms.CharField(max_length=1000, error_messages=message_errors, widget=forms.Textarea(attrs={
        'type': 'text',
        'name': 'message',
        'placeholder': 'Tutaj wpisz wiadomość',
        'rows': '2',
        'maxlength': '1000',
    }))

    def clean_name(self):
        name = self.cleaned_data['name']
        return name[0].upper() + name[1:].lower()

    def clean_surname(self):
        surname = self.cleaned_data['surname']
        return surname[0].upper() + surname[1:].lower()

    def clean_email(self):
        email = self.cleaned_data['email']
        return email.lower()


class DonationForm(forms.ModelForm):
    class Meta:
        model = Donation
        fields = ('quantity', 'address', 'phone_number', 'city', 'institution', 'categories',
                  'post_code', 'pick_up_date', 'pick_up_time', 'pick_up_comment')

    def __init__(self, *args, **kwargs):
        super(DonationForm, self).__init__(*args, **kwargs)
        self.fields['quantity'].error_messages = {
            "required": _("Ilość worków jest wymagane"),
            "max_length": _("Możesz maksymalnie użyć 20 worków"),
            "invalid": _("Proszę o podanie prawidłowej ilości worków"),
        }
        self.fields['address'].error_messages = {
            "required": _("Adres jest wymagany"),
            "max_length": _("Adres jest za długi. Maksymalnie możesz użyć do 200 znaków"),
            "invalid": _("Proszę o podanie prawidłowego adresu"),
        }
        self.fields['phone_number'].error_messages = {
            "required": _("Numer telefonu jest wymagany"),
            "max_length": _("Numer telefonu jest niepoprawny"),
            "invalid": _("Proszę o podanie prawidłowego numeru telefonu"),
        }
        self.fields['city'].error_messages = {
            "required": _("Miasto jest wymagane"),
            "max_length": _("Miasto jest za długie. Maksymalnie możesz użyć do 100 znaków"),
            "invalid": _("Proszę o podanie prawidłowego miasta"),
        }
        self.fields['institution'].error_messages = {
            "required": _("Organizacja' jest wymagane"),
            "max_length": _("Organizacja jest za długa"),
            "invalid": _("Niewłaściwa organizacja"),
        }
        self.fields['categories'].error_messages = {
            "required": _("Przynajmniej jedna kategoria jest wymagana"),
            "max_length": _("Kategoria jest za długa. Maksymalnie możesz użyć do 60 znaków"),
            "invalid": _("Niewłaściwa kategoria"),
        }
        self.fields['post_code'].error_messages = {
            "required": _("Kod pocztowy jest wymagany"),
            "max_length": _("Kod pocztowy powinien miec format XX-XXX"),
            "invalid": _("Proszę o podanie prawidłowego kodu pocztowego"),
        }
        self.fields['pick_up_date'].error_messages = {
            "required": _("Data jest wymagana"),
            "invalid": _("Proszę o podanie prawidłowej daty"),
        }
        self.fields['pick_up_time'].error_messages = {
            "required": _("Godzina jest wymagana"),
            "invalid": _("Proszę o podanie prawidłowej godziny"),
        }
        self.fields['pick_up_comment'].error_messages = {
            "max_length": _("Komentarz jest za długi. Maksymalnie możesz użyć do 500 znaków"),
        }
        # # Phone number validator
        # PHONE_REGEX = RegexValidator(r'^(\+\d{1,2})?\d{9}$', "Numer telefonu musi mieć format +XXXXXXXXXXX")
        # phone_validators = [PHONE_REGEX],
        # phone_number = self.fields['phone_number']
        # phone_number.validators.append(phone_validators)
        #
        # # Post Code validator
        # POST_CODE_REGEX = RegexValidator(r'^\d{2}\-?\d{3}$', "Kod pocztowy musi mieć format: XX-XXX.")
        # post_code_validators = [POST_CODE_REGEX]
        # post_code = self.fields['post_code']
        # post_code.validators.append(post_code_validators)

    def clean_phone_number(self):
        phone_number = self.cleaned_data['phone_number']
        return phone_number

    def clean_city(self):
        city = self.cleaned_data['city']
        return city[0].upper() + city[1:].lower()

    def clean_institution(self):
        institution = self.cleaned_data['institution']
        try:
            institution = Institution.objects.get(pk=institution.pk)
        except Institution.DoesNotExist:
            raise ValidationError(_("Proszę wybrać poprawną instytucję"))
        return institution

    def clean_categories(self):
        categories = self.cleaned_data['categories']
        for category in categories:
            try:
                category = Category.objects.get(pk=category.pk)
            except Category.DoesNotExist:
                raise ValidationError(_("Proszę wybrać poprawną kategorię"))
        return categories
