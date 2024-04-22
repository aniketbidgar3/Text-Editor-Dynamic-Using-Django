from django.urls import path

from .views import HomePageView, AboutPageView ,LoginPageView 
#add LoginPageView in import

urlpatterns = [
    path("", LoginPageView.as_view(), name="login"),
    path("home/", HomePageView.as_view(), name="home"),
    path("about/", AboutPageView.as_view(), name="about"),
]
