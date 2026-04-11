from django.core.management.base import BaseCommand
from catalogues.models import Catalogue, Topic, QuizQuestion


class Command(BaseCommand):
    help = 'Migrate content_json subtopics and quiz questions to Topic and QuizQuestion models'

    def handle(self, *args, **options):
        catalogues = Catalogue.objects.all()
        
        if not catalogues.exists():
            self.stdout.write(self.style.WARNING('No catalogues found'))
            return
        
        total_topics_created = 0
        total_questions_created = 0
        
        for catalogue in catalogues:
            self.stdout.write(f'\nProcessing catalogue: {catalogue.title}')
            
            content_json = catalogue.content_json or {}
            subtopics = content_json.get('subtopics', [])
            summaries = content_json.get('summaries', [])
            quiz_questions = content_json.get('quiz_questions', [])
            
            if not subtopics:
                self.stdout.write(self.style.WARNING(f'  No subtopics found in {catalogue.title}'))
                continue
            
            # Create Topics for each subtopic
            created_topics = []
            for order, subtopic_title in enumerate(subtopics):
                summary = summaries[order] if order < len(summaries) else ''
                
                # Check if topic already exists
                topic, created = Topic.objects.get_or_create(
                    catalogue=catalogue,
                    order=order,
                    defaults={
                        'title': subtopic_title,
                        'content': summary,  # Use summary as content
                        'summary': summary,
                    }
                )
                
                if created:
                    total_topics_created += 1
                    self.stdout.write(f'  ✓ Created topic: {subtopic_title}')
                else:
                    self.stdout.write(f'  ~ Topic already exists: {subtopic_title}')
                
                created_topics.append(topic)
            
            # Distribute quiz questions across topics
            if quiz_questions and created_topics:
                questions_per_topic = max(1, len(quiz_questions) // len(created_topics))
                
                for question_order, question_data in enumerate(quiz_questions):
                    # Distribute questions across topics
                    topic_index = min(question_order // questions_per_topic, len(created_topics) - 1)
                    topic = created_topics[topic_index]
                    
                    # Extract question data
                    question_text = question_data.get('question', '')
                    options = question_data.get('options', [])
                    correct_answer = question_data.get('answer', '')
                    explanation = question_data.get('explanation', '')
                    
                    # Check if question already exists
                    quiz_q, created = QuizQuestion.objects.get_or_create(
                        topic=topic,
                        question=question_text,
                        defaults={
                            'options': options,
                            'correct_answer': correct_answer,
                            'explanation': explanation,
                            'order': question_order % questions_per_topic,
                        }
                    )
                    
                    if created:
                        total_questions_created += 1
                        self.stdout.write(f'    ✓ Created question: {question_text[:50]}...')
        
        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS(
            f'Migration complete!\n'
            f'Topics created: {total_topics_created}\n'
            f'Questions created: {total_questions_created}'
        ))
