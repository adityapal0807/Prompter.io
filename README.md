# Medical Research Paper Summarizer and GPT-3 Chatbot Web Application

## Overview

This web application allows users to upload medical research papers in PDF format and leverage the power of Langchain and OpenAI's GPT-3 to summarize the document and interact with its contents using a chatbot. The application is built using Django for the API and REST framework for the frontend. It comprises two major features: Summarizer and GPT Prompter.

## Project Working Snippets

![Home Page](Github_Snippets\1.png) ![Dashboard](Github_Snippets\2.png) ![Summarizer](Github_Snippets\3.png) ![GPT Prompter](Github_Snippets\4.png)

## Distinctiveness and Complexity

### 1. Summarizer

The Summarizer feature takes a medical research paper uploaded by the user and generates a summary. It offers the following functionalities:

#### Default Summary

The application provides a default summary generated using the Langchain algorithm. This summary is designed to capture the main points and key findings from the research paper.

#### Parameter Tuning

Users can adjust the summary generation parameters according to their preferences:

- Factual: Generates a concise and factual summary.
- Moderate: Provides a balanced summary with both factual and contextual information.
- Intelligent: Creates a more elaborate summary with deeper insights.
- Custom Prompt: Allows users to input their custom prompts for generating the summary.

#### Summary Saving

Each generated summary is saved in the database, allowing users to access and refer to their summarized papers in the future.

### 2. GPT Prompter (Chatbot)

The GPT Prompter feature allows users to interact with the contents of the research paper using a chatbot powered by OpenAI's GPT-3. Users can ask questions and seek information from the document, and the chatbot will respond with relevant answers.

## Technologies Used

The web application is built using the following technologies:

- Django: Backend framework to handle API and database operations.
- HTML, CSS, and JavaScript: Frontend development for user interface and interaction.
- Django REST Framework: Used for building RESTful APIs and managing frontend interactions.
- Langchain: Algorithm used for generating default summaries from medical research papers.
- OpenAI GPT-3: Language model used to power the interactive chatbot.

## Installation

To set up and run the web application locally, follow these steps:

1. Clone the repository from GitHub.
2. Install the required dependencies using `pip install -r requirements.txt`.
3. Configure the Django settings, such as database settings and API keys for Langchain and OpenAI GPT-3.
4. Configure a .env file containing your OpenAi Api Key `OPENAI_API_KEY = 'your openai api key`
5. Run the Django development server using `python manage.py runserver`.
6. Access the application through your web browser at `http://localhost:8000`.

## Authentication

To ensure security and privacy, the web application requires user authentication as the first step. This can be achieved through Django's built-in authentication system, allowing users to create accounts and log in securely.

## Support

For any issues or inquiries regarding the application, please contact adityapal0807@gmail.com 
