/* keyboard shorcut for archiving a message */
function mndrix_kb_archive () {
    KeyboardShortcuts.Actions.extend({
        'e' : function (e) {
            $$('li#mbf6179846 button[type=submit]')[0].click();
        },
    });
}

/* keyboard shortcut for selectively displaying previews */
function mndrix_kb_preview () {
    var old_o = KeyboardShortcuts.Actions['o'];
    KeyboardShortcuts.Actions.extend({
        'enter' : old_o,
        'o' : function (e) {
            var preview = $$('tr.keyboardSelected + tr.preview')[0];
            var display = preview.style.display;
            if ( !display || display=='none' ) {
                display = 'table-row';
            }
            else {
                display = 'none';
            }
            preview.style.display = display;
            return;
        },
    });
}

/* replace the 'x' shortcut with one that also moves down */
function mndrix_kb_select_and_down () {
    var old_x = KeyboardShortcuts.Actions['x'];
    KeyboardShortcuts.Actions.extend({
        'x' : function (e) {
            old_x(e);
            KeyboardShortcuts.Actions['j'](e);
        },
    });
}

/* Tweaks to the Fastmail.fm web interface */
window.addEvent('domready', function () {

    /* Search all folders by defaults */
    //$('searchAll').checked = true;

    /* Only on the mailbox page */
    if( $defined($('mailbox')) ) {

        /* Refresh the mailbox screen every 5 minutes */
        var minutes = 5;
        var refresh = function () { $$('button.actionRefresh')[0].click() };
        window.setTimeout( refresh, minutes*60*1000 );

        /* make 'o' shortcut toggle the preview */
        mndrix_kb_preview.delay(10);

        /* make 'e' shortcut for moving messages to Archive */
        mndrix_kb_archive();

        /* make 'x' shortcut select and then move down */
        mndrix_kb_select_and_down.delay(10);

        /* TODO make 'ctrl-enter' do the following
         *  - open message in a new background tab
         *  - tag the current message in the mailbox view
         *  - select the next message
         */
    }

    /* Only on the message page */
    if( $defined($('message')) ) {
        /* make 'e' shortcut for moving messages to Archive */
        mndrix_kb_archive();
    }
});
