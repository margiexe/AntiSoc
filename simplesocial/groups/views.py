from django.shortcuts import render
from django.contrib import messages
from django.db import IntegrityError
from django.urls import reverse_lazy
# Create your views here.
from django.contrib.auth.mixins import (LoginRequiredMixin,
                                        PermissionRequiredMixin)
from django.urls import reverse
from django.views import generic
from django.shortcuts import get_object_or_404
from . models import Group,GroupMember
from . import models

class CreateGroup(LoginRequiredMixin,generic.CreateView):
    fields = ('name','description')
    model = Group
    
class SingleGroup(generic.DetailView):
    model = Group
    
class ListGroups(generic.ListView):
    model = Group

class JoinGroup(LoginRequiredMixin,generic.RedirectView):
    def get_redirect_url(self, *args, **kwargs):
        return reverse('groups:single',kwargs={'slug':self.kwargs.get('slug')})
    def get(self,request,*args, **kwargs):
        group = get_object_or_404(Group,slug=self.kwargs.get('slug'))
        try:
            GroupMember.objects.create(user=self.request.user,group=group)
        except IntegrityError:
            messages.warning(self.request,('warning already a member!'))
        else:
            messages.success(self.request,'you are now a member!')
        return super().get(request,*args, **kwargs)
    
class LeaveGroup(LoginRequiredMixin,generic.RedirectView):
    def get_redirect_url(self, *args, **kwargs):
        return reverse('groups:single',kwargs={'slug':self.kwargs.get('slug')})
    def get(self, request, *args, **kwargs):
        try:
            membership = models.GroupMember.objects.filter(
                user=self.request.user,
                group__slug=self.kwargs.get('slug')
            ).get()
        except models.GroupMember.DoesNotExist:
            messages.warning(self,request,'sorry you are not in the group')
        else:
            membership.delete() 
            messages.success(self.request,'you have left the group')
        return super().get(request,*args, **kwargs)
    
class DeleteGroup(LoginRequiredMixin,generic.DeleteView):
    model = models.Group
    select_related = ('user','group')
    success_url = reverse_lazy('groups:all')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user_id=self.request.user.id)
    
    def delete(self,*args, **kwargs):
        messages.success(self.request,'Group Deleted')
        return super().delete(*args, **kwargs)