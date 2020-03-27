declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var uuidv1 = require('uuid/v1');
var scripts = require('./Scripts/Script');

const money = "images/img-money.png";
const ccVisa = "images/visa.png";
const ccmaster = "images/mastercard.png";
const ccOthers = "images/othercard.png";
const ccard = "images/credit-card.png";
var GenericScripts = require('../../GenericScripts/Script');

class PaymentGateway extends React.Component {

    state = {
        valueChanged: false,
        newValue: 0,
        cash: 0,
        idTabToActivate: "",
        idTabToBlock: "",
        pay: 0,
        receivedValue: 0,
        change: 0,
        focus: '',
        showRecivedValue: false,
        showChange: false,
        showSave: false,
        showPay: false
    }

    componentDidMount() {
        const { valueChanged } = this.state;
        const { total, updateNewValue, updateTotal } = this.props;
        if (!valueChanged) {
            updateNewValue(total);
            updateTotal(total);
        }
    }

    componentDidUpdate() {
        const { idTabToActivate, idTabToBlock, focus } = this.state;
        if ((idTabToActivate != undefined && idTabToBlock != undefined) || (idTabToActivate != "" && idTabToBlock != "")) {

            scripts.setTapPayment(idTabToActivate, idTabToBlock);

            if (focus !== '') {
                scripts.setFocus(focus);
            }
        };
    };

    handleCash(e) {
        var cash = Number(e.target.value.replace("$", '').replace(".", '').replace(",", ''));

        if (cash.toString() === 'NaN') {
            const { pay } = this.state;
            this.setState({ 'pay': pay });
        } else {
            const { total, updateNewValue, updateTotal } = this.props;
            const { newValue, valueChanged } = this.state;

            if (cash === 0) {
                this.setState({ "showRecivedValue": false });
            }
            if (Number(total) < cash) {
                alert('El monto a pagar no debe ser mayor que el monto total')
            } else {
                updateNewValue(total - cash);
                updateTotal(total);
                this.setState({
                    "newValue": total - cash, "cash": cash,
                    "pay": Number(cash),
                    "focus": 'money',
                    "showRecivedValue": true
                });

                if (!valueChanged) {
                    this.setState({ "valueChanged": true });
                }
            }
        }
    }

    handelReceivedValue(e) {
        var received = Number(e.target.value.replace("$", '').replace(".", '').replace(",", ''));
        const { cash, receivedValue } = this.state;

        if (received.toString() === 'NaN') {

            this.setState({
                "receivedValue": receivedValue
            });
        } else {
            var nCash = Number(cash);
            var nReceivedValue = Number(received);

            this.setState({ "receivedValue": Number(received), "focus": 'received' });

            if (nCash < nReceivedValue) {
                this.setState({ "change": nReceivedValue - nCash, "showChange": true, "showSave": true });
            }
            else {
                this.setState({ "change": 0, "showChange": false, "showSave": false });
            }
        }
    }

    handleTabsCash(idTabToActivate, idTabToBlock) {
        this.setState({ "idTabToActivate": idTabToActivate, "idTabToBlock": idTabToBlock });
        scripts.setTapPayment(idTabToActivate, idTabToBlock);
    }

