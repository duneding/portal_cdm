

var ucHome = {
    NameContainer: 'Home',
    Load: function (parameters) {
        document.location.href = 'http://office2013.citrite.net/sites/bicoe';
    }
}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucHome,
        Key: ucHome.NameContainer
    });
});