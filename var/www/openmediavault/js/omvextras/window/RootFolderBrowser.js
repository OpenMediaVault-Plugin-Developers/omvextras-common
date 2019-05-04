/**
 * Copyright (C) 2016-2019 OpenMediaVault Plugin Developers.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omvextras/tree/Folder.js")

Ext.define('OmvExtras.window.RootFolderBrowser', {
    extend: 'Ext.window.Window',
    requires: ['OmvExtras.tree.Folder'],

    buttonAlign: 'center',
    height: 400,
    layout: 'fit',
    modal: true,
    title: _('Select a directory'),
    width: 300,

    /**
     * @event select
     * Fires after the dialog has been closed by pressing the 'OK' button.
     * @param {OmvExtras.window.RootFolderBrowser} this The window object.
     * @param {Object}                             node The selected tree node.
     * @param {string}                             path The selected directory path.
     */

    /**
     * @private
     */
    initComponent: function() {
        this.folderTreePanel = Ext.create('OmvExtras.tree.Folder', {
            border: false,
            rootVisible: false,
            listeners: {
                scope: this,
                select: function(tree, record, index, eOpts) {
                    var button = this.queryById(this.getId() + '-ok');
                    button.setDisabled(false);
                }
            }
        });

        Ext.apply(this, {
            buttons: [{
                id: this.getId() + '-ok',
                text: _('OK'),
                disabled: true,
                handler: this.onOkButton,
                scope: this
            }, {
                text: _('Cancel'),
                handler: this.close,
                scope: this
            }],
            items: [this.folderTreePanel]
        });

        this.callParent(arguments);
    },

    /**
     * Handler for when the 'OK' button is pressed.
     */
    onOkButton: function() {
        var node = this.folderTreePanel.getSelection()[0];

        this.fireEvent('select', this, node, this.folderTreePanel.getPathFromNode(node));
        this.close();
    }
});
