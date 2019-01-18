var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Cordova, IonicNativePlugin, Plugin } from '@ionic-native/core';
/**
 * @name Braintree
 * @description
 * This plugin enables the use of the Braintree Drop-In Payments UI in your Ionic applications on Android and iOS, using the native Drop-In UI for each platform (not the Javascript SDK).
 *
 *  Ionic Native utilizes [a maintained fork](https://github.com/taracque/cordova-plugin-braintree) of the original `cordova-plugin-braintree`
 *
 *  For information on how to use Apple Pay with this plugin, please refer to the [plugin documentation](https://github.com/Taracque/cordova-plugin-braintree#apple-pay-ios-only)
 *
 * **NOTE**: This is not a complete payments solution. All of the Braintree client-side UIs simply generate a payment nonce that must then be processed by your server to complete the payment.
 * See the [Braintree Node server documentation](https://developers.braintreepayments.com/start/hello-server/node) for details and a [sample Express server](https://github.com/braintree/braintree_express_example) that implements the required functionality.
 *
 * @usage
 * ```typescript
 * import { Braintree, ApplePayOptions, PaymentUIOptions } from '@ionic-native/braintree';
 *
 * constructor(private braintree: Braintree) { }
 *
 * ...
 *
 * // Your Braintree `Tokenization Key` from the Braintree dashboard.
 * // Alternatively you can also generate this token server-side
 * // using a client ID in order to allow users to use stored payment methods.
 * // See the [Braintree Client Token documentation](https://developers.braintreepayments.com/reference/request/client-token/generate/node#customer_id) for details.
 * const BRAINTREE_TOKEN = '<YOUR_BRAINTREE_TOKEN>';
 *
 * // NOTE: Do not provide this unless you have configured your Apple Developer account
 * // as well as your Braintree merchant account, otherwise the Braintree module will fail.
 * const appleOptions: ApplePayOptions = {
 *   merchantId: '<YOUR MERCHANT ID>',
 *   currency: 'USD',
 *   country: 'US'
 * };
 *
 * const paymentOptions: PaymentUIOptions = {
 *   amount: '14.99',
 *   primaryDescription: 'Your product or service (per /item, /month, /week, etc)',
 * };
 *
 * this.braintree.initialize(BRAINTREE_TOKEN)
 *   .then(() => this.braintree.setupApplePay(appleOptions))
 *   .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
 *   .then((result: PaymentUIResult) => {
 *     if (result.userCancelled) {
 *       console.log("User cancelled payment dialog.");
 *     } else {
 *       console.log("User successfully completed payment!");
 *       console.log("Payment Nonce: " + result.nonce);
 *       console.log("Payment Result.", result);
 *     }
 *   })
 *   .catch((error: string) => console.error(error));
 *
 * ```
 *
 * @interfaces
 * ApplePayOptions
 * PaymentUIOptions
 * PaymentUIResult
 */
