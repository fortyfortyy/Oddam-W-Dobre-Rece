from django.shortcuts import render, redirect
from django.views import View


class LandingPage(View):
    form_class = ''
    template_class = 'main.html'
    context = {}

    def get(self, request, *args, **kwargs):
        self.context['add_donation'] = True
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        pass


class AddDonation(View):
    form_class = ''
    template_class = 'mainapp/form.html'
    context = {}

    def get(self, request, *args, **kwargs):
        self.context['form_confirmation'] = True
        return render(request, self.template_class, self.context)

    def post(self, request, *args, **kwargs):
        pass
