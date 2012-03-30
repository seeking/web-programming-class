
var questionView = {
  init: function(questionCollection) {
    this.questions = questionCollection;
    this.showQuestion(0);
  },
  
  showAll: function() {
    $('.qa').remove();
    for (i=0;i<this.questions.length;i++) {
      this.showQuestion(i);
    }
  },
  
  showQuestion: function(qNum,hideOthers) {
    q = this.questions[qNum];
    if (hideOthers) $('.qa').remove();
    var qa = $('<div/>').addClass('qa').attr('id','q'+qNum);
    $('<div/>').addClass('num').text(parseInt(qNum)+1).appendTo(qa);
    $('<div/>').addClass('question').html(q.questionHTML).appendTo(qa);
    
    ansHTML = $('<div/>').addClass((!q.isMC)?'answer fillIn':'answer').html(q.answerHTML).appendTo(qa);
    ansHTML.find('[bgColor]').attr('bgColor','transparent');
    ansHTML.find('td[width="1%"]').html('');
    ansHTML.find('td[width="18%"]').addClass('ansStats').hide();
    
    $('<div/>').addClass('stats').html(q.studentsMissed+' out of '+q.studentsAnswered+' missed this one. ').appendTo(qa);
    
    if (qNum < this.questions.length) {
      _this = this;
      $('<button/>').addClass('next').attr('data-next',parseInt(qNum)+1).text('next question').prependTo(qa).click(function() {
        _this.showQuestion($(this).attr('data-next'));
      });
    }
    
    $('<button/>').addClass('toggleAnswer').text('toggle answer').prependTo(qa).click(function() {
      
      var pt = $(this).parent();
      
      if (pt.find('.answer').hasClass('fillIn')) $(this).parent().find('.answer').toggle();
      pt.find('.ansStats').toggle();
      
      var ans = pt.find('[bgColor]');
      if (ans.attr('bgColor') != 'transparent') {
        ans.attr('bgColor','transparent');
      } else {
        ans.attr('bgColor','#FAF7B6');
      }
      
    });
    
    
    
    qa.prependTo('#questions');
  }
  
}



$(function() {
  
  $.get('quiaAchieve.txt', function(data) {
    var questionsStats = [];
    var re = /<table.*?Average score: ([0-9]+) out of ([0-9]+).*?([0-9]+) out of.*?question\.(?:<br>)+(.*?)<br><br>(<table width(.|\n)*?table>)/g;
    var m;
    while (m = re.exec(data)) {
      var percCorrect = m[1]/m[2];
      if (percCorrect <= 0.5) {
        qObj = {
          percCorrect: percCorrect,
          studentsAnswered: m[3],
          questionHTML: m[4],
          answerHTML: m[5],
          studentsCorrect: percCorrect*m[3],
          studentsMissed: (1-percCorrect)*m[3],
          isMC: /\[A\]/.test(m[5])
        }
        questionsStats.push(qObj);

      }
    }
    
    questionsStats = _.sortBy(questionsStats, function(q) {
      return 1000 - q.studentsAnswered;
    });
    
    questionsStats = _.sortBy(questionsStats, function(q) {
      return 1000 - q.studentsMissed;
    });
    
    questionView.init(questionsStats);
  });

});