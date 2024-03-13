from django import forms

class CommentForm(forms.Form):
    text = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'Write your comment here...'}))
