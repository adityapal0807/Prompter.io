from django.urls import path
from . import views

urlpatterns=[
    path("", views.landing_page, name="landing_page"),
    path("dashboard", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),


    #API ROUTES
    path('api/pdf_upload',views.pdf_upload),
    path('api/user_data',views.user_data),
    path('api/chat',views.chatbot),
    path('api/pdf/<str:pdf_id>',views.pdf)
]