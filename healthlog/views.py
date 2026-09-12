from django.shortcuts import get_object_or_404, redirect, render

from .forms import HealthEntryForm
from .models import HealthEntry


def entry_list(request):
    entries = HealthEntry.objects.all()
    return render(request, 'healthlog/entry_list.html', {'entries': entries})


def entry_create(request):
    if request.method == 'POST':
        form = HealthEntryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('healthlog:entry_list')
    else:
        form = HealthEntryForm()
    return render(request, 'healthlog/entry_form.html', {'form': form})


def entry_edit(request, pk):
    entry = get_object_or_404(HealthEntry, pk=pk)
    if request.method == 'POST':
        form = HealthEntryForm(request.POST, instance=entry)
        if form.is_valid():
            form.save()
            return redirect('healthlog:entry_list')
    else:
        form = HealthEntryForm(instance=entry)
    return render(request, 'healthlog/entry_form.html', {'form': form, 'entry': entry})


def entry_delete(request, pk):
    entry = get_object_or_404(HealthEntry, pk=pk)
    if request.method == 'POST':
        entry.delete()
        return redirect('healthlog:entry_list')
    return render(request, 'healthlog/entry_confirm_delete.html', {'entry': entry})
