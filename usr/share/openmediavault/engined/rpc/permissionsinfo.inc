<?php
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
namespace OMV\Engined\Rpc;

use OMV\Rpc\Rpc;
use OMV\Rpc\ServiceAbstract;
use OmvExtras\Util\UserDirectoryPermissions;

class PermissionsInfo extends ServiceAbstract
{
    /**
     * Get the name of the RPC service.
     *
     * @return string
     */
    public function getName()
    {
        return 'PermissionsInfo';
    }

    /**
     * Initialize the RPC service.
     *
     * @return void
     */
    public function initialize()
    {
        $this->registerMethod('checkUserDirectoryPermissions');
    }

    /**
     * Check what permissions a user has on a given directory path.
     *
     * @param mixed $params
     * @param mixed $context
     *
     * @return object
     */
    public function checkUserDirectoryPermissions($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.permissionsinfo.checkuserdirectorypermissions');

        $path = Rpc::call('ShareMgmt', 'getPath', ['uuid' => $params['uuid']], $context);

        return UserDirectoryPermissions::check($params['username'], $path);
    }
}
