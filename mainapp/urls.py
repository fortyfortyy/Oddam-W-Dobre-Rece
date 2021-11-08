from django.urls import path
from mainapp import views as ex_views


urlpatterns = [
    path('', ex_views.LandingPageView.as_view(), name='main-page'),
    path('add-donation/', ex_views.AddDonationView.as_view(), name='add-donation')
]
