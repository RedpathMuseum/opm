from django.contrib import admin

from .models import Tour
from .models import Render
from .models import Paragraph

class ParagraphInline(admin.TabularInline):
    model = Paragraph

class TourAdmin(admin.ModelAdmin):
    inlines = [ ParagraphInline ]

admin.site.register(Tour, TourAdmin)
admin.site.register(Render)
admin.site.register(Paragraph)
