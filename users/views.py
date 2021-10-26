from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.models import Site
from django.shortcuts import redirect, render
from django.views import View

from project import settings
from users.forms import CustomUserCreationForm, LoginForm
# from django.contrib.auth.views import LogoutView


class RegisterView(View):
    """
    Create the user account and also log in.
    """
    form_class = CustomUserCreationForm
    template_class = 'users/register.html'
    context = {}

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            messages.error(request, f'You are already authenticated as {request.user}')
            return redirect('main-page')
        self.context['registration_form'] = self.form_class
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.site = Site.objects.get(pk=settings.SITE_ID)
            profile.save()
            messages.success(request, 'Account has been created!')
            return render(request, self.template_class, self.context)

        messages.error(request, 'Something gone wrong. Please try again.')
        self.context['registration_form'] = form
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
            messages.error(request, "Sorry you're already logged-in!")
            return redirect('main-page')

        self.context['form'] = self.form_class
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email'].lower()
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('main-page')
        self.context['form'] = form
        messages.error(request, "There was an error. Please try with the correct username or password.")
        return render(request, self.template_class, self.context)


class LogoutView(LoginRequiredMixin, View):
    """
    Logs out the user and displays 'You are logged out' message.
    Then redirects to the log-in page.
    """
    login_url = 'login/'

    def get(self, request, *args, **kwargs):
        logout(request)
        messages.info(request, 'You are logged out!')
        return redirect('main-page')
