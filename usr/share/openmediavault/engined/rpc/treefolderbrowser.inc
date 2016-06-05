<?php
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
namespace OMV\Engined\Rpc;

use DirectoryIterator;
use OMV\Rpc\Rpc;
use OMV\Rpc\ServiceAbstract;

class TreeFolderBrowser extends ServiceAbstract
{
    /**
     * Get the name of the RPC service.
     *
     * @return string
     */
    public function getName()
    {
        return 'TreeFolderBrowser';
    }

    /**
     * Initialize the RPC service.
     *
     * @return void
     */
    public function initialize()
    {
        $this->registerMethod('getDirectories');
    }

    /**
     * List all directories inside a given directory.
     *
     * @param mixed $params
     * @param mixed $context
     *
     * @return array
     */
    public function getDirectories($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.treefolderbrowser.get');

        $result = [];

        foreach (new DirectoryIterator($params['path']) as $item) {
            if ($item->isDot()) {
                continue;
            }

            if (!$item->isDir()) {
                continue;
            }

            $result[] = $item->getFilename();
        }

        return $result;
    }
}
