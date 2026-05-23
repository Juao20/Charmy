from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "is_premium", "premium_until", "created_at"]
    search_fields = ["email"]
    ordering = ["-created_at"]