
var ucMission = {
    NameContainer: 'Our_Mission',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucMission,
        Key: ucMission.NameContainer
    });
});