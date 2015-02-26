
var ucNews = {
    NameContainer: 'Latest_News',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucNews,
        Key: ucNews.NameContainer
    });
});