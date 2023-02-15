(function () {
    var months = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 },
        detergent = { 'TIDE': 0, 'ARM & HAMMER': 1, 'SEVENTH GENERATION': 2 }, softener = { 'NONE': 0, 'DOWNY': 1, 'BOUNCE': 2, 'DOWNY FREE SENSITIVE': 3 },
        apartment = { 'Studio': 1, '1BR': 2, '2BR': 3, '3BR': 4 };
        lastOrder = new Page('lastOrder', function () {
            var userData = getUserData();
            // console.log(userData);
        if (localStorage.getItem('lastOrder') != null || userData['service'] != null) {
            if(localStorage.getItem('lastOrder') != null){
                var data = JSON.parse(localStorage.getItem('lastOrder')), self = this;
                self.render({ 'data': data['data'], 'data_time_info': data['data_time_info'], 'total': data['total'], 'goBack': data['goBack'] }, function () {
                    //focus fixed
                    if (!globalData['event_native_keyboardshow_exist']) {

                        globalData['event_native_keyboardshow_exist'] = true;

                        window.addEventListener("native.keyboardshow", function (e) {
                            $('.onFocusHide').hide();
                        }, false);
                        window.addEventListener("native.keyboardhide", function (e) {
                            $('.onFocusHide').show();
                        }, false);
                    }
                    // console.log("Service " + data['goBack']);
                });
            } else if(userData['service'] != null){
                self = this;
                //var data = new Array();
                var data = [];
                data['data'] = [];
                data['data_time_info'] = [];
                data['data'][0] = [];
                data['data'][1] = [];
                data['data'][2] = [];
                data['data'][3] = [];
                data['data'][4] = [];
                data['data'][5] = [];
                data['total'] = userData['total'];
                data['data'][5]['name'] = 'tips';
                data['data'][5]['value'] = userData['tips'];
                data['trans_status'] = userData['trans_status'];
                data['washing_status'] = userData['wash_status'];

                if(userData['service'] == 'wash'){

                    var res = userData['detergent'].split(",");
                    data['data'][0]['text'] = 'Detergent';
                    data['data'][0]['value'] = res[0];
                    if(res[1] && (res[1].toLowerCase().includes("downy") || res[1].toLowerCase().includes("bounce") || res[1].toLowerCase().includes("liox"))){
                        data['data'][1]['text'] = 'Softener';
                        data['data'][1]['value'] = res[1];
                    } else if(res[1] && res[1].toLowerCase().includes("clorox")){
                        data['data'][1]['text'] = 'Additional';
                        data['data'][1]['value'] = res[1];
                    }
                    if(res[2]){
                        data['data'][2]['text'] = 'Additional';
                        data['data'][2]['value'] = res[2];
                    }


                    var pick_str = dateConvert(userData['pick_up_date'].substring(0, 10));
                    var drop_str = dateConvert(userData['drop_off_date'].substring(0, 10));

                    data['data_time_info']['instruction'] = userData['instructions'];
                    data['data_time_info']['pickup'] = userData['pick_up_date'];
                    data['data_time_info']['pickup-day'] = pick_str;
                    data['data_time_info']['pickup-time'] = tConvert(userData['pick_up_date'].substring(11, 16));
                    data['data_time_info']['pickup-title'] = 'PICK UP';

                    data['data_time_info']['dropoff'] = userData['drop_off_date'];
                    data['data_time_info']['dropoff-day'] = drop_str;
                    data['data_time_info']['dropoff-time'] = tConvert(userData['drop_off_date'].substring(11, 16));
                    data['data_time_info']['dropoff-title'] = 'DROP OFF';

                } else if(userData['service'] == 'dryclean'){
                    data['data'][0]['text'] = 'Dry Cleaning';
                    data['data'][0]['value'] = '&nbsp';

                    var pick_str = dateConvert(userData['pick_up_date'].substring(0, 10));
                    var drop_str = dateConvert(userData['drop_off_date'].substring(0, 10));

                    data['data_time_info']['instruction'] = userData['instructions'];
                    data['data_time_info']['pickup'] = userData['pick_up_date'];
                    data['data_time_info']['pickup-day'] = pick_str;
                    data['data_time_info']['pickup-time'] = tConvert(userData['pick_up_date'].substring(11, 16));
                    data['data_time_info']['pickup-title'] = 'PICK UP';

                    data['data_time_info']['dropoff'] = userData['drop_off_date'];
                    data['data_time_info']['dropoff-day'] = drop_str;
                    data['data_time_info']['dropoff-time'] = tConvert(userData['drop_off_date'].substring(11, 16));
                    data['data_time_info']['dropoff-title'] = 'DROP OFF';

                } else if(userData['service'] == 'maid'){
                    data['data'][0]['text'] = 'Cleaning Type';
                    data['data'][0]['value'] = userData['clean_type'];
                    data['data'][1]['text'] = 'Bedrooms';
                    if(userData['bedrooms'] == 0){
                        userData['bedrooms'] = 'Studio';
                    }
                    data['data'][1]['value'] = userData['bedrooms'];

                    data['data'][2]['text'] = 'Bathrooms';
                    data['data'][2]['value'] = userData['bathrooms'];

                    var pick_str = dateConvert(userData['pick_up_date'].substring(0, 10));
                    data['data_time_info']['instruction'] = userData['instructions'];
                    data['data_time_info']['pickup'] = userData['pick_up_date'];
                    data['data_time_info']['pickup-day'] = pick_str
                    data['data_time_info']['pickup-time'] = tConvert(userData['pick_up_date'].substring(11, 16));
                    data['data_time_info']['pickup-title'] = 'BOOKING DATE';
                }
                self.render({ 'data': data['data'], 'data_time_info': data['data_time_info'], 'total': data['total'], 'goBack': userData['service'] }, function () {
                    //focus fixed
                    if (!globalData['event_native_keyboardshow_exist']) {

                        globalData['event_native_keyboardshow_exist'] = true;

                        window.addEventListener("native.keyboardshow", function (e) {
                            $('.onFocusHide').hide();
                        }, false);
                        window.addEventListener("native.keyboardhide", function (e) {
                            $('.onFocusHide').show();
                        }, false);
                    }

                    // console.log("Service " + userData['service']);
                });
            }
        } else {
            alert('No saved records');
            window.location.hash = '/menuPage';
        }

    });
    function dateConvert(date){
        var dat = date.split("-");
        var pick_str;
        var pick_mon;
        var postfix;
        if(dat[1] == '01') pick_mon = 'Jan';
        if(dat[1] == '02') pick_mon = 'Feb';
        if(dat[1] == '03') pick_mon = 'Mar';
        if(dat[1] == '04') pick_mon = 'Apr';
        if(dat[1] == '05') pick_mon = 'May';
        if(dat[1] == '06') pick_mon = 'June';
        if(dat[1] == '07') pick_mon = 'July';
        if(dat[1] == '08') pick_mon = 'Aug';
        if(dat[1] == '09') pick_mon = 'Sep';
        if(dat[1] == '10') pick_mon = 'Oct';
        if(dat[1] == '11') pick_mon = 'Nov';
        if(dat[1] == '12') pick_mon = 'Dec';
        if(parseInt(dat[2]) == 1) postfix = "st";
        if(parseInt(dat[2]) == 2) postfix = "nd";
        if(parseInt(dat[2]) == 3) postfix = "rd";
        if(parseInt(dat[2]) > 3) postfix = "th";
        return pick_str = pick_mon + ' ' + parseInt(dat[2]) + postfix;
    }
function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}
})();
