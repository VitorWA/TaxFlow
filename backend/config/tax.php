<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Tax Engine
    |--------------------------------------------------------------------------
    |
    | Motor tributário usado pelo orquestrador. "fake" usa respostas
    | simuladas; adaptadores reais entram nas fases seguintes.
    |
    */

    'engine' => env('TAX_ENGINE', 'fake'),

];
