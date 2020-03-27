declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var resources = require('./../../Resources');
var Redirect = require('react-router-dom').Redirect;
var ProductCard = require('./ProductCard').default;
var uuidv1 = require('uuid/v1');

class Section extends React.Component {

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

    handleImageRandomTopFour = async () => {
        let result = await fetch(resources.WebApiGoldenStart + "Item/GetAleatoryProductcs",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(resources.idSucursal)

            });

        const res = await result.json();

        this.setState({ ["random"]: res });
    }

    handleImagePromoTopFour = async () => {
        let result = await fetch(resources.WebApiGoldenStart + "Item/GetPromoProducts",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(resources.idSucursal)
            });

        const res = await result.json();

        this.setState({ ["promo"]: res });
    }

    handleNewImageRandomTopFour = async () => {
        let result = await fetch(resources.WebApiGoldenStart + "Item/MoreDiscountProducts",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(resources.idSucursal)

            });

        const res = await result.json();

        this.setState({ ["moreDiscount"]: res });
    }

    handleRelatedItemsTopFour = async () => {
        const { familiaId, updateRelatedItems } = this.props;

        let result = await fetch(resources.WebApiGoldenStart + "Item/GetRelatedItems",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify({ Sucursal: resources.idSucursal, IdFamilia: familiaId })

            });

        const res = await result.json();

        updateRelatedItems(res);
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



    setRedirectCategories = item => {
        this.setState({
            redirect: true
        });
        this.setState({
            selectedItem: item
        });
        this.setState({
            pathname: "/categoryDetail"
        });
    };



    render() {

        let products = null;

        const { title, relatedItems, updateCondition } = this.props;
        const { promo, random, moreDiscount } = this.state;


        if (title == "ARTÍCULOS NUEVOS" && random === null) {
            this.handleImageRandomTopFour();
        }
        else if (title == "PROMOCIONES" && promo === null) {
            this.handleImagePromoTopFour();
        }
        else if (title == "ARTÍCULOS CON MAS DESCUENTO" && moreDiscount === null) {
            this.handleNewImageRandomTopFour();
        }
        else if (title == "ARTICULOS RELACIONADOS" && relatedItems.length === 0) {
            this.handleRelatedItemsTopFour();
        }

        if (promo != null && promo.length > 0) {
            products = promo;
        }
        if (random != null && random.length > 0) {
            products = random;
        }
        if (moreDiscount != null && moreDiscount.length > 0) {
            products = moreDiscount;
        }
        if (relatedItems != null && relatedItems.length > 0) {
            products = relatedItems;
            updateCondition(true);
        }

        return (
            <div key={uuidv1()} className="product-cart">
                <div key={uuidv1()} className="title-product--cart">

                    <label key={uuidv1()}>{title}</label><a key={uuidv1()} className="see-add" onClick={() => this.setRedirectCategories(title)}>Ver más ...</a>
                </div>
                <div key={uuidv1()} className="item-product--group">
                    {products != null &&
                        products.map(product => {
                            return (<ProductCard product={product} />)

                        })
                    }
                </div>

                {this.renderRedirect()}
            </div>
        );
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart,
        relatedItems: state.ecommerce.relatedItems,
        updated: state.ecommerce.updated
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart: item => {
            dispatch({ type: "ADD", payload: item });
        },
        updateRelatedItems: items => {
            dispatch({ type: "UPDATE_RELATED_ITEMS", payload: items });
        },
        updateCondition: value => {
            dispatch({ type: "UPDATE_CONDITION", payload: value });
        }
    };
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(Section);