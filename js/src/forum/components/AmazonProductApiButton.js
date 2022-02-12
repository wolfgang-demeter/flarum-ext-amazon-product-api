import app from 'flarum/common/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import AmazonProductApiModal from './AmazonProductApiModal';
import Tooltip from 'flarum/common/components/Tooltip';

export default class AmazonProductApiButton extends Component {
  view() {
    return (
      <Tooltip text={app.translator.trans('wd-amazon-product-api.forum.button.tooltip')}>
        <Button
          className={classList([
            'Button',
            'hasIcon',
            'Button--icon',
            'Button--link',
          ])}
          icon={'fab fa-amazon'}
          onclick={this.AmazonProductApiButtonClicked.bind(this)}
        >
          <span className="Button-label">{app.translator.trans('wd-amazon-product-api.forum.button.label')}</span>
        </Button>
      </Tooltip>
    );
  }

  /**
   * Event handler for AmazonProductApi button being clicked
   *
   * @param {PointerEvent} e
   */
  AmazonProductApiButtonClicked(e) {
    e.preventDefault();

    // Open dialog
    app.modal.show(AmazonProductApiModal, {});
  }
}
