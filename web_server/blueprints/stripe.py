from flask import Blueprint, request, jsonify, session as s
from blueprints.middleware import login_required
from utils.user_utils import subscribe
import os, stripe

stripe_bp = Blueprint("stripe", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = ""

subscription = os.getenv("GANDER_SUBSCRIPTION")

@login_required
@stripe_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """
    Creates the stripe checkout session
    """
    print("Creating checkout session", flush=True)
    try:
        user_id = s.get("user_id")
        streamer_id = request.args.get("streamer_id")
        session = stripe.checkout.Session.create(
            ui_mode = 'embedded',
            payment_method_types=['card'],
            line_items=[
                {
                    'price': 'price_1QikNCGk6yuk3uA86mZf3dmM',
                    'quantity': 1,
                },
            ],
            mode='subscription',
            redirect_on_completion = 'never',
            client_reference_id = f"{user_id}-{streamer_id}"
        )
    except Exception as e:
        print(e, flush=True)
        return str(e), 500

    return jsonify(clientSecret=session.client_secret)

@stripe_bp.route('/session-status') # check for payment status
def session_status():
  """
  Used to query payment status
  """
  session = stripe.checkout.Session.retrieve(request.args.get('session_id'))

  return jsonify(status=session.status, customer_email=session.customer_details.email)

@stripe_bp.route('/stripe/webhook', methods=['POST'])
def stripe_webhook():
    """
    Webhook for handling stripe payments
    """
    event = None
    payload = request.data
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        raise e
    except stripe.error.SignatureVerificationError as e:
        raise e
    
    if event['type'] == "checkout.session.completed":
        session = event['data']['object']
        product_id = stripe.checkout.Session.list_line_items(session['id'])['data'][0]['price']['product']
        if product_id == subscription:
            client_reference_id = session.get("client_reference_id")
            user_id, streamer_id = client_reference_id.split("-")
            print(f"user_id: {user_id} is subscribing to streamer_id: {streamer_id}", flush=True)
            subscribe(user_id, streamer_id)

    return "Success", 200