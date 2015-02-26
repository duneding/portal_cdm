

var ucPilars = {
    NameContainer: 'Pilars',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucPilars,
        Key: ucPilars.NameContainer
    });
});