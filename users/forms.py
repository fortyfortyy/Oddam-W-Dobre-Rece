from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from users.models import Profile


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)

        self.fields['first_name'].widget.attrs.update(
            {'type': 'text', 'name': 'first_name', 'class': 'form-control', 'placeholder': 'First Name'})

        self.fields['last_name'].widget.attrs.update(
            {'type': 'text', 'name': 'last_name', 'class': 'form-control', 'placeholder': 'Last Name'})

        self.fields['email'].widget.attrs.update(
            {'type': 'email', 'name': 'email', 'class': 'form-control', 'placeholder': 'Email'})

        self.fields['password1'].widget.attrs.update(
            {'type': 'password', 'name': 'password1', 'class': 'form-control', 'placeholder': 'Password'})

        self.fields['password2'].widget.attrs.update(
            {'type': 'password', 'name': 'password2', 'class': 'form-control', 'placeholder': 'Confirm password'})

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        if len(email) > 255:
            raise ValidationError(_('Email jest za długi. Maksymalnie możesz użyć do 255 znaków.'), code='long_email')
        try:
            account = Profile.objects.get(email=email)
        except Profile.DoesNotExist:
            return email
        raise ValidationError(f'Email {email} jest używany. Czy chcesz zresetowac hasło?', code='email_exists')

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if len(first_name) > 150:
            raise ValidationError(_('Imię jest za długie. Maksymalnie możesz użyć do 150 znaków.'),
                                  code='long_first_name')
        else:
            return first_name[0].upper() + first_name[1:].lower()

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        if len(last_name) > 150:
            raise ValidationError(_('Nazwisko jest za długie. Maksymalnie możesz użyć do 150 znaków.'),
                                  code='long_last_name')
        else:
            return last_name[0].upper() + last_name[1:].lower()


class LoginForm(forms.Form):
    email = forms.CharField(label='Email', max_length=255, widget=forms.TextInput(attrs={
        'type': 'email',
        'name': 'email',
        'class': 'form-control',
        'placeholder': 'Email',
    }))

    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={
        'type': 'password',
        'name': 'password',
        'class': 'form-control',
        'placeholder': 'Password',
    }))

    def clean_email(self):
        email = self.cleaned_data['email']
        if len(email) > 255:
            raise ValidationError(_('Email jest za długi. Maksymalnie możesz użyć do 255 znaków.'), code='long_email')
        else:
            return email.lower()


class ProfileEditForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'email')

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if len(first_name) > 150:
            raise ValidationError(_('Imię jest za długie. Maksymalnie możesz użyć do 150 znaków.'),
                                  code='long_first_name')
        else:
            return first_name[0].upper() + first_name[1:].lower()

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        if len(last_name) > 150:
            raise ValidationError(_('Nazwisko jest za długie. Maksymalnie możesz użyć do 150 znaków.'),
                                  code='long_last_name')
        else:
            return last_name[0].upper() + last_name[1:].lower()

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if len(email) > 255:
            raise ValidationError(_('Email jest za długi. Maksymalnie możesz użyć do 255 znaków.'), code='long_email')
        else:
            return email.lower()
