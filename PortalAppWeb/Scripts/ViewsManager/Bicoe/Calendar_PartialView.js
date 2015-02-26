
var ucCalendar = {
    NameContainer: 'Calendar',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucCalendar,
        Key: ucCalendar.NameContainer
    });
});