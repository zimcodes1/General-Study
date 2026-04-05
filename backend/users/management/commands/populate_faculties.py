from django.core.management.base import BaseCommand
from users.faculty_models import Faculty, Department

class Command(BaseCommand):
    help = 'Populate faculties and departments'

    def handle(self, *args, **kwargs):
        faculties_data = {
            'Natural and Applied Sciences': [
                'Computer Science',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'Biochemistry',
                'Microbiology',
                'Statistics',
            ],
            'Law': [
                'Common Law',
                'Civil Law',
                'Islamic Law',
            ],
            'Agriculture': [
                'Agricultural Economics',
                'Agronomy',
                'Animal Science',
                'Crop Science',
                'Soil Science',
                'Agricultural Extension',
            ],
            'Engineering': [
                'Civil Engineering',
                'Mechanical Engineering',
                'Electrical Engineering',
                'Chemical Engineering',
                'Computer Engineering',
                'Petroleum Engineering',
            ],
            'Social Sciences': [
                'Economics',
                'Political Science',
                'Sociology',
                'Psychology',
                'Geography',
                'Mass Communication',
            ],
            'Arts': [
                'English',
                'History',
                'Philosophy',
                'Linguistics',
                'Theatre Arts',
                'Music',
            ],
            'Education': [
                'Educational Management',
                'Curriculum Studies',
                'Educational Psychology',
                'Adult Education',
            ],
            'Medicine': [
                'Medicine and Surgery',
                'Nursing',
                'Pharmacy',
                'Physiotherapy',
                'Medical Laboratory Science',
            ],
            'Management Sciences': [
                'Accounting',
                'Business Administration',
                'Banking and Finance',
                'Marketing',
                'Insurance',
            ],
        }

        for faculty_name, departments in faculties_data.items():
            faculty, created = Faculty.objects.get_or_create(name=faculty_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created faculty: {faculty_name}'))
            
            for dept_name in departments:
                dept, created = Department.objects.get_or_create(
                    name=dept_name,
                    faculty=faculty
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'  Created department: {dept_name}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated faculties and departments'))
