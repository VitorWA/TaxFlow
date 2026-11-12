<?php

namespace Tests;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): Application
    {
        $app = parent::createApplication();
        if (config('database.default') === 'mysql') {
            $database = config('database.connections.mysql.database');
            if (! is_string($database) || ! preg_match('/_(test|postman)$/D', $database) || config('database.connections.mysql.url')) {
                throw new \RuntimeException('Testes MySQL exigem banco isolado com sufixo _test ou _postman e sem DB_URL.');
            }
        }

        return $app;
    }
}
