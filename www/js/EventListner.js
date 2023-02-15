(function (global) {
    var EventListner = function () {

    }
    EventListner.prototype.on = function addEventListner(event, listner, data) {
        try {
            var ListnerObject = { 'listner': listner, 'data': typeof data != 'undefined' ? data : {} };
            if (typeof this.EventLists == 'object') {
                if (typeof this.EventLists[event] == 'undefined') {
                    this.EventLists[event] = [ListnerObject];
                } else {
                    this.EventLists[event].push(ListnerObject);
                }
            } else {
                this.EventLists = {};
                this.EventLists[event] = [ListnerObject];
            }
            if (typeof this.EmitedList == 'object' && typeof this.EmitedList[event] == 'object') {
                ListnerObject['listner'].call(this.EmitedList[event]['context'], this.EmitedList[event]['data']);
            }
        } catch (e) {
            console.error(e);
        }
        return this;
    }
    EventListner.prototype.emit = function emitListner(event, data,context) {
        if (typeof this.EventLists != 'undefined' && typeof this.EventLists[event] != 'undefined') {
            for (var i in this.EventLists[event]) {
                //Data for Function
                if (typeof data == 'object' && typeof this.EventLists[event][i]['data'] == 'object') var DataForFunction = this._MergeArray(data, this.EventLists[event][i]['data']);
                else if (typeof data == 'object' && typeof this.EventLists[event][i]['data'] == 'undefined') var DataForFunction = data;
                else if (typeof data == 'undefined' && typeof this.EventLists[event][i]['data'] == 'object') var DataForFunction = this.EventLists[event][i]['data'];
                else var DataForFunction;
                //Call function
                this.EventLists[event][i]['listner'].call((typeof context != 'undefined' ? context : this), DataForFunction);
                if (typeof this.EmitedList == 'object') {
                    this.EmitedList[event] = { 'data': DataForFunction, 'context': (typeof context != 'undefined' ? context : this) };
                } else {
                    this.EmitedList = {};
                    this.EmitedList[event] = { 'data': DataForFunction, 'context': (typeof context != 'undefined' ? context : this) };
                }
            }
        }
    }
    EventListner.prototype._MergeArray = function _mergeArray(first, secend) {
        var data = secend;
        for (var k in first) {
            data[k] = first[k];
        }
        return data;
    }
    global.EventListner = EventListner;
})(window);