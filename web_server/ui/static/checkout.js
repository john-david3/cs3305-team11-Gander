const stripe = Stripe("pk_test_51QikGlGk6yuk3uA8MT3uQrPMpUqJlKzkxfbrfrd34yXolWSbJYEFWm674s2aUydZyjjS0W2oByEJTV0LXMs1pWTk002ioHxQl6");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}