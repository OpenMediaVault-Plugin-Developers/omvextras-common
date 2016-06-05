/**
 * Copyright (C) 2016 OpenMediaVault Plugin Developers.
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

// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/data/reader/RpcArray.js")

/**
 * @param {Object} treeStoreRoot The root node for the Ext.dataTreeStore
 *                               associated with this panel.
 */
Ext.define('OmvExtras.tree.Folder', {
    extend: 'Ext.tree.Panel',
    requires: [
        'OMV.data.Model',
        'OMV.data.proxy.Rpc',
        'OMV.data.reader.RpcArray'
    ],

    /**
     * @private
     */
    initComponent: function() {
        Ext.apply(this, {
            store: Ext.create('Ext.data.TreeStore', {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    fields: [{
                        name: 'text',
                        type: 'string',
                        mapping: 0
                    }, {
                        name: 'name',
                        type: 'string',
                        mapping: 0
                    }]
                }),
                proxy: {
                    type: 'rpc',
                    reader: 'rpcarray',
                    rpcData: {
                        service: 'TreeFolderBrowser',
                        method: 'getDirectories',
                        params: {}
                    },
                    appendSortParams: false
                },
                sorters: [{
                    direction: 'ASC',
                    property: 'text'
                }],
                root: Ext.apply({
                    name: '',
                    text: ''
                }, this.treeStoreRoot || {}),
                listeners: {
                    scope: this,
                    beforeload: function(store, operation) {
                        // Add the required 'path' parameter to the request.
                        Ext.apply(store.proxy.rpcData.params, {
                            path: this.getPathFromNode(operation.node)
                        });
                    }
                }
            })
        });

        this.callParent(arguments);
    },

    /**
     * Build the full path from a given node. E.g. '/path/to/directory'.
     *
     * @param {Object} node The node to process.
     *
     * @return {string}
     */
    getPathFromNode: function(node) {
        var separator = '/';

        var path = node.getPath('name', separator);

        // Trim all forward slashes at the beginning and the end of the path.
        return separator + path.replace(/(^\/+|\/+$)/g, '');
    }
});
