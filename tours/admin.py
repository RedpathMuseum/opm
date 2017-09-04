from django.contrib import admin

from .models import Tour
from .models import Render
from .models import Paragraph
from .models import Image
from .models import Video
from .models import Annotation
from .models import TourGroup

class ParagraphInline(admin.TabularInline):
    model = Paragraph
    extra = 0

class ImageInline(admin.TabularInline):
    model = Image
    extra = 0

class VideoInline(admin.TabularInline):
    model = Video
    extra = 0

class AnnotationInline(admin.TabularInline):
    model = Annotation
    extra = 0
    max_num = 0
    # template = './admin/tours/annotations/custom-annot-inline.html'


class TourAdmin(admin.ModelAdmin):
    inlines = [ ParagraphInline, ImageInline, VideoInline, AnnotationInline]

admin.site.register(Tour, TourAdmin)
admin.site.register(Render)
admin.site.register(Paragraph)
admin.site.register(Image)
admin.site.register(Video)
admin.site.register(TourGroup)
