declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var Redirect = require('react-router-dom').Redirect;
var Section = require('./Section').default;
var scriptEcommerce = require('./Scripts/Script');
var Modal = require('../ShoppingCar/ConfirmationModal').default;
var uuidv1 = require('uuid/v1');
var resources = require('./../../Resources');
var Loader = require('react-loader');
var GenericScripts = require('../../GenericScripts/Script')

class ProductDetail extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            redirect: false,
            selectedItem: null,
            showModal: false,
            redirectAllCategories: false,
            render: false
        }


    }

    handleRelatedItemsTopFour = async () => {
        const { familiaId, updateRelatedItems } = this.props;
        const { itemtemObjet } = this.props.location.state;

        let result = await fetch(resources.WebApiGoldenStart + "Item/GetRelatedItems",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify({ Sucursal: resources.idSucursal, IdFamilia: itemtemObjet.IdFamilia })
            });

        const res = await result.json();

        updateRelatedItems(res);
        this.setState({ 'render': true });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: "/itemDetail",
                        state: {
                            itemtemObjet: this.state.selectedItem
                        }
                    }}
                />
            );
        }

        if (this.state.redirectAllCategories) {
            return (
                <Redirect
                    to={{
                        pathname: "/"
                    }}
                />
            );
        }
    }

    setRedirect = item => {
        this.setState({
            redirect: true
        });
        this.setState({
            selectedItem: item
        });
    };

    handleRedirectAllCategories = () => {
        this.setState({
            redirectAllCategories: true
        });
    };

    setImageZoom = image => {
        scriptEcommerce.zoom(image);
    };

    handleAddItem = (itemtemObjet) => {
        const { addToCart } = this.props;
        addToCart(itemtemObjet);
        this.setState({
            showModal: true
        });
    };

    handleUpdate = () => {
        const { updated, updateRelatedItems } = this.props;

        if (updated) {
            updateRelatedItems([]);
        }
    }

    render() {
        const { itemtemObjet } = this.props.location.state;
        const { showModal, render } = this.state;


        if (!render) {
            this.handleRelatedItemsTopFour();
        }

        let count = 0;
        return (
            <div>
                {render ?
                    <Loader loaded={render}><div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item active" aria-current="page">
                                    <a onClick={() => this.handleRedirectAllCategories()}>
                                        <i className="material-icons">keyboard_arrow_left</i>
                                        Todas las categorías
                </a>
                                </li>
                            </ol>
                        </nav>
                        <div className="dp-flex">
                            <div className="ecommerce-img--product col-6">
                                <div className="img-big">
                                    <img id="zoom-product" src={`data:image/jpeg;base64,${itemtemObjet.Documents[0].Documento}`} onClick={() => this.setImageZoom(`data:image/jpeg;base64,${itemtemObjet.Documents[0].Documento}`)} />
                                </div>
                                <div className="container-images">
                                    {
                                        itemtemObjet.Documents != null &&
                                        itemtemObjet.Documents.map(document => {
                                            count = ++count;
                                            return (
                                                <img key={uuidv1()} className={--count == 0 ? "activada" : ""} src={`data:image/jpeg;base64,${document.Documento}`} onClick={() => this.setImageZoom(`data:image/jpeg;base64,${document.Documento}`)} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="ecommerce-info--product col-6">
                                <h2>{itemtemObjet.Descripcion}</h2>
                                <div>
                                    <i className="material-icons star star-active">star</i>
                                    <i className="material-icons star star-active">star</i>
                                    <i className="material-icons star star-active">star</i>
                                    <i className="material-icons star star-active">star</i>
                                    <i className="material-icons star star-active">star</i>
                                </div>
                                <div className="value-info--product"><span className="cl-green">${GenericScripts.formatNumbers(itemtemObjet.Avaluo)}</span></div>
                                <div className="hr"></div>
                                <div className="description-product">
                                    <span>{itemtemObjet.Observaciones}</span>
                                </div>
                                <div className="hr"></div>
                                <div className="label-value">
                                    <span>Sucursal:</span>
                                    <label>{itemtemObjet.Sucursal}</label>
                                </div>
                                <div className="label-value">
                                    <span>Categoria:</span>
                                    <label>{itemtemObjet.Familia}</label>
                                </div>
                                <div className="label-value">
                                    <span>Subcategoria:</span>
                                    <label>{itemtemObjet.Subfamilia}</label>
                                </div>
                                <a onClick={() => this.handleAddItem(itemtemObjet)} className="btns btn-go">
                                    Agregar <i className="material-icons">shopping_cart</i>
                                </a>
                            </div>
                        </div>
                        <Section />
                        {showModal ? <Modal /> : null}
                        {this.renderRedirect()}
                    </div> </Loader> : <Loader loaded={render}> <div /> </Loader>}
            </div>
        );
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart,
        updated: state.ecommerce.updated
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart: item => {
            dispatch({ type: "ADD", payload: item });
        },
        removeFromCart: item => {
            dispatch({ type: "REMOVE", payload: item });
        },
        updateCondition: value => {
            dispatch({ type: "UPDATE_CONDITION", payload: value });
        },
        updateRelatedItems: items => {
            dispatch({ type: "UPDATE_RELATED_ITEMS", payload: items });
        }
    };
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(ProductDetail);
