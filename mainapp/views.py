from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.views import View
from mainapp.models import Institution, Donation, Category
from mainapp.forms import FooterForm, DonationForm
from django.contrib import messages

from django.core.mail import EmailMessage


class LandingPageView(View):
    """
    Returns main page.
    Handles the data from the contact form.
    """
    footer_form = FooterForm
    template_class = 'main.html'
    context = {}

    def get(self, request, *args, **kwargs):
        institutions = Institution.objects.all()
        donations = Donation.objects.all()
        donations_quantity = 0
        institutions_quantity = []
        for donation in donations:
            donations_quantity += donation.quantity
            institution = donation.institution
            if institution not in institutions_quantity:
                institutions_quantity.append(institution)

        self.context['institutions_quantity'] = len(institutions_quantity)
        self.context['donations_quantity'] = donations_quantity
        self.context['institutions'] = institutions
        self.context['footer_form'] = FooterForm
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        """
        Handles the contact form and send an email to the staff
        """
        form = self.footer_form(request.POST)
        if form.is_valid():
            user_name, user_email, user_message = form.cleaned_data.values()
            subject = f'Pytanie od użytkownika w Oddam w Dobre Ręce'
            message = render_to_string('emails/contact_email.html', {
                'user_name': user_name,
                'user_email': user_email,
                'user_message': user_message,
            })
            mail = EmailMessage(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                ['fzj21628@boofx.com'],
            )
            mail.send()
            messages.success(request, "Formularz kontaktowy został przesłany. Prosimy czekać na odpowiedź.")
            return redirect('main-page')

        self.context['footer_form'] = form
        messages.error(request, "Formularz został nieprawidłowo wypełniony. Prosimy spróbować ponownie.")
        return render(request, self.template_class, self.context)


class AddDonationView(LoginRequiredMixin, View):
    """
    Main function handling the data from the donation form.
    """
    login_url = '/account/login/'
    donation_form = DonationForm
    template_form_class = 'mainapp/form.html'
    template_confirmation_form_class = 'mainapp/form-confirmation.html'
    context = {}

    def get(self, request, *args, **kwargs):
        institutions = Institution.objects.all()
        categories = Category.objects.all()
        self.context['institutions'] = institutions
        self.context['categories'] = categories
        self.context['donation_form'] = DonationForm
        return render(request, self.template_form_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.donation_form(request.POST)
        if form.is_valid():
            institution = form.cleaned_data.get('institution')
            categories = form.cleaned_data.get('categories')
            donation = form.save(commit=False)
            donation.user = request.user
            donation.institution = institution
            donation.save()
            for category in categories:
                donation.categories.add(category)
            messages.success(request, "Wniosek został przesłany prawidłowo! Dziękujemy!")
            return redirect('main-page')
        messages.error(request, "Formularz został nieprawidłowo wypełniony. Prosimy spróbować jeszcze raz.")
        return redirect('add-donation')
