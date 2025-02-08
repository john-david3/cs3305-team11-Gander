from flask import Blueprint
from blueprints.middleware import admin_required

admin_bp = Blueprint("admin", __name__)

@admin_required
@admin_bp.route('admin/delete_user/<int:user_id>')
def admin_delete_user(user_id):
    return