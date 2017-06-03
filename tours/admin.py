from django.contrib import admin

from .models import Tour
from .models import Render
from .models import Paragraph
from .models import Image
from .models import Annotation

class ParagraphInline(admin.TabularInline):
    model = Paragraph
    extra = 0

class ImageInline(admin.TabularInline):
    model = Image
    extra = 0

class AnnotationInline(admin.TabularInline):
    model = Annotation
    extra = 0
    max_num = 0
    # template = './admin/tours/annotations/custom-annot-inline.html'


class TourAdmin(admin.ModelAdmin):
    inlines = [ ParagraphInline, ImageInline, AnnotationInline]

admin.site.register(Tour, TourAdmin)
admin.site.register(Render)
admin.site.register(Paragraph)
admin.site.register(Image)
