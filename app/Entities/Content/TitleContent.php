<?php

namespace App\Entities\Content;

use App\Entities\Content\Content;

class TitleContent extends Content
{
    protected $validateRules = [
        'value' => [
            'rule' => [
                'required',
                'max:30'
            ],
        ],
    ];

}
