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

namespace OmvExtras\Util;

use Exception;
use OMV\System\Process;

class UserDirectoryPermissions
{
    /**
     * Check what permissions a user has on a given directory path.
     *
     *
     * @param string $username The user to check the permissions for.
     * @param string $path     The path to the directory to check.
     *
     * @return object Returns an object with the properties executable,
     *                readable and writable.
     */
    public static function check($username, $path)
    {
        $cmd = new Process(
            'su',
            '--shell',
            '/bin/sh',
            '--command',
            sprintf('"/usr/lib/omvextras/user-directory-permissions --path %s"', escapeshellarg($path)),
            escapeshellarg($username)
        );
        $cmd->execute($output);

        $json = implode(PHP_EOL, $output);
        $data = json_decode($json);

        if (!$data) {
            throw new Exception('Failed to decode JSON.');
        }

        return $data;
    }
}
