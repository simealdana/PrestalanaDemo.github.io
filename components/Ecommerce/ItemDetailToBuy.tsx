declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var uuidv1 = require('uuid/v1');
var scripts = require('./Scripts/Script');
var cloneDeep = require('lodash.clonedeep');
var resources = require('./../../Resources');
var GenericScripts = require('../../GenericScripts/Script');
var uuidv1 = require('uuid/v1');

class ItemDetailToBuy extends React.Component {

    constructor(props) {
        super(props);
        this.percentajeInput = React.createRef();
        this.amountOfPayments = React.createRef();
        this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    }

    state = {
        anchorEl: null,
        buttonActive: false,
        percentaje: 0,
        registerDate: this.handleDate(),
        amountOfPayments: 0,
        amountSeparate: 0,
        term: -1,
        totalPayment: 0.0,
        separate: 0.0,
        dates: [],
        remainingAmount: 0.0,
        totalPaymentPlusTax: 0.0,
        isFirstLoad: true,
        totalTotal: 0.0,
        products: [],
        terms: []
    }

    componentDidMount() {

        const { product } = this.props;
        const { isFirstLoad, percentaje, terms } = this.state;

        scripts.clickSale();
        scripts.clickSale2();
        scripts.clickAside2();
        this.handleGetEcommerceParameters();
        this.handleSeparate(false, product.Avaluo, product, isFirstLoad);
    }

    componentDidUpdate(prevProps, prevState) {
        const { amountOfPayments, percentaje, terms } = this.state;
        const { ecommerceParameters } = this.props;
        if (prevState.percentaje != percentaje) {
            if (percentaje != null) {
                this.percentajeInput.current.focus();
            }
        }

        if (prevState.amountOfPayments != amountOfPayments) {
            if (amountOfPayments != null) {
                this.amountOfPayments.current.focus();
            }
        }

        if (ecommerceParameters.length > 0) {
            if (percentaje === 0) {
                this.setState({ 'percentaje': Number(ecommerceParameters.find(parameter => parameter.NombreParametro === 'PorcentajeMinimoApartado').Valor) }, function () {
                    const { percentaje } = this.state;
                    this.handleChangeTextInput({
                        target: {
                            id: "percentaje",
                            value: percentaje
                        }
                    })
                })
            }

            if (amountOfPayments == 0) {
                this.setState({ 'amountOfPayments': Number(ecommerceParameters.find(parameter => parameter.NombreParametro === 'NumeroPagosMaximos').Valor) }, function () {
                    const { amountOfPayments } = this.state;
                    this.handleChangeTextInput({
                        target: {
                            id: "amountOfPayments",
                            value: amountOfPayments
                        }
                    })
                })
            }

            if (terms.length === 0) {
                var list = []
                let id = 1;
                ecommerceParameters.map(paramete => {
                    if (paramete.NombreParametro === 'Plazos') {
                        list.push({
                            idParameter: id,
                            value: paramete.Valor
                        });
                        id++;
                    }
                });

                this.setState({ 'terms': list });
            }
        }
    }

    handleDate() {
        return this.handelGeneralDates(new Date());
    }

