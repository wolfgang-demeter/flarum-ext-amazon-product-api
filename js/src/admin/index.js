import app from 'flarum/admin/app';

app.initializers.add('wolfgang-demeter/flarum-ext-amazon-product-api', () => {
  app.extensionData
    .for('wolfgang-demeter-amazon-product-api')
    .registerSetting({
      setting: 'wd-amazon-product-api.accessKey',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.admin.settings.access_key'),
      // placeholder: 'xyz-21',
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.secretKey',
      type: 'password',
      label: app.translator.trans('wd-amazon-product-api.admin.settings.secret_key'),
      // placeholder: 'xyz-21',
    })
    .registerSetting({
      label: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag_title'),
      help: app.translator.trans('wd-amazon-product-api.lib.help_text', {
        a: <a href="https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html" target="_blank" rel="noopener" />,
      }),
      type: 'hidden',
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.partnerTag.de',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.lib.partner_tag.de'),
      placeholder: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag_placeholder'),
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.partnerTag.fr',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.lib.partner_tag.fr'),
      placeholder: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag_placeholder'),
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.partnerTag.it',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.lib.partner_tag.it'),
      placeholder: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag_placeholder'),
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.partnerTag.uk',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.lib.partner_tag.uk'),
      placeholder: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag_placeholder'),
    })
    .registerSetting({
      setting: 'wd-amazon-product-api.partnerTag.us',
      type: 'text',
      label: app.translator.trans('wd-amazon-product-api.lib.partner_tag.us'),
      placeholder: app.translator.trans('wd-amazon-product-api.admin.settings.partner_tag_placeholder'),
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
