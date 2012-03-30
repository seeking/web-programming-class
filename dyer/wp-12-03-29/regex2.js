
$(function() {

  var str = 'name: Sebastian, grade: F, comment: no homework';
  
  var newStr = str.replace(/([a-z]+):/g,"field-$1:");
  
  console.log(newStr);
  
});