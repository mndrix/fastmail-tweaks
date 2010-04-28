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

/* add a 't' shortcut that selects and then moves down */
function mndrix_kb_select_and_down () {
    KeyboardShortcuts.Actions.extend({
        't' : function (e) {
            KeyboardShortcuts.Actions['x'](e);
            KeyboardShortcuts.Actions['j'](e);
        },
    });
}

/* make ctrl-enter queue the current message to be read, tag it
 * and move on to the next one
 */
function mndrix_kb_open_tag_move () {
    KeyboardShortcuts.Actions.extend({
        'ctrl-enter' : function (e) {
            KeyboardShortcuts.Actions['x'](e);
            var link = $E('tr.keyboardSelected td.subject a');
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent(
                "click", // type
                true,    // canBubble
                true,    // cancelable
                window,  // view
                0,       // detail
                0,       // screenX
                0,       // screenY
                0,       // clientX
                0,       // clientY
                false,   // ctrlKey
                false,   // altKey
                false,   // shiftKey
                true,    // metaKey  (different key on Windows?)
                0,       // button
                null     // relatedTarget
            );
            link.dispatchEvent(evt);
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
        /* TODO don't auto-refresh if messages are checked off */
        var minutes = 5;
        var refresh = function () { $$('button.actionRefresh')[0].click() };
        window.setTimeout( refresh, minutes*60*1000 );

        /* make 'o' shortcut toggle the preview */
        mndrix_kb_preview.delay(10);

        /* make 'e' shortcut for moving messages to Archive */
        mndrix_kb_archive();

        /* make 't' shortcut select and then move down */
        mndrix_kb_select_and_down.delay(10);

        /* make 'ctrl-enter' open, tag and select a message */
        mndrix_kb_open_tag_move.delay(10);
    }

    /* Only on the message page */
    if( $defined($('message')) ) {
        /* make 'e' shortcut for moving messages to Archive */
        mndrix_kb_archive();

        /* TODO change Message-Id header into mid:... link */
    }
});
