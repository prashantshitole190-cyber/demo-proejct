import re
from django.utils.text import slugify

def calculate_read_time(content):
    """Calculate estimated read time based on content length"""
    words = len(re.findall(r'\w+', content))
    return max(1, words // 200)  # Assuming 200 words per minute

def generate_unique_slug(title, model_class):
    """Generate a unique slug for a model"""
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    
    while model_class.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug