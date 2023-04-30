from django import forms
from config.models import User

class PrivateUserForm(forms.ModelForm):
    class Meta:
        model=User
        fields='__all__'
        #exclude = ()
