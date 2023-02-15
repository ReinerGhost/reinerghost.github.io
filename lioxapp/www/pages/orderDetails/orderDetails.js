var dataProofs = null;

function displaySignature() {

    if (dataProofs.signature != null) {

        $('#signature_signed_by').html(dataProofs.signature.signed_by);
        $('#signature_created_at').html(dataProofs.signature.created_at);
        $('#signature_image').html('<img src="' + dataProofs.signature.path + '" style="width: 100%"/>');

        document.getElementById('signature-modal').setAttribute('data-modal-state', 'open');
    }
}

function displayProof(proofId) {

    $('#picture_proof_created_at').html('');
    $('#picture_proof_image').html('');

    console.log(dataProofs);

    if (dataProofs.picture_proofs != null) {
        let isFound = false;
        for(var i = 0; i < dataProofs.picture_proofs.length; i++) {
            if (proofId == dataProofs.picture_proofs[i].id) {
                $('#picture_proof_created_at').html(dataProofs.picture_proofs[i].created_at);
                $('#picture_proof_image').append('<div style="padding: 10px 0;"><img src="' + dataProofs.picture_proofs[i].path + '" style="width: 100%"/></div>');
                isFound = true;
            }
        }
        if (isFound) {
            document.getElementById('picture-proof-modal').setAttribute('data-modal-state', 'open');
        }
    }

}

(function () {

    orderDetails = new Page('orderDetails', function (name) {

        console.log("app-step-0");

        var self = this;
        let User = getUserData();

        // fetch('https://www.cleanlogistics.co/get-proof?order_id=' + orderDetailsId)
        fetch('https://www.cleanlogistics.co/get-proof?order_token=' + orderDetailsToken)
            .then(res => {
                if (!res.ok) {
                    throw new Error(); // Will take you to the `catch` below
                }
                return res.json();
            })
            .then(function(dataProof) {

                dataProofs = dataProof;

                $.ajax({
                    type: 'POST',
                    url: "../../mobile-get-order-details",
                    data: {
                        'id': orderDetailsId,
                        'user_id': User.user_id
                    },
                    success: function (response) {

                        ordersHistory = response.orders_history;
                        orderDetailsInfo = response.order_details;

                        self.render({'ordersHistory': ordersHistory, 'orderDetailsInfo': orderDetailsInfo, 'orderDetailsId': orderDetailsId, 'orderDetailsToken': orderDetailsToken, 'dataProof': dataProof}, function () {

                            $('.logout').click(function () {
                                $.ajax({
                                    type: "POST",
                                    url: helper.app.HomeSite + '/mobile-home',
                                    data: { 'username': '', 'password': '', 'service': 'logout' },
                                    success: function (r, b, c) {
                                        // console.log(r, b, c);
                                        localStorage.removeItem('userData');
                                        getOrderUid();
                                        window.location.hash = "/login";
                                    },
                                    error: function (v) {
                                        // console.log(v);
                                        if (window.plugins) {
                                            window.plugins.toast.showShortBottom('Error. Problems with the network connection');
                                        }
                                    },
                                    timeout: 5000
                                });
                            });

                        });
                    },
                    error: function(err) {
                        console.error('Error get order details');
                    }
                });

            });
    });

})();
