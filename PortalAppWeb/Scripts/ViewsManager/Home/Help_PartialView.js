

var ucHelp = {
    NameContainer: 'Site-Help',    
    Load: function (parameters) {        
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucHelp,
        Key: ucHelp.NameContainer
    });
});