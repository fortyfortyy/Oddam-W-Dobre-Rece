from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from users.models import Profile


class CustomUserCreationForm(UserCreationForm):
    error_messages = {
        'password_mismatch': _("Twoje hasła nie zgadzają się ze sobą."),
        # 'password_too_common': _("Hasło jest zbyt popularne. Proszę podać nowe hasło."),
        'email_exists': _("Email %(email)s jest używany. Czy chcesz zresetowac hasło?"),
    }

    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'email', 'password1', 'password2')
        field_args = {
            "first_name": {
                "error_messages": {
                    "invalid": _("Proszę podac poprawne imię."),
                    "required": _("Pole 'Imię' jest wymagane"),
                    "max_length": _("Imię jest za długie. Maksymalnie możesz użyć do 150 znaków."),
                }
            },
            "last_name": {
                "error_messages": {
                    "invalid": _("Proszę podac poprawne nazwisko."),
                    "required": _("Pole 'Nazwisko' jest wymagane."),
                    "max_length": _("Nazwisko jest za długie. Maksymalnie możesz użyć do 150 znaków."),
                },
            },
            "email": {
                "error_messages": {
                    "invalid": _("Proszę podac poprawny adres email."),
                    "required": _("Pole 'Email' jest wymagane."),
                    "max_length": _("Email jest za długi. Maksymalnie możesz użyć do 255 znaków."),
                },
            },
            "password1": {
                "error_messages": {
                    "invalid": _("Proszę podac poprawne pierwsze hasło."),
                    "required": _("Pole 'Hasło' jest wymagane"),
                    "max_length": _("Długość hasła może wynosić do 128 znaków."),
                },
            },
            "password2": {
                "error_messages": {
                    "invalid": _("Proszę podac poprawne drugie hasło."),
                    "required": _("Pole 'Powtórz hasło' jest wymagane"),
                    "max_length": _("Długość hasła może wynosić do 128 znaków."),
                },
            }
        }

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        if hasattr(self.Meta, "field_args"):
            # Look at the field_args Meta class attribute to get
            # any (additional) attributes we should set for a field.
            field_args = self.Meta.field_args
            # Iterate over all fields...
            for fname, field in self.fields.items():
                # Check if we have something for that field in field_args
                fargs = field_args.get(fname)
                if fargs:
                    # Iterate over all attributes for a field that we
                    # have specified in field_args
                    for attr_name, attr_val in fargs.items():
                        if attr_name.startswith("+"):
                            merge_attempt = True
                            attr_name = attr_name[1:]
                        else:
                            merge_attempt = False
                        orig_attr_val = getattr(field, attr_name, None)
                        if orig_attr_val and merge_attempt and \
                                type(orig_attr_val) == dict and \
                                type(attr_val) == dict:
                            # Merge dictionaries together
                            orig_attr_val.update(attr_val)
                        else:
                            # Replace existing attribute
                            setattr(field, attr_name, attr_val)

        # self.fields['last_name'].error_messages = {'required': "Pole 'Nazwisko' jest wymagane"}
        # self.fields['email'].error_messages = {'required': "Pole 'Email' jest wymagane"}
        # self.fields['password1'].error_messages = {'required': "Pole 'Hasło' jest wymagane"}
        # self.fields['password2'].error_messages = {'required': "Pole 'Powtórz hasło' jest wymagane"}

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        try:
            account = Profile.objects.get(email=email)
        except Profile.DoesNotExist:
            return email
        raise ValidationError(self.error_messages['email_exists'], code='email_exists', params={'email': email})

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        return first_name[0].upper() + first_name[1:].lower()

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        return last_name[0].upper() + last_name[1:].lower()


class LoginForm(forms.Form):
    my_default_errors = {
        "required": _("Pole 'Email' jest wymagane."),
        "invalid": _("Wprowadź poprawną wartość."),
        "max_length": _("Email jest za długi. Maksymalnie możesz użyć do 255 znaków."),
    }

    email = forms.CharField(label='Email', max_length=255, error_messages=my_default_errors,
                            widget=forms.TextInput(attrs={
                                'type': 'email',
                                'name': 'email',
                                'placeholder': 'Email',
                            }))

    password = forms.CharField(label='Password', max_length=128, widget=forms.PasswordInput(attrs={
        'type': 'password',
        'name': 'password',
        'placeholder': 'Hasło',
    }))

    def clean_email(self):
        email = self.cleaned_data['email']
        return email.lower()


class ProfileEditForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'email')

    def __init__(self, *args, **kwargs):
        super(ProfileEditForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].error_messages = {
            "required": _("Pole 'Imię' jest wymagane"),
            "max_length": _("Imię jest za długie. Maksymalnie możesz użyć do 150 znaków."),
        }
        self.fields['last_name'].error_messages = {
            "required": _("Pole 'Nazwisko' jest wymagane"),
            "max_length": _("Nazwisko jest za długie. Maksymalnie możesz użyć do 150 znaków."),
        }
        self.fields['email'].error_messages = {
            "required": _("Pole 'Email' jest wymagane"),
            "max_length": _("Email jest za długie. Maksymalnie możesz użyć do 255 znaków."),
        }

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        return first_name[0].upper() + first_name[1:].lower()

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        return last_name[0].upper() + last_name[1:].lower()

    def clean_email(self):
        email = self.cleaned_data.get('email')
        return email.lower()
