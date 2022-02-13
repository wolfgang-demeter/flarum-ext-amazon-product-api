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

    // this leaks those values to forum! we probably don't want this
    // (new Extend\Settings())
    //     ->serializeToForum('wd-amazon-product-api.partnerTag', 'wd-amazon-product-api.partnerTag', 'strval')
    //     ->serializeToForum('wd-amazon-product-api.accessKey', 'wd-amazon-product-api.accessKey', 'strval')
    //     ->serializeToForum('wd-amazon-product-api.secretKey', 'wd-amazon-product-api.secretKey', 'strval'),
];
