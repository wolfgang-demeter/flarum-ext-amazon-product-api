import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
// import Switch from 'flarum/common/components/Switch';
import Stream from 'flarum/common/utils/Stream';

export default class AmazonProductApiModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.country = Stream(app.session.country);
    this.asin = Stream(app.session.asin);
  }

  className() {
    return 'Modal--large wd-amazon-product-api';
  }

  title() {
    return app.translator.trans('wd-amazon-product-api.forum.modal.headline');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="helpText">{app.translator.trans('wd-amazon-product-api.lib.help_text')}</div>

          <div className="Form-group">
            <label>{app.translator.trans('wd-amazon-product-api.forum.modal.asin')}</label>
            <input type="text" autocomplete="off" name="asin" className="FormControl" bidi={this.asin} disabled={this.loading} />
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('wd-amazon-product-api.forum.modal.country')}</label>
            {Select.component(
              {
                value: this.country(),
                onchange: this.country,
                options: this.countryOptions(),
              }
            )}
          </div>

          <div className="helpText">{app.translator.trans('wd-amazon-product-api.forum.modal.hint')}</div>

          <div className="Form-group">
            {Button.component(
              {
                className: 'Button Button--primary',
                type: 'submit',
                loading: this.loading,
              },
              app.translator.trans('wd-amazon-product-api.forum.modal.search')
            )}
          </div>
        </div>
      </div>
    );
  }

  countryOptions() {
    let options;
    options = ['ca', 'de', 'es', 'fr', 'it', 'uk', 'us'].reduce((o, key) => {
      o[key] = app.translator.trans(`wd-amazon-product-api.lib.partner_tag.${key}`);

      return o;
    }, {});
    return options;
  }

  onsubmit(e) {
    e.preventDefault();

    app
      .request({
        url: app.forum.attribute('apiUrl') + '/wd-amazon-product-api-search?country=' + encodeURIComponent(this.country()) + '&asin=' + encodeURIComponent(this.asin()),
        method: 'GET',
      })
      .then((data) => {
        // loadingIcon.remove();

        if (data.exception) {
          // an exception occured
          app.alerts.show(
            { type: '' },
            app.translator.trans('wd-amazon-product-api.forum.modal.exception', {
              exception: data.exception
            })
          );
        } else {
          let editorString = '';

          // image
          if (data.resultImage) {
            editorString += '[![' + app.translator.trans('wd-amazon-product-api.forum.text_insert.image_alt') + '](' + data.resultImage + ')](' + data.resultUrl + ')\n';
          }

          // title
          if (data.resultTitle) {
            editorString += '[' + data.resultTitle + '](' + data.resultUrl + ')\n';
          }

          // price & savings
          if (data.resultPrice) {
            editorString += app.translator.trans('wd-amazon-product-api.forum.text_insert.for') + ' **' + data.resultPrice + '**';

            if (data.resultSavings || data.resultSavingBasis) {
              editorString += ' _' + app.translator.trans('wd-amazon-product-api.forum.text_insert.savings.spacer');

              if (data.resultSavings) {
                editorString += ' ' + app.translator.trans('wd-amazon-product-api.forum.text_insert.savings.savings') + ' ' + data.resultSavings;
              }

              if (data.resultSavingBasis) {
                editorString += ' ' + app.translator.trans('wd-amazon-product-api.forum.text_insert.savings.basis') + ' ' + data.resultSavingBasis;
              }

              editorString += '_';
            }

            editorString += '\n';
          }

          // add result back to editor
          this.hide();
          app.composer.editor.insertAtCursor(editorString);
        }
      });
  }

  onerror(error) {
    super.onerror(error);
  }
}
