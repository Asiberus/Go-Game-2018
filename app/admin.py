from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
   list_display   = ('name', 'channel_id', 'isInGame', )
   list_filter    = ('isInGame', )


admin.site.register(User, UserAdmin)
