from django.shortcuts import render
from .models import TeamMember


def index(request):
    teamMembers = TeamMember.objects.all()
    return render(request, 'navapp/index.html', { 'teamMembers' : teamMembers})
