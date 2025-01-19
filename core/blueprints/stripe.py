from flask import render_template, Blueprint, request, jsonify

import stripe

stripe_bp = Blueprint("stripe", __name__)

stripe.api_key = 'sk_test_51QikGlGk6yuk3uA8muEMPjMhUvbZWZiMCYQArZRXcFVn26hbt1kTz5yUVWkk3RQlltArbAXmVmkfEHU2z1Ch5Obv00Y03oT127'

@stripe_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
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
            mode='subscription',
            redirect_on_completion = 'never'
        )
    except Exception as e:
        print(e)
        return str(e)

    return jsonify(clientSecret=session.client_secret)

@stripe_bp.route('/session-status', methods=['GET']) # check for payment status
def session_status():
  session = stripe.checkout.Session.retrieve(request.args.get('session_id'))

  return jsonify(status=session.status, customer_email=session.customer_details.email)

@stripe_bp.route('/checkout', methods=['GET'])
def checkout():
    return render_template("checkout.html")