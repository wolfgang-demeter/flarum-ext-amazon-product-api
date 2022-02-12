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
        permission: 'user.useAmazonProductApi',
      },
      'start'
    );
    // .registerSetting({
    //   setting: 'datlechin-birthdays.set_on_registration',
    //   type: 'boolean',
    //   label: app.translator.trans('datlechin-birthdays.admin.settings.set_on_registration_label'),
    // })
    // .registerSetting({
    //   setting: 'datlechin-birthdays.date_format',
    //   type: 'text',
    //   label: app.translator.trans('datlechin-birthdays.admin.settings.date_format_label'),
    //   placeholder: 'LL',
    // })
    // .registerSetting({
    //   setting: 'datlechin-birthdays.date_none_year_format',
    //   type: 'text',
    //   label: app.translator.trans('datlechin-birthdays.admin.settings.date_none_year_label'),
    //   placeholder: 'DD MMMM',
    // })
    // .registerSetting(function () {
    //   return (
    //     <div className="Form-group">
    //       <p className="helpText">
    //         {app.translator.trans('datlechin-birthdays.admin.settings.date_format_help', {
    //           a: <a href="https://day.js.org/docs/en/display/format" target="_blank" />,
    //         })}
    //       </p>
    //     </div>
    //   );
    // })
    // .registerPermission(
    //   {
    //     icon: 'fas fa-user-tag',
    //     label: app.translator.trans('datlechin-birthdays.admin.permissions.edit_own_birthday_label'),
    //     permission: 'user.editOwnBirthday',
    //   },
    //   'start'
    // );
});
