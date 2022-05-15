<?php

namespace WD\AmazonProductApi\Extenders;

use Flarum\Api\Serializer\ForumSerializer;

class AddForumAttributes
{
    /**
     * @param ForumSerializer $serializer
     */
    public function __invoke(ForumSerializer $serializer)
    {
        $attributes['wd-amazon-product-api.post.useAmazonProductApi'] = $serializer->getActor()->can('wd-amazon-product-api.post.useAmazonProductApi');

        return $attributes;
    }
}
