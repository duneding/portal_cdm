
var ucLearning = {
    NameContainer: 'Learning',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucLearning,
        Key: ucLearning.NameContainer
    });
});