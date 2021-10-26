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
            {'type': 'text', 'name': 'name', 'class': 'form-control', 'placeholder': 'First Name'})

        self.fields['last_name'].widget.attrs.update(
            {'type': 'text', 'name': 'surname', 'class': 'form-control', 'placeholder': 'Last Name'})

        self.fields['email'].widget.attrs.update(
            {'type': 'email', 'name': 'email', 'class': 'form-control', 'placeholder': 'Email'})

        self.fields['password1'].widget.attrs.update(
            {'type': 'password', 'name': 'password1', 'class': 'form-control', 'placeholder': 'Password'})

        self.fields['password2'].widget.attrs.update(
            {'type': 'password', 'name': 'password2', 'class': 'form-control', 'placeholder': 'Confirm password'})

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        if len(email) > 255:
            raise ValidationError(_('Email is too long. Max 255 characters. Please try again.'), code='long_email')
        try:
            account = Profile.objects.get(email=email)
        except Profile.DoesNotExist:
            return email
        raise ValidationError(f'Email {email} is already in use.', code='email_exists')


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
        email = self.cleaned_data['email'].lower()
        if len(email) > 255:
            raise ValidationError(_('Email is too long. Max 255 characters. Please try again.'), code='long_email')
        else:
            return email
