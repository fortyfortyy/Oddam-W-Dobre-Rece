from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.models import Site
from django.shortcuts import redirect, render
from django.views import View

from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode

from mainapp.models import Donation
from project import settings
from users.models import Profile
from users.forms import CustomUserCreationForm, LoginForm, ProfileEditForm
from users.utils import account_activation_token


class RegisterView(View):
    """
    Create the user account and activate account by link sent to given email.
    """
    form_class = CustomUserCreationForm
    template_class = 'users/register.html'
    context = {}

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            messages.error(request, f'Jesteś zalogowany jako {request.user}')
            return redirect('main-page')
        self.context['registration_form'] = self.form_class
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.is_active = False
            profile.site = Site.objects.get(pk=settings.SITE_ID)
            profile.save()

            messages.success(request, 'Proszę potwierdzić swój adres email w celu aktywacji utworzenego konta.')
            return render(request, self.template_class, self.context)

        messages.error(request, 'Niepoprawne podane dane. Prosimy spróbować jeszcze raz.')
        self.context['registration_form'] = form
        return render(request, self.template_class, self.context)


class ActivateAccountView(View):
    """
    Checks whether the link is valid for the given user.
    Then, activate account.
    """
    template_class = 'main.html'
    context = {}

    def get(self, request, *args, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(kwargs['uidb64']))
            profile = Profile.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, KeyError, Profile.DoesNotExist):
            profile = None

        self.context['activation_message'] = True
        if profile is not None and account_activation_token.check_token(profile, kwargs['token']):
            profile.is_active = True

            # Create temporary attribute to send welcome message
            # When it's done, delete that attribute
            try:
                profile._sendwelcomemessage = True
                profile.save()
            finally:
                del profile._sendwelcomemessage

            login(request, profile)
            messages.success(request, "Twoje konto zostało pomyślnie aktywowane!")
            return render(request, self.template_class, self.context)
        messages.error(request, "Twoje konto już jest aktywne!")
        return render(request, self.template_class, self.context)


class LoginView(View):
    """
    Displays the login form and handles the login action.
    Then redirects to the main page.
    """
    form_class = LoginForm
    template_class = 'users/login.html'
    context = {}

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            messages.error(request, "Przepraszamy ale jesteś już zalogowany!")
            return redirect('main-page')

        self.context['login_form'] = self.form_class
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('main-page')
        self.context['login_form'] = form
        messages.error(request, "Niepoprawny login lub hasło. Spróbuj jeszcze raz.")
        return render(request, self.template_class, self.context)


class LogoutView(LoginRequiredMixin, View):
    """
    Logs out the user and displays 'You are logged out' message.
    Then redirects to the log-in page.
    """
    login_url = '/account/login/'

    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect('main-page')


class ProfileView(LoginRequiredMixin, View):
    """
    Shows user's profile and it's donations.
    Handles the taken and not taken donations.
    """
    login_url = '/account/login/'
    template_class = 'users/profile.html'
    context = {}

    def get(self, request, *args, **kwargs):
        donations = Donation.objects.filter(user=request.user.pk)
        profile = Profile.objects.get(pk=request.user.pk)
        self.context['donations'] = donations
        self.context['profile'] = profile
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        donation_pk = request.POST.get('donation_pk')
        try:
            donation_obj = Donation.objects.get(pk=donation_pk)
        except Donation.DoesNotExist:
            return redirect('profile', kwargs['pk'])

        donation_taken = request.POST.get('donation_taken')
        donation_not_taken = request.POST.get('donation_not_taken')
        if donation_taken == 'Zabrane':
            donation_obj.is_taken = True
            donation_obj.save()
        if donation_not_taken == 'Niezabrane':
            donation_obj.is_taken = False
            donation_obj.save()
        return redirect('profile', kwargs['pk'])


class ProfileEditView(LoginRequiredMixin, View):
    """
    Shows user's profile and forms for editing name, surname, email and password.
    Handles the forms and checks if are valid.
    """
    login_url = '/account/login/'
    template_class = 'users/profile-edit-form.html'
    form_edit_profile = ProfileEditForm
    context = {}

    def get(self, request, *args, **kwargs):
        user_pk = kwargs['pk']
        try:
            profile = Profile.objects.get(pk=user_pk)
        except Profile.DoesNotExist:
            return redirect('main-page')
        self.context['form_edit_profile'] = self.form_edit_profile(instance=profile)
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(pk=kwargs['pk'])
        form_edit_profile = self.form_edit_profile(request.POST, instance=profile)
        if form_edit_profile.is_valid():
            password = form_edit_profile.data['password']
            if profile.check_password(password):
                form_edit_profile.save()
                return redirect('profile-edit', profile.pk)
            messages.error(request, "Podane hasło jest niepoprawne.")
        self.context['form_edit_profile'] = form_edit_profile
        return render(request, self.template_class, self.context)
