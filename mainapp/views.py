from django.shortcuts import render, redirect
from django.views import View


class LandingPage(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'main.html')

    def post(self, request, *args, **kwargs):
        pass


class AddDonation(View):
    def get(self, request, *args, **kwargs):
        pass

    def post(self, request, *args, **kwargs):
        pass
