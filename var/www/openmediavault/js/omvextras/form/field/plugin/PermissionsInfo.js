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

/**
 * This plugin displays information about insufficient permissions for a user on
 * a selected shared folder in an 'OMV.form.field.SharedFolderComboBox'.
 *
 * Example configuration for an 'OMV.form.field.SharedFolderComboBox':
 *
 *     {
 *         xtype: 'sharedfoldercombo',
 *         plugins: [{
 *             ptype: 'permissionsinfo',
 *             username: 'username',
 *             execute: true,
 *             read: true,
 *             write: true
 *         }]
 *     }
 */
Ext.define('OmvExtras.form.field.plugin.PermissionsInfo', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.permissionsinfo',

    comboBox: null,
    config: {
        username: null,
        execute: false,
        read: false,
        write: false
    },
    messageElement: null,
    template: null,

    init: function(comboBox) {
        if (!(comboBox instanceof OMV.form.field.SharedFolderComboBox)) {
            Ext.Error.raise('The permissionsinfo plugin can only be used with an instance of "OMV.form.field.SharedFolderComboBox"');
        }

        this.template = new Ext.XTemplate([
            '<div class="x-form-error-wrap x-form-error-wrap-default x-form-error-wrap-under x-form-error-wrap-under-side-label">',
                '<div class="x-form-error-msg x-form-invalid-under x-form-invalid-under-default">',
                    '<ul class="x-list-plain">',
                        '<tpl for="missingPermissions">',
                            '<li>The user {parent.username} is missing {.} permissions on this directory.</li>',
                        '</tpl>',
                    '</ul>',
                '</div>',
            '</div>'
        ]);
        this.template.compile();

        this.comboBox = comboBox;
        this.comboBox.on('afterrender', this._afterRender, this);
    },

    destroy: function() {
        this.comboBox.un('afterrender', this._afterRender, this);
        this.comboBox.un('change', this._onChange, this);
    },

    /**
     * @private
     */
    _afterRender: function(field, eOpts) {
        this.comboBox.on('change', this._onChange, this);
    },

    /**
     * @private
     */
    _onChange: function(field, newValue, oldValue, eOpts) {
        if (this.messageElement) {
            this.messageElement.destroy();
        }

        if (newValue === '') {
            return;
        }

        OMV.Rpc.request({
            callback: this._onCheckedPermissions,
            rpcData: {
                service: 'PermissionsInfo',
                method: 'checkUserDirectoryPermissions',
                params: {
                    username: this.getUsername(),
                    uuid: newValue
                }
            },
            scope: this
        });
    },

    /**
     * @private
     */
    _onCheckedPermissions: function(options, success, response) {
        var missingPermissions = [];

        if (!success) {
            return;
        }

        if (this.getExecute() && !response.executable) {
            missingPermissions.push('execute');
        }

        if (this.getRead() && !response.readable) {
            missingPermissions.push('read');
        }

        if (this.getWrite() && !response.writable) {
            missingPermissions.push('write');
        }

        if (missingPermissions.length === 0) {
            return;
        }

        this.messageElement = this.template.append(this.comboBox.getEl(), {
            username: this.getUsername(),
            missingPermissions: missingPermissions
        }, true);
    }
});
