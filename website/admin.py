from django.contrib import admin
from .models import User,PDF_HISTORY

# Register your models here.
admin.site.register(User)
admin.site.register(PDF_HISTORY)
