// import Modal from 'flarum/common/components/Modal';
// import Button from 'flarum/common/components/Button';

// export default class AmazonProductApiModal extends Modal {
//   view() {
//     return (
//       <div className={`Modal modal-dialog amazon-product-api`}>
//         <div className="Modal-content">
//           <div className="Modal-header">
//             <h3 className="App-titleControl App-titleControl--text">{app.translator.trans('wd-amazon-product-api.forum.modal.headline')}</h3>
//           </div>

//           <div className="Modal-body">
//             Add some Amazon Product API stuff
//           </div>

//           <div className="Modal-footer">
//             <Button onclick={this.hide.bind(this)} className="Button Button--primary">
//               {app.translator.trans('wd-amazon-product-api.forum.modal.accept')}
//             </Button>
//             <Button onclick={this.hide.bind(this)} className="Button">
//               {app.translator.trans('wd-amazon-product-api.forum.modal.cancel')}
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /**
//    * Add selected Amazon Product API data to composer
//    */
//   onSelect(rating) {
//     this.hide();
//     app.composer.editor.insertAtCursor('**amazon-product-api-data**\n');
//   }
// }

import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import Stream from 'flarum/common/utils/Stream';

export default class AmazonProductApiModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.locale = Stream(app.session.locale);
    this.asin = Stream(app.session.asin);

    // this.asin = "";
    // this.country = "";
  }

  className() {
    return 'Modal--large wd-amazon-product-api';
  }

  title() {
    return app.translator.trans('wd-amazon-product-api.forum.modal.headline');
  }

  content() {
    // autocomplete="off"
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group Select">
            <label>{app.translator.trans('wd-amazon-product-api.forum.modal.locale')}</label>
            <select name="locale" className="Select-input FormControl">
              <option value="de">amazon.de</option>
              <option value="it">amazon.it</option>
            </select>
            <i class="icon fas fa-sort Select-caret"></i>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('wd-amazon-product-api.forum.modal.asin')}</label>
            <input type="text" name="asin" className="FormControl" bidi={this.asin} disabled={this.loading} />
          </div>

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

  onsubmit(e) {
    e.preventDefault();

    // if (this.asin() === '') {
    //   alert('ASIN empty');
    //   this.hide()
    //   return;
    // }

    // this.loading = true;
    // this.alertAttrs = null;

    // app.session.user
    //   .save({
    //     country: this.country(),
    //     asin: this.asin()
    //   }, { errorHandler: this.onerror.bind(this) })
    //   .then(() => {
    //     this.success = true;
    //     // this.hide();
    //   })
    //   .catch(() => {})
    //   .then(this.loaded.bind(this));

    // const asin = this.asin();

    app
      .request({
        url: app.forum.attribute('apiUrl') + '/wd-amazon-product-api-search?locale=' + encodeURIComponent(this.locale()) + '&asin=' + encodeURIComponent(this.asin()),
        method: 'GET',
      })
      .then((data) => {
        // loadingIcon.remove();
        // console.log(data.resultTitle);

        this.hide();
        app.composer.editor.insertAtCursor(
          '[![](' + data.resultImage + ')](' + data.resultUrl + ')\n' +
          '[' + data.resultTitle + '](' + data.resultUrl + ')\n' +
          'für **' + data.resultPrice + '**\n'
        );
      });
  }

  onerror(error) {
    super.onerror(error);
  }
}
