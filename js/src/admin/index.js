import app from 'flarum/admin/app';

app.initializers.add('wolfgang-demeter/flarum-ext-amazon-product-api', () => {
  app.extensionData
    .for('wolfgang-demeter-amazon-product-api')
    .registerSetting({
      setting: 'wd-amazon-product-api.partnerTag',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag'),
      placeholder: 'xyz-21',
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.accessKey',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.admin.settings.access_key'),
      // placeholder: 'xyz-21',
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.secretKey',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.admin.settings.secret_key'),
      // placeholder: 'xyz-21',
    })
    .registerPermission(
      {
        icon: 'fab fa-amazon',
        label: app.translator.trans('wd-amazon-product-api.admin.permissions.use_amazon_product_api'),
        permission: 'wd-amazon-product-api.post.useAmazonProductApi',
      },
      'start'
    );
});
