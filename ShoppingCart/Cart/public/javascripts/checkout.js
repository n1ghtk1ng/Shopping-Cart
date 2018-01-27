// Create a Stripe client
var stripe = Stripe('pk_test_dxEe7bQZy9baJyD90Zx98bOz');

// Create an instance of Elements
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
    base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
    var displayError = $('#card-errors');
    if (event.error) {

        displayError.text(event.error.message);
        displayError.removeClass("hidden");
    } else {
        displayError.addClass("hidden");
        displayError.text('');
    }
});

function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
}

// Handle form submission
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    var extraDetails = {
        name: $('#card-name').value,
    };
    stripe.createToken(card,extraDetails).then(function(result) {
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = $('#card-errors');
            errorElement.text(result.error.message);
            errorElement.removeClass("hidden");
        } else {
            // Send the token to your server
            stripeTokenHandler(result.token);
        }
    });
});
