import app from 'flarum/common/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import AmazonProductApiButton from './components/AmazonProductApiButton';

extend(TextEditor.prototype, 'toolbarItems', function(items) {
  items.add(
    'amazon-product-api',
    AmazonProductApiButton.component(),
    -1
  );
});
