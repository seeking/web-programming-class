
window.spreadSheetModelMaker = {
  baseUrl: 'http://spreadsheets.google.com/feeds/cells/{id}/od6/public/values?alt=json-in-script&callback=?',
  
  init: function(ssId,cb) {
    this.ssId = ssId;
    this.url = this.baseUrl.replace('{id}',this.ssId);
    var th = this;
    this.getData(function() {
      cb(th);
    });
    
  },
  
  getData: function(cb) {
    var th = this;
    $.getJSON(this.url,function(json) {
      console.log(json);
      th.jsonObj = json;
      th.props = [];
      th.entries = [];
      th.jsonObj.feed.entry.forEach(function(obj) {
        var row = parseInt(obj.gs$cell.row)-2;
        var col = parseInt(obj.gs$cell.col)-1;
        var val = obj.gs$cell.$t;
        console.log(row,col,val);
        if (row == -1) {
          th.props[col] = val; // or th.props.push(val);
        } else {
          if (!th.entries[row]) {
            th.entries[row] = {};
          }
          th.entries[row][th.props[col]] = val;
        }
      });
      cb();
    });
  }
  
};

window.tableView = {
  
  rootEl: $('<table><thead></thead><tbody></tbody></table>'),
  
  init: function(model) {
    this.model = model;
    return this;
  },
  
  render: function() {
    var th = this;
    var hrEl = $('<tr/>');
    th.model.props.forEach(function(hc) {
      $('<th/>').text(hc).appendTo(hrEl);
    });
    hrEl.appendTo(th.rootEl.find('thead'));
    
    th.model.entries.forEach(function(entry) {
      var rowEl = $('<tr/>');
      th.model.props.forEach(function(prop) {
        $('<td/>').text(entry[prop]).appendTo(rowEl);
      });
      rowEl.appendTo(th.rootEl.find('tbody'));
    });
    return this;
  },
  
  open: function() {
    this.rootEl.appendTo('body');
    return this;
  },
  
  close: function() {
    this.rootEl.remove();
    return this;
  }
  
  
};

$(function() {
    
  window.spreadSheetModelMaker.init('0AjiIacAWc-aRdHZ6Uk1MOFlXdHpvY2UtN1ZNQ0xTZ0E',function(m) {
    window.tableView.init(m).render().open();
    $('#loading').hide();
  });
  
});