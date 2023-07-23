from django.shortcuts import render
from django.http import HttpResponse
import PyPDF2
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.contrib.auth import authenticate, login, logout
import nltk
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User,PDF_HISTORY
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
import json


from .helpers import remove_references,Chatbot,summarizer,get_time_period
# Create your views here.

bot = Chatbot()


def landing_page(request):
    return render(request,'website/layout_auth.html')


@login_required
def index(request):
    # return render(request,'website/index.html')
    if request.user.is_authenticated:
        return render(request,'website/index_COPY.html')
    else:
        return HttpResponseRedirect(reverse("login"))
    
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "website/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "website/login.html")
    
def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "website/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "website/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "website/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("landing_page"))

@csrf_exempt
@login_required
def pdf_upload(request):
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']

        pdf_reader = PyPDF2.PdfReader(pdf_file)

        # Extract text from each page of the PDF
        extracted_text = ''
        for page in pdf_reader.pages:
            extracted_text += page.extract_text()

        # Process the PDF file here
        # code to show the summary here and send the summary as response

        #rempve references
        clean_text = remove_references(extracted_text)

        # summary = summarizer(clean_text)



        # Everytime pdf is uploaded first clear previous knowledge base and add new one
        bot.knowledge_base = None
        bot.initialize_knowledge_base(clean_text)
        summary = bot.summarizer()
        
        model_info = {
            'tokens': len(str(clean_text).split(' ')),
            'model_temperature' : 0.5,
            'model_prompt' : ''
        }


        # after this save the data in database
        obj = PDF_HISTORY(
            user=request.user,
            file_name=str(pdf_file),
            refined_doc_content = extracted_text,
            latest_summary = summary,
        )

        obj.save()

        return JsonResponse({'obj_id':obj.pk,'file_name':str(pdf_file),'summary':summary,'text':clean_text,'message':'Pdf Uploaded Successfully','model_info':model_info})
    elif request.method == "PUT":
        data = json.loads(request.body)
        text = data['text']
        temperature = data['temperature']
        custum_prompt = data['custom_prompt']

        aobj = PDF_HISTORY.objects.get(id=data['obj_id'])
        

        model_info = {
            'tokens': len(str(text).split(' ')),
            'model_temperature' : temperature,
            'model_prompt' : custum_prompt
        }

        # use previous knowledge base
        response = bot.custom_summarizer(prompt=custum_prompt,temperature=temperature,custom_prompt=custum_prompt)

        # response = summarizer(text,temperature,custum_prompt)
        # response = ''

        aobj.latest_summary = response
        aobj.save()

        obj = PDF_HISTORY.objects.filter()
        return JsonResponse({'summary':response,'model_info':model_info})

    else:
        return JsonResponse({'error': 'Invalid request'})
    
def user_data(request):
    if request.method == 'GET':
        if request.user:
            profile = request.user
            pdfs_len = PDF_HISTORY.objects.filter(user = profile).order_by('-updated').all()
            data = profile.serialize()
            data['greet'] = get_time_period()
            data['pdf_count'] = pdfs_len.count()
            data['pdfs'] = [pdf.serialize() for pdf in pdfs_len]

            
            
            return JsonResponse(data)
        else:
            return JsonResponse({'error':'User not Logged In'})
    else:
        return HttpResponse({'message':'Only Get Request Allowed'}) 
@csrf_exempt
@login_required
def chatbot(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question = data['question']

        answer = bot.chat(question)
        # answer = ''

        return JsonResponse({'response':answer})
    else:
        return HttpResponse({'message':'Only Get Request Allowed'}) 
    
@csrf_exempt
def pdf(request,pdf_id):
    if request.method == 'GET':
        try:
            obj = PDF_HISTORY.objects.get(id=pdf_id)
        except:
            return JsonResponse({'message':'No pdf with this id'})
        
        return JsonResponse(obj.serialize())
    else:
        return HttpResponse({'message':'Only GET method allowed.'})
    




    




