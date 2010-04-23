var MailboxScreen = new Class({
    initialize: function () {
        $$('div.actions i').addClass('hidden');
        (function () {
            this.redirectDialog();
            this.contactsMenu();
            this.keyboardSupport();
        }).delay(1, this);
    },
    redirectDialog: function () {
        if (Browser.Engine.trident4) return;
        var dialog = new ModalDialog({
            title: 'Redirect Message(s) to:'
        });
        var input;
        dialog.addEvent('show', function () {
            if (input) return $('redirectInput').focus();
            dialog.content.set('html', '<input id="redirectInput" type="text"> \
			 <div class="modalDialog-actions"> \
				<button class="actionCancel"><div>Cancel</div></button> \
				<button class="actionSend"><div>Send</div></button> \
			 </div>');
            input = new AutoCompleteTextBox(new TokenisingTextBox('redirectInput'));
            FastMail.Services.addAutoCompleteAddresses(input);
            dialog.box.getElement('button.actionCancel').addEvent('click', function () {
                dialog.hide();
                $$('div.actions select > option:first-child').set('selected', true);
                $$('div.actions select').sendEvent('change');
            });
            dialog.box.getElement('button.actionSend').addEvent('click', function () {
                dialog.hide();
                $E('span.primaryActions i input').value = $('redirectInput-original').value;
                $E('span.primaryActions button.autoDo').sendEvent('click');
            });
            $('redirectInput').focus();
            return true;
        });
        $$('div.actions select').addEvent('change', function () {
            if (this.options[this.selectedIndex].text.contains('Redirect')) {
                this.blur();
                dialog.show();
                $$('div.actions select option')[this.selectedIndex].set('selected', true);
            }
        });
    },
    contactsMenu: function () {
        $$('tbody').addEvent('click', function (event) {
            var contact = $(event.target);
            if (!contact.hasClass('from') && !(contact = contact.getParent('.from'))) return;
            var person = contact.getElement('span');
            event.stop();
            new Menu({
                align: contact,
                choices: [{
                    name: 'Reply to \'' + contact.getNext('td').getElement('a').get('text') + '\'',
                    callBack: function () {
                        location.href = person.get('replyhref');
                    }
                },
                {
                    name: 'Reply to all',
                    callBack: function () {
                        location.href = person.get('replyallhref');
                    }
                },
                {
                    name: 'Compose new message to ' + person.get('text'),
                    callBack: function () {
                        location.href = person.get('composehref');
                    }
                },
                {
                    name: 'Add/Show ' + person.get('text') + ' in address book',
                    callBack: function () {
                        location.href = person.get('addresshref');
                    }
                }]
            });
        });
    },
    keyboardSupport: function () {
        var actions = new SelectMenu('moreActions', {
            title: 'More actions',
            label: 'Use &uarr;/&darr;/enter or shortcut key',
            method: 'shortcut',
            onChange: function () {
                actions.hide();
                $('moreActions').fireEvent('change');
            }
        });
        KeyboardShortcuts.Actions.extend({
            enter: 'o',
            o: function (event) {
                $E('tr.keyboardSelected td.subject a').sendEvent('click');
            },
            'ctrl-enterctrl': 'ctrl-enter',
            'ctrl-enter': function (event) {
                var link = $E('tr.keyboardSelected td.subject a');
                var features = '';
                if (Browser.Engine.presto) features = "location=yes";
                if (Browser.Engine.trident) features = "location=yes,resizable=yes";
                var newWin = window.open(link.href, '_blank', features);
                if (newWin) newWin.focus();
            },
            m: 'u',
            u: function (event) {
                $E('button.actionRefresh').sendEvent('click');
            },
            'shift-!': function (event) {
                $E('button.actionSpam').sendEvent('click');
            },
            'shift-Â£': 'shift-#',
            'shift-Â§': 'shift-#',
            'shift-#': function (event) {
                $E('button.actionDelete').sendEvent('click');
            },
            'shift-%': function (event) {
                $E('#moreActions option[value=DelPerm]').set('selected', true).parentNode.sendEvent('change');
            },
            'ctrl- ': '.',
            '.': function (event) {
                actions.show();
            },
            '*': function (event) {
                var input = new Element('input', {
                    type: 'text',
                    styles: {
                        position: 'absolute',
                        top: '-2000px'
                    }
                }).addEvent('keypress', function (event) {
                    switch (event.key) {
                    case 'a':
                        if (event.shift) $('moreActions-selectAll').set('selected', true).parentNode.sendEvent('change');
                        else $('checkAll').set('checked', false).sendEvent('click');
                        break;
                    case 'n':
                        if (event.shift) $('moreActions-deselectAll').set('selected', true).parentNode.sendEvent('change');
                        else $('checkAll').set('checked', true).sendEvent('click');
                        break;
                    case 'r':
                        $$('table.contentTable tbody tr:not(.unread):not(.preview) input[type=checkbox]').set('checked', false).sendEvent('click');
                        break;
                    case 'u':
                        $$('table.contentTable tbody tr.unread input[type=checkbox]').set('checked', false).sendEvent('click');
                        break;
                    case 'f':
                        $$('table.contentTable tbody tr.flagged input[type=checkbox]').set('checked', false).sendEvent('click');
                        break;
                    case 'g':
                        $$('table.contentTable tbody tr:not(.flagged):not(.preview) input[type=checkbox]').set('checked', false).sendEvent('click');
                        break;
                    default:
                        break;
                    }
                    $clear(t);
                    this.blur();
                    this.destroy();
                }).inject(document.body);
                input.focus();
                var t = (function () {
                    input.blur();
                    input.destroy();
                }).delay(1000);
            }
        });
    }
});
1;