var Braintree = (function (_super) {
    __extends(Braintree, _super);
    function Braintree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Used to initialize the Braintree client. This function must be called before other methods can be used.
     *  As the initialize code is async, be sure you call all Braintree related methods after the initialize promise has resolved.
     *
     * @param {string} token The client token or tokenization key to use with the Braintree client.
     * @return {Promise<undefined | string>} Returns a promise that resolves with undefined on successful initialization, or rejects with a string message describing the failure.
     */
    /**
       * Used to initialize the Braintree client. This function must be called before other methods can be used.
       *  As the initialize code is async, be sure you call all Braintree related methods after the initialize promise has resolved.
       *
       * @param {string} token The client token or tokenization key to use with the Braintree client.
       * @return {Promise<undefined | string>} Returns a promise that resolves with undefined on successful initialization, or rejects with a string message describing the failure.
       */
    Braintree.prototype.initialize = /**
       * Used to initialize the Braintree client. This function must be called before other methods can be used.
       *  As the initialize code is async, be sure you call all Braintree related methods after the initialize promise has resolved.
       *
       * @param {string} token The client token or tokenization key to use with the Braintree client.
       * @return {Promise<undefined | string>} Returns a promise that resolves with undefined on successful initialization, or rejects with a string message describing the failure.
       */
    function (token) {
        return;
    };
    /**
     * Used to configure Apple Pay on iOS.
     *  In order for Apple Pay payments to appear on the Drop-In Payments UI, you must initialize the Apple Pay framework before using the Drop-In Payments UI.
     *
     *  Do not turn on Apple Pay in Braintree if you don't have Apple Pay entitlements - the Braintree module will reject the attempt to set up Apple Pay.
     *  Please refer to the [Braintree Merchant Documentation](https://developers.braintreepayments.com/guides/apple-pay/configuration/ios/v4#apple-pay-certificate-request-and-provisioning) to set up a Merchant Account.
     *
     *  Calling this function on Android is a `noop` so you can call it without having to check which cordova platform you are on! :D
     *
     * @param {ApplePayOptions}options The options used to configure Apple Pay.
     * @return {Promise<undefined | string>} Returns a promise that resolves with undefined on successful initialization, or rejects with a string message describing the failure.
     */
    /**
       * Used to configure Apple Pay on iOS.
       *  In order for Apple Pay payments to appear on the Drop-In Payments UI, you must initialize the Apple Pay framework before using the Drop-In Payments UI.
       *
       *  Do not turn on Apple Pay in Braintree if you don't have Apple Pay entitlements - the Braintree module will reject the attempt to set up Apple Pay.
       *  Please refer to the [Braintree Merchant Documentation](https://developers.braintreepayments.com/guides/apple-pay/configuration/ios/v4#apple-pay-certificate-request-and-provisioning) to set up a Merchant Account.
       *
       *  Calling this function on Android is a `noop` so you can call it without having to check which cordova platform you are on! :D
       *
       * @param {ApplePayOptions}options The options used to configure Apple Pay.
       * @return {Promise<undefined | string>} Returns a promise that resolves with undefined on successful initialization, or rejects with a string message describing the failure.
       */
    Braintree.prototype.setupApplePay = /**
       * Used to configure Apple Pay on iOS.
       *  In order for Apple Pay payments to appear on the Drop-In Payments UI, you must initialize the Apple Pay framework before using the Drop-In Payments UI.
       *
       *  Do not turn on Apple Pay in Braintree if you don't have Apple Pay entitlements - the Braintree module will reject the attempt to set up Apple Pay.
       *  Please refer to the [Braintree Merchant Documentation](https://developers.braintreepayments.com/guides/apple-pay/configuration/ios/v4#apple-pay-certificate-request-and-provisioning) to set up a Merchant Account.
       *
       *  Calling this function on Android is a `noop` so you can call it without having to check which cordova platform you are on! :D
       *
       * @param {ApplePayOptions}options The options used to configure Apple Pay.
       * @return {Promise<undefined | string>} Returns a promise that resolves with undefined on successful initialization, or rejects with a string message describing the failure.
       */
    function (options) {
        return;
    };
    /**
     * Shows Braintree's Drop-In Payments UI.
     *  Apple Pay is only shown in the Drop In UI if you have previously called `setupApplePay`.
     *
     * @param options {PaymentUIOptions} An optional argument used to configure the payment UI; see type definition for parameters. If not provided, the UI will show "0.00" as the price and an empty description.
     * @return {Promise<PaymentUIResult | string>} Returns a promise that resolves with a PaymentUIResult object on successful payment (or the user cancels), or rejects with a string message describing the failure.
     */
    /**
       * Shows Braintree's Drop-In Payments UI.
       *  Apple Pay is only shown in the Drop In UI if you have previously called `setupApplePay`.
       *
       * @param options {PaymentUIOptions} An optional argument used to configure the payment UI; see type definition for parameters. If not provided, the UI will show "0.00" as the price and an empty description.
       * @return {Promise<PaymentUIResult | string>} Returns a promise that resolves with a PaymentUIResult object on successful payment (or the user cancels), or rejects with a string message describing the failure.
       */
    Braintree.prototype.presentDropInPaymentUI = /**
       * Shows Braintree's Drop-In Payments UI.
       *  Apple Pay is only shown in the Drop In UI if you have previously called `setupApplePay`.
       *
       * @param options {PaymentUIOptions} An optional argument used to configure the payment UI; see type definition for parameters. If not provided, the UI will show "0.00" as the price and an empty description.
       * @return {Promise<PaymentUIResult | string>} Returns a promise that resolves with a PaymentUIResult object on successful payment (or the user cancels), or rejects with a string message describing the failure.
       */
    function (options) {
        return;
    };
    Braintree.decorators = [
        { type: Injectable },
    ];
    __decorate([
        Cordova({
            platforms: ['Android', 'iOS']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], Braintree.prototype, "initialize", null);
    __decorate([
        Cordova({
            platforms: ['iOS']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Braintree.prototype, "setupApplePay", null);
    __decorate([
        Cordova({
            platforms: ['Android', 'iOS']
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Braintree.prototype, "presentDropInPaymentUI", null);
    /**
     * @name Braintree
     * @description
     * This plugin enables the use of the Braintree Drop-In Payments UI in your Ionic applications on Android and iOS, using the native Drop-In UI for each platform (not the Javascript SDK).
     *
     *  Ionic Native utilizes [a maintained fork](https://github.com/taracque/cordova-plugin-braintree) of the original `cordova-plugin-braintree`
     *
     *  For information on how to use Apple Pay with this plugin, please refer to the [plugin documentation](https://github.com/Taracque/cordova-plugin-braintree#apple-pay-ios-only)
     *
     * **NOTE**: This is not a complete payments solution. All of the Braintree client-side UIs simply generate a payment nonce that must then be processed by your server to complete the payment.
     * See the [Braintree Node server documentation](https://developers.braintreepayments.com/start/hello-server/node) for details and a [sample Express server](https://github.com/braintree/braintree_express_example) that implements the required functionality.
     *
     * @usage
     * ```typescript
     * import { Braintree, ApplePayOptions, PaymentUIOptions } from '@ionic-native/braintree';
     *
     * constructor(private braintree: Braintree) { }
     *
     * ...
     *
     * // Your Braintree `Tokenization Key` from the Braintree dashboard.
     * // Alternatively you can also generate this token server-side
     * // using a client ID in order to allow users to use stored payment methods.
     * // See the [Braintree Client Token documentation](https://developers.braintreepayments.com/reference/request/client-token/generate/node#customer_id) for details.
     * const BRAINTREE_TOKEN = '<YOUR_BRAINTREE_TOKEN>';
     *
     * // NOTE: Do not provide this unless you have configured your Apple Developer account
     * // as well as your Braintree merchant account, otherwise the Braintree module will fail.
     * const appleOptions: ApplePayOptions = {
     *   merchantId: '<YOUR MERCHANT ID>',
     *   currency: 'USD',
     *   country: 'US'
     * };
     *
     * const paymentOptions: PaymentUIOptions = {
     *   amount: '14.99',
     *   primaryDescription: 'Your product or service (per /item, /month, /week, etc)',
     * };
     *
     * this.braintree.initialize(BRAINTREE_TOKEN)
     *   .then(() => this.braintree.setupApplePay(appleOptions))
     *   .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
     *   .then((result: PaymentUIResult) => {
     *     if (result.userCancelled) {
     *       console.log("User cancelled payment dialog.");
     *     } else {
     *       console.log("User successfully completed payment!");
     *       console.log("Payment Nonce: " + result.nonce);
     *       console.log("Payment Result.", result);
     *     }
     *   })
     *   .catch((error: string) => console.error(error));
     *
     * ```
     *
     * @interfaces
     * ApplePayOptions
     * PaymentUIOptions
     * PaymentUIResult
     */
    Braintree = __decorate([
        Plugin({
            pluginName: 'Braintree',
            plugin: 'cordova-plugin-braintree',
            pluginRef: 'BraintreePlugin',
            repo: 'https://github.com/taracque/cordova-plugin-braintree',
            platforms: ['Android', 'iOS'],
            install: 'ionic cordova plugin add https://github.com/taracque/cordova-plugin-braintree',
            installVariables: []
        })
    ], Braintree);
    return Braintree;
}(IonicNativePlugin));
export { Braintree };
//# sourceMappingURL=index.js.map