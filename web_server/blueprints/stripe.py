from flask import Blueprint, request, jsonify
import os, stripe

stripe_bp = Blueprint("stripe", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@stripe_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """
    Creates the stripe checkout session
    """
    print("Creating checkout session")
    try:
        session = stripe.checkout.Session.create(
            ui_mode = 'embedded',
            payment_method_types=['card'],
            line_items=[
                {
                    'price': 'price_1QikNCGk6yuk3uA86mZf3dmM', #Subscription ID
                    'quantity': 1,
                },
            ],
            mode='payment',
            redirect_on_completion = 'never'
        )
    except Exception as e:
        print(e)
        return str(e)

    return jsonify(clientSecret=session.client_secret)

@stripe_bp.route('/session-status', methods=['GET']) # check for payment status
def session_status():
  """
  Used to query payment status
  """
  session = stripe.checkout.Session.retrieve(request.args.get('session_id'))

  return jsonify(status=session.status, customer_email=session.customer_details.email)
