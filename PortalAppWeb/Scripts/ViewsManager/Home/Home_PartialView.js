

var ucHome = {
    NameContainer: 'Home',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucHome,
        Key: ucHome.NameContainer
    });
});