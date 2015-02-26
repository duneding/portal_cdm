
var ucStories = {
    NameContainer: 'Success_Stories',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucStories,
        Key: ucStories.NameContainer
    });
});