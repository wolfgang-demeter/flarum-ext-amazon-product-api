import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

export default class AmazonProductApiModal extends Modal {
  view() {
    return (
      <div className={`Modal modal-dialog amazon-product-api`}>
        <div className="Modal-content">
          <div className="Modal-header">
            <h3 className="App-titleControl App-titleControl--text">{app.translator.trans('flarum-ext-amazon-product-api.forum.modal.headline')}</h3>
          </div>

          <div className="Modal-body">
            Add some Amazon Product API stuff

            <Button onclick={this.hide.bind(this)} className="Button">
              {app.translator.trans('flarum-ext-amazon-product-api.forum.modal.cancel')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Add selected Amazon Product API data to composer
   */
  onSelect(rating) {
    this.hide();
    app.composer.editor.insertAtCursor('**amazon-product-api-data**\n');
  }
}
