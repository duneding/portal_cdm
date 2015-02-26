
var ucGovernance = {
    NameContainer: 'Governance',
    Load: function (parameters) {
        $('#' + this.NameContainer).css('display', 'block');
    }

}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucGovernance,
        Key: ucGovernance.NameContainer
    });
});