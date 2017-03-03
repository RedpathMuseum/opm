from django.contrib import admin

from .models import Tour
from .models import Render
from .models import Paragraph
from .models import Image
from .models import Annotation

class ParagraphInline(admin.TabularInline):
    model = Paragraph

class ImageInline(admin.TabularInline):
    model = Image

class TourAdmin(admin.ModelAdmin):
    inlines = [ ParagraphInline, ImageInline ]

admin.site.register(Tour, TourAdmin)
admin.site.register(Render)
admin.site.register(Paragraph)
admin.site.register(Image)