    render() {
        const { total } = this.props
        const { valueChanged, newValue, cash, pay, receivedValue, change, showRecivedValue, showChange, showSave } = this.state;
        const disableDivs = { 'display': 'none' };

        return (<div key={uuidv1()} className="box-data list-cart" >
            <label key={uuidv1()} className="title-shopping--cart">Pagos</label>
            <div key={uuidv1()} className="item-cart">
                <div key={uuidv1()} className="dp-flex">
                    <div key={uuidv1()} className="label-value">
                        <span className="cl-gray--text semibold">Total a pagar:</span>
                        <label className="cl-green bold">$ {total}</label>
                    </div>
                    <div key={uuidv1()} className="label-value">
                        <span className="cl-gray--text semibold">Faltante:</span>
                        <label className="cl-red bold">$ {valueChanged ? newValue : total}</label>
                    </div>

                </div>
                <div key={uuidv1()} className="label-value m-0">
                    <span>Pago en efectivo:</span>
                    <label>$ {cash}</label>
                </div>
                <div key={uuidv1()} className="label-value m-0">
                    <span>Pago con tarjetas:</span>
                    <label>$ 0.00</label>
                </div>
            </div>
            <div>
                <div key={uuidv1()} id="accordion">
                    <div>
                        <div key={uuidv1()} className="box-pay tag gray">
                            <div key={uuidv1()} className="dp-flex align-items-center">
                            {/* <div key={uuidv1()} className="md-checkbox m-0 mr-3" data-toggle="collapse" href="#collapse_One" role="button" aria-expanded="false" aria-controls="collapse_One"> */}
                                <div key={uuidv1()} className="md-checkbox m-0 mr-3" data-toggle="collapse"  role="button" aria-expanded="false" aria-controls="collapse_One">
                                    <input key={uuidv1()} id="i1" type="checkbox" onClick={() => this.handleTabsCash("collapse_One", "collapse_2")} />
                                    <label htmlFor="i1"></label>
                                </div>
                                <label>Pago en efectivo</label>
                            </div>
                            <div key={uuidv1()} className="dp-flex justify-content-end">
                                <a><img src={money} /></a>
                            </div>
                        </div>
                        <div key={uuidv1()} id="collapse_One" className="collapse bg-white p-3" data-parent="#accordion">
                            <div key={uuidv1()} className="d-flex">
                                <div key={uuidv1()} className="group">
                                    <input id="money" key={uuidv1()} type="text" value={"$" + GenericScripts.formatNumbers(pay)} min="0" max={total} onChange={(e) => this.handleCash(e)} required />
                                    <span className="bar"></span>
                                    <label key={uuidv1()} className="asterisk">Monto a pagar</label>
                                </div>
                                <div key={uuidv1()} style={showRecivedValue ? { 'display': '' } : disableDivs} className="group">
                                    <input id='received' key={uuidv1()} type="text" value={"$" + GenericScripts.formatNumbers(receivedValue)} onChange={(e) => this.handelReceivedValue(e)} required />
                                    <span className="bar"></span>
                                    <label key={uuidv1()} className="asterisk">Monto recibido</label>
                                </div>
                                <div key={uuidv1()} style={showChange ? { 'display': '' } : disableDivs} className="group">
                                    <input key={uuidv1()} type="text" value={"$" + GenericScripts.formatNumbers(change)} disabled required />
                                    <span className="bar"></span>
                                    <label key={uuidv1()} className="asterisk">Cambio</label>
                                </div>

                                <a style={showSave ? { 'display': '' } : disableDivs} className="btns btn-go m-0" id="save-money" >Guardar</a>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div key={uuidv1()} className="box-pay tag gray">
                            <div key={uuidv1()} className="dp-flex align-items-center">
                            {/* <div id="card" key={uuidv1()} className="md-checkbox m-0 mr-3" data-toggle="collapse" href="#collapse_2" role="button" aria-expanded="false" aria-controls="collapse_2"> */}
                                <div id="card" key={uuidv1()} className="md-checkbox m-0 mr-3" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapse_2">
                                    <input key={uuidv1()} id="i2" type="checkbox" onClick={() => this.handleTabsCash("collapse_2", "collapse_One")} />
                                    <label key={uuidv1()} htmlFor="i2"></label>
                                </div>
                                <label>Pago con tarjetas</label>
                            </div>
                            <div key={uuidv1()} className="dp-flex justify-content-end">
                                <a ><img key={uuidv1()} src={ccard} /></a>
                            </div>
                        </div>
                        <div key={uuidv1()} id="collapse_2" className="collapse bg-white p-3" data-parent="#accordion">
                            <div key={uuidv1()} className="radio-button  mb-3">
                                <div key={uuidv1()} className="item-radio--button">
                                    <div key={uuidv1()} className="pd-right--30px">
                                        <input key={uuidv1()} type="radio" id="test1" name="radio-group" checked />
                                        <label key={uuidv1()} htmlFor="test1">Credito</label>
                                    </div>
                                    <div>
                                        <input key={uuidv1()} type="radio" id="test2" name="radio-group" />
                                        <label key={uuidv1()} htmlFor="test2">Debito</label>
                                    </div>
                                </div>
                            </div>
                            <div key={uuidv1()} className="dp-flex  justify-content-between">
                                <div key={uuidv1()} className="dp-flex align-items-center">
                                    <a key={uuidv1()} className="item-card active-card">
                                        <img key={uuidv1()} src={ccVisa} alt="Alternate Text" />
                                    </a>
                                    <a key={uuidv1()} className="item-card">
                                        <img key={uuidv1()} src={ccmaster} alt="Alternate Text" />
                                    </a>
                                    <a key={uuidv1()} className="item-card">
                                        <img key={uuidv1()} src={ccOthers} alt="Alternate Text" />
                                        <div>Otras tarjetas</div>
                                    </a>
                                </div>
                                <a className="btns btn-go m-0" id="next-card">Siguiente</a>
                            </div>
                            <div key={uuidv1()} className="mt-3">
                                <div key={uuidv1()} className="label-value">
                                    <span >Pago exitoso:</span>
                                    <label key={uuidv1()} className="bold">$ 400.00</label>
                                </div>
                                <div key={uuidv1()} className="mt-2">
                                    <img src={ccVisa} alt="Alternate Text" />
                                    <span className="ml-3">**********0237</span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>)
    }
}

function mapStateTopProps(state) {
    return {
        amountSeparate: state.ecommerce.amountSeparate,
        amountPurchase: state.ecommerce.amountPurchase,
        nonWorkingDays: state.ecommerce.nonWorkingDays
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePurchaseAmount: amount => {
            dispatch({ type: "UPDATE_PURCHASE_AMOUNT", payload: amount })
        },
        updateNewValue: newValue => {
            dispatch({ type: "UPDATE_NEW_VALUE", payload: newValue })
        },
        updateTotal: total => {
            dispatch({ type: "UPDATE_TOTAL_VALUE", payload: total })
        }
    }
}

export default connect(
    mapStateTopProps, mapDispatchToProps
)(PaymentGateway);