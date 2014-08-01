﻿define(["modules/jquery-mozu", "shim!vendor/underscore>_", "modules/backbone-mozu", "hyprlive", "modules/models-price", "modules/api"], function($, _, Backbone, Hypr, PriceModels, api) {

    function zeroPad(str, len) {
        str = str.toString();
        while (str.length < 2) str = '0' + str;
        return str;
    }
    function formatDate(d) {
        var date = new Date(Date.parse(d) + (new Date()).getTimezoneOffset() * 60000);
        return [zeroPad(date.getFullYear(), 4), zeroPad(date.getMonth() + 1, 2), zeroPad(date.getDate(), 2)].join('-');
    }


    var ProductOption = Backbone.MozuModel.extend({
        idAttribute: "attributeFQN",
        helpers: ['isChecked'],
        initialize: function() {
            var me = this;
            _.defer(function() {
                me.listenTo(me.collection, 'invalidoptionselected', me.handleInvalid, me);
            });
            var attributeDetail = me.get('attributeDetail');
            if (attributeDetail) {
                if (attributeDetail.valueType === ProductOption.Constants.ValueTypes.Predefined) {
                    this.legalValues = _.chain(this.get('values')).pluck('value').map(function(v) { return !_.isUndefined(v) && !_.isNull(v) ? v.toString() : v }).value();
                }
                if (attributeDetail.inputType === ProductOption.Constants.InputTypes.YesNo) {
                    me.on('change:value', function(model, newVal) {
                        var values;
                        if (me.previous('value') !== newVal) {
                            values = me.get('values');
                            _.first(values).isSelected = newVal;
                            me.set({
                                value: newVal,
                                shopperEnteredValue: newVal,
                                values: values
                            }, {
                                silent: true
                            });
                            me.trigger('optionchange', newVal, me);
                        }
                    });
                } else {
                    me.on("change:value", function(model, newVal) {
                        var newValObj, values = me.get("values");
                        if (typeof newVal === "string") newVal = $.trim(newVal);
                        if (newVal || newVal === false || newVal === 0 || newVal === '') {
                            _.each(values, function(fvalue) {
                                if (fvalue.value.toString() === newVal.toString()) {
                                    newValObj = fvalue;
                                    fvalue.isSelected = true;
                                    me.set("value", newVal);
                                } else {
                                    fvalue.isSelected = false;
                                }
                            });
                            me.set("values", values);
                            //if (me.get("attributeDetail").inputType !== "List") {
                            //    me.set("shopperEnteredValue", newVal);
                            //}
                        } else {
                            me.unset('value');
                            me.unset("shopperEnteredValue");
                        }
                        if (newValObj && !newValObj.isEnabled) me.collection.trigger('invalidoptionselected', newValObj, me);
                        me.trigger('optionchange', newVal, me);
                    });
                }
            }
        },
        handleInvalid: function(newValObj, opt) {
            if (this !== opt) {
                this.unset("value");
                _.each(this.get("values"), function(value) {
                    value.isSelected = false;
                });
            }
        },
        parse: function(raw) {
            var selectedValue, storedShopperValue;
            if (!raw.isMultiValue) {
                selectedValue = _.findWhere(raw.values, { isSelected: true });
                if (selectedValue) raw.value = selectedValue.value;
            }
            if (raw.attributeDetail.valueType !== ProductOption.Constants.ValueTypes.Predefined) {
                storedShopperValue = raw.values[0] && raw.values[0].shopperEnteredValue;
                if (storedShopperValue || storedShopperValue === 0)
                    this.set({
                        shopperEnteredValue: storedShopperValue,
                        value: storedShopperValue
                    });
            }
            if (raw.attributeDetail.inputType === ProductOption.Constants.InputTypes.Date && raw.attributeDetail.validation) {
                raw.minDate = formatDate(this.attributeDetail.validation.minDateValue);
                raw.maxDate = formatDate(this.attributeDetail.validation.maxDateValue);
            }
            return raw;
        },
        isChecked: function() {
            var attributeDetail = this.get('attributeDetail'),
                values = this.get('values');
            return attributeDetail && attributeDetail.inputType === ProductOption.Constants.InputTypes.YesNo && values && values[0].isSelected;
        },
        isValidValue: function() {
            var value = this.get('value') || this.get('shopperEnteredValue');
            return value !== undefined && value !== '' && (this.get('attributeDetail').valueType !== ProductOption.Constants.ValueTypes.Predefined || _.contains(this.legalValues, value));
        },
        isConfigured: function() {
            return this.isChecked() || this.isValidValue();
        },
        toJSON: function(options) {
            var j = Backbone.MozuModel.prototype.toJSON.apply(this, arguments);
            if (j && j.attributeDetail && j.attributeDetail.valueType !== ProductOption.Constants.ValueTypes.Predefined && this.isConfigured()) {
                var val = j.value || j.shopperEnteredValue;
                if (j.attributeDetail.dataType === "Number") val = parseFloat(val);
                j.shopperEnteredValue = j.value = val;
            }

            return j;
        }
    }, {
        Constants: {
            ValueTypes: {
                Predefined: "Predefined",
                ShopperEntered: "ShopperEntered",
                AdminEntered: "AdminEntered"
            },
            InputTypes: {
                List: "List",
                YesNo: "YesNo",
                Date: "Date"
            }
        }
    }),

    ProductContent = Backbone.MozuModel.extend({}),

    Product = Backbone.MozuModel.extend({
        mozuType: 'product',
        idAttribute: 'productCode',
        handlesMessages: true,
        helpers: ['mainImage', 'notDoneConfiguring', 'hasPriceRange'],
        defaults: {
            purchasableState: {},
            quantity: 1
        },
        dataTypes: {
            quantity: Backbone.MozuModel.DataTypes.Int
        },
        validation: {
            quantity: {
                min: 1,
                msg: Hypr.getLabel('enterProductQuantity')
            }
        },
        relations: {
            content: ProductContent,
            price: PriceModels.ProductPrice,
            priceRange: PriceModels.ProductPriceRange,
            options: Backbone.Collection.extend({
                model: ProductOption
            })
        },
        hasPriceRange: function() {
            return this._hasPriceRange;
        },
        calculateHasPriceRange: function(json) {
            this._hasPriceRange = json && !!json.priceRange;
        },
        initialize: function(conf) {
            var slug = this.get('content').get('seoFriendlyUrl');
            _.bindAll(this, 'calculateHasPriceRange', 'onOptionChange');
            this.listenTo(this.get("options"), "optionchange", this.onOptionChange);
            this.updateConfiguration = _.debounce(this.updateConfiguration, 300);
            this.set({ url: slug ? "/" + slug + "/p/" + this.get("productCode") : "/p/" + this.get("productCode") });
            this.lastConfiguration = [];
            this.calculateHasPriceRange(conf);
            this.on('sync', this.calculateHasPriceRange);
        },
        mainImage: function() {
            var imgs = this.get('content').get("productImages"),
                img = imgs && imgs[0];
            return img || { imageUrl: 'http://placehold.it/160&text=' + Hypr.getLabel('noImages') }
        },
        notDoneConfiguring: function() {
            var purchasableState = this.get('purchasableState');
            return purchasableState.isPurchasable === false && purchasableState.messages && purchasableState.messages[0] && purchasableState.messages[0].message === "Not done configuring";
        },
        getConfiguredOptions: function() {
            return _.invoke(this.get("options").filter(function(opt) {
                return opt.isConfigured();
            }), 'toJSON');
        },
        addToCart: function() {
            var me = this;
            this.whenReady(function() {
                if (!me.validate()) {
                    me.apiAddToCart(me.get("quantity")).then(function(item) {
                        me.trigger('addedtocart', item);
                    });
                }
            });
        },
        addToWishlist: function() {
            var me = this;
            this.whenReady(function() {
                if (!me.validate()) {
                    me.apiAddToWishlist({
                        customerAccountId: require.mozuData('user').accountId,
                        quantity: me.get("quantity")
                    }).then(function(item) {
                        me.trigger('addedtowishlist', item);
                    });
                }
            });
        },
        addToCartForPickup: function(locationCode, quantity) {
            var me = this;
            this.whenReady(function() {
                return me.apiAddToCartForPickup({
                    fulfillmentLocationCode: locationCode,
                    quantity: quantity || 1
                }).then(function(item) {
                    me.trigger('addedtocart', item);
                });
            });
        },
        onOptionChange: function() {
            this.isLoading(true);
            this.updateConfiguration();
        },
        updateConfiguration: function() {
            var newConfiguration = this.getConfiguredOptions();
            if (JSON.stringify(this.lastConfiguration) !== JSON.stringify(newConfiguration)) {
                this.lastConfiguration = newConfiguration;
                this.apiConfigure({ options: newConfiguration });
            } else {
                this.isLoading(false);
            }
        },
        toJSON: function(options) {
            var j = Backbone.MozuModel.prototype.toJSON.apply(this, arguments);
            if (!options || !options.helpers) {
                j.options = this.getConfiguredOptions();
            }
            if (options && options.helpers) {
                if (typeof j.mfgPartNumber == "string") j.mfgPartNumber = [j.mfgPartNumber];
                if (typeof j.upc == "string") j.upc = [j.upc];
                if (j.bundledProducts && j.bundledProducts.length === 0) delete j.bundledProducts;
            }
            return j;
        }
    }),

    ProductCollection = Backbone.MozuModel.extend({
        relations: {
            items: Backbone.Collection.extend({
                model: Product
            })
        }
    });

    return {
        Product: Product,
        Option: ProductOption,
        ProductCollection: ProductCollection
    };

});


