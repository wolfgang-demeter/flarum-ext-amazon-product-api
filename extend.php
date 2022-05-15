<?php

namespace WD\AmazonProductApi;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(Extenders\AddForumAttributes::class),

    (new Extend\Routes('api'))
        ->get('/wd-amazon-product-api-search', 'wd-amazon-product-api-search', Api\Controllers\AmazonProductApiSearchController::class),
];
