from django import template

register = template.Library()


@register.filter(name="initial")
def initial(username):
    username = str(username)
    return f"{username[:1].capitalize()}"
