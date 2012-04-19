
var spreadSheetModelMaker = {
  // this is a url template in which we can just replace {id}
  // with the id of the google spreadsheet!
  baseUrl: 'http://spreadsheets.google.com/feeds/cells/{id}/od6/public/values?alt=json-in-script&callback=?',
  
  init: function(ssId,cb) {
    //                ^ cb represents the callback function that I
    //                want to be called only once all the data has
    //                been received and processed

    this.ssId = ssId;
    this.url = this.baseUrl.replace('{id}',this.ssId);
    var th = this;

    // below I call the algorithm that we came up with in class,
    // which I coded in the method getDataClass.
    // you can instead use the algorithm I came up with simply by calling
    // the method getData instead...

    this.getDataClass(function() {
      cb(th); // here's where the callback is called, and is passed the whole object
    });
    
  },
  
  // here is the algorithm for processing the JSON of cells
  // that we came up with in class...
  getDataClass: function(cb) {
    var th = this;
    $.getJSON(this.url,function(json) {
      // console.log(json);
      th.jsonObj = json;
      th.props = [];
      th.entries = [];
      var entryObj; // helper object
      th.jsonObj.feed.entry.forEach(function(obj) {
        var row = parseInt(obj.gs$cell.row);
        var col = parseInt(obj.gs$cell.col);
        var val= obj.gs$cell.$t;
        if (row==1) {
          th.props.push(val);
        } else {
          if (col == 1) {
            entryObj = {};
          }
          var propName = th.props[col-1];
          entryObj[propName] = val;
          if (col == th.props.length) {
            th.entries.push(entryObj);
          }
        }
      });
      cb();
    });
  },
  
  // here is a slightly more efficient algorithm that 
  // I had made before class...
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
          // instead of checking the col, just check if the object
          // for that row doesn't exists yet:
          if (!th.entries[row]) { 
            // I make the object directly inside the array 
            // instead of using a helper object
            th.entries[row] = {};
          }
          // instead of waiting to push a helper obj
          // onto the array at the last column,
          // here I directly set it in the array
          th.entries[row][th.props[col]] = val;
        }
      });
      cb();
    });
  }
  
};


// my object that represents the table in the browser

var tableView = {
  
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
    
  spreadSheetModelMaker.init('0AjiIacAWc-aRdHZ6Uk1MOFlXdHpvY2UtN1ZNQ0xTZ0E',function(m) {
    // as soon as the init function finishes and calls this callback,
    //  I pass the data object to my tableView object.
    // However, YOU could do something else instead! 

    tableView.init(m).render().open();

    $('#loading').hide();
  });
  
});