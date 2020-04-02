declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var NavLink = require('react-router-dom').NavLink;
var Modal = require('../Ecommerce/SearchClient').default;
var scriptLayout = require('./Scripts/Script');
var uuidv1 = require('uuid/v1');

const userPhoto = "images/foto-user.png"

class UserLinks extends React.Component {

    handleSearchClient = () => {
        scriptLayout.openModal();
    };

    render() {
        const { cart } = this.props;
        let totalSale = 0;

        return (
            <div key={uuidv1()} className="item-header col-2">
                <a key={uuidv1()} id="dropdownCar" className="mr-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="material-icons">shopping_cart</i></a>
                <div key={uuidv1()} className="dropdown-menu dropdown-menu-right cart-buy" aria-labelledby="dropdownCar">
                    {
                        cart.length === 0
                            ? <a key={uuidv1()} className="dropdown-item nombre" href="#">Carrito de compras vacio.</a>
                            :
                            cart != null &&
                            cart.map(item => {
                                totalSale = item.Avaluo + totalSale;
                                return (

                                    <a className="dropdown-item item-cart-buy" href="#">
                                        <div className="img-cart">
                                            <img src={`data:image/jpeg;base64,${item.Document.Documento}`} alt={item.Descripcion} />
                                        </div>
                                        <div>
                                            <label>{item.Descripcion}</label>
                                            <span className="value">${item.Avaluo}</span>
                                            <span className="quantity">Cantidad 1</span>
                                        </div>
                                    </a>

                                )
                            })
                    }
                    {
                        cart.length === 0
                            ? null
                            : <div className="footer-dropdown" key={uuidv1()}>
                                <hr/>
                                <span key={uuidv1()} className="dropdown-item">Valor Compra total: <span className="bold">${totalSale}</span></span>
                                <span key={uuidv1()} className="dropdown-item">Valor Minimo apartado: <span className="bold">$0.00</span></span>
                                <a key={uuidv1()} onClick={() => this.handleSearchClient()} className="btns btn-go add">Proceder Compra</a>
                             </div>
                    }

                </div>

                <NavLink key={uuidv1()} href="#" to="/"><i key={uuidv1()} className="material-icons icon-notification mr-3">notifications</i></NavLink>
                <img key={uuidv1()} src={userPhoto} />
                <a key={uuidv1()} id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="material-icons arrow-down">keyboard_arrow_down</i></a>
                <div key={uuidv1()} className="dropdown-menu dropdown-menu-right dropdown-user" aria-labelledby="dropdownMenuLink">
                    <a key={uuidv1()} className="dropdown-item nombre" href="#">
                        Monica Gonzalez
                <span key={uuidv1()} className="cargo">Asesora Comercial</span>
                    </a>
                    <a key={uuidv1()} className="dropdown-item cerrar" >Cerrar sesión</a>
                </div>
                <Modal />
            </div>
        );
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart
    };
}

export default connect(
    mapStateTopProps,
    null
)(UserLinks);