declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var UserSection = require('../Clients/UserSection').default;
var ItemDetailToBuy = require('./ItemDetailToBuy').default;
var Section = require('./Section').default;
var PaymentGateway = require('./PaymentGateway').default;
var ClientHistory = require('./ClientHistory').default;
var UpClient = require('../Clients/UpClient').default;
var GenericScripts = require('../../GenericScripts/Script');
var resources = require('./../../Resources');
var Redirect = require('react-router-dom').Redirect;

class PurchaseSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amountSeparate: 0,
            isGateway: false,
            showContinue: true,
            redirect: false
        };

        this.handleFieldChange = this.handleFieldChange.bind(this);
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

    renderRedirect = () => {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: "/"
                    }}
                />
            );
        }
    }

    handleFieldChange(value, isAdd) {
        var totalSeparate = document.getElementById('totalAmountSeparated') as HTMLInputElement;
        var totalAmountValue = Number(totalSeparate.innerHTML.replace("$", '').replace(".", ''));

        if (isAdd === true) {
            this.setState({ "amountSeparate": this.trunc(totalAmountValue + value, 2) });
        } else if (isAdd === false) {
            if (totalAmountValue === 0) {
                this.setState({ "amountSeparate": totalAmountValue });
            } else {
                this.setState({ "amountSeparate": this.trunc(totalAmountValue - value, 2) });
            }
        } else {
            this.setState({ "amountSeparate": this.trunc(totalAmountValue, 2) });
        }
    }

    handleTicket() {

        const { listItemsToBuy, listItemsToSeparate, newValue, totalValue } = this.props;

        if (newValue === totalValue || newValue != 0) {
            alert('Por favor diligencie el monto a pagar en efectivo.');
        } else if (listItemsToSeparate.length) {

            fetch(resources.WebApiGoldenStart + "Apartado/GenerarApartado",
                {
                    mode: 'cors',
                    method: "POST",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }),
                    cache: 'no-cache',
                    body: JSON.stringify(listItemsToSeparate)
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('BAD HTTP stuff');
                    }
                }).then(response => {
                    this.setState({ "redirect": true });
                    alert('Generación ticket apartado.');

                })
                .catch((err) => {
                    console.log('Error', err.message);
                });
        }

        if (listItemsToBuy.length) {

        }
    }

    handleBack() {
        const { isGateway, showContinue } = this.state;

        this.setState({
            "isGateway": !isGateway,
            "showContinue": !showContinue
        });
    }

    handleGoToGateWay() {
        const { isGateway, showContinue } = this.state;
        const { listItemsToBuy, listItemsToSeparate, cart } = this.props;

        var countItemsToBuy = listItemsToBuy.length;
        var countItemsToSeparate = listItemsToSeparate.length;
        var countTotal = countItemsToBuy + countItemsToSeparate;

        if ((countItemsToBuy > 0 && countItemsToBuy == cart.length && countItemsToSeparate === 0) ||
            (countItemsToBuy === 0 && countItemsToSeparate === cart.length) ||
            ((countItemsToBuy > 0 && countItemsToSeparate > 0) && countTotal === cart.length) ||
            (countItemsToSeparate === cart.length)) {
            this.setState({
                "isGateway": !isGateway,
                "showContinue": !showContinue
            });
        } else if ((countItemsToBuy === 0 && countItemsToSeparate < countTotal) ||
            (countItemsToBuy > 0 && countItemsToSeparate < countTotal) ||
            (countItemsToBuy === 0 && countItemsToSeparate === 0) ||
            (countItemsToBuy === 0 && countItemsToSeparate < cart.length) ||
            ((countItemsToBuy > 0 && countItemsToSeparate > 0) && countTotal !== cart.length)) {
            alert('Uno o ma elementos apartados no han sido ajustados');
        }
    }

    componentDidMount() {
        const { cart, updatePurchaseAmount } = this.props;
        var total = 0;
        cart.map(item => {
            total = item.Avaluo + total;
        })

        updatePurchaseAmount(total);
    }

    render() {
        const { clientSelected } = this.props.location.state;
        const { cart, amountPurchase, isHistory, isInformation } = this.props;
        const { amountSeparate, isGateway, showContinue } = this.state;
        const disableDivs = { 'display': 'none' };

        const sumarySection =
            (<div>
                <div className="box-shopping-cart">
                    {isGateway ?
                        (<PaymentGateway total={amountSeparate + amountPurchase} />) :
                        (<div className="box-data list-cart">
                            {
                                cart.map(item => {
                                    return (<ItemDetailToBuy product={item} client={clientSelected} onChange={this.handleFieldChange} />)
                                })
                            }
                        </div>
                        )
                    }

                    <div className="box-data  list-cart--pay">
                        <label className="title-shopping--cart">Carrito de compras</label>
                        <div className="item-list--pay">
                            <label>{"Hay " + cart.length + " artículo(s) en el carrito"}</label>
                            <div className="label-value">
                                <span>Valor Compra apartado:</span>
                                <label id="totalAmountSeparated" >${GenericScripts.formatNumbers(amountSeparate)}</label>
                            </div>
                            <div className="label-value">
                                <span>Valor compra producto:</span>
                                <label>${GenericScripts.formatNumbers(amountPurchase)}</label>
                            </div>
                        </div>
                        <div className="item-pay--total">
                            <div className="label-value">
                                <span>Valor compra total:</span>
                                <label className="cl-green">${GenericScripts.formatNumbers(amountSeparate + amountPurchase)}</label>
                            </div>
                            <a className="btns btn-go m-0" onClick={this.handleGoToGateWay.bind(this)} style={showContinue ? { 'display': '' } : disableDivs} >Continuar</a>
                            <a className="btns btn-go m-0" onClick={this.handleBack.bind(this)} style={!showContinue ? { 'display': '' } : disableDivs} >Regresar</a>
                            <a className="btns btn-go m-0" onClick={this.handleTicket.bind(this)} style={!showContinue ? { 'display': '' } : disableDivs} >Pagar</a>

                        </div>
                    </div>
                </div>
                <Section title="ARTÍCULOS NUEVOS" />
            </div>);

        const subSection =
            isHistory === false && isInformation === false ? sumarySection :
                isHistory === true && isInformation === false ? (<ClientHistory />) :
                    isHistory === false && isInformation === true ? (<UpClient/>) :
                        (<div />);
        return (
            <div >
                <UserSection clients={[clientSelected]} isSearchClient={false} />
                {subSection}
                {this.renderRedirect()}
            </div>
        )
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart,
        amountPurchase: state.ecommerce.amountPurchase,
        list: state.ecommerce.list,
        isHistory: state.ecommerce.isHistory,
        isInformation: state.ecommerce.isInformation,
        listItemsToBuy: state.ecommerce.listItemsToBuy,
        listItemsToSeparate: state.ecommerce.listItemsToSeparate,
        newValue: state.ecommerce.newValue,
        totalValue: state.ecommerce.totalValue
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePurchaseAmount: amount => {
            dispatch({ type: "UPDATE_PURCHASE_AMOUNT", payload: amount })
        }
    }
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(PurchaseSummary);