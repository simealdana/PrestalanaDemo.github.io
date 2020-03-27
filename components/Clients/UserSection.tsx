declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var resources = require('./../../Resources');
var Redirect = require('react-router-dom').Redirect;
var uuidv1 = require('uuid/v1');
var GenericScripts = require('../../GenericScripts/Script')
const money = "images/img-money.png"

class UserSection extends React.Component {

    state = {
        products: null,
        random: null,
        promo: null,
        moreDiscount: null,
        redirect: false,
        showModal: false,
        selectedItem: null,
        pathname: null,
        clientSelected: null,
        informationDisable: false,
        historyDisable: false,
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: this.state.pathname,
                        state: {
                            clientSelected: this.state.clientSelected
                        }
                    }}
                />
            );
        }
    }

    setRedirectClient = client => {
        this.setState({
            "redirect": true, "clientSelected": client, "pathname": "/purchaseSummary"
        });
    }

    handleClientHistory() {
        const { updateIsHistory, isHistory } = this.props;
        updateIsHistory(!isHistory);
        this.setState({ "informationDisable": !isHistory });
    }

    handleClientInformation() {
        const { updateIsInformation, updateUpdateIsEditClient, isInformation } = this.props;
        updateIsInformation(!isInformation);
        updateUpdateIsEditClient(false);
        this.setState({ "historyDisable": !isInformation });
    }

    render() {
        const { clients, isSearchClient, isHistory, isInformation } = this.props;
        const { historyDisable, informationDisable } = this.state;
        const disabledHistory = historyDisable ? {
            'pointer-events': 'none',
            opacity: '0.4'
        } : {};
        const disabledInformation = informationDisable ? {
            'pointer-events': 'none',
            opacity: '0.4'
        } : {};

        return (
            <div key={uuidv1()}>
                {clients != null &&
                    clients.map(client => {
                        return (
                            <div key={uuidv1()} className={isSearchClient ? "box-customer--search" : "box-customer--search complete"}>
                                <div className="photo-search ">
                                    <div className="img-user">
                                        <img className="img-class" src={client.FotoClientURL === null ? `data:image/jpeg;base64,${client.FotoCliente}` : client.FotoClientURL} alt="Alternate Text" />
                                    </div>

                                    <div className="dp-flex">
                                        <div className="img-customer">
                                            <div>
                                                <img className="img-money" src={money} alt="Alternate Text"></img>
                                                <span className="ranking">1000</span>
                                            </div>
                                            <span className="reliability">Ranking</span>
                                        </div>
                                        <div className="img-customer">
                                            <div>
                                                <i key={uuidv1()}  className="material-icons star star-active">star</i>
                                                <i key={uuidv1()}  className="material-icons star star-active">star</i>
                                                <i key={uuidv1()}  className="material-icons star star-active">star</i>
                                                <i key={uuidv1()}  className="material-icons star star-active">star</i>
                                                <i key={uuidv1()}  className="material-icons star star-active">star</i>
                                            </div>
                                            <span className="reliability">Confiabilidad</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-customer">
                                    <a href="BusquedaCliente2UI" className="name-customer">{client.Nombres} {client.ApellidoPaterno} {client.ApellidoMaterno} </a>
                                    <div className="info-detail">
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>NUC:</span>
                                                <label>{client.NUC}</label>
                                            </div>
                                            <div className="label-value">
                                                <span>Sucursal:</span>
                                                <label>{client.Branch}</label>
                                            </div>

                                        </div>
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>Saldo disponible:</span>
                                            </div>
                                            <div className="dp-flex">
                                                <span className="border-green">Empeños ${GenericScripts.formatNumbers(client.TotalBalance)}</span>
                                                <span className="border-gray">Apartados de ${GenericScripts.formatNumbers(client.TotalSeparated)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-customer--history">
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>Empeños:</span>
                                                <label>{client.Pawns}</label>
                                            </div>
                                            <div className="label-value">
                                                <span>Monto:</span>
                                                <label>${GenericScripts.formatNumbers(client.PawnsAmmount)}</label>
                                            </div>

                                        </div>
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>Refrendos:</span>
                                                <label>{client.Referendums}</label>
                                            </div>
                                            <div className="label-value">
                                                <span>Interés:</span>
                                                <label>${GenericScripts.formatNumbers(client.ReferendumsAmmount)}</label>
                                            </div>
                                        </div>
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>Desempeños:</span>
                                                <label>{client.Unpawns}</label>
                                            </div>
                                            <div className="label-value">
                                                <span>Interés:</span>
                                                <label>${GenericScripts.formatNumbers(client.UnpawnsAmmount)}</label>
                                            </div>
                                        </div>
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>Almoneda:</span>
                                                <label>{client.Almoneda}</label>
                                            </div>
                                            <div className="label-value">
                                                <span>Monto:</span>
                                                <label>${GenericScripts.formatNumbers(client.AlmonedaAmmount)}</label>
                                            </div>
                                        </div>
                                        <div className="pr-3 flex-grow-1">
                                            <div className="label-value">
                                                <span>Ingresos totales:</span>
                                            </div>
                                            <div className="label-value">
                                                <label>${GenericScripts.formatNumbers(client.TotalIncome)}</label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="customer-btn">
                                    {
                                        isSearchClient ?
                                            <a className="btns btn-go m-0" onClick={() => this.setRedirectClient(client)}>Proceder compra</a> :
                                            <div className="dp-flex flex-column">
                                                <div style={disabledInformation} className={isInformation ? "tag green" : "tag gray"} onClick={this.handleClientInformation.bind(this)} id="btn-info">
                                                    <a ><span>Información</span></a>
                                                </div>
                                                <div style={disabledHistory} className={isHistory ? "tag green" : "tag gray"} onClick={this.handleClientHistory.bind(this)} id="btn-history">
                                                    <a  ><span>Historial</span></a>
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>)
                    })
                }
                {this.renderRedirect()}
            </div>
        );
    }
}

function mapStateTopProps(state) {
    return {
        isHistory: state.ecommerce.isHistory,
        isInformation: state.ecommerce.isInformation
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateIsHistory: isHistory => {
            dispatch({ type: "UPDATE_IS_HISTORY", payload: isHistory })
        },
        updateIsInformation: isInformation => {
            dispatch({ type: "UPDATE_IS_INFORMATION", payload: isInformation })
        },
        updateUpdateIsEditClient: isEdit => {
            dispatch({ type: "UPDATE_IS_EDIT", payload: isEdit })
        }
    }
}

export default connect(
    mapStateTopProps, mapDispatchToProps
)(UserSection);