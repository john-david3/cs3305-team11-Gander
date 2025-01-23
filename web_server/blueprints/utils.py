from flask import redirect, url_for, request, g, session
from functools import wraps

def logged_in_user():
    g.user = session.get("username", None)
    g.admin = session.get("username", None)

def login_required(view):
    """add at start of routes where users need to be logged in to access"""
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

def admin_required(view):
    """add at start of routes where admins need to be logged in to access"""
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.admin != "admin":
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view