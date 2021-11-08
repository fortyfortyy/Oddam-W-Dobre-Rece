from django.urls import path

from users import views as ex_views

urlpatterns = [
    path('register/', ex_views.RegisterView.as_view(), name='register'),
    path('login/', ex_views.LoginView.as_view(), name='login'),
    path('logout/', ex_views.LogoutView.as_view(), name='logout'),
    path('profile/<str:pk>', ex_views.ProfileView.as_view(), name='profile'),
    path('profile/<str:pk>/settings', ex_views.ProfileEditView.as_view(), name='profile-edit'),
]
