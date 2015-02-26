
var ucRoadmap = {
    NameContainer: 'Portfolio_Roadmap',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucRoadmap,
        Key: ucRoadmap.NameContainer
    });
});