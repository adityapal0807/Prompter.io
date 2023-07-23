from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

# Create your models here.
class User(AbstractUser):
    pass
    # profession = models.CharField(max_length=20,null=True,blank=True)

    def serialize(self):
        return ({
            'id': self.pk,
            'username' : self.username,
            #'profession' : self.profession if hasattr(self,'profession') else None
            'email' : self.email,
            'date_joined':self.date_joined,
        })

class PDF_HISTORY(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_registered')
    file_name = models.CharField(max_length=1000)
    refined_doc_content = models.TextField(max_length=50000)
    latest_summary = models.TextField(max_length=10000)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def serialize(self):
        return ({
            'id':self.pk,
            'user':self.user.username,
            'filename':self.file_name,
            'refinedDocContent':self.refined_doc_content,
            'latestSummary':self.latest_summary,
            'createdOn':datetime.fromisoformat(str(self.created)[:-6]).strftime('%Y-%m-%d %H:%M:%S'),
            'updatedOn': datetime.fromisoformat(str(self.created)[:-6]).strftime('%Y-%m-%d %H:%M:%S')

        })
    