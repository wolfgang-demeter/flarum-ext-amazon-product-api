import app from 'flarum/common/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import AmazonProductApiButton from './components/AmazonProductApiButton';

extend(TextEditor.prototype, 'toolbarItems', function(items) {
  if (!app.forum.attribute('wd-amazon-product-api.post.useAmazonProductApi')) return;

  items.add(
    'wd-amazon-product-api',
    AmazonProductApiButton.component(),
    -1
  );
});