    handleGetEcommerceParameters() {
        const { updateEcommerceParameters } = this.props;
        fetch(resources.WebApiGoldenStart + "EcommerceParameters/ParametersEcommerce",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            }).then(response => {
                updateEcommerceParameters(response);
            })
            .catch((err) => {
                console.log('Error', err.message);
            });
    }

    handelGeneralDates(d) {
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handleSeparate(isActive, value, product, isFirstLoad) {
        const { separatedIds, amountPurchase, updatePurchaseAmount, updateListItemsToBuy, updateListItemsToSeparate, updateSaparatedIds } = this.props;
        const { separate } = this.state;

        updateListItemsToSeparate([]);
        //updateListItemsToBuy([]);

        let newPurchase = 0;
        let separatedId = separatedIds.find(function (separateId) {
            return product.IDArticulo === separateId;
        })

        if (isActive && (separatedId === null || separatedId === undefined)) {
            separatedIds.push(product.IDArticulo);
            updateSaparatedIds(separatedIds);
            newPurchase = amountPurchase === 0 ? 0 : amountPurchase - value;

            if (separate > 0) {
                this.props.onChange(separate, true);
                this.setState({ "isFirstLoad": false });
            }
        }
        else if (!isActive && (separatedId != null || separatedId != undefined)) {
            var index = separatedIds.indexOf(product.IDArticulo)
            if (index !== -1) {
                separatedIds.splice(index, 1);
                updateSaparatedIds(separatedIds);
            }
            this.setState({ "separateIsUnClicked": true, "sellIsUnClicked": false });
            newPurchase = amountPurchase + value;
            this.props.onChange(separate, false);
            this.setState({ "isFirstLoad": false });
        } else if (isFirstLoad === true) {
            this.props.onChange(separate, null);
            newPurchase = value;
        } else {
            newPurchase = amountPurchase;
            this.props.onChange(separate, null);
            this.setState({ "isFirstLoad": false });
        }

        this.setState({ "buttonActive": isActive }, updatePurchaseAmount(newPurchase));
    }

    handleChangeTextInput(e) {
        const { ecommerceParameters } = this.props;
        var minimunPercentaje = 0;
        var minimunPayments = 0;
        if (ecommerceParameters.length > 0) {
            minimunPercentaje = Number(ecommerceParameters.find(parameter => parameter.NombreParametro === 'PorcentajeMinimoApartado').Valor);
            minimunPayments = Number(ecommerceParameters.find(parameter => parameter.NombreParametro === 'NumeroPagosMaximos').Valor);
        }
        if (e.target.id === "percentaje") {
            if (Number(e.target.value) > minimunPercentaje && e.target.value <= 99) {
                let totalAmountSeparate = 0;
                var dif = 0;
                let isAdd = true;
                const { product } = this.props;
                const { amountOfPayments, separate } = this.state;
                var value = this.trunc(((product.Avaluo * e.target.value) / 100), 2);
                var remainingAmount = this.trunc(product.Avaluo - value, 2);
                var payment = this.trunc(((remainingAmount * resources.tax) + remainingAmount) / amountOfPayments, 2);
                var totalPaymentPlusTax = this.trunc(((remainingAmount * resources.tax) + remainingAmount), 2);

                if (separate < value) {
                    dif = value - separate;
                    isAdd = true;

                } else if (separate > value) {
                    dif = separate - value;
                    isAdd = false;
                }

                this.setState({ "percentaje": e.target.value, "separate": value, "totalPayment": payment, "remainingAmount": remainingAmount, "totalPaymentPlusTax": totalPaymentPlusTax, "amountSeparate": totalAmountSeparate }
                );

                this.props.onChange(dif, isAdd)
            }
            else if (Number(e.target.value) === Number(minimunPercentaje) || e.target.value === null || e.target.value === '' || e.target.value === undefined) {

                const { product } = this.props;
                var dif = Number(this.trunc(((product.Avaluo * e.target.value) / 100), 2));

                var isAdd = false;

                this.setState({
                    "percentaje": minimunPercentaje,
                    "separate": dif
                });
                this.props.onChange(dif, isAdd);
            }

        }
        else if (e.target.id === "amountOfPayments") {
            if (e.target.value > minimunPayments) {
                const { product } = this.props;
                const { percentaje, term } = this.state;

                var ee = {
                    target: {
                        value: term,
                        amountOfPayments: e.target.value
                    }
                };

                var value = this.trunc(((product.Avaluo * percentaje) / 100), 2);
                var remainingAmount = this.trunc(product.Avaluo - value, 2);
                var payment = this.trunc(((remainingAmount * resources.tax) + remainingAmount) / e.target.value, 2);
                var totalPaymentPlusTax = this.trunc(((remainingAmount * resources.tax) + remainingAmount), 2);
                this.setState({ "amountOfPayments": e.target.value, "totalPayment": payment, "remainingAmount": remainingAmount, "totalPaymentPlusTax": totalPaymentPlusTax }, this.handleTermSelect(ee));
            } else if (Number(e.target.value) === minimunPayments || e.target.value === null || e.target.value === '' || e.target.value === undefined) {

                const { product } = this.props;
                const { percentaje } = this.state;

                if (percentaje != undefined) {
                    var value = this.trunc(((product.Avaluo * percentaje) / 100), 2);
                    var remainingAmount = this.trunc(product.Avaluo - value, 2);
                    var payment = this.trunc(((remainingAmount * resources.tax) + remainingAmount) / minimunPayments, 2);
                    this.setState({ "totalPayment": payment, "amountOfPayments": Number(e.target.value) });
                }
            }
        }
        else {
            this.setState({
                [e.target.id]: e.target.value
            });
        }
    }

    handleTermSelect(e) {
        let { amountOfPayments } = this.state;
        const { nonWorkingDays } = this.props;

        if (e.target.amountOfPayments !== null && e.target.amountOfPayments !== undefined) {
            amountOfPayments = Number(e.target.amountOfPayments)
        }

        let newDatesFullFormat = [];
        let newDates = [];

        if (e.target.value === "1") {
            let modifyCount = 0;
            for (let i = 0; i < amountOfPayments; i++) {

                var newDate;
                if (newDatesFullFormat[i - 1] === undefined) {
                    newDate = new Date();
                } else {
                    if (modifyCount === 0) {
                        newDate = cloneDeep(newDatesFullFormat[i - 1]);
                    } else {
                        newDate = cloneDeep(newDatesFullFormat[i - 1]);
                        newDate.setDate(newDate.getDate() - modifyCount);
                        modifyCount = 0;
                    }
                }

                newDate.setDate(newDate.getDate() + 2 * 7);

                var formatedDate = newDate;

                nonWorkingDays.map(noWorkingDay => {
                    var nonWOrking = noWorkingDay.Fecha.split("T")[0];
                    var formatedDateValidation = this.handelGeneralDates(formatedDate)
                    if (formatedDateValidation === nonWOrking) {
                        var mydate = new Date(formatedDateValidation);
                        mydate.setDate(mydate.getDate() + 1);
                        formatedDate = mydate
                        modifyCount = modifyCount + 1;
                    }
                });

                newDatesFullFormat.push(formatedDate);
            }
        } else if (e.target.value === "2") {
            let modifyCount = 0;
            for (let i = 0; i < amountOfPayments; i++) {
                var newDate;
                if (newDatesFullFormat[i - 1] === undefined) {
                    newDate = new Date();
                } else {
                    if (modifyCount === 0) {
                        newDate = cloneDeep(newDatesFullFormat[i - 1]);
                    } else {
                        newDate = cloneDeep(newDatesFullFormat[i - 1]);
                        newDate.setDate(newDate.getDate() - modifyCount);
                        modifyCount = 0;
                    }
                }

                newDate.setDate(newDate.getDate() + 1 * 7);

                var formatedDate = newDate;
                nonWorkingDays.map(noWorkingDay => {
                    var nonWOrking = noWorkingDay.Fecha.split("T")[0];
                    var formatedDateValidation = this.handelGeneralDates(formatedDate)
                    if (formatedDateValidation === nonWOrking) {
                        var mydate = new Date(formatedDateValidation);
                        mydate.setDate(mydate.getDate() + 1);
                        formatedDate = mydate
                        modifyCount = modifyCount + 1;
                    }
                });


                newDatesFullFormat.push(formatedDate);
            }
        }

        newDatesFullFormat.map(date => {
            newDates.push(this.handelGeneralDates(date));
        });

        this.setState({
            [e.target.id]: e.target.value, "dates": newDates
        });
    }

    trunc(x, posiciones = 0) {
        var s = x.toString()
        var l = s.length
        var decimalLength = s.indexOf('.') + 1

        if (decimalLength === 0) {
            return x;
        }
        else {
            var numStr = s.substr(0, decimalLength + posiciones)
            return Number(numStr);
        }
    }

    createTableBody = (product, registerDate) => {
        const { client, listItemsToSeparate, updateListItemsToSeparate, listItemsToBuy, updateListItemsToBuy, separatedIds } = this.props;

        if (separatedIds.length > 0) {
            const { amountOfPayments, dates, totalPayment, separate, totalPaymentPlusTax, percentaje } = this.state

            var item = separatedIds.find(o => o === Number(product.IDArticulo));

            if (item === undefined) {
                if (listItemsToBuy.find(item => item.SKU_IDArticulo === product.IDArticulo) === undefined) {
                    listItemsToBuy.push({
                        //Ventas_DET_2013
                        IDFolioVenta: '',
                        IDSucursal: resources.idSucursal,
                        IDDetalle: '',
                        SKU_IDEmpeño: product.IDEmpeño,
                        SKU_IDSucursal: product.IDSucursal,
                        SKU_IDArticulo: product.IDArticulo,
                        SKU_Consecutivo: product.Consecutivo,
                        PrecioVenta: product.Avaluo,
                        Descuento: '',
                        IVA: '',
                        SubTotal: '',
                        Actualizar: 0,
                        IDTabla: 0,
                        Audit_FechaInsert: '',
                        Audit_UsuarioInsert: '',
                        IDPromocionDesc: 0,
                        //Ventas_GBL_2013
                        // IDCliente: client.IDCliente,
                    });
                    updateListItemsToBuy(listItemsToBuy);

                    console.log(listItemsToSeparate);
                    console.log(listItemsToBuy);

                }
            } else {
                //if (listItemsToSeparate.find(item => item.ApartadosEcommerceDetalle.SKU_IDArticulo === product.IDArticulo) !== undefined) {
                //    listItemsToSeparate.splice(listItemsToSeparate.find(item => item.ApartadosEcommerceDetalle.SKU_IDArticulo === product.IDArticulo), 1);
                //}

                if (listItemsToBuy.find(item => item.SKU_IDArticulo === product.IDArticulo) !== undefined) {
                    listItemsToBuy.splice(listItemsToBuy.find(item => item.SKU_IDArticulo === product.IDArticulo), 1);
                }


                let count = 2;
                let body = []
                var totalSell = separate;
                var payments = [];

                if (dates.length > 0) {
                    payments.push({
                        IDPayment: '',
                        IDSucursal: resources.idSucursal,
                        IDApartadoEcommerce: '',
                        NoPago: 1,
                        ValorPago: separate,
                        FechaEstimadaPago: registerDate,
                        FechaPago: registerDate,
                        ValorPagado: separate,
                        ValorRestante: totalPaymentPlusTax,
                        IDUsuario: resources.idUsuerInsert,
                        EstaCancelado: false
                    });
                }

                body.push(<tr key={uuidv1()}>
                    <td key={uuidv1()} className="text-center">1</td>
                    <td key={uuidv1()} className="text-center">$ {separate}</td>
                    <td key={uuidv1()} className="text-center">{registerDate}</td>
                    <td key={uuidv1()} className="text-center">{registerDate}</td>
                    <td key={uuidv1()} className="text-center">$ {separate}</td>
                    <td key={uuidv1()} className="text-center">$ {totalPaymentPlusTax}</td>
                </tr>)

                for (let i = 0; i < amountOfPayments; i++) {

                    if (dates[i] !== undefined) {
                        payments.push({
                            IDPayment: '',
                            IDSucursal: resources.idSucursal,
                            IDApartadoEcommerce: '',
                            NoPago: count,
                            ValorPago: totalPayment,
                            FechaEstimadaPago: dates[i],
                            IDUsuario: resources.idUsuerInsert,
                            EstaCancelado: false
                        });
                    }

                    body.push(<tr key={uuidv1()}>
                        <td key={uuidv1()} className="text-center">{count}</td>
                        <td key={uuidv1()} className="text-center">$ {totalPayment}</td>
                        <td key={uuidv1()} className="text-center">{dates[i] === undefined ? "-" : dates[i]}</td>
                        <td key={uuidv1()} className="text-center">-</td>
                        <td key={uuidv1()} className="text-center">-</td>
                        <td key={uuidv1()} className="text-center">-</td>
                    </tr>)

                    count = count + 1;
                    totalSell = this.trunc(totalSell + totalPayment, 2);
                }

                body.push(<tr key={uuidv1()} className="total-table">
                    <td key={uuidv1()} className="text-center">Total venta</td>
                    <td key={uuidv1()} className="text-center">$ {totalSell}</td>
                    <td key={uuidv1()} className="text-center"></td>
                    <td key={uuidv1()} className="text-center"></td>
                    <td key={uuidv1()} className="text-center">$ {separate}</td>
                    <td key={uuidv1()} className="text-center">$ {totalPaymentPlusTax}</td>
                </tr>);

                if (amountOfPayments + 1 === payments.length) {
                    listItemsToSeparate.push({
                        IDApartadoEcommerce: '',
                        IDCliente: client.IDCliente,
                        IDSucursal: resources.idSucursal,
                        IDEstatus: 14,
                        FechaRegistro: '',
                        ApartadosEcommerceDetalle: {
                            IDApartadoEcommerce: '',
                            IDSucursal: resources.idSucursal,
                            SKU_IDEmpeño: product.IDEmpeño,
                            SKU_IDArticulo: product.IDArticulo,
                            SKU_IDSucursal: product.IDSucursal,
                            SKU_Consecutivo: product.Consecutivo,
                            PorcentajeApartado: percentaje,
                            ValorApartado: separate,
                            ValorPago: totalPayment,
                            Plazo: amountOfPayments,
                            Payments: payments
                        }
                    });

                    updateListItemsToSeparate(listItemsToSeparate);
                    updateListItemsToBuy(listItemsToBuy);
                }
                return body;
            }
        }
        else if (listItemsToSeparate.length === 1) {
            updateListItemsToSeparate([]);

            if (listItemsToBuy.find(item => item.SKU_IDArticulo === product.IDArticulo) === undefined) {
                listItemsToBuy.push({
                    //Ventas_DET_2013
                    IDFolioVenta: '',
                    IDSucursal: resources.idSucursal,
                    IDDetalle: '',
                    SKU_IDEmpeño: product.IDEmpeño,
                    SKU_IDSucursal: product.IDSucursal,
                    SKU_IDArticulo: product.IDArticulo,
                    SKU_Consecutivo: product.Consecutivo,
                    PrecioVenta: product.Avaluo,
                    Descuento: '',
                    IVA: '',
                    SubTotal: '',
                    Actualizar: 0,
                    IDTabla: 0,
                    Audit_FechaInsert: '',
                    Audit_UsuarioInsert: '',
                    IDPromocionDesc: 0,
                    //Ventas_GBL_2013
                    // IDCliente: client.IDCliente,
                });
                updateListItemsToBuy(listItemsToBuy);
            }

        } else if (listItemsToSeparate.length === 0) {
            if (listItemsToBuy.find(item => item.SKU_IDArticulo === product.IDArticulo) === undefined) {
                listItemsToBuy.push({
                    //Ventas_DET_2013
                    IDFolioVenta: '',
                    IDSucursal: resources.idSucursal,
                    IDDetalle: '',
                    SKU_IDEmpeño: product.IDEmpeño,
                    SKU_IDSucursal: product.IDSucursal,
                    SKU_IDArticulo: product.IDArticulo,
                    SKU_Consecutivo: product.Consecutivo,
                    PrecioVenta: product.Avaluo,
                    Descuento: '',
                    IVA: '',
                    SubTotal: '',
                    Actualizar: 0,
                    IDTabla: 0,
                    Audit_FechaInsert: '',
                    Audit_UsuarioInsert: '',
                    IDPromocionDesc: 0,
                    //Ventas_GBL_2013
                    // IDCliente: client.IDCliente,
                });
                updateListItemsToBuy(listItemsToBuy);
            }

        }
    }

    render() {
        const { product, ecommerceParameters } = this.props;
        const { buttonActive, percentaje, registerDate, amountOfPayments, term, totalPayment, separate, totalPaymentPlusTax, terms, isFirstLoad } = this.state;

        var minimunPercentaje = 0;
        var minimunPayments = 0;
        if (ecommerceParameters.length > 0) {
            minimunPercentaje = Number(ecommerceParameters.find(parameter => parameter.NombreParametro === 'PorcentajeMinimoApartado').Valor);
            minimunPayments = Number(ecommerceParameters.find(parameter => parameter.NombreParametro === 'NumeroPagosMaximos').Valor);
        }

        return (
            <div className="item-cart" key={uuidv1()}>
                <div key={uuidv1()} className="dp-flex">
                    <div key={uuidv1()} className="img-product--modal">
                        <img key={uuidv1()} src={`data:image/jpeg;base64,${product.Document.Documento}`} alt="Alternate Text" />
                        <div key={uuidv1()} className="text-center mt-2 mr-3">
                            <i key={uuidv1()} className="material-icons star star-active">star</i>
                            <i key={uuidv1()} className="material-icons star star-active">star</i>
                            <i key={uuidv1()} className="material-icons star star-active">star</i>
                            <i key={uuidv1()} className="material-icons star star-active">star</i>
                            <i key={uuidv1()} className="material-icons star star-active">star</i>
                        </div>
                    </div>
                    <div>
                        <label key={uuidv1()} className="item-title--cart">{product.Descripcion}</label>
                        <div key={uuidv1()} className="label-value label-column value-cart">
                            <span key={uuidv1()}>Valor del producto:</span>
                            <label key={uuidv1()} className="cl-green">${GenericScripts.formatNumbers(product.Avaluo)}</label>
                        </div>
                        <div key={uuidv1()} className="label-value">
                            <span key={uuidv1()} >Descripción:</span>
                            <label key={uuidv1()} >
                                {product.Observaciones}
                            </label>
                        </div>
                        <div key={uuidv1()} className="dp-flex justify-content-around mt-4">
                            <div key={uuidv1()} onClick={() => this.handleSeparate(false, product.Avaluo, product, false)} className={buttonActive ? "tag gray" : "tag green"} id="sale">
                                <a><span key={uuidv1()} >Venta</span></a>
                            </div>
                            <div key={uuidv1()} onClick={() => this.handleSeparate(true, product.Avaluo, product, false)} className={buttonActive ? "tag green" : "tag gray"} id="aside">
                                <a><span key={uuidv1()} >Apartado</span></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div key={uuidv1()} id="optionAside" className={buttonActive ? "dp-block" : "dp-none"} >
                    <div key={uuidv1()} className="form">
                        <div key={uuidv1()} className="item-form">
                            <div key={uuidv1()} className="group">
                                <input key={uuidv1()} id="registerDate" value={registerDate} type="date" onChange={(e) => this.handleChangeTextInput(e)} required />
                                <span key={uuidv1()} className="bar"></span>
                                <label key={uuidv1()} className="asterisk">Fecha de registro</label>
                            </div>
                            <div key={uuidv1()} className="group">
                                <input key={uuidv1()} id="percentaje" ref={this.percentajeInput} onChange={(e) => this.handleChangeTextInput(e)} value={percentaje} type="number" min={minimunPercentaje} max="99" required />
                                <span key={uuidv1()} className="bar"></span>
                                <label key={uuidv1()} className="asterisk">% para el apartado</label>
                            </div>
                            <div key={uuidv1()} className="label-value label-column">
                                <span key={uuidv1()} >Valor del apartado:</span>
                                <label key={uuidv1()} className="cl-green">${separate}</label>
                            </div>
                        </div>
                        <div key={uuidv1()} className="item-form">
                            <div key={uuidv1()} className="group">
                                <input key={uuidv1()} id="amountOfPayments" type="number" min={minimunPayments} ref={this.amountOfPayments} value={amountOfPayments} onChange={(e) => this.handleChangeTextInput(e)} required />
                                <span key={uuidv1()} className="bar"></span>
                                <label key={uuidv1()} className="asterisk">No. pagos</label>
                            </div>
                            <div key={uuidv1()} className="label-value label-column">
                                <span key={uuidv1()} >Valor del pago:</span>
                                <label key={uuidv1()} className="cl-green">${GenericScripts.formatNumbers(totalPayment)}</label>
                            </div>

                            <div key={uuidv1()} className="select">
                                <select key={uuidv1()} id="term" className="select-text" value={term} onChange={this.handleTermSelect.bind(this)} required>
                                    <option key={uuidv1()} value="-1" disabled selected>Seleccione</option>
                                    {terms.length > 0 &&
                                        terms.map(term => {
                                            return (<option key={uuidv1()} selected value={term.idParameter}>{term.value}</option>)
                                        })
                                    }
                                </select>
                                <label className="asterisk select-label">Plazo</label>
                            </div>
                        </div>
                    </div>
                    <div key={uuidv1()} className="table-responsive">
                        <table key={uuidv1()} className="table">
                            <thead key={uuidv1()}>
                                <tr key={uuidv1()}>
                                    <th key={uuidv1()} className="text-center bold">No. pago</th>
                                    <th key={uuidv1()} className="text-center bold">Valor de pago</th>
                                    <th key={uuidv1()} className="text-center bold">Fecha estimada pago</th>
                                    <th key={uuidv1()} className="text-center bold">Fecha pago</th>
                                    <th key={uuidv1()} className="text-center bold">Valor pagado</th>
                                    <th key={uuidv1()} className="text-center bold">Valor pendiente</th>
                                </tr>
                            </thead>
                            <tbody key={uuidv1()}>
                                {this.createTableBody(product, registerDate)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateTopProps(state) {
    return {
        amountSeparate: state.ecommerce.amountSeparate,
        amountPurchase: state.ecommerce.amountPurchase,
        nonWorkingDays: state.ecommerce.nonWorkingDays,
        ecommerceParameters: state.ecommerce.ecommerceParameters,
        listItemsToBuy: state.ecommerce.listItemsToBuy,
        listItemsToSeparate: state.ecommerce.listItemsToSeparate,
        separatedIds: state.ecommerce.separatedIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePurchaseAmount: amount => {
            dispatch({ type: "UPDATE_PURCHASE_AMOUNT", payload: amount })
        },
        updateEcommerceParameters: parameters => {
            dispatch({ type: "UPDATE_ECOMMERCE_PARAMETERS", payload: parameters })
        },
        updateListItemsToBuy: items => {
            dispatch({ type: "UPDATE_LIST_ITEMS_TO_BUY", payload: items })
        },
        updateListItemsToSeparate: items => {
            dispatch({ type: "UPDATE_LIST_ITEMS_TO_SEPARATE", payload: items })
        },
        updateSaparatedIds: separatedIds => {
            dispatch({ type: "UPDATE_LIST_SEPARATED_IDS", payload: separatedIds })
        }
    }
}

export default connect(
    mapStateTopProps, mapDispatchToProps
)(ItemDetailToBuy);