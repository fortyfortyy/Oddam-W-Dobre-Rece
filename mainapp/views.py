from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.views import View
from mainapp.models import Institution, Donation, Category
from mainapp.forms import FooterForm, DonationForm
from django.contrib import messages
from users.models import Profile


class LandingPageView(View):
    footer_form = FooterForm
    template_class = 'main.html'
    context = {}

    def get(self, request, *args, **kwargs):
        institutions = Institution.objects.all()
        donations = Donation.objects.all()
        donations_quantity = 0
        for donation in donations:
            donations_quantity += donation.quantity

        self.context['institutions'] = institutions
        self.context['donations_quantity'] = donations_quantity
        self.context['footer_form'] = FooterForm
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.footer_form(request.POST)
        if form.is_valid():
            name, surname, user_message = form.cleaned_data.values()
            messages.success(request, "Formularz kontaktowy został przesłany. Prosimy czekać na odpowiedź")
            # TODO send an contact email to the staff
            return redirect('main-page')

        self.context['footer_form'] = form
        messages.error(request, "Formularz został nieprawidłowo wypełniony. Prosimy spróbować ponownie")
        return render(request, self.template_class, self.context)


class AddDonationView(LoginRequiredMixin, View):
    footer_form = FooterForm
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
        self.context['footer_form'] = FooterForm
        self.context['donation_form'] = DonationForm
        return render(request, self.template_form_class, self.context)

    def post(self, request, *args, **kwargs):
        form = self.donation_form(request.POST)
        breakpoint()
        if form.is_valid():
            breakpoint()

            # Institution check
            institution = request.POST.get('organization')
            try:
                institution = Institution.objects.get(pk=institution.pk)
            except Institution.DoesNotExist:
                messages.error(request, "Formularz jest niepoprawny, proszę spóbowac ponownie")
                return redirect('add-donation')

            # Category check
            categories = request.POST.getlist('categories')
            for category in categories:
                try:
                    category = Category.objects.get(pk=category.pk)
                except Category.DoesNotExist:
                    messages.error(request, "Formularz jest niepoprawny, proszę spóbowac ponownie")
                    return redirect('add-donation')

            donation = form.save(commit=False)
            donation.user = request.user
            donation.institution = institution
            for category in categories:
                donation.categories.add(category)
            donation.save()
            return render(request, self.template_confirmation_form_class)

        # TODO pokazanie błędów w formularzu
        return redirect('add-donation')


