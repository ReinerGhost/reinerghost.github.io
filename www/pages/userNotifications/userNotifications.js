(function () {

    var notificationsSubscriptionFields = [
        'subscription_updates',
        'subscription_lemonade',
        'subscription_promos',
        ];
    var notificationsTextFields = [
        'subscription_text_delivery',
        'subscription_text_pickup',
        'subscription_text_driver_arrival',
        'subscription_text_concierge',
    ];

    userNotifications = new Page('userNotifications', function (name) {
        let self = this;
        // console.log(name);
        let UserData = getUserData();
        fetch(helper.app.HomeSite + "/mobile-app-notifications?user_id=" + UserData['user_id'], {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                renderPage.call(self, data);
            });
        //console.log(response);
    });

    function renderPage(notificationsData) {
        let self = this;
        let UserData = getUserData();
        self.render({notificationsSubscriptionFields, notificationsTextFields, notificationsData}, function (){
            let inputs = document.querySelectorAll('.notifications__item input[type="checkbox"]');
            let notificationsFormData = new FormData();
            notificationsFormData.set('user_id', UserData['user_id']);
            inputs.forEach(function(el){
                el.addEventListener('change', function(){
                    notificationsFormData.set(this.id, +this.checked);
                    fetch(helper.app.HomeSite + "/mobile-app-notifications", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                        },
                        body: notificationsFormData
                    }).then(response => response.json())
                    .then(data => {
                          // console.log(data);
                    });
                });
                notificationsFormData.set(el.id, +el.checked);
            });
            // console.log(Array.from(notificationsFormData));
        });
    }

})()
