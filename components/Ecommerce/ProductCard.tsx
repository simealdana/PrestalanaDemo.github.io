declare var require: any

var React = require('react');
var uuidv1 = require('uuid/v1');
var Modal = require('../ShoppingCar/ConfirmationModal').default;
var Redirect = require('react-router-dom').Redirect;
var connect = require('react-redux').connect;
var GenericScripts = require('../../GenericScripts/Script');


class ProductCard extends React.Component {


    state = {
        products: null,
        random: null,
        promo: null,
        moreDiscount: null,
        redirect: false,
        showModal: false,
        selectedItem: null,
        pathname: null
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: this.state.pathname,
                        state: {
                            itemtemObjet: this.state.selectedItem
                        }
                    }}
                />
            );
        }
    }

    setRedirectItemDetail = item => {
        this.setState({
            redirect: true
        });
        this.setState({
            selectedItem: item
        });
        this.setState({
            pathname: "/itemDetail"
        });
    };

    handleAddItem = (itemtemObjet) => {
        const { addToCart } = this.props;
        addToCart(itemtemObjet);
        this.setState({
            showModal: true
        });
    };

    render() {

        const { product } = this.props;
        const { showModal } = this.state;

        return (
            <div key={uuidv1()} className="item-product--only">
                {product.EsNuevo ? <span className="sale">30% off</span> : <span />}
                <div key={uuidv1()} className="img-product">
                    <img src={`data:image/jpeg;base64,${product.Document.Documento}`} alt="Alternate Text" />
                </div>
                <div key={uuidv1()} className="title-product--only">
                    <a onClick={() => this.setRedirectItemDetail(product)}>{product.Descripcion}</a>
                </div>
                <div key={uuidv1()} className="category-product--only">
                    <a >{product.Subfamilia}</a>
                </div>
                <div>
                    <i key={uuidv1()} className="material-icons star star-active">star</i>
                    <i key={uuidv1()} className="material-icons star star-active">star</i>
                    <i key={uuidv1()} className="material-icons star star-active">star</i>
                    <i key={uuidv1()} className="material-icons star star-active">star</i>
                    <i key={uuidv1()} className="material-icons star star-active">star</i>
                </div>
                <div key={uuidv1()} className="value-product--only">
                    {product.EsOferta ? <div><span key={uuidv1()} className="promo">${GenericScripts.formatNumbers(product.Avaluo)}</span><span key={uuidv1()} >${GenericScripts.formatNumbers(product.Avaluo)}</span> </div> : <span>${GenericScripts.formatNumbers(product.Avaluo)}</span>}

                </div>
                <div key={uuidv1()} className="btn-cart" onClick={() => this.handleAddItem(product)} >
                    <i key={uuidv1()} className="material-icons">shopping_cart</i>
                </div>
                {showModal ? <Modal /> : null}
                {this.renderRedirect()}
            </div>
        )
    }
}




function mapDispatchToProps(dispatch) {
    return {
        addToCart: item => {
            dispatch({ type: "ADD", payload: item });
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(ProductCard);